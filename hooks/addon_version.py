"""
MkDocs hook — expose the latest available addon version to theme templates.

The header's GitHub button renders a version chip (see
`docs/overrides/main.html`). The value cannot be fetched in the browser: the
addon repo is private, so an anonymous GitHub API call returns 404. It is
therefore resolved at BUILD time, where the deploy workflow holds a read
token, and baked into `config.extra`.

Two sources, in order:

  1. `docs/_data/release.json` — written by the deploy workflow from the
     addon repo's latest published release (the true "available" version).
  2. `docs/_data/ui_manifest.json` — the version in the addon's
     blender_manifest.toml, used as a fallback and for local `mkdocs serve`.

If neither file is present the chip is simply omitted — a missing version
must never fail the build.
"""

import json
from pathlib import Path

RELEASE_PATH = Path("docs/_data/release.json")
MANIFEST_PATH = Path("docs/_data/ui_manifest.json")


def _load(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def _resolve_version():
    """Return the display version (no leading 'v'), or None."""
    release = _load(RELEASE_PATH)
    version = release.get("version") or release.get("tag")
    if not version:
        version = _load(MANIFEST_PATH).get("addon", {}).get("version")
    if not version:
        return None
    return str(version).lstrip("vV").strip() or None


def on_config(config):
    config["extra"]["addon_version"] = _resolve_version()
    return config
