#!/usr/bin/env python3
"""Copy markdown files to dist/ with links rewritten for .md serving."""
import os, re, shutil
from pathlib import Path

DOCS = "src/content/docs"
DIST = "dist"

# Walk all .md/.mdx files
for root, dirs, files in os.walk(DOCS):
    rel_root = root[len(DOCS):].lstrip("/")
    for f in files:
        if not (f.endswith(".md") or f.endswith(".mdx")):
            continue

        src = os.path.join(root, f)

        # Determine output path
        slug = re.sub(r"\.(md|mdx)$", "", f)
        if slug == "index":
            # /getting-started/index.md -> dist/getting-started.md
            out_path = os.path.join(DIST, rel_root + ".md")
        else:
            # /getting-started.md -> dist/getting-started.md
            out_path = os.path.join(DIST, rel_root, slug + ".md")

        os.makedirs(os.path.dirname(out_path), exist_ok=True)

        with open(src) as fh:
            content = fh.read()

        body = content
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                body = parts[2]

        # Rewrite internal links:
        # [text](slug/)        -> [text](slug.md)
        # [text](loops/slug/)  -> [text](loops/slug.md)
        # Keep external links (http://, https://), anchor links (#), absolute links (/) untouched
        def rewrite_link(m):
            prefix = m.group(1)
            url = m.group(2)
            label = m.group(3)

            # Skip external, absolute, anchor-only
            if url.startswith("http") or url.startswith("#") or url.startswith("/"):
                return m.group(0)

            # url is relative like "functions/" or "loops/for-loop/"
            url = url.rstrip("/")
            return f"{prefix}({url}.md{label})"

        body = re.sub(r"(\[.*?\])\(([^)]+)\)(\{[^}]*\})?", rewrite_link, body)

        # Build frontmatter-stripped output
        out_lines = []
        # Derive title from frontmatter or first heading
        title = ""
        desc = ""
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                fm = parts[1]
                for line in fm.split("\n"):
                    m = re.match(r"^title:\s*(.*)", line)
                    if m:
                        title = m.group(1).strip().strip('"').strip("'")
                    m = re.match(r"^description:\s*(.*)", line)
                    if m:
                        desc = m.group(1).strip().strip('"').strip("'")

        if title:
            out_lines.append(f"# {title}")
            out_lines.append("")
        if desc:
            out_lines.append(f"> {desc}")
            out_lines.append("")

        out_lines.append(body.strip())
        out_lines.append("")

        with open(out_path, "w") as fh:
            fh.write("\n".join(out_lines))

        print(f"  {out_path}")

print("Done.")
