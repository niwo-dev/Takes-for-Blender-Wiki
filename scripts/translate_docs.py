import os
import glob
import deepl

# ==============================================================================
# Takes for Blender - Auto Translation Engine (Approach 1 - DeepL)
# 
# This script scans 'docs/' for updated English markdown files and translates
# them automatically using the official DeepL API.
# ==============================================================================

# Initialize client. Requires DEEPL_API_KEY set in environment variables (or GitHub Secrets)
auth_key = os.environ.get("DEEPL_API_KEY")

# DeepL requires target languages to be uppercase (e.g., 'DE', 'ES', 'JA')
# Mapping from our file suffix (lowercase) to DeepL's required target code.
TARGET_LANGUAGES = {
    "de": "DE",
    # "es": "ES", # Uncomment to expand!
    # "ja": "JA"
}

def translate_markdown(content: str, target_lang: str, translator: deepl.Translator) -> str:
    """Uses DeepL to translate Markdown docs while trying to preserve formatting."""
    try:
        # DeepL handles text translation. Preserve formatting prevents it from 
        # completely destroying markdown structure, though extremely complex 
        # nested code blocks might occasionally need manual review.
        result = translator.translate_text(
            content, 
            target_lang=target_lang,
            preserve_formatting=True,
        )
        return result.text
    except Exception as e:
        print(f"  [!] Translation failed: {e}")
        return content

def main():
    if not auth_key:
        print("WARNING: DEEPL_API_KEY missing. Skipping translation pipeline.")
        return
        
    translator = deepl.Translator(auth_key)
    docs_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'docs')
    
    # Recursively find all markdown files
    md_files = glob.glob(os.path.join(docs_dir, '**', '*.md'), recursive=True)
    
    for md_file in md_files:
        # Skip files that are already translated versions (e.g., index.de.md)
        if any(md_file.endswith(f".{lang}.md") for lang in TARGET_LANGUAGES.keys()):
            continue
            
        base_mtime = os.path.getmtime(md_file)
        
        for lang_suffix, deepl_target in TARGET_LANGUAGES.items():
            target_file = md_file[:-3] + f".{lang_suffix}.md"
            
            # Check if translation exists and is newer than the source
            if os.path.exists(target_file):
                target_mtime = os.path.getmtime(target_file)
                if target_mtime >= base_mtime:
                    continue # Translation is up-to-date
            
            print(f"Translating {os.path.basename(md_file)} -> {deepl_target} ({lang_suffix})...")
            
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            translated_content = translate_markdown(content, deepl_target, translator)
            
            # Only write if it actually changed
            if translated_content != content:
                with open(target_file, 'w', encoding='utf-8') as f:
                    f.write(translated_content)
                print(f"  [+] Saved {os.path.basename(target_file)}")

if __name__ == "__main__":
    print("Starting DeepL Multi-Language Pipeline...")
    main()
