# Wiki Scripts

## `translate_docs.py` — DeepL translation utility (manual)

Translation **does not run automatically** anymore. It is invoked only when you
ask for it.

### Run via GitHub Actions

1. Open the **Actions** tab on the repo.
2. Select **Translate Docs (Manual)**.
3. Click **Run workflow**.
4. Optionally enter a comma-separated subset of target codes (e.g. `de,es`).
   Leave blank to translate all configured languages.

The workflow uses the `DEEPL_API_KEY` repository secret and commits the result
to the same branch.

### Run locally

```bash
export DEEPL_API_KEY="..."
# All configured languages
python scripts/translate_docs.py
# Subset only
TRANSLATE_LANGUAGES="de,es" python scripts/translate_docs.py
```

PowerShell:

```powershell
$env:DEEPL_API_KEY = "..."
$env:TRANSLATE_LANGUAGES = "de,es"   # optional
python scripts/translate_docs.py
```

### Behavior

- Source files: `docs/en/**/*.md`.
- Targets: `docs/<lang>/**/*.md` for `de`, `es`, `ru`, `zh`, `ja`, `vi`.
- Skips a file when the target's mtime is newer than or equal to the source.
- Preserves frontmatter, code blocks, MkDocs admonitions, icons, links, and
  HTML via placeholder substitution.
