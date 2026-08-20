"""Local wiki gate — mirrors .github/workflows/deploy-docs.yml so drift is
caught before a push instead of in CI.

The deploy workflow generates three things from the addon repo that are not
committed here (ui_manifest.json, docs/changelog/*, docs/roadmap/*). Without
them `mkdocs build --strict` fails locally for reasons that have nothing to do
with the page you just edited, which makes the strict build useless as a gate.
This script regenerates them, runs the same string-drift verifier CI runs, then
builds strict.

Usage:
    python dev/wiki_gate.py [--addon-root PATH] [--skip-manifest]
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

WIKI_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_ADDON_ROOT = WIKI_ROOT.parent / "Takes-for-Blender"


def run(cmd: list[str], *, cwd: Path | None = None) -> int:
    print(f"\n$ {' '.join(cmd)}", flush=True)
    return subprocess.call(cmd, cwd=str(cwd or WIKI_ROOT))


def generate_manifest(addon_root: Path) -> int:
    out = WIKI_ROOT / "docs" / "_data" / "ui_manifest.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    rc = run([
        sys.executable,
        str(addon_root / "dev" / "build" / "manifest_extractor.py"),
        "--addon-root", str(addon_root),
        "--out", str(out),
    ])
    if rc == 0:
        counts = json.loads(out.read_text(encoding="utf-8"))["_meta"]["counts"]
        print(f"manifest counts: {counts}")
    return rc


def mirror_changelogs(addon_root: Path) -> None:
    dest = WIKI_ROOT / "docs" / "changelog"
    dest.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(addon_root / "CHANGELOG.md", dest / "index.md")

    # Same two rewrites CI applies: the sibling CHANGELOG.md link becomes the
    # mirrored user page, and links into .py source become inline code, since
    # source files are not wiki docs and --strict aborts on unresolved links.
    text = (addon_root / "CHANGELOG_DEV.md").read_text(encoding="utf-8")
    text = text.replace("[CHANGELOG.md](CHANGELOG.md)", "[CHANGELOG.md](index.md)")
    text = re.sub(r"\[([^\[\]]*)\]\([^)]*\.py[^)]*\)", r"`\1`", text)
    (dest / "dev.md").write_text(text, encoding="utf-8")
    print(f"changelog pages: {[p.name for p in sorted(dest.iterdir())]}")


def generate_roadmap(addon_root: Path) -> int:
    script = addon_root / "dev" / "scripts" / "build_wiki_roadmap.py"
    if not script.exists():
        print("(no build_wiki_roadmap.py — skipping roadmap regen)")
        return 0
    return run([
        sys.executable, str(script),
        "--addon-root", str(addon_root),
        "--wiki", str(WIKI_ROOT),
    ])


def verify_strings(addon_root: Path) -> int:
    findings_path = WIKI_ROOT / "dev" / "verify_findings.json"
    rc = run([
        sys.executable,
        str(addon_root / "dev" / "build" / "verify_wiki.py"),
        "--wiki", str(WIKI_ROOT / "docs"),
        "--manifest", str(WIKI_ROOT / "docs" / "_data" / "ui_manifest.json"),
        "--out", str(findings_path),
    ])
    if rc != 0 and findings_path.exists():
        print("\nWiki drift — the wiki names add-on strings that no longer exist:")
        findings = json.loads(findings_path.read_text(encoding="utf-8"))["findings"]
        for f in findings:
            print(f"  {f.get('severity', '?').upper():<6} {f.get('wiki_file')}:"
                  f"{f.get('wiki_line')}  {f.get('kind')} '{f.get('ref')}'")
            if f.get("description"):
                print(f"         {f['description']}")
        print(f"\n{len(findings)} finding(s).")
    return rc


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--addon-root", type=Path, default=DEFAULT_ADDON_ROOT)
    ap.add_argument("--skip-manifest", action="store_true",
                    help="reuse the existing ui_manifest.json")
    args = ap.parse_args()

    addon_root = args.addon_root.resolve()
    if not addon_root.is_dir():
        print(f"ERROR: addon repo not found at {addon_root}")
        return 2

    if not args.skip_manifest:
        if generate_manifest(addon_root) != 0:
            print("ERROR: manifest extraction failed")
            return 1

    mirror_changelogs(addon_root)
    generate_roadmap(addon_root)

    drift = verify_strings(addon_root)
    build = run([sys.executable, "-m", "mkdocs", "build", "--strict"])

    print("\n" + "=" * 60)
    print(f"string drift : {'PASS' if drift == 0 else 'FAIL'}")
    print(f"strict build : {'PASS' if build == 0 else 'FAIL'}")
    print("=" * 60)
    return 0 if (drift == 0 and build == 0) else 1


if __name__ == "__main__":
    sys.exit(main())
