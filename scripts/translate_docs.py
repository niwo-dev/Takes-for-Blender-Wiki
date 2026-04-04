import os
import re
import glob
import deepl

# ==============================================================================
# Takes for Blender - Auto Translation Engine (DeepL)
#
# Scans 'docs/' for updated English markdown files and translates them
# using the DeepL API. Protects MkDocs-specific syntax (frontmatter,
# admonitions, icons, code blocks, links) from being mangled.
# ==============================================================================

auth_key = os.environ.get("DEEPL_API_KEY")

TARGET_LANGUAGES = {
    "de": "DE",
    "es": "ES",
    "ru": "RU",
    "zh": "ZH-HANS",
    "ja": "JA",
    "vi": "VI",
}

# Regex for YAML frontmatter block at the top of a file
RE_FRONTMATTER = re.compile(r"\A(---\n.*?\n---\n)", re.DOTALL)

# Placeholder prefix unlikely to appear in real docs
PH = "\u2060TXSPH"


def _extract_protected(content: str) -> tuple[str, list[str]]:
    """Replace untranslatable tokens with numbered placeholders."""
    protected: list[str] = []

    def _save(match: re.Match) -> str:
        idx = len(protected)
        protected.append(match.group(0))
        return f"{PH}{idx}{PH}"

    # 1. Frontmatter (--- ... ---)
    content = RE_FRONTMATTER.sub(_save, content)

    # 2. Fenced code blocks (``` ... ```)
    content = re.sub(r"```.*?```", _save, content, flags=re.DOTALL)

    # 3. Inline code (`...`)
    content = re.sub(r"`[^`]+`", _save, content)

    # 4. MkDocs icon shortcodes  :material-xxx:{ .lg .middle }
    content = re.sub(r":[a-z0-9_-]+(?:-[a-z0-9_-]+)+:\{[^}]*\}", _save, content)

    # 5. Standalone icon shortcodes  :material-xxx:
    content = re.sub(r":[a-z0-9_-]+(?:-[a-z0-9_-]+)+:", _save, content)

    # 6. Markdown links  [text](url)  — protect the URL part
    content = re.sub(r"\]\([^)]+\)", _save, content)

    # 7. Admonition / details lines  !!! type "title" / ??? type "title"
    content = re.sub(r"^([!?]{3}\s+\w+.*)$", _save, content, flags=re.MULTILINE)

    # 8. Key shortcodes  ++ctrl+n++, ++del++, ++alt++
    content = re.sub(r"\+\+[a-z0-9+]+\+\+", _save, content)

    # 9. HTML tags
    content = re.sub(r"<[^>]+>", _save, content)

    # 10. Horizontal rules (standalone ---)
    content = re.sub(r"^---\s*$", _save, content, flags=re.MULTILINE)

    # 11. Indented content lines (4-space) in cards/admonitions — protect indent
    content = re.sub(r"^(    +)", _save, content, flags=re.MULTILINE)

    return content, protected


def _restore_protected(content: str, protected: list[str]) -> str:
    """Put original tokens back in place of placeholders."""
    for idx, original in enumerate(protected):
        content = content.replace(f"{PH}{idx}{PH}", original)
    return content


def translate_markdown(content: str, target_lang: str, translator: deepl.Translator) -> str:
    """Translate only the prose portions of a Markdown file."""
    stripped, protected = _extract_protected(content)

    try:
        result = translator.translate_text(
            stripped,
            target_lang=target_lang,
            preserve_formatting=True,
        )
        translated = result.text
    except Exception as e:
        print(f"  [!] Translation failed: {e}")
        return content

    result_text = _restore_protected(translated, protected)

    # Post-process: replace typographic quotes from all target languages.
    # MkDocs admonitions require straight ASCII quotes.
    for ch in '\u201e\u201c\u201d\u00ab\u00bb\u300c\u300d\u300e\u300f\u201a\u2019\u2018':
        result_text = result_text.replace(ch, '"')

    return result_text


def main():
    if not auth_key:
        print("WARNING: DEEPL_API_KEY missing. Skipping translation pipeline.")
        return

    translator = deepl.Translator(auth_key)
    docs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs")

    md_files = glob.glob(os.path.join(docs_dir, "en", "**", "*.md"), recursive=True)

    for md_file in md_files:
        # Get relative path starting after 'docs/en/'
        # Example: 'features/takes.md'
        rel_path = os.path.relpath(md_file, os.path.join(docs_dir, "en"))

        base_mtime = os.path.getmtime(md_file)

        for lang_code, deepl_target in TARGET_LANGUAGES.items():
            # Build target path: docs/de/features/takes.md
            target_file = os.path.join(docs_dir, lang_code, rel_path)

            if os.path.exists(target_file):
                target_mtime = os.path.getmtime(target_file)
                if target_mtime >= base_mtime:
                    continue

            print(f"Translating {os.path.basename(md_file)} -> {deepl_target} ({lang_code})...")

            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()

            translated_content = translate_markdown(content, deepl_target, translator)

            if translated_content != content:
                # Ensure the target directory exists before saving
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                with open(target_file, "w", encoding="utf-8") as f:
                    f.write(translated_content)
                print(f"  [+] Saved {os.path.basename(target_file)}")


if __name__ == "__main__":
    print("Starting DeepL Multi-Language Pipeline...")
    main()
