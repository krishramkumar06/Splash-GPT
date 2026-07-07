#!/usr/bin/env python3
"""Re-embed the handbook into Splash HQ.html.

Run this after editing any wiki page or doc:

    python3 rebuild.py

The guide block (#doc-guide) is compiled from the wiki: every folder in wiki/
in name order (S0, S1, ... S7), each folder's _section.md heading first, then
its pages in name order. So the wiki files in Drive are the source of truth
and the app is the reader. The #doc-website and #doc-emails blocks still come
from docs/website-docs.md and docs/emails-2025.md.

It also nags: any page whose "Last reviewed" line is 2+ years old is listed
so it can be re-verified (or the line updated).
"""
import datetime
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP = HERE / "Splash HQ.html"
WIKI = HERE / "wiki"

DOCS = {
    "doc-website": "website-docs.md",
    "doc-emails": "emails-2025.md",
}

REVIEWED_RE = re.compile(r"\*\*Last reviewed:\*\*[^·\n]*?(20\d\d)")


def compile_wiki():
    if not WIKI.is_dir():
        raise SystemExit("wiki/ folder not found — it is the handbook source now")
    parts = ["The Hitchhiker's Guide to Directing Splash",
             "",
             "*Maintained as the Splash Wiki: one page per task, compiled into "
             "this app by rebuild.py. Start at S0.01 (the FAQ) or just search.*",
             ""]
    stale, this_year = [], datetime.date.today().year
    for section_dir in sorted(p for p in WIKI.iterdir() if p.is_dir()):
        heading = section_dir / "_section.md"
        if heading.exists():
            parts += [heading.read_text(encoding="utf-8").strip(), ""]
        for page in sorted(section_dir.glob("*.md")):
            if page.name == "_section.md":
                continue
            text = page.read_text(encoding="utf-8").strip()
            parts += [text, ""]
            m = REVIEWED_RE.search(text)
            if not m or this_year - int(m.group(1)) >= 2:
                stale.append(page.relative_to(WIKI))
    return "\n".join(parts), stale


def embed(html, block_id, text):
    text = text.replace("</script", "<\\/script")
    pattern = re.compile(
        r'(<script type="text/markdown" id="%s">).*?(</script>)' % block_id,
        re.DOTALL,
    )
    if not pattern.search(html):
        raise SystemExit(f"Could not find block #{block_id} in {APP.name}")
    print(f"embedded {len(text):,} chars -> #{block_id}")
    return pattern.sub(lambda m: m.group(1) + "\n" + text + "\n" + m.group(2), html)


def main():
    html = APP.read_text(encoding="utf-8")
    guide, stale = compile_wiki()
    html = embed(html, "doc-guide", guide)
    for block_id, filename in DOCS.items():
        html = embed(html, block_id, (HERE / "docs" / filename).read_text(encoding="utf-8"))
    stamp = datetime.date.today().strftime("%B %Y")
    html = re.sub(
        r'(<span id="doc-stamp">).*?(</span>)',
        lambda m: m.group(1) + stamp + m.group(2),
        html,
    )
    APP.write_text(html, encoding="utf-8")
    print(f"wrote {APP.name} ({APP.stat().st_size:,} bytes)")
    if stale:
        print("\nPages due for a review pass (Last reviewed is 2+ years old or missing):")
        for p in stale:
            print(f"  - {p}")


if __name__ == "__main__":
    main()
