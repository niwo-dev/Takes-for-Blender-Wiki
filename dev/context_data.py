# -*- coding: utf-8 -*-
"""What each video has to do, beyond the facts the module pages already hold.

Keys are video ids: "A1.1", "B2.3". Every value is a list of short lines --
these are notes for a person about to record, not prose.

  job        what the video has to achieve. Two or three lines.
  knows      what the viewer already has when they arrive.
  after      what they can do that they could not before.
  show       the order of what is on screen. One step per line.
  setup      the state the file, the add-on and the window must be in.
  careful    what goes wrong on camera if you are not watching for it.
  scope      named and left alone, so the video does not sprawl.
  questions  anything only NIWO can answer.

Empty or missing is fine: build_context.py writes the sheet with the section
marked as not yet filled in.
"""

CONTEXT = {

# ---------------------------------------------------------------- A0 --------
"A0.1": {
    "job": [
        "Sell the course in the first thirty seconds, with the product doing the "
        "selling rather than the narration.",
        "Say what the four stages are and roughly how long each takes.",
        "Set the expectation that the add-on ships often, without making that "
        "sound like a warning.",
    ],
    "knows": [
        "Possibly nothing at all. This is the channel trailer as well as the "
        "course opener.",
    ],
    "after": [
        "They know whether the course is for them and where to start.",
        "They know a video may show a button that has since moved, and that the "
        "page under each lesson is current.",
    ],
    "show": [
        "The finished demo, working, no talking. Finishes, lighting, angles.",
        "The syllabus page: four stages, times on screen.",
        "Stage A named as the part that is enough to do real work.",
        "The one product everything is built on.",
        "How to watch: one problem per video, none longer than eight minutes.",
        "The invitation — the problem you hit is the one worth fixing.",
    ],
    "setup": [
        "The full demo file, finished.",
        "The syllabus page open, Stage A expanded.",
    ],
    "careful": [
        "No feature names. This video teaches nothing.",
        "The 'ships often' beat is a reason to join, never an apology.",
        "Times on screen must match the syllabus. It is generated — read it, "
        "do not remember it.",
    ],
    "scope": [
        "Everything. Nothing is taught here.",
    ],
    "questions": [
        "Does this double as the channel trailer, or is a shorter cut made for "
        "that? Same footage either way.",
    ],
},

# ---------------------------------------------------------------- A1 --------
"A1.1": {
    "job": [
        "Make the viewer recognise their own file names on screen in the first "
        "twenty seconds.",
        "Name the cost out loud: not disk space, but not knowing which copy is "
        "the good one.",
        "Land one promise — every round stays inside one file — and stop. "
        "Do not explain how yet.",
    ],
    "knows": [
        "Nothing about the add-on. This may be the first thing they ever see of it.",
        "Blender itself. Assume they can model, light and render.",
    ],
    "after": [
        "They can say what problem the add-on is for, in their own words.",
        "They want to watch the next video.",
    ],
    "show": [
        "A file browser, real folder, a run of saved copies with dates. No talking.",
        "Open two of them side by side. They look nearly identical.",
        "Cut to one Blender file. Click three takes. Three different looks.",
        "Hold on the tree for a beat so the shape registers before it is named.",
    ],
    "setup": [
        "A folder of decoy files with believable names and a spread of dates.",
        "One finished demo file with at least three takes that look clearly different.",
        "Sidebar open on the Takes tab. Nothing else on screen.",
    ],
    "careful": [
        "Do not tour the panel. The tree appears; it is not explained.",
        "No feature names at all. Not cascade, not view layer, not take.",
        "Keep the folder shot short. The pain is recognised, not dwelt on.",
    ],
    "scope": [
        "How takes actually work — A3 onwards.",
        "What it is for and not for — the next video.",
    ],
    "questions": [
        "Use a real project's folder, or a staged one? A real one is more "
        "convincing, if nothing in it is confidential.",
    ],
},

"A1.2": {
    "job": [
        "Draw the line around what the add-on manages: the stage, not the story.",
        "Say plainly what it does not do, so nobody arrives expecting an editor.",
        "Give the one sentence a viewer would repeat to a colleague.",
    ],
    "knows": [
        "The problem from A1.1. Nothing else.",
    ],
    "after": [
        "They can tell whether this add-on is for the work they do.",
    ],
    "show": [
        "One product, one shot. Change the camera. Change the world. Change the "
        "finish. Same file.",
        "Then the counter-example: a timeline of many different shots — say "
        "that is a different job and a different tool.",
        "Close on the five things it manages: camera, world, materials, action, "
        "render settings.",
    ],
    "setup": [
        "The demo file, with at least two cameras, two worlds and two finishes.",
        "A second file or a still showing a multi-shot sequence for the contrast.",
    ],
    "careful": [
        "Name no competitor as worse. The wiki's Comparing page treats them as "
        "neighbours and partners; the video must match it.",
        "Resist listing features. Five words is the whole list.",
    ],
    "scope": [
        "Who builds it — next video.",
        "Every feature. This is the shape, not the tour.",
    ],
    "questions": [],
},

"A1.3": {
    "job": [
        "Earn trust before the AI sentence lands. Product work first, the survey "
        "of the field second, background third.",
        "Be straight about the AI from strength, in one calm beat, then move on.",
        "Invite: ideas first, support second.",
    ],
    "knows": [
        "What the add-on is for, from A1.1 and A1.2.",
    ],
    "after": [
        "They know who is behind it and why it exists.",
        "They know their problem report is wanted.",
    ],
    "show": [
        "Cold open: the demo, working, no talking. The proof comes before the claims.",
        "Real product work. One project, with a number.",
        "What was tried before building anything.",
        "What was missing: a hierarchy rather than a flat list of saved states.",
        "Who is building it.",
        "The AI beat. No code on screen — it is a trust claim, not a technical one.",
        "Built from the problem inward, not the data model outward.",
        "Ships often, and what that does and does not mean.",
        "The ask. Problems first, support second.",
    ],
    "setup": [
        "The full demo, working, for the cold open.",
        "Stills of real product visualisation work.",
        "The roadmap board on screen for the 'ships often' beat.",
    ],
    "careful": [
        "Say the AI part once, calmly, and move on. The longer it is defended "
        "the more it sounds like it needs defending.",
        "No crash claim. 'Quick and steady on files with a lot going on' cannot "
        "be falsified by one bad afternoon.",
        "Every number must be real. A placeholder read aloud is worse than no number.",
    ],
    "scope": [
        "How anything works. This video teaches nothing.",
    ],
    "questions": [
        "Seven blanks are still open — see "
        "`.claude/plans/script-a1-3-who-builds-this.md`. Nothing is recorded "
        "until they are filled.",
    ],
},

}
