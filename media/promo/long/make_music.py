"""Score, sound design and final mix for the long promo. Pure synthesis (numpy/scipy), no samples.

Inputs:  timeline.json (scene/chapter times), build/cues.json (SFX cues exported from the scenes),
         build/voice.wav (narration from make_vo.py)
Output:  build/mix.wav (stereo 44.1 kHz), plus build/music.wav and build/sfx.wav stems.

Style switches (environment):
  MUSIC_STYLE  cinematic (default, chosen for the tour) | electro | keynote | house | synthwave
  SFX_STYLE    digital (default, chosen for the tour) | clean | watch | cinematic
  MUSIC_DB     music bed gain offset in dB (default 0)
  END          stop the mix at this many seconds (previews)
  OUT_TAG      write only build/styles/<OUT_TAG>.wav instead of the standard outputs
"""
import json
import os
import wave

import numpy as np
from scipy.signal import butter, oaconvolve, sosfilt

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
B = os.path.join(HERE, 'build')
TL = json.load(open(os.path.join(HERE, 'timeline.json')))
CUES = json.load(open(os.path.join(B, 'cues.json'))) if os.path.exists(os.path.join(B, 'cues.json')) else []
MUSIC_STYLE = os.environ.get('MUSIC_STYLE', 'cinematic')
SFX_STYLE = os.environ.get('SFX_STYLE', 'digital')
MUSIC_DB = float(os.environ.get('MUSIC_DB', '0'))
OUT_TAG = os.environ.get('OUT_TAG', '')
TOTAL = TL['total']
END = min(TOTAL, float(os.environ.get('END', TL['total'])))
N = int((END + 0.05) * SR)
BPM = TL['bpm']; BEAT = 60 / BPM; BAR = 4 * BEAT; STEP = BEAT / 4
rng = np.random.default_rng(11)
SC = {s['id']: s for s in TL['scenes']}


def tt(d): return np.arange(int(d * SR)) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
def noise(n): return rng.standard_normal(n)
def lp(x, fc, o=2): return sosfilt(butter(o, min(fc, SR * .45), 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, min(hi, SR * .45)], 'band', fs=SR, output='sos'), x)


class Bus:
    def __init__(self): self.L = np.zeros(N + SR * 4); self.R = np.zeros(N + SR * 4)
    def add(self, sig, t, gain=1.0, pan=0.0, sig_r=None):
        i = int(round(t * SR))
        if i >= len(self.L) or gain == 0: return
        if i < 0: sig = sig[-i:]; sig_r = None if sig_r is None else sig_r[-i:]; i = 0
        n = min(len(sig), len(self.L) - i)
        l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
        self.L[i:i + n] += sig[:n] * gain * l
        self.R[i:i + n] += (sig if sig_r is None else sig_r)[:n] * gain * r


drums, bass_b, pad_b, arp_b, lead_b, fx_b, sfx_b, rev_send, dly_send = (Bus() for _ in range(9))

# ---------------- oscillators (band-limited wavetables) ----------------
TN = 2048
_ph = np.arange(TN) / TN


def _table(nh, kind):
    t = np.zeros(TN)
    for h in range(1, nh + 1):
        if kind == 'saw' or h % 2: t += np.sin(2 * np.pi * h * _ph) / h
    return t / np.abs(t).max()


TABLES = {k: [_table(max(1, min(900, int(SR / 2 / (27.5 * 2 ** (o + 1))))), k) for o in range(10)] for k in ('saw', 'sq')}


def osc(kind, freq, n, phase=None):
    f = np.full(n, float(freq)) if np.ndim(freq) == 0 else np.asarray(freq, float)[:n]
    if kind == 'sin':
        return np.sin(2 * np.pi * ((rng.random() if phase is None else phase) + np.cumsum(f) / SR))
    o = int(np.clip(np.floor(np.log2(max(float(f.max()), 27.5) / 27.5)), 0, 9))
    tbl = TABLES[kind][o]
    x = ((rng.random() if phase is None else phase) + np.cumsum(f) / SR) % 1.0 * TN
    i = x.astype(int); fr = x - i
    return tbl[i] * (1 - fr) + tbl[(i + 1) % TN] * fr


def adsr(n, a, d, s, r):
    t = np.arange(n) / SR; dur = n / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    return e * np.clip((dur - t) / max(r, 1e-4), 0, 1)


# ---------------- drums ----------------
def kick(g=1.0):
    t = tt(.5); f = 46 + 130 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = hp(noise(len(t)) * np.exp(-t * 350), 1800) * .35
    return (np.tanh(1.7 * body) + click) * g


def snare(g=1.0):
    t = tt(.35)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 22) * .6 + np.sin(2 * np.pi * 330 * t) * np.exp(-t * 30) * .3
    nz = bp(noise(len(t)), 1200, 9000) * np.exp(-t * 16) * .9
    return (tone + nz) * g


def clap(g=1.0):
    out = np.zeros(int(.4 * SR))
    for k, off in enumerate([0, .010, .021, .033]):
        s = bp(noise(int(.3 * SR)), 900, 7000) * np.exp(-tt(.3) * (26 if k == 3 else 110))
        i = int(off * SR); out[i:i + len(s)] += s[:len(out) - i]
    return out * .85 * g


def hat(g=1.0, open_=False):
    d = .32 if open_ else .06
    t = tt(d); s = hp(noise(len(t)), 7500, 3) * np.exp(-t * (9 if open_ else 70))
    return s * .55 * g


def shaker(g=1.0):
    t = tt(.09); s = bp(noise(len(t)), 5000, 12000) * np.sin(np.pi * np.clip(t / .09, 0, 1)) ** 2
    return s * .4 * g


def rim(g=1.0):
    t = tt(.08); return (bp(noise(len(t)), 1500, 4000) * np.exp(-t * 90) + np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 70) * .4) * g


def crash(g=1.0, d=2.4):
    t = tt(d); s = hp(noise(len(t)), 3500) * np.exp(-t * 1.6)
    for f in (3150, 4270, 5510, 6930):
        s += np.sin(2 * np.pi * f * t + rng.random() * 6) * np.exp(-t * 2.4) * .08
    return s * .45 * g


def tom(f=110, g=1.0):
    t = tt(.35); ff = f * (1 + .6 * np.exp(-t * 20))
    return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 9) * g


# ---------------- tonal instruments ----------------
def bass_note(f, dur, bright=1.0):
    n = int(dur * SR)
    x = osc('saw', f, n) * .7 + osc('sq', f * .5, n) * .15 + osc('sin', f * .5, n) * .55
    env = np.exp(-np.arange(n) / SR * 9)
    y = lp(x, 180 + 1400 * bright) * (1 - env) + lp(x, 400 + 3200 * bright) * env
    return np.tanh(1.4 * y) * adsr(n, .004, .25, .75, .05)


def pad_chord(freqs, dur, warmth=2400, a=.35, r=.5):
    n = int(dur * SR); Lx = np.zeros(n); Rx = np.zeros(n)
    for f in freqs:
        for k, det in enumerate((-.012, -.005, 0, .006, .013)):
            v = osc('saw', f * (1 + det), n) * (.8 if det else 1.0)
            (Lx if k % 2 == 0 else Rx)[:] += v
            if det == 0: Rx[:] += v * .6; Lx[:] += v * .6
    env = adsr(n, a, 1.0, .9, r)
    return lp(Lx, warmth) * env / (len(freqs) * 3), lp(Rx, warmth) * env / (len(freqs) * 3)


def pluck(f, dur=.3, bright=1.0):
    n = int(dur * SR)
    x = osc('saw', f, n) * .6 + osc('sq', f * 1.002, n) * .4
    env = np.exp(-np.arange(n) / SR * 12)
    y = lp(x, 900 + 5200 * bright) * env + lp(x, 700) * (1 - env) * .3
    return y * np.exp(-np.arange(n) / SR * 6.5) * np.minimum(1, np.arange(n) / (SR * .002))


def lead_note(f, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    vib = 1 + .0065 * np.sin(2 * np.pi * 5.4 * t) * np.clip((t - .12) / .2, 0, 1)
    x = osc('saw', f * vib, n) * .5 + osc('saw', f * 1.004 * vib, n) * .5 + osc('sq', f * .5 * vib, n) * .2
    return lp(x, 3400) * adsr(n, .012, .35, .72, .08)


def stab(freqs, dur=.35):
    n = int(dur * SR)
    x = sum(osc('saw', f * (1 + d), n) for f in freqs for d in (-.008, .008))
    return lp(x, 3000) * np.exp(-np.arange(n) / SR * 9) / len(freqs)


def sweep_noise(d, f0, f1, q=2.0, curve=1.0):
    n = int(d * SR); hop, win = 256, 1024; w = np.hanning(win); out = np.zeros(n + win)
    fr = np.fft.rfftfreq(win, 1 / SR)
    for i in range(0, n, hop):
        u = (i / n) ** curve; fc = f0 * (f1 / f0) ** u
        mask = np.exp(-((np.log2(np.maximum(fr, 1) / fc) * q) ** 2) / 2)
        out[i:i + win] += np.fft.irfft(np.fft.rfft(noise(win) * w) * mask) * w
    out = out[:n]; return out / (np.abs(out).max() + 1e-9)


def riser(d):
    t = tt(d); env = (t / d) ** 2.2
    s = sweep_noise(d, 300, 9000, 2.2, 1.6) * env * .8
    f = 110 * 2 ** (3 * t / d)
    s += osc('saw', f, len(t)) * env * .18
    return s


def impact(g=1.0, d=1.8):
    t = tt(d); f = 32 + 80 * np.exp(-t * 11)
    body = np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2))
    air = lp(noise(len(t)), 5000) * np.exp(-t * 8) * .5
    return (body + air) * g


def reverse_cymbal(d):
    c = crash(1.0, d)[::-1]; return c * np.linspace(0, 1, len(c)) ** 1.5


def downlifter(d):
    t = tt(d); return sweep_noise(d, 7000, 300, 2.0, .7) * np.exp(-t * 2.2) * .7


# ---------------- sound effects (cue names used by the scenes) ----------------
def fm_bell(f, d=1.2, ratio=3.5, idx=2.2):
    t = tt(d); mod = np.sin(2 * np.pi * f * ratio * t) * idx * np.exp(-t * 4)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 3.2) * np.minimum(1, t / .002)


def sfx_clean(name, p=0.0):
    k = 2 ** (p / 12)
    if name == 'click':
        t = tt(.03); return hp(noise(len(t)), 2500) * np.exp(-t * 300) * .6 + np.sin(2 * np.pi * 2400 * k * t) * np.exp(-t * 180) * .5
    if name == 'pop':
        t = tt(.09); f = (820 * k) * (1 - .45 * (t / .09)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * np.clip(t / .09, 0, 1)) ** .6
    if name == 'tick':
        t = tt(.05); return np.sin(2 * np.pi * 1760 * k * t) * np.exp(-t * 90) + hp(noise(len(t)), 5000) * np.exp(-t * 400) * .2
    if name in ('key', 'type'):
        t = tt(.07); g = 1 if name == 'key' else .6
        return (hp(noise(len(t)), 1800) * np.exp(-t * 260) * .8 + np.sin(2 * np.pi * (170 + rng.random() * 40) * t) * np.exp(-t * 60) * .7) * g
    if name == 'whoosh':
        d = .55; return sweep_noise(d, 250, 6500, 2.0) * np.sin(np.pi * tt(d) / d) ** 1.4
    if name == 'swish':
        d = .32; return sweep_noise(d, 900, 9000, 2.4) * np.sin(np.pi * tt(d) / d) ** 1.2
    if name == 'thud':
        t = tt(.4); return np.sin(2 * np.pi * (62 + 50 * np.exp(-t * 25)) * t) * np.exp(-t * 9) + lp(noise(len(t)), 900) * np.exp(-t * 30) * .3
    if name == 'hit':
        return impact(.8, 1.0)
    if name == 'chime':
        a = fm_bell(hz(84) * k, 1.4) * .6; a[:int(1.1 * SR)] += fm_bell(hz(91) * k, 1.1) * .25; return a
    if name == 'success':
        a = fm_bell(hz(84) * k, 1.2) * .5; b = fm_bell(hz(91) * k, 1.4) * .5
        out = np.zeros(len(b) + int(.11 * SR)); out[:len(a)] += a; out[int(.11 * SR):] += b; return out
    if name == 'shimmer':
        d = 1.0; t = tt(d); s = np.zeros(len(t))
        for j in range(9):
            f = hz(88 + j * 2) * k * (1 + .003 * rng.standard_normal())
            s += np.sin(2 * np.pi * f * t + rng.random() * 6) * np.exp(-((t - j * .06) ** 2) / .02) * .25
        return s * np.minimum(1, t / .01)
    if name == 'snap':
        t = tt(.12); return bp(noise(len(t)), 1800, 6000) * np.exp(-t * 80) * 1.2
    if name == 'glitch':
        d = .28; n = int(d * SR); out = np.zeros(n); i = 0
        while i < n:
            L = int(rng.uniform(.012, .04) * SR); f = rng.choice([180, 360, 720, 1440, 2880]) * k
            seg = np.sign(np.sin(2 * np.pi * f * np.arange(L) / SR)) * .5 if rng.random() < .5 else noise(L) * .4
            out[i:i + L] = seg[:n - i] * (rng.random() > .2); i += L
        return np.round(out * 6) / 6
    if name == 'shutter':
        out = np.zeros(int(.16 * SR))
        for off in (0, .065):
            t = tt(.05); s = hp(noise(len(t)), 1200) * np.exp(-t * 180) + np.sin(2 * np.pi * 320 * t) * np.exp(-t * 90) * .4
            i = int(off * SR); out[i:i + len(s)] += s
        return out
    if name == 'boing':
        t = tt(.45); f = 110 + 620 * np.exp(-t * 9) + 28 * np.sin(2 * np.pi * 22 * t) * np.exp(-t * 5)
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    if name == 'riser':
        return riser(1.0) * .7
    if name == 'blip':
        t = tt(.07); return np.sin(2 * np.pi * 1046 * k * t) * np.exp(-t * 55)
    if name == 'error':
        t = tt(.3); f = np.where(t < .14, 233, 196) * k
        return lp(osc('sq', f, len(t)), 1800) * np.exp(-t * 5) * .6
    if name == 'sparkle':
        out = np.zeros(int(.55 * SR))
        for j, m in enumerate((96, 100, 103, 108)):
            s = np.sin(2 * np.pi * hz(m) * k * tt(.3)) * np.exp(-tt(.3) * 14) * .4
            i = int(j * .055 * SR); out[i:i + len(s)] += s
        return out
    t = tt(.06); return np.sin(2 * np.pi * 1200 * k * t) * np.exp(-t * 60)


# ---------------- alternative sound-effect palettes (same cue names, different character) ----------------
def metal_tick(f=4200, d=.035, g=1.0):
    """a watch escapement tick: a few inharmonic metal partials and a tiny noise transient"""
    t = tt(d)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t * 300) + np.sin(2 * np.pi * f * 1.47 * t) * np.exp(-t * 380) * .7
         + np.sin(2 * np.pi * f * 2.13 * t) * np.exp(-t * 450) * .4 + hp(noise(len(t)), 5000) * np.exp(-t * 900) * .5)
    return s * g


def ratchet(n=4, gap=.018, f=3600, g=1.0, accel=1.0):
    """crown winding: a run of small ticks (accel < 1 speeds the run up)"""
    out = np.zeros(int((n * gap + .06) * SR)); pos = 0.0; gp = gap
    for j in range(n):
        s = metal_tick(f * (1 + .03 * rng.standard_normal()), .03, .7 + .3 * rng.random())
        i = int(pos * SR); out[i:i + len(s)] += s[:len(out) - i]; pos += gp; gp *= accel
    return out * g


def tink(f, d=.2, g=1.0):
    t = tt(d)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 26) + np.sin(2 * np.pi * f * 2.71 * t) * np.exp(-t * 48) * .45) * np.minimum(1, t / .0008) * g


def sfx_watch(name, p=0.0):
    k = 2 ** (p / 12)
    if name == 'click': return metal_tick(3800 * k, .03, .9)
    if name == 'tick': return metal_tick(4600 * k, .03, .75)
    if name == 'pop': return tink(1900 * k, .18, .8)
    if name == 'key': return ratchet(3, .016, 3300 * k, .8)
    if name == 'type': return ratchet(2, .014, 3500 * k, .55)
    if name in ('whoosh', 'swish'):
        d = .55 if name == 'whoosh' else .32; t = tt(d)
        air = sweep_noise(d, 400, 5200, 2.4) * np.sin(np.pi * t / d) ** 1.6 * .75
        ring = sum(np.sin(2 * np.pi * f * t) for f in (2350, 3810)) * np.sin(np.pi * t / d) ** 3 * .05
        return air + ring
    if name == 'thud':                                   # a case closing: low knock with a wooden body
        t = tt(.3); return np.sin(2 * np.pi * (95 + 40 * np.exp(-t * 30)) * t) * np.exp(-t * 14) + bp(noise(len(t)), 300, 1400) * np.exp(-t * 40) * .5
    if name == 'hit':                                    # deep metallic strike
        t = tt(1.6); s = impact(.7, 1.6)
        for f, dc in ((233, 2.2), (377, 2.8), (611, 3.5), (1043, 4.5)): s += np.sin(2 * np.pi * f * t + rng.random()) * np.exp(-t * dc) * .12
        return s
    if name in ('chime', 'success'):                     # minute-repeater tones
        notes = (81, 76) if name == 'chime' else (76, 81, 88)
        out = np.zeros(int((1.7 + .22 * len(notes)) * SR))
        for j, m in enumerate(notes):
            b = fm_bell(hz(m) * k, 1.6, 2.0, 1.0) * .55; i = int(j * .22 * SR); out[i:i + len(b)] += b
        return out
    if name == 'shimmer':                                # a balance wheel's glitter of tiny tinks
        out = np.zeros(int(1.0 * SR))
        for j in range(8):
            s = tink(hz(96 + (j * 5) % 12) * k, .25, .35); i = int(j * .07 * SR); out[i:i + len(s)] += s
        return out
    if name == 'sparkle':
        out = np.zeros(int(.6 * SR))
        for j, m in enumerate((96, 100, 103, 108)):
            s = tink(hz(m) * k, .25, .4); i = int(j * .055 * SR); out[i:i + len(s)] += s
        return out
    if name == 'snap':                                   # a clasp closing
        out = np.zeros(int(.12 * SR)); a = metal_tick(2600 * k, .05, 1.0); b = metal_tick(3400 * k, .04, .7)
        out[:len(a)] += a; out[int(.012 * SR):int(.012 * SR) + len(b)] += b; return out
    if name == 'glitch': return ratchet(9, .011, 3000 * k, .8)
    if name == 'shutter':
        out = np.zeros(int(.14 * SR)); a = metal_tick(3000 * k, .04); b = metal_tick(2400 * k, .04, .8)
        out[:len(a)] += a; out[int(.06 * SR):int(.06 * SR) + len(b)] += b; return out
    if name == 'blip': return tink(2600 * k, .12, .6)
    if name == 'error':                                  # two dull tocks
        out = np.zeros(int(.3 * SR))
        for j, f in enumerate((520, 440)):
            t = tt(.08); s = (np.sin(2 * np.pi * f * t) * np.exp(-t * 60) + bp(noise(len(t)), 400, 1600) * np.exp(-t * 90) * .4)
            i = int(j * .14 * SR); out[i:i + len(s)] += s
        return out
    if name == 'riser':                                  # winding up
        r = ratchet(26, .06, 3200, .55, .9); t = np.arange(len(r)) / SR
        sw = sweep_noise(len(r) / SR, 400, 6000, 2.0, 1.6); sw = np.pad(sw, (0, max(0, len(r) - len(sw))))[:len(r)]
        return r * np.linspace(.4, 1, len(r)) + sw * (t / t[-1]) ** 2 * .35
    return sfx_clean(name, p)


def sfx_cine(name, p=0.0):
    k = 2 ** (p / 12)
    if name == 'click':
        t = tt(.08); return np.sin(2 * np.pi * (140 + 300 * np.exp(-t * 80)) * t) * np.exp(-t * 40) * .9 + hp(noise(len(t)), 3000) * np.exp(-t * 400) * .35
    if name == 'pop':
        t = tt(.25); f = 300 * k * (1 - .5 * t / .25); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14) * .9
    if name in ('key', 'type'):
        t = tt(.1); g = 1 if name == 'key' else .6
        return (np.sin(2 * np.pi * (110 + 60 * np.exp(-t * 60)) * t) * np.exp(-t * 35) + hp(noise(len(t)), 2500) * np.exp(-t * 300) * .4) * g
    if name == 'whoosh':
        d = .9; t = tt(d); env = np.sin(np.pi * t / d) ** 1.3
        return sweep_noise(d, 150, 4200, 1.8) * env + np.sin(2 * np.pi * (45 + 25 * t / d) * t) * env ** 2 * .45
    if name == 'swish':
        d = .5; t = tt(d); return sweep_noise(d, 300, 7000, 2.0) * np.sin(np.pi * t / d) ** 1.2
    if name == 'thud':
        t = tt(.9); return np.tanh(1.6 * np.sin(2 * np.pi * (38 + 60 * np.exp(-t * 14)) * t) * np.exp(-t * 4.5)) + lp(noise(len(t)), 700) * np.exp(-t * 18) * .3
    if name == 'hit': return impact(1.1, 2.2)
    if name in ('chime', 'success'):
        a = fm_bell(hz(76) * k, 2.2, 2.0, 1.6) * .6; b = fm_bell(hz(64) * k, 2.4, 1.0, .8) * .35
        if name == 'success':
            c = fm_bell(hz(83) * k, 2.0, 2.0, 1.4) * .4; out = np.zeros(len(b) + int(.12 * SR)); out[:len(a)] += a; out[:len(b)] += b; out[int(.12 * SR):int(.12 * SR) + len(c)] += c; return out
        out = np.zeros(len(b)); out[:len(a)] += a; out += b; return out
    if name == 'shimmer':
        s = sfx_clean('shimmer', p); r = s[::-1] * .6; out = np.zeros(len(s) * 2); out[:len(r)] += r; out[len(r):] += s; return out
    if name == 'snap':
        t = tt(.3); return bp(noise(len(t)), 900, 5000) * np.exp(-t * 45) * 1.2 + np.sin(2 * np.pi * 90 * t) * np.exp(-t * 30) * .5
    if name == 'glitch':
        base = impact(.7, .3); out = np.zeros(int(.34 * SR))
        for j in range(4):
            seg = base[:int(.05 * SR)] * (1 - j * .15); i = int(j * .07 * SR); out[i:i + len(seg)] += seg
        return np.tanh(2 * out)
    if name == 'riser': return riser(1.4) * .8
    if name == 'blip':
        t = tt(.2); return np.sin(2 * np.pi * 880 * k * t) * np.exp(-t * 18) * .7
    return sfx_clean(name, p)


def crush(x, bits=5, down=6):
    x = np.repeat(x[::down], down)[:len(x)]; q = 2 ** bits
    return np.round(x * q) / q


def sq_notes(ms, step=.045, d=.09, g=.35):
    out = np.zeros(int((len(ms) * step + d + .02) * SR))
    for j, m in enumerate(ms):
        t = tt(d); s = lp(osc('sq', hz(m), len(t)), 5000) * np.exp(-t * 22) * g; i = int(j * step * SR); out[i:i + len(s)] += s
    return out


def sfx_digital(name, p=0.0):
    k = 2 ** (p / 12)
    if name == 'click': t = tt(.014); return np.sign(np.sin(2 * np.pi * 3000 * k * t)) * np.exp(-t * 300) * .45
    if name == 'pop':
        t = tt(.08); f = 600 * k * 2 ** (t / .08 * 1.5); return crush(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 20), 4, 3)
    if name == 'tick': t = tt(.02); return np.sign(np.sin(2 * np.pi * 5200 * k * t)) * np.exp(-t * 350) * .35
    if name in ('key', 'type'):
        t = tt(.009); f = rng.uniform(2000, 5000) * k; return np.sign(np.sin(2 * np.pi * f * t)) * np.exp(-t * 300) * (.4 if name == 'key' else .28)
    if name in ('whoosh', 'swish'):
        d = .55 if name == 'whoosh' else .32; t = tt(d)
        return crush(sweep_noise(d, 250, 6500, 2.0), 5, 6) * np.sin(np.pi * t / d) ** 1.4 * .8
    if name == 'thud':
        t = tt(.35); return crush(np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 25)) * t) * np.exp(-t * 10), 4, 4)
    if name == 'hit':
        base = impact(.8, .9); out = np.zeros(int(1.1 * SR)); w = int(.06 * SR)
        for j in range(3): out[j * w:j * w + w] += base[:w] * (1 - j * .2)
        rest = base[w:]; m = min(len(rest), len(out) - 3 * w); out[3 * w:3 * w + m] += rest[:m]
        return crush(out, 6, 2)
    if name == 'chime': return sq_notes([84, 88, 91], .06, .14, .32)
    if name == 'success': return sq_notes([79, 84, 88, 91, 96], .05, .14, .3)
    if name == 'sparkle': return sq_notes([96, 100, 103, 108], .04, .08, .22)
    if name == 'shimmer': return sq_notes(list(rng.choice([91, 93, 96, 98, 100, 103], 9)), .05, .07, .18)
    if name == 'snap': t = tt(.05); return crush(noise(len(t)) * np.exp(-t * 90), 4, 4) * .9
    if name == 'glitch': return sfx_clean('glitch', p) * 1.1
    if name == 'blip': t = tt(.06); return lp(osc('sq', 1500 * k, len(t)), 6000) * np.exp(-t * 45) * .45
    if name == 'riser': return crush(riser(1.0) * .7, 6, 4)
    if name == 'shutter':
        out = np.zeros(int(.12 * SR))
        for off in (0, .05):
            t = tt(.012); s = np.sign(np.sin(2 * np.pi * 2200 * t)) * np.exp(-t * 300) * .4; i = int(off * SR); out[i:i + len(s)] += s
        return out
    return sfx_clean(name, p)


SFX_PACKS = {'clean': sfx_clean, 'watch': sfx_watch, 'cinematic': sfx_cine, 'digital': sfx_digital}
PACK_GAIN = {'clean': 1.0, 'watch': 1.28, 'cinematic': .8, 'digital': 1.0}      # matched loudness under speech
PACK_REV = {'clean': 1.0, 'watch': .8, 'cinematic': 1.6, 'digital': .6}
sfx = SFX_PACKS[SFX_STYLE]


SFX_GAIN = {'click': .38, 'pop': .30, 'tick': .20, 'key': .45, 'type': .20, 'whoosh': .40, 'swish': .38, 'thud': .55,
            'hit': .55, 'chime': .30, 'success': .34, 'shimmer': .30, 'snap': .45, 'glitch': .35, 'shutter': .42,
            'boing': .35, 'riser': .40, 'blip': .22, 'error': .32, 'sparkle': .26}
SFX_REV = {'chime': .5, 'success': .5, 'shimmer': .6, 'sparkle': .5, 'hit': .4, 'snap': .3, 'whoosh': .25, 'thud': .2, 'pop': .15}

# ---------------- harmony ----------------
CH = {'Am': (57, 60, 64, 33), 'F': (53, 57, 60, 29), 'C': (55, 60, 64, 36), 'G': (55, 59, 62, 31), 'Dm': (57, 62, 65, 38),
      'Bb': (58, 62, 65, 34), 'E': (56, 59, 64, 40), 'Em': (55, 59, 64, 40), 'A': (57, 61, 64, 33), 'Am9': (57, 60, 64, 33)}
HOOK = [  # 4 bars over Am F C G: (bar, beat, dur_beats, midi)
    (0, 0, 1, 69), (0, 1, .5, 72), (0, 1.5, 1, 76), (0, 2.5, .5, 74), (0, 3, 1, 72),
    (1, 0, .5, 69), (1, .5, .5, 72), (1, 1, 1, 77), (1, 2, .5, 76), (1, 2.5, 1.5, 72),
    (2, 0, .5, 67), (2, .5, .5, 72), (2, 1, 1, 76), (2, 2, 1, 79), (2, 3, 1, 76),
    (3, 0, 1, 74), (3, 1, .5, 71), (3, 1.5, .5, 74), (3, 2, 2, 79)]
MOTIF3 = [  # over Dm Bb F C
    (0, 0, 1, 69), (0, 1, 1, 74), (0, 2, 1.5, 77), (0, 3.5, .5, 76),
    (1, 0, 1.5, 74), (1, 1.5, .5, 77), (1, 2, 2, 74),
    (2, 0, 1, 72), (2, 1, 1, 77), (2, 2, 1.5, 81), (2, 3.5, .5, 79),
    (3, 0, 1.5, 76), (3, 1.5, .5, 74), (3, 2, 2, 72)]

STYLES = {
    'problem': dict(prog=['Am9', 'Am9', 'F', 'E'], kick='heart', hats='tick', bass='pulse', bright=(.05, .35), pad='dark', arp=None),
    'build':   dict(prog=['Am', 'F', 'E', 'E'], kick='four', kg=.55, hats='8', bass='pulse', bright=(.35, 1.0), pad='swell', arp='16', ag=.5, roll=True),
    'drop':    dict(prog=['Am', 'F', 'C', 'G'], kick='four', snare='clap', hats='16', openhat=True, bass='oct', pad='big', arp='16', lead=HOOK, crash=True),
    'ch2':     dict(prog=['F', 'C', 'G', 'Am'], kick='four', kg=.8, snare='clap', sg=.7, hats='8', bass='off', pad='soft', arp='16', ag=.8),
    'ch3':     dict(prog=['Dm', 'Bb', 'F', 'C'], kick='half', snare='snare', hats='8', hg=.7, bass='long', pad='lush', arp='8', lead=MOTIF3, lg=.6, lead_every=2),
    'ch4':     dict(prog=['Am', 'G', 'F', 'E'], kick='four', snare='clap', hats='16', bass='synco', pad='soft', arp='16', stabs=True, crash=True),
    'ch5':     dict(prog=['Am', 'F', 'C', 'G'], kick='four', snare='clap', hats='16', openhat=True, bass='oct', pad='big', arp='16', lead=HOOK, lg=.8, crash=True),
    'ch6':     dict(prog=['C', 'G', 'Am', 'F'], kick='two', snare='rim', hats='shaker', bass='long', pad='warm', arp='8', ag=.9),
}

# sections from the timeline
cards = [s for s in TL['scenes'] if s.get('card')]
sections = [(0.0, SC['s02_collapse']['start'], 'problem'), (SC['s02_collapse']['start'], SC['s03_title']['start'], 'build'),
            (SC['s03_title']['start'], cards[0]['start'], 'drop')]
names = ['ch2', 'ch3', 'ch4', 'ch5', 'ch6']
for k, c in enumerate(cards):
    end = cards[k + 1]['start'] if k + 1 < len(cards) else SC['s20_outro']['start']
    sections.append((c['start'], c['start'] + c['dur'], 'card:' + names[k]))
    sections.append((c['start'] + c['dur'], end, names[k]))
sections.append((SC['s20_outro']['start'], TOTAL, 'finale'))

sc_kicks = []   # kick times for sidechain


def place_note(bus, sig, t, end, g, pan=0.0, sig_r=None, fade=.03):
    """add a note, cutting it cleanly at the section end"""
    if t >= end: return
    n = int((end - t) * SR)
    if len(sig) > n:
        f = np.ones(n); m = min(n, int(fade * SR)); f[n - m:] = np.linspace(1, 0, m)
        sig = sig[:n] * f
        if sig_r is not None: sig_r = sig_r[:n] * f
    bus.add(sig, t, g, pan, sig_r)


def run_section(a, b, name):
    st = STYLES[name]; prog = st['prog']
    nbars = int(np.ceil((b - a) / BAR - 1e-6))
    for bi in range(nbars):
        t0 = a + bi * BAR
        chord = CH[prog[bi % len(prog)]]; notes, root = chord[:3], chord[3]
        frac = bi / max(1, nbars - 1)
        # pads
        pd = st.get('pad')
        if pd:
            warmth = {'dark': 700 + 900 * frac, 'swell': 900 + 2600 * frac, 'big': 3200, 'soft': 2200, 'lush': 2600, 'warm': 1900}[pd]
            g = {'dark': .5, 'swell': .45 + .3 * frac, 'big': .55, 'soft': .42, 'lush': .55, 'warm': .5}[pd]
            fr = [hz(m) for m in notes] + ([hz(notes[0] + 12)] if pd in ('big', 'lush') else []) + ([hz(notes[0] - 12 + 2)] if pd == 'dark' else [])
            Lx, Rx = pad_chord(fr, BAR + .6, warmth, a=.5 if pd in ('dark', 'swell') else .25)
            place_note(pad_b, Lx, t0, b + .3, g, 0, Rx, fade=.3)
            rev_send.add(Lx, t0, g * .35, -.3, Rx)
        # drums
        for s in range(16):
            ts = t0 + s * STEP
            if ts >= b - .02: break
            kg = st.get('kg', 1.0)
            kpat = {'four': s % 4 == 0, 'half': s in (0, 10), 'two': s in (0, 8), 'heart': s in (0, 3)}.get(st.get('kick'), False)
            if kpat:
                drums.add(kick(kg * (.55 if st['kick'] == 'heart' and s == 3 else 1) * (.6 if st['kick'] == 'heart' else 1)), ts, .9)
                sc_kicks.append(ts)
            sn = st.get('snare'); sg = st.get('sg', 1.0)
            if sn == 'clap' and s in (4, 12): drums.add(clap(sg), ts, .6, .08); rev_send.add(clap(sg), ts, .12)
            if sn == 'snare' and s == 8: drums.add(snare(sg), ts, .6, .05); rev_send.add(snare(sg), ts, .15)
            if sn == 'rim' and s in (4, 12, 14): drums.add(rim(sg * (.6 if s == 14 else 1)), ts, .35, .2)
            h, hg = st.get('hats'), st.get('hg', 1.0)
            vel = .75 + .25 * rng.random()
            if h == '16': drums.add(hat(hg * vel * (1 if s % 2 else .5)), ts, .22, .3)
            if h == '8' and s % 2 == 0: drums.add(hat(hg * vel * (1 if s % 4 == 2 else .6)), ts, .24, .3)
            if h == 'tick' and s % 4 == 0: drums.add(hat(.8), ts, .35, .25)
            if h == 'shaker': drums.add(shaker(vel * (1 if s % 2 else .6)), ts, .36, .35)
            if st.get('openhat') and s in (2, 6, 10, 14): drums.add(hat(.7, True), ts, .14, -.25)
            # bass
            bs = st.get('bass'); bl = st.get('bright', (.6, .6)); bright = bl[0] + (bl[1] - bl[0]) * ((ts - a) / max(b - a, 1e-6))
            bnote = None
            if bs == 'pulse' and s % 2 == 0: bnote = (root, STEP * 1.6)
            if bs == 'oct' and s % 2 == 0: bnote = (root + (12 if s % 4 == 2 else 0), STEP * 1.7)
            if bs == 'off' and s in (2, 6, 10, 14): bnote = (root, STEP * 1.8)
            if bs == 'long' and s == 0: bnote = (root, BAR * .95)
            if bs == 'synco' and s in (0, 3, 6, 8, 11, 14): bnote = (root + (12 if s in (6, 14) else 0), STEP * 1.5)
            if bnote: place_note(bass_b, bass_note(hz(bnote[0]), bnote[1], bright), ts, b, .55 if bs != 'long' else .5)
            # arp
            ar = st.get('arp')
            if ar and ts - a > (.0 if name != 'problem' else 99):
                if (ar == '16') or (ar == '8' and s % 2 == 0):
                    pat = [0, 1, 2, 3, 2, 1, 0, 2][s % 8] if ar == '16' else [0, 2, 3, 1][(s // 2) % 4]
                    m = (list(notes) + [notes[0] + 12])[pat] + 12
                    ag = st.get('ag', 1.0)
                    sig = pluck(hz(m), .28 if ar == '16' else .5, .8)
                    pan = -.35 if s % 2 else .35
                    place_note(arp_b, sig, ts, b, .16 * ag, pan); dly_send.add(sig, ts, .07 * ag, pan); rev_send.add(sig, ts, .06 * ag)
            if st.get('stabs') and s in (6, 14):
                sig = stab([hz(m + 12) for m in notes]); place_note(fx_b, sig, ts, b, .18, 0); rev_send.add(sig, ts, .08)
        if st.get('crash') and bi == 0: drums.add(crash(), t0, .5); rev_send.add(crash(), t0, .15)
        # lead
        L = st.get('lead')
        if L and bi < nbars and (bi // 4) % st.get('lead_every', 1) == 0:
            for (bar, beat, d, m) in L:
                if bar == bi % 4:
                    ts = t0 + beat * BEAT
                    sig = lead_note(hz(m), d * BEAT)
                    place_note(lead_b, sig, ts, b, .2 * st.get('lg', 1.0), .05); dly_send.add(sig, ts, .06 * st.get('lg', 1.0), .05); rev_send.add(sig, ts, .09)
    # special gestures
    if name == 'drop':
        fx_b.add(impact(1.0, 2.4), a, .85); rev_send.add(impact(1.0, 2.4), a, .3)
        fx_b.add(fm_bell(hz(81), 2.0) * .3, a, .5); rev_send.add(fm_bell(hz(81), 2.0), a, .15)
    if name == 'problem':
        drone_n = int((b - a + .5) * SR); t = np.arange(drone_n) / SR
        dr = lp(osc('saw', hz(33), drone_n) + osc('saw', hz(40) * 1.003, drone_n) * .6, 520) * np.minimum(1, t / 2.0) * (.8 + .2 * np.sin(t * .6))
        fx_b.add(dr * .22, a); rev_send.add(dr, a, .05)
    if st.get('roll'):
        # snare roll into the title drop, 16ths then 32nds, crescendo; stop just before the hit
        r0 = b - 3.0; ts = r0; i = 0
        while ts < b - .06:
            q = (ts - r0) / 3.0; drums.add(snare(.35 + .65 * q), ts, .45 * (.4 + .6 * q), .05 * np.sin(i)); i += 1
            ts += STEP if q < .5 else STEP / 2
        fx_b.add(riser(b - a - .6) * .75, a + .5, .7); fx_b.add(reverse_cymbal(1.6), b - 1.6 - .05, .6)


def run_card(a, b, nxt):
    """chapter card: impact + stab on the downbeat, drums stop, a reverse swell leads into the next chapter"""
    st = STYLES[nxt]; ch = CH[st['prog'][0]]
    fx_b.add(impact(1.0, 2.2), a, .8); rev_send.add(impact(1.0, 2.2), a, .25)
    s = stab([hz(m) for m in ch[:3]] + [hz(ch[0] + 12)], .9); fx_b.add(s, a, .35); rev_send.add(s, a, .3)
    Lx, Rx = pad_chord([hz(m) for m in ch[:3]], b - a + .4, 1500, a=.05, r=.4); pad_b.add(Lx, a, .35, 0, Rx); rev_send.add(Lx, a, .2, 0, Rx)
    fx_b.add(downlifter(1.1), a + .05, .35)
    fx_b.add(reverse_cymbal(b - a - .2), a + .2, .45)
    bass_b.add(bass_note(hz(ch[3]), b - a - .1, .3), a, .45)


def run_finale(a, b):
    seq = [('F', a), ('G', a + BAR), ('Am', a + 2 * BAR)]
    final_t = a + 3 * BAR
    fx_b.add(impact(1.0, 2.4), a, .8); drums.add(crash(1.0, 3.0), a, .55)
    for name, t0 in seq:
        ch = CH[name]
        Lx, Rx = pad_chord([hz(m) for m in ch[:3]] + [hz(ch[0] + 12)], BAR + .5, 3000, a=.1)
        pad_b.add(Lx, t0, .5, 0, Rx); rev_send.add(Lx, t0, .3, 0, Rx)
        for s in range(16):
            ts = t0 + s * STEP
            if s % 4 == 0: drums.add(kick(), ts, .9); sc_kicks.append(ts)
            if s in (4, 12): drums.add(clap(), ts, .55, .08)
            drums.add(hat(.8 if s % 2 else .45), ts, .3, .3)
            if s % 2 == 0: bass_b.add(bass_note(hz(ch[3] + (12 if s % 4 == 2 else 0)), STEP * 1.7, .8), ts, .5)
            m = (list(ch[:3]) + [ch[0] + 12])[[0, 1, 2, 3, 2, 1, 0, 2][s % 8]] + 12
            sig = pluck(hz(m), .28, .9); arp_b.add(sig, ts, .15, -.35 if s % 2 else .35); dly_send.add(sig, ts, .06)
    # last bar before the final chord: tom fill
    for j, f in enumerate((180, 150, 125, 100)):
        drums.add(tom(f), final_t - BEAT + j * STEP, .5, -.3 + j * .2)
    # final chord: A major, big, with crash and a long tail
    ch = CH['A']; tail = b - final_t + 2.5
    Lx, Rx = pad_chord([hz(m) for m in ch[:3]] + [hz(ch[0] + 12), hz(ch[0] - 12)], tail, 3200, a=.02, r=2.5)
    pad_b.add(Lx, final_t, .6, 0, Rx); rev_send.add(Lx, final_t, .45, 0, Rx)
    fx_b.add(impact(1.0, 3.0), final_t, .9); drums.add(crash(1.0, 4.0), final_t, .6); rev_send.add(crash(1.0, 4.0), final_t, .3)
    bass_b.add(bass_note(hz(33), 3.5, .4) * np.exp(-tt(3.5) * .6), final_t, .55)
    ln = lead_note(hz(81), 3.0) * np.exp(-tt(3.0) * .5); lead_b.add(ln, final_t, .2); rev_send.add(ln, final_t, .2); dly_send.add(ln, final_t, .08)
    for k, m in enumerate((93, 96, 100)):
        fb = fm_bell(hz(m), 2.5) * .25; fx_b.add(fb, final_t + .05 * k, .6, -.4 + .4 * k); rev_send.add(fb, final_t, .3)
    return final_t


# ======================= alternative music styles =======================
# Each style renders one bar at a time at a section "level" (0 quiet intro ... 3 full), and brings its own
# chapter-card gesture, fill into a card, section specials and finale. 'electro' keeps the arranger above.
LEVEL = {'problem': 0, 'build': 1, 'drop': 3, 'ch2': 2, 'ch3': 2, 'ch4': 2.5, 'ch5': 3, 'ch6': 2}


def soft_kick(g=1.0):
    t = tt(.35); f = 50 + 90 * np.exp(-t * 40)
    return np.tanh(1.2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)) * g


def taiko(g=1.0, f=70):
    t = tt(1.2); ff = f * (1 + .5 * np.exp(-t * 18))
    body = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 4.2)
    skin = lp(noise(len(t)), 1800) * np.exp(-t * 28) * .6
    return np.tanh(1.5 * (body + skin)) * g


def clock_tick(g=1.0, hi=True):
    t = tt(.04); f = 3900 if hi else 3100
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 260) + np.sin(2 * np.pi * f * 1.53 * t) * np.exp(-t * 320) * .6
            + hp(noise(len(t)), 4000) * np.exp(-t * 600) * .4) * g


def finger_snap(g=1.0):
    t = tt(.15); s = bp(noise(len(t)), 1500, 5500) * np.exp(-t * 55); a = int(.003 * SR); s[:a] *= np.linspace(0, 1, a)
    return s * 1.3 * g


def gated_snare(g=1.0):
    t = tt(.42); out = np.zeros(len(t)); b = snare(1.0); out[:len(b)] += b
    out += bp(noise(len(t)), 700, 7000) * .45 * np.clip(1 - (t - .3) / .03, 0, 1) * np.exp(-t * 1.5)
    return out * g


def sub_bass(f, dur):
    n = int(dur * SR); x = osc('sin', f, n) + .12 * osc('sin', 2 * f, n)
    return np.tanh(1.3 * x) * adsr(n, .006, .3, .85, .06)


def ostinato(f, dur, bright=.6):
    n = int(dur * SR); x = osc('saw', f, n) * .7 + osc('sq', f * 1.003, n) * .3
    env = np.exp(-np.arange(n) / SR * 16)
    y = lp(x, 300) * (1 - env) * .5 + lp(x, 900 + 2600 * bright) * env
    return np.tanh(1.2 * y) * adsr(n, .003, .1, .6, .03)


def braam(freqs, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(osc('saw', f * (1 + d), n) + .5 * osc('sq', f * (1 - d), n) for f in freqs for d in (-.006, .006))
    o = np.clip(t / .35, 0, 1)
    y = lp(x, 400) * (1 - .6 * o) + lp(x, 1600) * .6 * o
    return np.tanh(2.2 * y / len(freqs)) * adsr(n, .06, 1.2, .7, min(1.2, dur * .5))


def air_pad(freqs, dur, a=.5, r=.6):
    n = int(dur * SR); Lx = np.zeros(n); Rx = np.zeros(n)
    for f in freqs:
        for k, det in enumerate((-.004, .004)):
            (Lx if k == 0 else Rx)[:] += osc('sin', f * (1 + det), n) + .25 * osc('sin', 2 * f * (1 + det), n)
    env = adsr(n, a, 1.0, .9, r)
    return Lx * env / len(freqs), Rx * env / len(freqs)


def marimba(f, dur=.5):
    t = tt(dur); mod = np.sin(2 * np.pi * f * 4 * t) * 1.2 * np.exp(-t * 30)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 9) * np.minimum(1, t / .001)


def rhodes(freqs, dur=.6):
    t = tt(dur); out = np.zeros(len(t))
    for f in freqs:
        mod = np.sin(2 * np.pi * f * t) * 1.4 * np.exp(-t * 5)
        out += np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 3.5) + .25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 7)
    return lp(out / len(freqs), 4000) * (1 + .15 * np.sin(2 * np.pi * 5 * t)) * adsr(len(t), .004, .6, .5, .12)


def sq_pluck(f, dur=.25):
    t = tt(dur); return lp(osc('sq', f, len(t)), 3500) * np.exp(-t * 9) * np.minimum(1, t / .002)


def bar_steps(t0, end):
    for s in range(16):
        ts = t0 + s * STEP
        if ts >= end - .02: return
        yield s, ts


def hook_notes(bi, motif, t0):
    for (bar, beat, d, m) in motif:
        if bar == bi % 4: yield t0 + beat * BEAT, d, m


def bells(t, notes, g=.25, spread=.05):
    for k, m in enumerate(notes):
        fb = fm_bell(hz(m), 2.5) * g; fx_b.add(fb, t + spread * k, .6, -.4 + .8 * k / max(1, len(notes) - 1)); rev_send.add(fb, t, .3)


def problem_drone(a, b, hi=40, cut=500, g=.22):
    n = int((b - a + .5) * SR); t = np.arange(n) / SR
    dr = lp(osc('saw', hz(33), n) + osc('saw', hz(hi) * 1.003, n) * .6, cut) * np.minimum(1, t / 2.0)
    fx_b.add(dr * g, a); rev_send.add(dr, a, .05)


class Cinematic:
    """trailer pulse: string pads, a ticking clock, taiko hits, a driving ostinato, braams on the big moments"""
    PROG = {'problem': ['Am9', 'Am9', 'F', 'E'], 'build': ['Am', 'F', 'E', 'E'], 'drop': ['Am', 'F', 'C', 'G'],
            'ch2': ['F', 'C', 'G', 'Am'], 'ch3': ['Dm', 'Bb', 'F', 'C'], 'ch4': ['Am', 'G', 'F', 'E'],
            'ch5': ['Am', 'F', 'C', 'G'], 'ch6': ['C', 'G', 'Am', 'F']}
    PUMP = 0.0

    @staticmethod
    def bar(t0, end, cname, lvl, frac, bi, name):
        ch = CH[cname]; notes, root = ch[:3], ch[3]
        Lx, Rx = pad_chord([hz(m) for m in notes] + ([hz(notes[0] - 12)] if lvl >= 2 else []), BAR + .8, 900 + 600 * lvl, a=.6 if lvl < 3 else .3, r=.8)
        g = .32 + .08 * lvl
        place_note(pad_b, Lx, t0, end + .4, g, 0, Rx, fade=.4); rev_send.add(Lx, t0, g * .45, -.2, Rx)
        taik = {0: (), 1: (0, 8), 2: (0, 6, 8), 2.5: (0, 6, 8, 11), 3: (0, 3, 6, 8, 11, 14)}[lvl]
        for s, ts in bar_steps(t0, end):
            if s % 2 == 0 or lvl >= 3:                      # the clock: tick-tock
                hi = (s // 2) % 2 == 0
                drums.add(clock_tick(.8 if s % 4 == 0 else .55, hi), ts, .15 + .04 * min(lvl, 2), -.25 if hi else .25)
            if lvl >= 1 and (lvl != 2 or s % 2 == 0):       # ostinato: 16ths when driving, 8ths under the body
                m = root + 12 + ([0, 0, 12, 0, 7, 0, 12, 7][s % 8] if lvl != 2 else (12 if s % 8 == 6 else 0))
                place_note(bass_b, ostinato(hz(m), STEP * (1.1 if lvl != 2 else 1.8), .3 + .2 * lvl), ts, end, .4, -.12 if s % 2 else .12)
            if s in taik:
                drums.add(taiko(1.0 if s in (0, 8) else .65, 62 if s in (0, 8) else 88), ts, .5 + .08 * min(lvl, 2))
        if lvl >= 2: place_note(bass_b, sub_bass(hz(root), BAR * .9) * .6, t0, end, .35)
        if lvl >= 2 and (bi // 4) % 2 == 1:                  # a bell states the hook every other phrase
            for ts, d, m in hook_notes(bi, HOOK if name != 'ch3' else MOTIF3, t0):
                if abs((ts - t0) / BEAT - round((ts - t0) / BEAT)) < 1e-6:
                    sig = fm_bell(hz(m), 1.6, 3.0, 1.2) * .5
                    place_note(lead_b, sig, ts, end, .15, .1); rev_send.add(sig, ts, .12); dly_send.add(sig, ts, .05)

    @staticmethod
    def special(a, b, name):
        if name == 'problem': problem_drone(a, b, 40, 480, .24)
        if name == 'build':
            fx_b.add(riser(b - a - .6) * .7, a + .5, .7); fx_b.add(reverse_cymbal(1.6), b - 1.6 - .05, .55)
            r0 = b - 3.0; ts = r0; i = 0
            while ts < b - .06:
                q = (ts - r0) / 3.0; drums.add(taiko(.35 + .65 * q, 95 + 25 * (i % 2)), ts, .38 * (.5 + .5 * q), .25 * np.sin(i)); i += 1
                ts += STEP * 2 if q < .5 else STEP
        if name == 'drop':
            r = CH['Am'][3]; x = braam([hz(r), hz(r + 7), hz(r + 12)], 3.4)
            fx_b.add(x, a, .65); rev_send.add(x, a, .25)
            fx_b.add(impact(1.0, 2.4), a, .8); rev_send.add(impact(1.0, 2.4), a, .3)

    @staticmethod
    def card(a, b, nxt):
        r = CH[Cinematic.PROG[nxt][0]][3]; x = braam([hz(r), hz(r + 7), hz(r + 12)], b - a + .6)
        fx_b.add(x, a, .55); rev_send.add(x, a, .25)
        drums.add(taiko(1.2, 55), a, .7); fx_b.add(impact(.8, 1.8), a, .5)
        fx_b.add(reverse_cymbal(b - a - .2), a + .2, .4)

    @staticmethod
    def pre_card(b):
        for j in range(6): drums.add(taiko(.5 + j * .1, 100 - j * 6), b - BAR / 2 + j * STEP * 1.33, .4, -.3 + j * .12)
        fx_b.add(riser(1.6) * .7, b - 1.6, .45)

    @staticmethod
    def finale(a, b):
        final_t = a + 3 * BAR
        fx_b.add(impact(1.0, 2.4), a, .8)
        for j, cn in enumerate(('F', 'G', 'Am')): Cinematic.bar(a + j * BAR, final_t, cn, 3, 1, 0, 'finale')
        Cinematic.pre_card(final_t)
        ch = CH['A']; tail = b - final_t + 2.5
        x = braam([hz(ch[3]), hz(ch[3] + 7), hz(ch[3] + 12), hz(ch[3] + 16)], tail); fx_b.add(x, final_t, .6); rev_send.add(x, final_t, .3)
        Lx, Rx = pad_chord([hz(m) for m in ch[:3]] + [hz(ch[0] + 12)], tail, 2400, a=.05, r=2.5); pad_b.add(Lx, final_t, .55, 0, Rx); rev_send.add(Lx, final_t, .4, 0, Rx)
        drums.add(taiko(1.3, 50), final_t, .8); fx_b.add(impact(1.0, 3.0), final_t, .85)
        bells(final_t, (81, 88, 93), .25)
        return final_t


KEY_HOOK = [(0, 0, 1, 72), (0, 1, .5, 76), (0, 1.5, 1.5, 79), (0, 3, 1, 76),      # over C
            (1, 0, 1, 74), (1, 1, .5, 79), (1, 1.5, 1.5, 83), (1, 3, 1, 79),      # over G
            (2, 0, 1, 76), (2, 1, .5, 72), (2, 1.5, 1.5, 81), (2, 3, 1, 79),      # over Am
            (3, 0, 1, 77), (3, 1, .5, 72), (3, 1.5, 2.5, 76)]                     # over F


class Keynote:
    """minimal and optimistic: airy pads, marimba, soft kick, finger snaps, a warm sine bass"""
    PROG = {'problem': ['Am', 'F', 'C', 'G'], 'build': ['F', 'G', 'Am', 'G'], 'drop': ['C', 'G', 'Am', 'F'],
            'ch2': ['F', 'C', 'G', 'Am'], 'ch3': ['Dm', 'F', 'C', 'G'], 'ch4': ['Am', 'F', 'C', 'G'],
            'ch5': ['C', 'G', 'Am', 'F'], 'ch6': ['F', 'G', 'C', 'C']}
    PUMP = .2

    @staticmethod
    def bar(t0, end, cname, lvl, frac, bi, name):
        ch = CH[cname]; notes, root = ch[:3], ch[3]
        tones = list(notes) + [notes[0] + 12]
        Lx, Rx = air_pad([hz(m) for m in tones], BAR + .6, a=.5)
        g = .2 + .05 * lvl
        place_note(pad_b, Lx, t0, end + .3, g, 0, Rx, fade=.3); rev_send.add(Lx, t0, g * .5, 0, Rx)
        kicks = () if lvl < 1 else (0,) if lvl < 2 else (0, 8, 10) if lvl < 3 else (0, 6, 8, 10)
        for s, ts in bar_steps(t0, end):
            if lvl == 0 and s in (0, 8):
                sig = marimba(hz(tones[(s // 8 + bi) % 4] + 12), .8); place_note(arp_b, sig, ts, end, .2, .2 if s else -.2); rev_send.add(sig, ts, .1)
            if lvl >= 1:
                if s in kicks: drums.add(soft_kick(.9), ts, .75); sc_kicks.append(ts)
                drums.add(shaker(.55 if s % 2 else .35), ts, .22 + .04 * lvl, .3)
                if s % 2 == 0:
                    sig = marimba(hz(tones[[0, 1, 2, 1][(s // 2) % 4]] + 12), .5)
                    place_note(arp_b, sig, ts, end, .15, -.3 if s % 4 else .3); dly_send.add(sig, ts, .05); rev_send.add(sig, ts, .06)
            if lvl >= 2:
                if s in (4, 12): drums.add(finger_snap(), ts, .45, .1); rev_send.add(finger_snap(), ts, .1)
                if s in (0, 6, 10): place_note(bass_b, sub_bass(hz(root), STEP * 3), ts, end, .5)
                if s in (3, 11):
                    for m in (notes[1] + 12, notes[2] + 12): place_note(arp_b, marimba(hz(m), .4), ts, end, .1, .1)
            if lvl >= 3 and s % 2 == 1:
                sig = marimba(hz(tones[[3, 2, 1, 2][(s // 2) % 4]] + 24), .3); place_note(arp_b, sig, ts, end, .07, .4 if s % 4 == 1 else -.4)
        if lvl >= 3 and (bi // 4) % 2 == 0 and name in ('drop', 'ch5'):
            for ts, d, m in hook_notes(bi, KEY_HOOK, t0):
                sig = fm_bell(hz(m + 12), 1.0, 3.5, 1.0) * .45; place_note(lead_b, sig, ts, end, .12, .05); dly_send.add(sig, ts, .05); rev_send.add(sig, ts, .08)

    @staticmethod
    def special(a, b, name):
        if name == 'build':
            d = b - a - .8; fx_b.add(sweep_noise(d, 400, 7000, 2.0, 1.6) * np.linspace(0, 1, int(d * SR)) ** 2 * .35, a + .6, .6)
        if name == 'drop':
            fx_b.add(impact(.6, 1.6), a, .5); bells(a, (84, 88, 91), .3, .03)

    @staticmethod
    def card(a, b, nxt):
        ch = CH[Keynote.PROG[nxt][0]]
        bass_b.add(bass_note(hz(ch[3]), b - a - .2, .2), a, .35); fx_b.add(impact(.5, 1.2), a, .35)
        bells(a, [m + 12 for m in ch[:3]], .3, .04)
        Lx, Rx = air_pad([hz(m) for m in ch[:3]], b - a + .4, a=.05, r=.4); pad_b.add(Lx, a, .3, 0, Rx)
        fx_b.add(reverse_cymbal(b - a - .2) * .6, a + .2, .35)

    @staticmethod
    def pre_card(b):
        for j, m in enumerate((72, 76, 79, 84)):
            sig = marimba(hz(m + 12), .4); arp_b.add(sig, b - BEAT + j * STEP, .15, -.3 + j * .2); dly_send.add(sig, b - BEAT + j * STEP, .05)

    @staticmethod
    def finale(a, b):
        final_t = a + 3 * BAR
        for j, cn in enumerate(('F', 'G', 'Am')): Keynote.bar(a + j * BAR, final_t, cn, 3, 1, 1, 'finale')
        Keynote.pre_card(final_t)
        ch = CH['C']; tail = b - final_t + 2.5
        Lx, Rx = air_pad([hz(m) for m in ch[:3]] + [hz(ch[0] + 12)], tail, a=.02, r=2.5); pad_b.add(Lx, final_t, .45, 0, Rx); rev_send.add(Lx, final_t, .4, 0, Rx)
        bass_b.add(sub_bass(hz(ch[3]), 3.0) * np.exp(-tt(3.0) * .7), final_t, .5); drums.add(soft_kick(1.0), final_t, .8)
        for k, m in enumerate((72, 76, 79, 84, 88)):
            sig = marimba(hz(m + 12), 1.2); arp_b.add(sig, final_t + .035 * k, .2, -.4 + .2 * k); rev_send.add(sig, final_t, .15)
        bells(final_t, (84, 91, 96), .25)
        return final_t


HV = {'Am9': ((60, 64, 67, 71), 33), 'Fmaj9': ((57, 60, 64, 67), 29), 'Dm9': ((53, 57, 60, 64), 38),
      'Em7': ((55, 59, 62, 64), 40), 'Cmaj9': ((55, 59, 62, 64), 36), 'G6': ((55, 59, 62, 64), 31)}


class House:
    """deep house: four-on-the-floor, offbeat hats, electric-piano stabs on rich 9th chords, a round sub bass"""
    PROG = {'problem': ['Am9', 'Am9', 'Fmaj9', 'Fmaj9'], 'build': ['Dm9', 'Em7', 'Fmaj9', 'G6'], 'drop': ['Am9', 'Fmaj9', 'Dm9', 'Em7'],
            'ch2': ['Fmaj9', 'Cmaj9', 'Dm9', 'Am9'], 'ch3': ['Dm9', 'Am9', 'Fmaj9', 'Em7'], 'ch4': ['Am9', 'G6', 'Fmaj9', 'Em7'],
            'ch5': ['Am9', 'Fmaj9', 'Dm9', 'Em7'], 'ch6': ['Cmaj9', 'G6', 'Am9', 'Fmaj9']}
    PUMP = .4

    @staticmethod
    def bar(t0, end, cname, lvl, frac, bi, name):
        notes, root = HV[cname]
        Lx, Rx = pad_chord([hz(m) for m in notes], BAR + .6, 1100 + 200 * lvl, a=.3)
        place_note(pad_b, Lx, t0, end + .3, .26, 0, Rx, fade=.3); rev_send.add(Lx, t0, .1, 0, Rx)
        if lvl == 0:
            sig = rhodes([hz(m) for m in notes], BAR * .95); place_note(fx_b, sig, t0, end, .3, 0); rev_send.add(sig, t0, .15)
        for s, ts in bar_steps(t0, end):
            if lvl >= 1:
                if s % 4 == 0: drums.add(kick(.85), ts, .8); sc_kicks.append(ts)
                if s in (2, 6, 10, 14): drums.add(hat(.75, True), ts, .16, .2)
                if s in (3, 6, 11) or (lvl >= 2.5 and s == 14):
                    sig = rhodes([hz(m) for m in notes], .5 if s == 6 else .32)
                    place_note(fx_b, sig, ts, end, .28, -.1); rev_send.add(sig, ts, .1); dly_send.add(sig, ts, .04)
                bn = {0: root, 3: root + 12, 7: root, 10: root + 7, 14: root + 12}.get(s)
                if bn is not None and (lvl >= 2 or s in (0, 7)): place_note(bass_b, sub_bass(hz(bn), STEP * 2.2), ts, end, .55)
            if lvl >= 2:
                if s in (4, 12): drums.add(clap(.8), ts, .5, .05); rev_send.add(clap(.8), ts, .18)
                drums.add(shaker(.7 if s % 2 else .45), ts, .25, -.3)
                if s % 2 == 1: drums.add(hat(.5), ts, .12, .35)
        if lvl >= 3 and (bi // 4) % 2 == 1:
            for ts, d, m in hook_notes(bi, HOOK, t0):
                sig = pluck(hz(m), min(d * BEAT, .6), .6); place_note(lead_b, sig, ts, end, .13, .1); dly_send.add(sig, ts, .06); rev_send.add(sig, ts, .06)

    @staticmethod
    def special(a, b, name):
        if name == 'build':
            d = b - a - .6; fx_b.add(sweep_noise(d, 300, 8000, 2.2, 1.8) * np.linspace(0, 1, int(d * SR)) ** 2 * .45, a + .5, .6)
            fx_b.add(reverse_cymbal(1.6), b - 1.6 - .05, .5)
        if name == 'drop':
            fx_b.add(impact(.8, 2.0), a, .6); drums.add(crash(.9), a, .45); rev_send.add(crash(.9), a, .12)

    @staticmethod
    def card(a, b, nxt):
        notes, root = HV[House.PROG[nxt][0]]
        fx_b.add(impact(.8, 2.0), a, .6)
        sig = rhodes([hz(m) for m in notes], b - a); fx_b.add(sig, a, .35); rev_send.add(sig, a, .3)
        d = b - a - .1; bass_b.add(sub_bass(hz(root), d) * np.exp(-np.arange(int(d * SR)) / SR * 1.2), a, .45)
        fx_b.add(reverse_cymbal(b - a - .2), a + .2, .4)

    @staticmethod
    def pre_card(b):
        for j in range(8): drums.add(hat(.5 + j * .06), b - BAR / 2 + j * STEP, .2, .3)
        fx_b.add(riser(1.6) * .6, b - 1.6, .4)

    @staticmethod
    def finale(a, b):
        final_t = a + 3 * BAR
        for j, cn in enumerate(('Dm9', 'Em7', 'Fmaj9')): House.bar(a + j * BAR, final_t, cn, 3, 1, 0, 'finale')
        House.pre_card(final_t)
        notes, root = HV['Cmaj9']; tail = b - final_t + 2.5
        sig = rhodes([hz(m) for m in notes], tail); fx_b.add(sig * np.exp(-np.arange(len(sig)) / SR * .5), final_t, .45); rev_send.add(sig, final_t, .35)
        Lx, Rx = pad_chord([hz(m) for m in notes], tail, 1600, a=.02, r=2.5); pad_b.add(Lx, final_t, .4, 0, Rx); rev_send.add(Lx, final_t, .3, 0, Rx)
        bass_b.add(sub_bass(hz(root), 3.0) * np.exp(-tt(3.0) * .7), final_t, .55)
        drums.add(kick(1.0), final_t, .85); drums.add(crash(1.0, 4.0), final_t, .5); fx_b.add(impact(.9, 3.0), final_t, .7)
        bells(final_t, (88, 91, 95), .22)
        return final_t


class Synthwave:
    """retro 80s: gated snare, driving octave bass, square arps, lush detuned pads, a singing lead"""
    PROG = {'problem': ['Am', 'Am', 'F', 'E'], 'build': ['Am', 'F', 'G', 'E'], 'drop': ['Am', 'F', 'C', 'G'],
            'ch2': ['F', 'C', 'G', 'Am'], 'ch3': ['Dm', 'Bb', 'F', 'C'], 'ch4': ['Am', 'G', 'F', 'E'],
            'ch5': ['Am', 'F', 'C', 'G'], 'ch6': ['C', 'G', 'Am', 'F']}
    PUMP = .3

    @staticmethod
    def bar(t0, end, cname, lvl, frac, bi, name):
        ch = CH[cname]; notes, root = ch[:3], ch[3]
        tones = list(notes) + [notes[0] + 12]
        Lx, Rx = pad_chord([hz(m) for m in tones], BAR + .6, 2200 + 300 * lvl, a=.25 if lvl else .6)
        place_note(pad_b, Lx, t0, end + .3, .42, 0, Rx, fade=.3); rev_send.add(Lx, t0, .2, 0, Rx)
        for s, ts in bar_steps(t0, end):
            if lvl >= 1 or s % 2 == 0:
                sig = sq_pluck(hz(tones[[0, 1, 2, 3, 2, 1, 0, 2][s % 8]] + 12), .22)
                place_note(arp_b, sig, ts, end, .1 if lvl else .07, -.35 if s % 2 else .35); dly_send.add(sig, ts, .06)
            if lvl >= 1:
                if s in ((0, 4, 8, 12) if lvl >= 3 else (0, 8)): drums.add(kick(.95), ts, .85); sc_kicks.append(ts)
                if s % 2 == 0: place_note(bass_b, bass_note(hz(root + (12 if s % 4 == 2 else 0)), STEP * 1.8, .45), ts, end, .5)
            if lvl >= 2:
                if s in (4, 12): drums.add(gated_snare(.9), ts, .55, .05); rev_send.add(gated_snare(.9), ts, .12)
                if s % 2 == 0: drums.add(hat(.6), ts, .2, .3)
        if lvl >= 3 and bi % 4 == 0: drums.add(crash(.8), t0, .35)
        if lvl >= 3:
            for ts, d, m in hook_notes(bi, HOOK, t0):
                sig = lead_note(hz(m), d * BEAT); place_note(lead_b, sig, ts, end, .18, .05); dly_send.add(sig, ts, .07); rev_send.add(sig, ts, .1)

    @staticmethod
    def special(a, b, name):
        if name == 'problem': problem_drone(a, b, 45, 600, .2)
        if name == 'build':
            fx_b.add(riser(b - a - .6) * .7, a + .5, .65); fx_b.add(reverse_cymbal(1.6), b - 1.6 - .05, .55)
            for j, f in enumerate((200, 170, 150, 130, 115, 100, 90, 80)): drums.add(tom(f), b - BAR / 2 + j * STEP, .5, -.35 + j * .1)
        if name == 'drop':
            fx_b.add(impact(1.0, 2.4), a, .8); drums.add(gated_snare(1.0), a, .6); drums.add(crash(1.0), a, .5); rev_send.add(crash(1.0), a, .2)

    @staticmethod
    def card(a, b, nxt):
        ch = CH[Synthwave.PROG[nxt][0]]
        fx_b.add(impact(1.0, 2.2), a, .75); drums.add(gated_snare(1.0), a, .55)
        Lx, Rx = pad_chord([hz(m) for m in ch[:3]] + [hz(ch[0] + 12)], b - a + .4, 1800, a=.05, r=.4); pad_b.add(Lx, a, .4, 0, Rx); rev_send.add(Lx, a, .25, 0, Rx)
        bass_b.add(bass_note(hz(ch[3]), b - a - .1, .3), a, .45)
        fx_b.add(reverse_cymbal(b - a - .2), a + .2, .45)

    @staticmethod
    def pre_card(b):
        for j, f in enumerate((180, 150, 125, 100)): drums.add(tom(f), b - BEAT + j * STEP, .5, -.3 + j * .2)
        fx_b.add(riser(1.6) * .7, b - 1.6, .45)

    @staticmethod
    def finale(a, b):
        final_t = a + 3 * BAR
        fx_b.add(impact(1.0, 2.4), a, .8); drums.add(crash(1.0, 3.0), a, .5)
        for j, cn in enumerate(('F', 'G', 'Am')): Synthwave.bar(a + j * BAR, final_t, cn, 3, 1, j, 'finale')
        Synthwave.pre_card(final_t)
        ch = CH['A']; tail = b - final_t + 2.5
        Lx, Rx = pad_chord([hz(m) for m in ch[:3]] + [hz(ch[0] + 12), hz(ch[0] - 12)], tail, 3000, a=.02, r=2.5)
        pad_b.add(Lx, final_t, .6, 0, Rx); rev_send.add(Lx, final_t, .45, 0, Rx)
        fx_b.add(impact(1.0, 3.0), final_t, .9); drums.add(crash(1.0, 4.0), final_t, .6); drums.add(gated_snare(1.0), final_t, .5)
        bass_b.add(bass_note(hz(33), 3.5, .4) * np.exp(-tt(3.5) * .6), final_t, .55)
        ln = lead_note(hz(81), 3.0) * np.exp(-tt(3.0) * .5); lead_b.add(ln, final_t, .2); rev_send.add(ln, final_t, .2); dly_send.add(ln, final_t, .08)
        return final_t


ALT = {'cinematic': Cinematic, 'keynote': Keynote, 'house': House, 'synthwave': Synthwave}


def run_alt(a, b, name, S):
    prog = S.PROG[name]; lvl = LEVEL[name]
    nbars = int(np.ceil((b - a) / BAR - 1e-6))
    for bi in range(nbars):
        S.bar(a + bi * BAR, b, prog[bi % len(prog)], lvl, bi / max(1, nbars - 1), bi, name)
    S.special(a, b, name)


final_t = None
S = ALT.get(MUSIC_STYLE)
for a, b, name in sections:
    if a >= END: continue
    if S is None:                                   # electro: the original arranger
        if name.startswith('card:'): run_card(a, b, name.split(':')[1])
        elif name == 'finale': final_t = run_finale(a, b)
        else: run_section(a, b, name)
    else:
        if name.startswith('card:'): S.card(a, b, name.split(':')[1])
        elif name == 'finale': final_t = S.finale(a, b)
        else: run_alt(a, b, name, S)
    if not name.startswith('card') and name not in ('problem', 'build', 'finale'):
        # fill + riser into the next card
        nxt = [c['start'] for c in cards if c['start'] >= b - 1e-3]
        if nxt and abs(nxt[0] - b) < 1e-3:
            if S is not None: S.pre_card(b); continue
            fx_b.add(riser(1.6) * .8, b - 1.6, .5)
            for j in range(8): drums.add(snare(.4 + j * .07), b - BAR / 2 + j * STEP, .35 * (.5 + j / 14), .05)

# ---------------- SFX from scene cues ----------------
card_times = [c['start'] for c in cards] + [SC['s03_title']['start'], SC['s20_outro']['start']]
skipped = 0
for c in CUES:
    if c['t'] >= END: continue
    if c['name'] == 'hit' and c['scene'] == 'transition' and min(abs(c['t'] - x) for x in card_times) < .12:
        skipped += 1; continue   # the score already lands an impact there
    s = sfx(c['name'], c.get('pitch', 0))
    g = SFX_GAIN.get(c['name'], .3) * c.get('gain', 1) * PACK_GAIN[SFX_STYLE]
    sfx_b.add(s, c['t'], g, float(np.clip(c.get('pan', 0), -1, 1)))
    if c['name'] in SFX_REV: rev_send.add(s, c['t'], g * SFX_REV[c['name']] * PACK_REV[SFX_STYLE])


# ---------------- effects ----------------
def delay_pingpong(bus, t=.375, fb=.45, taps=6):
    L = np.zeros_like(bus.L); R = np.zeros_like(bus.R)
    for k in range(1, taps + 1):
        d = int(t * k * SR); g = fb ** (k - 1)
        src = bus.L if k % 2 else bus.R
        (L if k % 2 == 0 else R)[d:] += src[:-d] * g
    return lp(L, 5000), lp(R, 5000)


def reverb(bus, rt=2.2):
    n = int(rt * 1.2 * SR); t = np.arange(n) / SR; pre = int(.022 * SR)
    ir = []
    for ch in range(2):
        x = noise(n) * np.exp(-t * 6.9 / rt); x = lp(x, 6500); x[:pre] = 0
        for d, g in ((.011, .5), (.019, .35), (.029, .3), (.041, .22)):
            x[int((d + .005 * ch) * SR)] += g
        ir.append(x / np.sqrt(np.sum(x ** 2)))
    return oaconvolve(bus.L, ir[0])[:len(bus.L)], oaconvolve(bus.R, ir[1])[:len(bus.R)]


dL, dR = delay_pingpong(dly_send)
rL, rR = reverb(rev_send)

# sidechain pump on pads / bass / arp
tl = np.arange(len(pad_b.L)) / SR
pump = np.ones(len(pad_b.L))
for k in sc_kicks:
    i = int(k * SR); w = int(.28 * SR)
    seg = 1 - (.55 if S is None else S.PUMP) * np.exp(-np.arange(w) / SR / .09)
    pump[i:i + w] = np.minimum(pump[i:i + w], seg[:len(pump) - i])


def stereo(bus, g=1.0, p=None):
    return (bus.L * g * (1 if p is None else p), bus.R * g * (1 if p is None else p))


music = [stereo(drums, 1.0), stereo(bass_b, 1.0, pump), stereo(pad_b, .9, pump), stereo(arp_b, 1.0, pump ** .6),
         stereo(lead_b, 1.0), stereo(fx_b, 1.0), (dL * .9, dR * .9), (rL * .55, rR * .55)]
mL = sum(m[0] for m in music); mR = sum(m[1] for m in music)
sL, sR = sfx_b.L.copy(), sfx_b.R.copy()

# ---------------- narration & ducking ----------------
with wave.open(os.path.join(B, 'voice.wav')) as w:
    v = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float64) / 32768
vo = np.zeros(len(mL)); vo[:min(len(v), len(vo))] = v[:len(vo)]
env = np.sqrt(np.convolve(vo ** 2, np.ones(int(.05 * SR)) / int(.05 * SR), mode='same'))
env = np.clip(env / .05, 0, 1)
# smooth: fast attack, slow release
k_rel = np.exp(-1 / (.75 * SR)); sm = np.zeros_like(env); acc = 0.0
step = 64
for i in range(0, len(env), step):
    x = env[i:i + step].max()
    acc = x if x > acc else acc * (k_rel ** step)
    sm[i:i + step] = acc
sm = np.convolve(sm, np.ones(int(.08 * SR)) / int(.08 * SR), mode='same')
duck_m = 1 - .8 * sm
duck_s = 1 - .22 * sm

# master fade in/out and final tail
T = np.arange(len(mL)) / SR
fade = np.clip((END + .01 - T) / 1.0, 0, 1) * np.clip(T / .02, 0, 1)
MG = .48 * 10 ** (MUSIC_DB / 20)
L = (mL * duck_m * MG + sL * duck_s * 1.0 + vo * 1.35)
R = (mR * duck_m * MG + sR * duck_s * 1.0 + vo * 1.35)
L, R = hp(L, 28) * fade, hp(R, 28) * fade

# gentle glue compression (RMS, 1.6:1 above the 90th percentile) and a look-ahead peak limiter
from scipy.ndimage import maximum_filter1d, uniform_filter1d
L, R = lp(L, 13000), lp(R, 13000)
rms = np.sqrt(np.convolve((L ** 2 + R ** 2) / 2, np.ones(int(.05 * SR)) / int(.05 * SR), mode='same')) + 1e-9
thr = np.percentile(rms[rms > 1e-4], 90)
g = np.where(rms > thr, (thr + (rms - thr) / 1.6) / rms, 1.0)
g = uniform_filter1d(g, size=int(.02 * SR))
L, R = L * g, R * g
la = int(.004 * SR)
pk = maximum_filter1d(np.maximum(np.abs(L), np.abs(R)), size=2 * la + 1)
ceil = np.percentile(pk, 99.8)
lim = uniform_filter1d(np.minimum(1, ceil / (pk + 1e-9)), size=la)
L, R = L * lim, R * lim
norm = .93 / max(np.abs(L).max(), np.abs(R).max())
L, R = L * norm, R * norm
# diagnostics: voice vs music bed under speech
sp = sm[:len(L)] > .5
mb = (mL * duck_m * MG)[:len(L)] * norm
vr = vo[:len(L)] * 1.35 * norm
def _db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
act = np.abs(sL[:len(L)]) > 1e-3
print(f'sfx while active {_db(((sL * duck_s)[:len(L)] * norm)[act]):.1f} dB')
print(f'under speech: voice {_db(vr[sp]):.1f} dB, music bed {_db(mb[sp]):.1f} dB, sfx {_db(((sL * duck_s)[:len(L)] * norm)[sp]):.1f} dB; music alone (no speech) {_db(mb[~sp]):.1f} dB')

def write(path, a, b):
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.stack([np.clip(a, -1, 1), np.clip(b, -1, 1)], 1) * 32767).astype('<i2').tobytes())


n_out = int(END * SR)
if OUT_TAG:
    os.makedirs(os.path.join(B, 'styles'), exist_ok=True)
    write(os.path.join(B, 'styles', OUT_TAG + '.wav'), L[:n_out], R[:n_out])
else:
    write(os.path.join(B, 'mix.wav'), L[:n_out], R[:n_out])
    mm = .89 / max(np.abs(mL).max(), 1e-9)
    write(os.path.join(B, 'music.wav'), mL[:n_out] * mm, mR[:n_out] * mm)
    write(os.path.join(B, 'sfx.wav'), sL[:n_out] / max(np.abs(sL).max(), 1e-9) * .8, sR[:n_out] / max(np.abs(sL).max(), 1e-9) * .8)
rms_db = 20 * np.log10(np.sqrt(np.mean(L[:n_out] ** 2)) + 1e-9)
print(f'sections: {[(round(a, 2), n) for a, _, n in sections]}')
print(f'music {MUSIC_STYLE}, sfx {SFX_STYLE}; cues used: {len(CUES) - skipped} (skipped {skipped} duplicate hits); kicks: {len(sc_kicks)}; final chord at {final_t if final_t is None else round(final_t, 2)}s')
print(f'mix rms {rms_db:.1f} dBFS, length {n_out / SR:.2f}s')
