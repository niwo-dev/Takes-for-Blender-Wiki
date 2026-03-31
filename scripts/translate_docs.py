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
    # "es": "ES",
    # "ja": "JA",
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

    # 7. Admonition lines  !!! type "title"  — protect the ENTIRE line
    content = re.sub(r"^(!!!?\s+\w+.*)$", _save, content, flags=re.MULTILINE)

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

    # Post-process: DeepL converts "..." to „..." (German typographic quotes).
    # MkDocs admonitions require straight quotes.
    result_text = result_text.replace("\u201e", '"').replace("\u201c", '"').replace("\u201d", '"')

    return result_text


def main():
    if not auth_key:
        print("WARNING: DEEPL_API_KEY missing. Skipping translation pipeline.")
        return

    translator = deepl.Translator(auth_key)
    docs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs")

    md_files = glob.glob(os.path.join(docs_dir, "**", "*.md"), recursive=True)

    for md_file in md_files:
        if any(md_file.endswith(f".{lang}.md") for lang in TARGET_LANGUAGES):
            continue

        base_mtime = os.path.getmtime(md_file)

        for lang_suffix, deepl_target in TARGET_LANGUAGES.items():
            target_file = md_file[:-3] + f".{lang_suffix}.md"

            if os.path.exists(target_file):
                target_mtime = os.path.getmtime(target_file)
                if target_mtime >= base_mtime:
                    continue

            print(f"Translating {os.path.basename(md_file)} -> {deepl_target} ({lang_suffix})...")

            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()

            translated_content = translate_markdown(content, deepl_target, translator)

            if translated_content != content:
                with open(target_file, "w", encoding="utf-8") as f:
                    f.write(translated_content)
                print(f"  [+] Saved {os.path.basename(target_file)}")


if __name__ == "__main__":
    print("Starting DeepL Multi-Language Pipeline...")
    main()
