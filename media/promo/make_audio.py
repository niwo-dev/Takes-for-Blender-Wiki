"""Synthesises the score + sound effects for the Takes promo (no samples, pure numpy).
Every cue is timed against the scene table in takes_promo.html (T = boundaries, S = speed).
Usage: python3 make_audio.py [out.wav] [--long]     (--long = the ~60 s cut, ?long in the HTML)
"""
import sys
import numpy as np
from math import pi

SR = 44100
LONG = '--long' in sys.argv
T = [0, 4.5, 9, 17, 27, 36, 44, 53, 59] if LONG else [0, 2.2, 4, 6.8, 10, 12.8, 15.2, 17.9, 19.8]
S = [.67, .67, .6, .52, .45, .5, .47, .52] if LONG else [1.3, 1.6, 1.7, 1.6, 1.4, 1.7, 1.5, 1.6]
DROP = T[1]
TOTAL = T[-1]
BPM = 128
BEAT = 60 / BPM
rng = np.random.default_rng(7)
L = np.zeros(int(TOTAL * SR) + SR)
R = np.zeros_like(L)


def real(scene, lt):
    """internal scene time -> absolute video time"""
    return T[scene] + lt / S[scene]


def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i < 0 or i >= len(L):
        return
    n = min(len(sig), len(L) - i)
    l, r = np.cos((pan + 1) * pi / 4), np.sin((pan + 1) * pi / 4)
    L[i:i + n] += sig[:n] * gain * l * 1.414
    R[i:i + n] += sig[:n] * gain * r * 1.414


def tt(d):
    return np.arange(int(d * SR)) / SR


def hz(n):  # midi -> Hz
    return 440 * 2 ** ((n - 69) / 12)


# ---------- building blocks ----------
def kick(d=.4):
    t = tt(d)
    f = 45 + 110 * np.exp(-t * 32)
    ph = 2 * pi * np.cumsum(f) / SR
    return np.tanh(1.8 * np.sin(ph) * np.exp(-t * 9)) + .25 * rng.standard_normal(len(t)) * np.exp(-t * 300)


def noise_hp(d, decay):
    t = tt(d)
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)
    return n * np.exp(-t * decay)


def hat(d=.07):
    return noise_hp(d, 70) * .5


def clap():
    out = np.zeros(int(.32 * SR))
    for k, off in enumerate([0, .011, .024]):
        s = noise_hp(.25, 24 if k == 2 else 90)
        s = (s + np.convolve(s, np.ones(6) / 6, mode='same')) * .5
        i = int(off * SR)
        out[i:i + len(s)] += s[:len(out) - i]
    return out * .9


def pluck(f, d=.25):
    t = tt(d)
    s = sum(np.sin(2 * pi * f * h * t) / h * np.exp(-t * (7 + h * 5)) for h in range(1, 9))
    return s * np.minimum(1, t * 800)


def bass(f, d=.24):
    t = tt(d)
    s = np.sin(2 * pi * f * t) + .5 * np.sin(4 * pi * f * t) * np.exp(-t * 14)
    return np.tanh(1.6 * s) * np.minimum(1, t * 400) * np.exp(-t * 3.5)


def pad(freqs, d):
    t = tt(d)
    s = np.zeros_like(t)
    for f in freqs:
        for det in (-.006, 0, .006):
            ff = f * (1 + det)
            for h, a in ((1, 1), (2, .5), (3, .33), (4, .2), (5, .12)):
                s += a * np.sin(2 * pi * ff * h * t + rng.uniform(0, 6))
    att = np.minimum(1, t / min(.5, d / 3))
    rel = np.minimum(1, (d - t) / min(.6, d / 3))
    return s * att * rel / (len(freqs) * 6)


def bp_noise(d, f0, f1, q=6, curve=1.0):
    """noise through a moving band-pass (STFT overlap-add) -> whooshes/risers"""
    n = int(d * SR)
    hop, win = 256, 1024
    w = np.hanning(win)
    out = np.zeros(n + win)
    fr = np.fft.rfftfreq(win, 1 / SR)
    for i in range(0, n, hop):
        u = (i / n) ** curve
        fc = f0 * (f1 / f0) ** u
        mask = np.exp(-((np.log2(np.maximum(fr, 1) / fc) * q) ** 2) / 2)
        spec = np.fft.rfft(rng.standard_normal(win) * w) * mask
        out[i:i + win] += np.fft.irfft(spec) * w
    out = out[:n]
    return out / (np.abs(out).max() + 1e-9)


def whoosh(d=.5, up=True):
    s = bp_noise(d, 250, 7000, 2.2) if up else bp_noise(d, 7000, 250, 2.2)
    t = tt(d)
    env = np.sin(pi * np.minimum(1, t / d)) ** 1.5
    return s * env


def impact(d=1.0):
    t = tt(d)
    f = 34 + 70 * np.exp(-t * 14)
    body = np.sin(2 * pi * np.cumsum(f) / SR) * np.exp(-t * 4.5)
    air = bp_noise(d, 3000, 400, 1.2) * np.exp(-t * 7) * .45
    return np.tanh(1.5 * body) + air


def blip(f, d=.1):
    t = tt(d)
    return (np.sin(2 * pi * f * t) + .3 * np.sin(4 * pi * f * t)) * np.exp(-t * 30) * np.minimum(1, t * 1000)


def chime(f, d=1.0):
    t = tt(d)
    s = np.sin(2 * pi * f * t) + .5 * np.sin(2 * pi * f * 2.76 * t) * np.exp(-t * 3) + .3 * np.sin(2 * pi * f * 5.4 * t) * np.exp(-t * 6)
    return s * np.exp(-t * 4) * np.minimum(1, t * 800)


def boing(d=.45):
    t = tt(d)
    f = 110 + 620 * np.exp(-t * 9) + 28 * np.sin(2 * pi * 22 * t) * np.exp(-t * 5)
    return np.sin(2 * pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)


def shutter():
    n = noise_hp(.07, 55)
    t = tt(.09)
    return n * .9 + .5 * np.sin(2 * pi * 190 * t) * np.exp(-t * 60)[:len(n)] if False else n * .9


def sweep_up(d=.5, f0=200, f1=1400):
    t = tt(d)
    f = f0 * (f1 / f0) ** (t / d)
    return np.sin(2 * pi * np.cumsum(f) / SR) * np.sin(pi * t / d) ** 2


# ---------- music ----------
chords = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]     # Am F C G
roots = [33, 29, 36, 31]                                              # A1 F1 C2 G1
BAR = BEAT * 4
n_bars = int(TOTAL / BAR) + 1
drums_end = T[7] - .18
break_a, break_b = (T[5] + .5, T[6] - .9) if LONG else (0, 0)   # calm breakdown during the Rest State scene
for bar in range(n_bars):
    t0 = bar * BAR
    ch = chords[bar % 4]
    root = roots[bar % 4]
    # pad: whole bar
    if t0 < TOTAL:
        add(pad([hz(n) for n in ch] + [hz(ch[0] + 12)], BAR + .3), t0, .5 if t0 >= DROP else .42, 0)
    for step in range(16):
        ts = t0 + step * BEAT / 4
        if ts >= TOTAL - .3:
            break
        after_drop = ts >= DROP - 1e-6
        calm = break_a <= ts < break_b
        # arp (16ths) — enters quietly in the intro, full after the drop
        if ts >= 1.0 and ts < drums_end:
            note = ch[[0, 1, 2, 1, 2, 1, 0, 1][step % 8]] + 12 + (12 if step % 8 in (2, 5) else 0)
            add(pluck(hz(note), .22), ts, (.2 if after_drop else .09) * (1.25 if calm else 1), pan=-.35 if step % 2 else .35)
        if not after_drop or ts >= drums_end or calm:
            continue
        # drums
        if step % 4 == 0:
            add(kick(), ts, .95)
        if step % 4 == 2:
            add(hat(), ts, .5)
        if step in (4, 12):
            add(clap(), ts, .55, .1)
        if step % 2 == 1 or step in (2, 6, 10, 14):
            add(hat(.04), ts, .16 + .1 * (step % 4 == 3), .3)
        # bass: off-beat 8ths
        if step in (0, 3, 6, 8, 10, 12, 14):
            add(bass(hzz := hz(root + (12 if step in (6, 14) else 0)), .28), ts, .62)

# intro kick pulse (filtered feel: quiet) + riser into the title drop
nk = int((DROP - .2) / BEAT)
for k in range(nk):
    add(kick(), k * BEAT, .3 + .25 * k / nk)
add(bp_noise(DROP - .1, 250, 9000, 2.5, 1.8) * np.linspace(.05, 1, int((DROP - .1) * SR)) ** 2, 0.1, .55)
add(impact(1.2), DROP, .9)
add(bp_noise(.8, 9000, 1200, 1.5) * np.exp(-tt(.8) * 5), DROP, .5)
if LONG:   # riser + hit back into the full groove after the breakdown
    add(bp_noise(.9, 300, 9000, 2.5, 1.6) * np.linspace(.05, 1, int(.9 * SR)) ** 2, break_b, .5)
    add(impact(1.0), T[6], .8)

# ---------- SFX ----------
# hook: three headline slams
for lt in (.15, .95, 1.75):
    tm = real(0, lt) + .12
    add(impact(.5), tm, .7)
    add(noise_hp(.06, 80), tm, .5)

# scene wipes (whoosh up to the cut, small hit on the cut)
for b in T[1:-1]:
    add(whoosh(.5, True), b - .28, .55, -.2)
    add(whoosh(.35, False), b - .02, .3, .2)
    add(impact(.5), b, .35)

# title: mark spin, letter stagger, chips
add(sweep_up(.7, 260, 2200), real(1, 0), .22)
for i in range(5):
    add(blip(hz(72 + [0, 4, 7, 12, 16][i]), .12), real(1, .45 + i * .07) + .04, .3, -.4 + i * .2)
add(chime(hz(84), 1.2), real(1, 1.1), .3)
for i in range(5):
    add(blip(hz(76 + i * 2), .08), real(1, 1.7 + i * .12), .28, -.5 + i * .25)

# P1: tree rows appear, selection confirm
for i in range(7):
    add(blip(hz(60 + i * 2 + (2 if i > 4 else 0)), .1), real(2, .7 + i * .36), .4, .25)
add(chime(hz(79), .9), real(2, 4.2), .45)
add(chime(hz(86), .9), real(2, 4.2) + .05, .25)

# P2: three "set" chimes, each followed by a falling cascade of ticks
for ev, tier, note in ((1.0, 0, 79), (2.6, 3, 84), (4.1, 5, 88)):
    add(chime(hz(note), .8), real(3, ev), .45)
    for j in range(tier, 6):
        add(blip(hz(note - 12 - (j - tier) * 2), .09), real(3, ev + (j - tier) * .2), .32 - .02 * (j - tier), .4)

# P3: state swaps (shimmer) + stat pills
for k in range(3):
    tm = real(4, .6 + .68 + k * 1.1)
    add(sweep_up(.3, 500, 2600), tm - .05, .22)
    add(chime(hz(72 + k * 5), .5), tm + .2, .3)
for i in range(3):
    add(blip(hz(79 + i * 3), .1), real(4, 1.4 + i * .18), .32)

# P4: ball travels, snaps back with a boing, travels again
add(sweep_up(.6, 200, 900), real(5, .6), .2)
add(boing(), real(5, 1.7), .55)
add(chime(hz(91), .6), real(5, 1.75), .25)
add(sweep_up(.6, 200, 900), real(5, 2.9), .2)

# P5: 12 shutter ticks climbing a pentatonic scale, then the "all done" fanfare
pent = [0, 2, 4, 7, 9]
for i in range(12):
    tm = real(6, 1.2 + (i + 1) * .2) - .04
    add(shutter(), tm, .5, -.6 + i * .11)
    add(blip(hz(72 + pent[i % 5] + 12 * (i // 5)), .09), tm, .3, -.6 + i * .11)
tdone = real(6, 1.2 + 12 * .2) + .05
for k, n in enumerate((79, 83, 86, 91)):
    add(chime(hz(n), 1.2), tdone + k * .05, .32)

# outro: mark spin, title hit, four tagline stabs, final chord
add(whoosh(.6, True), T[7] - .05, .4)
add(impact(1.2), real(7, .3), .8)
add(sweep_up(.8, 300, 3000), real(7, 0), .2)
for i in range(4):
    add(impact(.4), real(7, .9 + i * .22) + .1, .32)
    add(blip(hz(69 + [0, 3, 7, 12][i]), .25), real(7, .9 + i * .22) + .1, .38)
tend = real(7, 1.5)
add(pad([hz(n) for n in (57, 64, 69, 72, 76)], TOTAL - tend + .3), tend, .9)
for k, n in enumerate((81, 84, 88, 93)):
    add(chime(hz(n), 1.6), tend + .05 * k, .3, -.4 + k * .3)

# ---------- master ----------
n = int(TOTAL * SR)
L, R = L[:n], R[:n]
fade = np.minimum(1, (TOTAL - np.arange(n) / SR) / .7)
head = np.minimum(1, np.arange(n) / (SR * .02))
L, R = L * fade * head, R * fade * head
# gentle sidechain-style duck of pads is skipped; soft-clip + normalise
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = np.tanh(L / peak * 1.5) / np.tanh(1.5), np.tanh(R / peak * 1.5) / np.tanh(1.5)
pcm = (np.stack([L, R], 1) * .89 * 32767).astype('<i2')
out = next((a for a in sys.argv[1:] if not a.startswith('--')), 'takes_promo.wav')
import wave
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print('wrote', out, f'{TOTAL:.1f}s')
