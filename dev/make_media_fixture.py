"""Adds a test-only media page to a locally built copy of the wiki.

    python -m mkdocs build -q -d dev/temp/site
    python dev/make_media_fixture.py [site-dir]          (default dev/temp/site)

Writes `<site-dir>/__media_fixture/`: `index.html` (a real built page with its
content swapped for one section per kind the section focus pop-up moves, plus
a mixed section and one with media inside `<details>` and a table cell), the
frame, object and embed documents, and short media made with ffmpeg. Nothing
goes into `docs/`, so nothing of it is ever published. The kinds themselves
are not listed here: dev/check_media_engines.mjs reads the movable list from
the page's script and fails when a kind has no element in this page.

ffmpeg comes from PATH, or from the FFMPEG environment variable.
"""

from __future__ import annotations

import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
BASE_PAGE = Path("features/custom_tokens/index.html")
NAME = "__media_fixture"
SECONDS = 40

FFMPEG = os.environ.get("FFMPEG") or shutil.which("ffmpeg") or (
    r"C:/Users/NIWO/AppData/Local/Microsoft/WinGet/Packages/"
    r"Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe")

# A random id and a click counter the frame page sets on itself: a reload shows
# as a new id and a counter back at zero.
SELF_STATE = """<script>
window.selfId = Math.random().toString(36).slice(2);
window.clicks = 0;
document.addEventListener("click", function () {
  window.clicks++;
  document.getElementById("n").textContent = window.clicks;
});
</script>"""

FRAME = ("<!doctype html><meta charset=utf-8><title>frame</title>"
         "<body style='margin:0;font:14px sans-serif'>"
         "<video id=fv width=240 height=135 muted loop playsinline preload=auto>"
         "<source src='clip.webm' type='video/webm'>"
         "<source src='clip.mp4' type='video/mp4'></video>"
         "<p>clicks: <b id=n>0</b></p>" + SELF_STATE)

OBJECT = ("<!doctype html><meta charset=utf-8><title>object</title>"
          "<body style='margin:0;font:14px sans-serif'><p>object document, clicks: "
          "<b id=n>0</b></p>" + SELF_STATE)

EMBED = ("<svg xmlns='http://www.w3.org/2000/svg' width='240' height='80'>"
         "<rect width='240' height='80' fill='#cde'/>"
         "<text x='10' y='45' font-size='16'>embedded svg</text>"
         "<script>window.selfId = Math.random().toString(36).slice(2);</script></svg>")

CANVAS_JS = """<script>
document.querySelectorAll("canvas").forEach(function (c) {
  var g = c.getContext("2d");
  var hue = Math.floor(Math.random() * 300);
  g.fillStyle = "hsl(" + hue + ",70%,60%)"; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#222"; g.font = "20px sans-serif"; g.fillText("canvas " + hue, 12, 40);
  for (var i = 0; i < 8; i++) { g.fillStyle = "hsl(" + (hue + i * 30) + ",80%,40%)"; g.fillRect(12 + i * 24, 60, 18, 18); }
});
</script>"""

VIDEO = ("<video {a} controls loop playsinline preload=auto width=320 height=180>"
         "<source src='clip.webm' type='video/webm'>"
         "<source src='clip.mp4' type='video/mp4'></video>")
AUDIO = ("<audio {a} controls loop preload=auto>"
         "<source src='tone.ogg' type='audio/ogg; codecs=opus'>"
         "<source src='tone.mp3' type='audio/mpeg'></audio>")
CANVAS = "<canvas {a} width=240 height=100></canvas>"
IFRAME = "<iframe {a} src='frame.html' width=300 height=240></iframe>"
OBJECT_EL = "<object {a} data='object.html' type='text/html' width=300 height=60></object>"
EMBED_EL = "<embed {a} src='embed.svg' type='image/svg+xml' width=240 height=80>"


def el(tpl: str, kind: str, n: str = "") -> str:
    return tpl.format(a=f'data-kind="{kind}"' + (f' data-n="{n}"' if n else ""))


def section(sid: str, title: str, body: str) -> str:
    link = '<p><a href="#sec-end" class="sf-link">Jump to the last section</a></p>'
    return f'<h2 id="{sid}">{title}</h2>\n<p>Intro text of {title}.</p>\n{body}\n{link}\n'


def content() -> str:
    parts = ['<h1 id="media-fixture">Media fixture</h1>\n<p>Test page, never published.</p>\n']
    for kind, tpl in (("video", VIDEO), ("audio", AUDIO), ("iframe", IFRAME), ("canvas", CANVAS),
                      ("object", OBJECT_EL), ("embed", EMBED_EL)):
        parts.append(section(f"sec-{kind}", f"The {kind} section", el(tpl, kind)))
    parts.append(section("sec-mixed", "Several kinds together",
                         "\n".join(el(t, k, "mixed") for k, t in (
                             ("video", VIDEO), ("canvas", CANVAS), ("iframe", IFRAME),
                             ("audio", AUDIO)))))
    parts.append(section(
        "sec-nested", "Inside details and a table cell",
        "<details open><summary>More</summary>" + el(VIDEO, "video", "details") + "</details>\n"
        "<table><thead><tr><th>Kind</th><th>Item</th></tr></thead><tbody>"
        "<tr><td>canvas</td><td>" + el(CANVAS, "canvas", "cell") + "</td></tr>"
        "<tr><td>audio</td><td>" + el(AUDIO, "audio", "cell") + "</td></tr></tbody></table>"))
    parts.append('<h2 id="sec-end">Last section</h2>\n<p>' + "Filler text. " * 80 + "</p>\n")
    return "".join(parts) + CANVAS_JS


def make_media(out: Path) -> None:
    base = [FFMPEG, "-y", "-v", "error"]
    video = ["-f", "lavfi", "-i",
             f"testsrc2=size=320x180:rate=25:duration={SECONDS}"]
    tone = ["-f", "lavfi", "-i", f"sine=frequency=440:duration={SECONDS}"]
    timer = ("drawtext=text='%{pts\\:hms}':x=10:y=10:fontsize=28:fontcolor=white:box=1:boxcolor=black")
    runs = [
        (video, ["-vf", timer, "-c:v", "libvpx-vp9", "-b:v", "200k", "-an", "clip.webm"]),
        (video, ["-vf", timer, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                 "-an", "clip.mp4"]),
        (tone, ["-c:a", "libopus", "tone.ogg"]),
        (tone, ["-c:a", "libmp3lame", "tone.mp3"]),
    ]
    for src, rest in runs:
        if not (out / rest[-1]).exists():
            try:
                subprocess.run(base + src + rest[:-1] + [str(out / rest[-1])], check=True)
            except subprocess.CalledProcessError:
                # drawtext needs a font build; the pattern alone still has a running clock
                rest = [r for r in rest if r not in ("-vf", timer)]
                subprocess.run(base + src + rest[:-1] + [str(out / rest[-1])], check=True)


def main() -> int:
    site = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "temp" / "site"
    page = site / BASE_PAGE
    if not page.exists():
        print(f"built site not found: {page} (run mkdocs build first)")
        return 2
    out = site / NAME
    out.mkdir(exist_ok=True)
    html = page.read_text(encoding="utf8")
    # The base page sits two folders deep, the fixture one.
    html = html.replace('="../../', '="../')
    a = html.index('<article class="md-content__inner md-typeset">')
    a = html.index(">", a) + 1
    b = html.index("</article>", a)
    html = html[:a] + "\n" + content() + "\n" + html[b:]
    html = re.sub(r"<title>.*?</title>", "<title>Media fixture</title>", html, count=1, flags=re.S)
    (out / "index.html").write_text(html, encoding="utf8")
    (out / "frame.html").write_text(FRAME, encoding="utf8")
    (out / "object.html").write_text(OBJECT, encoding="utf8")
    (out / "embed.svg").write_text(EMBED, encoding="utf8")
    make_media(out)
    print(f"fixture written: {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
