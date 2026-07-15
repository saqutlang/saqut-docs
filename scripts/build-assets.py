#!/usr/bin/env python3
"""Build llms.txt, llms-full.txt, and copy .md files to dist/ with links rewritten for .md serving."""
import os, re

DOCS = "src/content/docs"
SITE = "https://saqut.com"
DIST = "dist"
PUBLIC = "public"

pages = []

# ── Collect all pages ──────────────────────────────────
for root, dirs, files in os.walk(DOCS):
    for f in sorted(files):
        if not (f.endswith(".md") or f.endswith(".mdx")):
            continue
        ext = ".mdx" if f.endswith(".mdx") else ".md"
        fpath = os.path.join(root, f)
        rel = fpath[len(DOCS):].lstrip("/")
        slug = re.sub(r"\.(md|mdx)$", "", rel)
        if slug.endswith("/index"):
            slug = slug[:-6]
        html_url = "/" + slug + "/"
        if html_url == "/index/":
            html_url = "/"
        lang = "tr" if "/tr/" in html_url else "en"

        with open(fpath) as fh:
            text = fh.read()

        title = ""
        description = ""
        body = text

        if text.startswith("---"):
            parts = text.split("---", 2)
            if len(parts) >= 3:
                fm = parts[1]
                body = parts[2]
                for line in fm.split("\n"):
                    m = re.match(r"^title:\s*(.*)", line)
                    if m:
                        title = m.group(1).strip().strip('"').strip("'")
                    m = re.match(r"^description:\s*(.*)", line)
                    if m:
                        description = m.group(1).strip().strip('"').strip("'")

        if not title:
            for line in text.split("\n"):
                if line.startswith("# "):
                    title = line[2:]
                    break

        if not description:
            for line in body.strip().split("\n"):
                s = line.strip()
                if s and not s.startswith("#"):
                    description = s
                    break

        pages.append({
            "lang": lang,
            "html_url": html_url,
            "title": title,
            "description": description,
            "body": body.strip(),
            "fpath": fpath,
            "text": text,
            "frontmatter": text.split("---", 2)[1] if text.startswith("---") else "",
        })


# ── Helper: rewrite markdown links for .md serving ─────
def rewrite_md_links(body_text):
    """Convert relative links: [text](slug/) -> [text](slug.md)"""
    def _rewrite(m):
        prefix = m.group(1)
        url = m.group(2)
        label = m.group(3) or ""
        if url.startswith("http") or url.startswith("#") or url.startswith("/"):
            return m.group(0)
        url = url.rstrip("/")
        return f"{prefix}({url}.md{label})"
    return re.sub(r"(\[.*?\])\(([^)]+)\)(\{[^}]*\})?", _rewrite, body_text)


# ── llms.txt (index) ───────────────────────────────────
print("Generating public/llms.txt ...")
lines = []
lines.append("# saQut Documentation")
lines.append("")
lines.append("> saQut is a procedural programming language with an inspectable compiler pipeline.")
lines.append("> This file provides a structured index for LLMs. Full content: [llms-full.txt](llms-full.txt)")
lines.append("")

for label, lang in [("English Pages", "en"), ("Turkish Pages", "tr")]:
    lines.append(f"## {label}")
    lines.append("")
    for p in pages:
        if p["lang"] != lang:
            continue
        lines.append(f"- [{p['title']}]({SITE}{p['html_url']}): {p['description']}")
    lines.append("")

lines.append("## Additional Resources")
lines.append("")
lines.append(f"- [GitHub Repository](https://github.com/saqutlang/saqut)")
lines.append(f"- [Compiler Tools Documentation]({SITE}/compiler-tools/)")
lines.append(f"- [Getting Started]({SITE}/getting-started/)")
lines.append("- [llms.txt specification](https://llmstxt.org/)")

with open(f"{PUBLIC}/llms.txt", "w") as fh:
    fh.write("\n".join(lines) + "\n")
print(f"  {PUBLIC}/llms.txt ({len(lines)} lines)")


# ── llms-full.txt (tum icerik) ─────────────────────────
print("Generating public/llms-full.txt ...")
full = []
for p in pages:
    full.append(f"## {p['html_url']}")
    full.append("")
    # Rewrite links for .md context
    body_md = rewrite_md_links(p["body"])
    body_md = re.sub(
        r"^import\s+\{[^}]*\}\s+from\s+['\"]@astrojs/starlight/components['\"];?\s*\n",
        "", body_md, flags=re.MULTILINE
    )
    body_md = re.sub(r"^\n+", "", body_md)
    full.append(body_md)
    full.append("")

with open(f"{PUBLIC}/llms-full.txt", "w") as fh:
    fh.write("\n".join(full) + "\n")
print(f"  {PUBLIC}/llms-full.txt ({len(full)} lines)")


# ── Copy .md files to dist/ ────────────────────────────
print("\nCopying .md files to dist/ ...")
for p in pages:
    rel_root = os.path.dirname(p["fpath"][len(DOCS):].lstrip("/"))
    fname = os.path.basename(p["fpath"])

    # Determine output path: index.md / index.mdx -> parent.md
    if fname in ("index.md", "index.mdx"):
        out_path = os.path.join(DIST, rel_root + ".md") if rel_root else os.path.join(DIST, "index.md")
    else:
        slug = re.sub(r"\.(md|mdx)$", "", fname)
        out_path = os.path.join(DIST, rel_root, slug + ".md")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    # Build output: title + description + body with rewritten links
    out_lines = []
    if p["title"]:
        out_lines.append(f"# {p['title']}")
        out_lines.append("")
    if p["description"]:
        out_lines.append(f"> {p['description']}")
        out_lines.append("")

    body_md = rewrite_md_links(p["body"])
    # Strip Starlight component imports (keep saQut language imports)
    body_md = re.sub(
        r"^import\s+\{[^}]*\}\s+from\s+['\"]@astrojs/starlight/components['\"];?\s*\n",
        "", body_md, flags=re.MULTILINE
    )
    # Strip empty lines left by removed imports at the top
    body_md = re.sub(r"^\n+", "", body_md)
    out_lines.append(body_md)
    out_lines.append("")

    with open(out_path, "w") as fh:
        fh.write("\n".join(out_lines))

    print(f"  {out_path}")

print("\nDone.")
