#!/usr/bin/env python3
"""Generate llms.txt (index) and llms-full.txt (full content) for saQut docs."""
import os, re

DOCS = "src/content/docs"
SITE = "https://saqut.com"

pages = []

for root, dirs, files in os.walk(DOCS):
    for f in sorted(files):
        if not (f.endswith(".md") or f.endswith(".mdx")):
            continue
        fpath = os.path.join(root, f)
        rel = fpath[len(DOCS):].lstrip("/")
        slug = re.sub(r"\.(md|mdx)$", "", rel)
        if slug.endswith("/index"):
            slug = slug[:-6]
        url = "/" + slug + "/"
        if url == "/index/":
            url = "/"
        lang = "tr" if "/tr/" in url else "en"

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

        pages.append((lang, url, title, description, body.strip()))


# ── llms.txt (index) ──
lines = []
lines.append("# saQut Documentation")
lines.append("")
lines.append("> saQut is a procedural programming language with an inspectable compiler pipeline. This file provides a structured index for LLMs to understand the site's content at a glance.")
lines.append("")

for label, lang in [("English Pages", "en"), ("Turkish Pages (Turkce Sayfalar)", "tr")]:
    lines.append(f"## {label}")
    lines.append("")
    for l, url, title, desc, _ in pages:
        if l != lang:
            continue
        lines.append(f"- [{title}]({SITE}{url}): {desc}")
    lines.append("")

lines.append("## Additional Resources")
lines.append("")
lines.append(f"- [GitHub Repository](https://github.com/saqutlang/saqut)")
lines.append(f"- [Compiler Tools Documentation]({SITE}/compiler-tools/)")
lines.append(f"- [Getting Started]({SITE}/getting-started/)")
lines.append("- [llms.txt specification](https://llmstxt.org/)")

with open("public/llms.txt", "w") as fh:
    fh.write("\n".join(lines) + "\n")

# ── llms-full.txt (tum icerik, frontmatter'siz) ──
full = []
for _, url, _, _, body in pages:
    full.append(f"## {url}")
    full.append("")
    full.append(body)
    full.append("")

with open("public/llms-full.txt", "w") as fh:
    fh.write("\n".join(full) + "\n")

print(f"Generated llms.txt ({len(lines)} lines) and llms-full.txt ({len(full)} lines)")
