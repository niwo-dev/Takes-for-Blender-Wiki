"""Writes the ten A1.1 slides: drawn graphics only, every piece animates in."""
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / "doc" / "course" / "a1-why-takes" / "01-slides"

DARK, DEEP, LIGHT, MUTED, DIM, ACCENT = "#17171A", "#101012", "#F2F2EF", "#9A9AA0", "#6E6E76", "#E87D0D"
HEAD = "font-family:'Rubik', Arial, sans-serif"
MONO = "font-family:'JetBrains Mono', 'Courier New', monospace"


def section(sid, bg, body, notes, transition="fade", color=LIGHT):
    return (
        f'<section id="{sid}" data-transition="{transition}" style="background:{bg}; color:{color}; '
        f"font-family:'Inter', Arial, sans-serif; padding:128px; display:flex; flex-direction:column\">\n"
        f"{body}\n  <aside>{notes}</aside>\n</section>\n"
    )


def pin(x, y, w=None, h=None):
    s = f"position:absolute; left:{x}px; top:{y}px"
    if w is not None:
        s += f"; width:{w}px"
    if h is not None:
        s += f"; height:{h}px"
    return s


def build(kind, order):
    return f'data-build-in="{kind} {order} auto"'


# ---------------------------------------------------------------- drawings

def file_svg(w, h, fill="#26262B", stroke="#4A4A52", fold="#33333A", bars="#4A4A52", label="File"):
    return (
        f'<svg aria-label="{label}" width="{w}" height="{h}" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">'
        f'<path d="M8 4 H80 L112 36 V142 Q112 146 108 146 H12 Q8 146 8 142 Z" fill="{fill}" stroke="{stroke}" stroke-width="3" stroke-linejoin="round"/>'
        f'<path d="M80 4 V36 H112" fill="{fold}" stroke="{stroke}" stroke-width="3" stroke-linejoin="round"/>'
        f'<rect x="24" y="66" width="72" height="8" rx="4" fill="{bars}"/>'
        f'<rect x="24" y="86" width="56" height="8" rx="4" fill="{bars}"/>'
        f'<rect x="24" y="106" width="64" height="8" rx="4" fill="{bars}"/>'
        f"</svg>"
    )


def render_svg(uid, w, h, *, bg=("#3A3B40", "#1C1C20"), glow="#FFFFFF", glow_x=170, glow_op=0.22,
               body=(("0", "#5A5D63"), ("0.3", "#9DA1A8"), ("0.42", "#E9ECEF"), ("0.6", "#8C9097"), ("1", "#3E4046")),
               cap="#2A2B2F", label="#E8E2D4", ink="#9A8F7A", shadow_dx=18, scale=1.0, dx=0, live=False,
               alt="Product on a studio floor"):
    stops = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in body)
    group = f"translate({240 + dx} 250) scale({scale}) translate(-240 -250)"
    dot = ('<circle cx="30" cy="30" r="16" fill="#3FBF6F" opacity="0.25"/>'
           '<circle cx="30" cy="30" r="9" fill="#3FBF6F"/>') if live else ""
    return (
        f'<svg aria-label="{alt}" width="{w}" height="{h}" viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg">'
        f"<defs>"
        f'<linearGradient id="bg{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{bg[0]}"/><stop offset="1" stop-color="{bg[1]}"/></linearGradient>'
        f'<radialGradient id="gl{uid}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="{glow}" stop-opacity="{glow_op}"/><stop offset="1" stop-color="{glow}" stop-opacity="0"/></radialGradient>'
        f'<linearGradient id="bd{uid}" x1="0" y1="0" x2="1" y2="0">{stops}</linearGradient>'
        f'<filter id="bl{uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>'
        f"</defs>"
        f'<rect width="480" height="300" rx="14" fill="url(#bg{uid})"/>'
        f'<ellipse cx="{glow_x}" cy="90" rx="260" ry="200" fill="url(#gl{uid})"/>'
        f'<g transform="{group}">'
        f'<ellipse cx="{240 + shadow_dx}" cy="252" rx="82" ry="12" fill="#000000" opacity="0.55" filter="url(#bl{uid})"/>'
        f'<path d="M195 236 Q195 250 209 250 H271 Q285 250 285 236 V128 Q285 104 258 92 V62 H222 V92 Q195 104 195 128 Z" fill="url(#bd{uid})"/>'
        f'<rect x="195" y="158" width="90" height="54" fill="{label}"/>'
        f'<rect x="207" y="174" width="66" height="7" rx="3" fill="{ink}"/>'
        f'<rect x="216" y="190" width="48" height="5" rx="2" fill="{ink}"/>'
        f'<rect x="218" y="40" width="44" height="24" rx="5" fill="{cap}"/>'
        f'<rect x="218" y="48" width="44" height="3" fill="#000000" opacity="0.25"/>'
        f'<path d="M224 94 C206 108 200 128 206 148" stroke="#CDBB98" stroke-width="2.5" fill="none"/>'
        f'<rect x="196" y="146" width="20" height="28" rx="3" fill="#CDBB98" transform="rotate(8 206 160)"/>'
        f"</g>{dot}</svg>"
    )


# The three rounds the whole video is about.
ROUND_1 = dict()
ROUND_2 = dict(bg=("#5A3A22", "#221710"), glow="#FFB060", glow_x=330, glow_op=0.45, shadow_dx=-26,
               body=(("0", "#6A5540"), ("0.45", "#B9A28A"), ("0.62", "#FFE2BC"), ("0.78", "#A58B70"), ("1", "#4A3A2C")),
               alt="The same product in warm light")
ROUND_3 = dict(bg=("#2E3A46", "#141A20"), glow="#9FC6FF", glow_x=110, glow_op=0.3, shadow_dx=30, scale=1.12, dx=-30,
               body=(("0", "#1E1E22"), ("0.22", "#4A4038"), ("0.3", "#D8B27A"), ("0.4", "#5A4A3A"), ("1", "#141416")),
               cap="#D8B27A", label="#1E1E22", ink="#D8B27A", alt="The same product with a dark finish, closer angle")


def strike_svg(label):
    return (
        f'<svg aria-label="{label}" width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">'
        '<rect x="14" y="8" width="40" height="50" rx="5" fill="#26262B" stroke="#5A5A62" stroke-width="3"/>'
        '<rect x="26" y="22" width="40" height="50" rx="5" fill="#2E2E33" stroke="#5A5A62" stroke-width="3"/>'
        f'<path d="M8 72 L72 8" stroke="{ACCENT}" stroke-width="6" stroke-linecap="round"/></svg>'
    )


def check_svg():
    return (
        '<svg aria-label="Check" width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">'
        f'<circle cx="40" cy="40" r="36" fill="{ACCENT}"/>'
        f'<path d="M22 41 L35 54 L58 28" stroke="{DARK}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )


def question_svg(w, h, color, op):
    return (
        f'<svg aria-label="Question mark" width="{w}" height="{h}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">'
        f'<path d="M50 72 C50 22 150 22 150 72 C150 108 100 112 100 150" stroke="{color}" stroke-opacity="{op}" stroke-width="30" fill="none" stroke-linecap="round"/>'
        f'<circle cx="100" cy="206" r="18" fill="{color}" fill-opacity="{op}"/></svg>'
    )


def arrow_svg(w, h):
    return (
        f'<svg aria-label="Arrow to the next lesson" width="{w}" height="{h}" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">'
        f'<path d="M20 100 H250 M180 30 L260 100 L180 170" stroke="{ACCENT}" stroke-width="24" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    )


def one_file_svg(w, h):
    """One file holding three rounds, one strip per round."""
    return (
        f'<svg aria-label="One file holding three rounds" width="{w}" height="{h}" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">'
        f'<path d="M8 4 H80 L112 36 V142 Q112 146 108 146 H12 Q8 146 8 142 Z" fill="#232327" stroke="{ACCENT}" stroke-width="3" stroke-linejoin="round"/>'
        f'<path d="M80 4 V36 H112" fill="#2E2E33" stroke="{ACCENT}" stroke-width="3" stroke-linejoin="round"/>'
        '<rect x="22" y="56" width="76" height="20" rx="4" fill="#8E949C"/>'
        '<rect x="22" y="84" width="76" height="20" rx="4" fill="#D9955A"/>'
        '<rect x="22" y="112" width="76" height="20" rx="4" fill="#6C8FB0"/></svg>'
    )


# ---------------------------------------------------------------- slides

def eyebrow(text, y, order, color=ACCENT, x=128, w=1200, align="left"):
    return (f'  <p {build("fade", order)} style="{pin(x, y, w)}; {MONO}; font-size:28px; font-weight:500; '
            f'letter-spacing:2px; text-transform:uppercase; color:{color}; text-align:{align}">{text}</p>')


def title(text, order, size=72, y=128, w=1664):
    return (f'  <h2 {build("fade", order)} style="{pin(128, y, w)}; {HEAD}; font-size:{size}px; '
            f'font-weight:500; line-height:1.1">{text}</h2>')


def cover():
    files = []
    spots = [(0, 80, -10), (40, 60, -4), (80, 40, 2), (120, 20, 7), (160, 0, 12)]
    for i, (dx, dy, rot) in enumerate(spots):
        orange = i == len(spots) - 1
        svg = file_svg(280, 350, **(dict(stroke=ACCENT, bars=ACCENT, fold="#3A2A1A") if orange else {}))
        files.append(f'  <div {build("pop", 5 + i)} style="{pin(1290 + dx, 300 + dy, 280, 350)}; transform:rotate({rot}deg)">{svg}</div>')
    body = "\n".join([
        eyebrow("Takes for Blender &#183; Stage A", 128, 1),
        f'  <h1 {build("rise", 2)} style="{pin(128, 330, 1140)}; {HEAD}; font-size:120px; font-weight:500; line-height:1.05">The problem with<br>saved copies</h1>',
        f'  <p {build("rise", 3)} style="{pin(128, 640, 960)}; font-size:40px; line-height:1.4; color:{MUTED}">Why saving copy after copy goes wrong, and what to do instead.</p>',
        f'  <p {build("fade", 4)} style="{pin(128, 890, 900)}; {MONO}; font-size:26px; color:{DIM}">A1.1 &#183; about 2 min 30</p>',
        *files,
    ])
    notes = ("Cold open. Do not speak over this slide.\n\n"
             "The files drop in on their own. Let the last one land, then wait about nine seconds in total.\n\n"
             "Let the picture do the work before you say a single word.")
    return section("cover", DARK, body, notes)


FOLDER_ROWS = [
    ("scene.blend", "04 Mar"), ("scene_v2.blend", "04 Mar"), ("scene_v2_brighter.blend", "06 Mar"),
    ("scene_v3_client.blend", "11 Mar"), ("scene_v3_client_FINAL.blend", "11 Mar"),
    ("scene_v3_client_FINAL_2.blend", "12 Mar"),
]


def folder():
    rows = [title("You know this folder", 1),
            f'  <div {build("fade", 2)} style="{pin(128, 290, 1664, 72)}; display:flex; align-items:center; gap:28px; padding:0 40px; background:#1E1E22; border-radius:16px 16px 0 0">'
            f'<div style="width:36px"></div>'
            f'<p style="flex:1; {MONO}; font-size:26px; color:{DIM}">Name</p>'
            f'<p style="width:240px; {MONO}; font-size:26px; color:{DIM}">Date modified</p></div>']
    for i, (name, date) in enumerate(FOLDER_ROWS):
        last = i == len(FOLDER_ROWS) - 1
        bg = "rgba(232,125,13,0.12)" if last else ("#1A1A1E" if i % 2 else DARK)
        edge = f"border-left:6px solid {ACCENT}" if last else "border-top:1px solid #2E2E33"
        icon = file_svg(36, 45, **(dict(stroke=ACCENT, bars=ACCENT) if last else {}))
        rows.append(
            f'  <div {build("rise", 3 + i)} style="{pin(128, 362 + i * 88, 1664, 88)}; display:flex; align-items:center; gap:28px; '
            f'padding:0 40px; background:{bg}; {edge}">{icon}'
            f'<p style="flex:1; {MONO}; font-size:30px; color:{ACCENT if last else LIGHT}">{name}</p>'
            f'<p style="width:240px; {MONO}; font-size:30px; color:{MUTED}">{date}</p></div>')
    notes = ("SPOKEN:\n\n\"You know this folder.\"\n\n[hold 2s]\n\n"
             "\"Every one of these is the same scene. Saved again, because something changed. "
             "A different light. A different colour. A slightly different angle.\"\n\n"
             "The rows build in one after another. Start speaking when the last, orange row lands.")
    return section("folder", DARK, "\n".join(rows), notes)


def which_one():
    scatter = [(170, 150, -12), (1630, 160, 10), (190, 760, 9), (1620, 770, -8)]
    parts = [f'  <div {build("drop", 1 + i)} style="{pin(x, y, 120, 150)}; transform:rotate({r}deg); opacity:0.35">{file_svg(120, 150)}</div>'
             for i, (x, y, r) in enumerate(scatter)]
    parts += [
        eyebrow("Three weeks later", 330, 5, color=DIM, x=128, w=1664, align="center"),
        f'  <h1 {build("scale", 6)} style="{pin(128, 400, 1664)}; {HEAD}; font-size:128px; font-weight:500; line-height:1.05; text-align:center">Which one is<br>the good one?</h1>',
    ]
    notes = ("SPOKEN:\n\n\"And three weeks later there is one question left. Which one is the good one?\"\n\n"
             "[hold 2s]\n\nLet this one sit. Do not rush off it.")
    return section("which-one", DEEP, "\n".join(parts), notes)


def opening():
    near_same = dict(glow_op=0.26, body=(("0", "#5E6167"), ("0.3", "#A2A6AD"), ("0.43", "#EEF1F4"), ("0.6", "#90949B"), ("1", "#40424A")))
    pills = [("You compare", 260, 128, "#26262B", LIGHT), ("You scroll the dates", 410, 428, "#26262B", LIGHT),
             ("You open a third", 340, 878, "#26262B", LIGHT), ("Still not certain", 360, 1258, ACCENT, DARK)]
    parts = [
        title("Opening them does not help much", 1),
        f'  <div {build("left", 2)} style="{pin(128, 290, 720, 450)}">{render_svg("oa", 720, 450, alt="First saved copy")}</div>',
        f'  <div {build("right", 3)} style="{pin(1072, 290, 720, 450)}">{render_svg("ob", 720, 450, alt="Second saved copy, nearly the same", **near_same)}</div>',
        f'  <p {build("pop", 4)} style="{pin(848, 440, 224)}; {HEAD}; font-size:120px; line-height:1; text-align:center; color:{DIM}">&#8776;</p>',
        f'  <p {build("fade", 5)} style="{pin(128, 760, 720)}; {MONO}; font-size:26px; color:{MUTED}">scene_v3_client.blend</p>',
        f'  <p {build("fade", 6)} style="{pin(1072, 760, 720)}; {MONO}; font-size:26px; color:{MUTED}">scene_v3_client_FINAL.blend</p>',
    ]
    for i, (text, w, x, bg, fg) in enumerate(pills):
        parts.append(f'  <p {build("rise", 7 + i)} style="{pin(x, 850, w)}; font-size:28px; font-weight:600; text-align:center; '
                     f'background:{bg}; color:{fg}; padding:16px 0; border-radius:999px">{text}</p>')
    notes = ("SPOKEN:\n\n\"Opening them does not help much. They look nearly the same.\"\n\n"
             "\"So you compare. You scroll back through the dates. You open a third one.\"\n\n"
             "\"And you still are not certain.\"\n\n"
             "The two pictures slide in, then the four steps along the bottom. The last one is orange: that is your last line.")
    return section("opening", DARK, "\n".join(parts), notes)


def cost():
    parts = [
        eyebrow("The real cost", 128, 1, color="#5C3200"),
        f'  <h2 {build("rise", 2)} style="{pin(128, 320, 1500)}; {HEAD}; font-size:72px; font-weight:500; line-height:1.1; color:#5C3200; text-decoration:line-through">It is not the disk space.</h2>',
        f'  <h1 {build("rise", 3)} style="{pin(128, 470, 1300)}; {HEAD}; font-size:116px; font-weight:500; line-height:1.05; color:{DARK}">It is not knowing which one is right.</h1>',
        f'  <div {build("scale", 4)} style="{pin(1440, 560, 300, 360)}">{question_svg(300, 360, DARK, 0.22)}</div>',
    ]
    notes = ("SPOKEN:\n\n\"That is the real cost, and it is not the disk space.\"\n\n[hold 1s]\n\n"
             "\"It is not knowing which one is right.\"\n\n"
             "\"The file you send to a client is a guess. The file you open next Monday is a guess. "
             "Every copy you make is one more chance to pick the wrong one.\"\n\n"
             "The colour change does the emphasis. You do not have to raise your voice.")
    return section("cost", ACCENT, "\n".join(parts), notes, transition="push", color=DARK)


def one_file():
    ghosts = [(1180, 330, -8), (1220, 320, -3), (1260, 310, 3), (1300, 300, 8)]
    parts = [f'  <div {build("fade", 1)} style="{pin(x, y, 360, 450)}; transform:rotate({r}deg); opacity:0.12">{file_svg(360, 450)}</div>'
             for x, y, r in ghosts]
    parts += [
        f'  <div {build("pop", 2)} style="{pin(1240, 315, 360, 450)}">{file_svg(360, 450, stroke=ACCENT, bars=ACCENT, fold="#3A2A1A", label="One file")}</div>',
        eyebrow("The same work", 380, 3),
        f'  <h1 {build("rise", 4)} style="{pin(128, 440, 1000)}; {HEAD}; font-size:180px; font-weight:500; line-height:1">One file.</h1>',
    ]
    notes = ("SPOKEN:\n\n\"Here is that same work.\"\n\n[hold 1s]\n\n\"One file.\"\n\n"
             "This is the turn. The faint copies fade in first, then the one orange file lands on top of them. "
             "Say \"One file\" as the words rise.")
    return section("one-file", DEEP, "\n".join(parts), notes)


def three_rounds():
    cards = [("01", "The first round", ROUND_1), ("02", "Different lighting", ROUND_2), ("03", "Different finish and angle", ROUND_3)]
    parts = [title("Three rounds, three clicks", 1)]
    for i, (num, name, look) in enumerate(cards):
        x = 128 + i * 576
        parts.append(
            f'  <div {build("rise", 2 + i)} style="{pin(x, 290, 512)}; display:flex; flex-direction:column; gap:20px; '
            f'background:#1E1E22; border:1px solid #2E2E33; border-radius:16px; padding:32px">'
            f'<p style="{MONO}; font-size:26px; color:{ACCENT}">{num}</p>'
            f'{render_svg("r" + num, 448, 280, **look)}'
            f'<h3 style="font-size:36px; font-weight:600; line-height:1.2">{name}</h3></div>')
    notes = ("SPOKEN, one line per card:\n\n\"That is the first round.\"\n\"That is the second.\"\n\"And that is the third.\"\n\n"
             "[hold 2s]\n\nThe three cards rise one after another. Let each one land before you say its line.")
    return section("three-rounds", DARK, "\n".join(parts), notes)


def not_duplicated():
    looks = [ROUND_1, ROUND_2, ROUND_3]
    parts = [title("What did not happen", 1)]
    lines = [("Nothing was duplicated.", strike_svg("No copy"), MUTED, 320),
             ("Nothing was saved out to a new name.", strike_svg("No new name"), MUTED, 450)]
    for i, (text, icon, color, y) in enumerate(lines):
        parts.append(f'  <div {build("left", 2 + i)} style="{pin(128, y, 1280)}; display:flex; align-items:center; gap:36px">{icon}'
                     f'<p style="flex:1; font-size:52px; line-height:1.3; color:{color}">{text}</p></div>')
    for i, look in enumerate(looks):
        parts.append(f'  <div {build("pop", 4 + i)} style="{pin(1504, 290 + i * 210, 288, 180)}">'
                     f'{render_svg("n" + str(i), 288, 180, live=True, **look)}</div>')
    parts.append(f'  <div {build("rise", 7)} style="{pin(128, 610, 1280)}; display:flex; align-items:center; gap:36px">{check_svg()}'
                 f'<p style="flex:1; font-size:52px; line-height:1.3; color:{LIGHT}">All three are still here. All three are still live.</p></div>')
    notes = ("SPOKEN:\n\n\"Nothing was duplicated. Nothing was saved out to a new name.\"\n\n"
             "\"All three are still here. All three are still live. And I can go back to any of them, right now, with one click.\"\n\n"
             "[hold 4s]\n\nThe crossed-out lines come first, then the three live rounds, then the orange check. Speak the last line with the check.")
    return section("not-duplicated", DARK, "\n".join(parts), notes)


def promise():
    chips = ["No copies", "No dates to compare", "No guessing"]
    parts = [
        title("That is the whole idea", 1, size=84),
        f'  <p {build("rise", 2)} style="{pin(128, 290, 1000)}; font-size:52px; line-height:1.35">Every round you try stays inside the one file.</p>',
        f'  <div {build("pop", 3)} style="{pin(1340, 290, 400, 500)}">{one_file_svg(400, 500)}</div>',
    ]
    for i, chip in enumerate(chips):
        parts.append(f'  <p {build("left", 4 + i)} style="{pin(128, 520 + i * 110, 520)}; {MONO}; font-size:32px; color:{ACCENT}; '
                     f'border:2px solid #3A3A40; border-radius:999px; padding:18px 36px">{chip}</p>')
    notes = ("SPOKEN:\n\n\"That is the whole idea.\"\n\n[hold 1s]\n\n\"Every round you try stays inside the one file.\"\n\n"
             "\"No copies. No dates to compare. No guessing which one was the good one.\"\n\n[hold 3s]\n\n"
             "The file on the right holds three strips: the three rounds you just saw. The three chips come in as you name them.")
    return section("promise", DEEP, "\n".join(parts), notes)


def next_slide():
    parts = [
        f'  <p {build("fade", 1)} style="{pin(128, 260, 1300)}; font-size:52px; line-height:1.4; color:{MUTED}">That is what this add-on is for.</p>',
        f'  <div {build("rise", 2)} style="{pin(128, 420, 1200)}; display:flex; flex-direction:column; gap:24px; border-left:6px solid {ACCENT}; padding:0 0 0 48px">'
        f'<p style="{MONO}; font-size:28px; letter-spacing:2px; text-transform:uppercase; color:{ACCENT}">Next &#183; A1.2</p>'
        f'<h2 style="{HEAD}; font-size:68px; font-weight:500; line-height:1.15">What it does, and what it does not do</h2></div>',
        f'  <p {build("fade", 3)} style="{pin(128, 780, 1200)}; font-size:38px; line-height:1.4; color:{MUTED}">So you can tell in about two minutes whether it fits the work you actually do.</p>',
        f'  <div {build("right", 4)} style="{pin(1440, 440, 300, 200)}">{arrow_svg(300, 200)}</div>',
    ]
    notes = ("SPOKEN:\n\n\"That is what this add-on is for.\"\n\n"
             "\"Next: what it does, and just as importantly what it does not do, so you can tell in about two minutes whether it fits the work you actually do.\"\n\n"
             "[hold 3s]\n\nThe arrow slides in last. That is your cue to stop.")
    return section("next", DARK, "\n".join(parts), notes)


SLIDES = {"cover": cover, "folder": folder, "which-one": which_one, "opening": opening, "cost": cost,
          "one-file": one_file, "three-rounds": three_rounds, "not-duplicated": not_duplicated,
          "promise": promise, "next": next_slide}

if __name__ == "__main__":
    for sid, make in SLIDES.items():
        text = make()
        assert text.count("<section") == 1 and f'id="{sid}"' in text
        (OUT / f"{sid}.html").write_text(text, encoding="utf-8", newline="\n")
        print(f"{sid:16} {len(text):6} bytes")
