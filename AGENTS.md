## Writing style (MANDATORY for all docs content)

This is public, Google-indexed content. Write so it does not read as machine-generated.

- **Never use the em dash (`—`, U+2014).** Not in prose, headings, code comments,
  frontmatter, tables, or anywhere else. Use a comma, colon, semicolon,
  parentheses, or split into two sentences instead. Pick whatever is
  grammatically correct in context; do not create comma splices.
  - Also avoid the en dash (`–`, U+2013) in prose; a plain hyphen or "to" (for
    ranges) is fine.
- **Avoid AI-tell filler phrases.** Do not write: "That's the whole idea",
  "That's it", "delve", "dive deep", "it's worth noting", "in a nutshell",
  "the important half", "rest assured", "goes to die", "burning into memory",
  "sails through", "under the hood" as filler, or similar clichés. State the
  fact plainly.
- **Internal links must be absolute**, e.g. `[structs](/structs/)`, never
  relative like `[structs](structs/)` (a relative link 404s from a nested URL).
- Keep prose direct and concrete; prefer short sentences over dashes-as-connectors.

When adding or editing any Markdown/MDX under `src/content/docs/`, apply the
above and grep the file for `—` before finishing (there must be zero matches).

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Site Map

This is the saQut language documentation site. Content lives under
`src/content/docs/` as Markdown/MDX with Starlight frontmatter
(`title`, `description`). The site is bilingual (English `/` and Turkish `/tr/`).

Instead of maintaining a separate `llms.txt`, read the actual pages. Every
page is accessible at `src/content/docs/<slug>.md`. Start with the index,
then follow the sidebar order.

### English pages (`/`)

| Page | URL |
|------|-----|
| Home / Index | https://saqut.com/ |
| Getting Started | https://saqut.com/getting-started/ |
| Variables | https://saqut.com/variables/ |
| Data Types | https://saqut.com/data-types/ |
| Operators | https://saqut.com/operators/ |
| if / else | https://saqut.com/if-else/ |
| switch / case | https://saqut.com/switch/ |
| for Loop | https://saqut.com/loops/for-loop/ |
| while Loop | https://saqut.com/loops/while-loop/ |
| do-while Loop | https://saqut.com/loops/do-while-loop/ |
| Functions | https://saqut.com/functions/ |
| Structs | https://saqut.com/structs/ |
| Arrays | https://saqut.com/arrays/ |
| Strings | https://saqut.com/strings/ |
| Built-in Functions | https://saqut.com/builtin-functions/ |
| Modules (import/export) | https://saqut.com/modules/ |
| Error Handling | https://saqut.com/error-handling/ |
| Compiler Errors | https://saqut.com/compiler-errors/ |
| Compiler Tools | https://saqut.com/compiler-tools/ |
| Optimization | https://saqut.com/optimization/ |
| Garbage Collection | https://saqut.com/garbage-collection/ |

### Turkish pages (`/tr/`)

| Page | URL |
|------|-----|
| Ana Sayfa | https://saqut.com/tr/ |
| Hizli Baslangic | https://saqut.com/tr/getting-started/ |
| Degiskenler | https://saqut.com/tr/variables/ |
| Veri Turleri | https://saqut.com/tr/data-types/ |
| Operatorler | https://saqut.com/tr/operators/ |
| if / else | https://saqut.com/tr/if-else/ |
| switch / case | https://saqut.com/tr/switch/ |
| for Dongusu | https://saqut.com/tr/loops/for-loop/ |
| while Dongusu | https://saqut.com/tr/loops/while-loop/ |
| do-while Dongusu | https://saqut.com/tr/loops/do-while-loop/ |
| Fonksiyonlar | https://saqut.com/tr/functions/ |
| Struct (Yapilar) | https://saqut.com/tr/structs/ |
| Diziler | https://saqut.com/tr/arrays/ |
| Metinler | https://saqut.com/tr/strings/ |
| Yerlesik Fonksiyonlar | https://saqut.com/tr/builtin-functions/ |
| Moduller (import/export) | https://saqut.com/tr/modules/ |
| Hata Yonetimi | https://saqut.com/tr/error-handling/ |
| Derleyici Hatalari | https://saqut.com/tr/compiler-errors/ |
| Derleyici Araclari | https://saqut.com/tr/compiler-tools/ |
| Optimizasyon | https://saqut.com/tr/optimization/ |
| Cop Toplama | https://saqut.com/tr/garbage-collection/ |

### Live content

To read the actual content of any page, open:
`src/content/docs/<slug>.md` (English) or `src/content/docs/tr/<slug>.md` (Turkish).

The URL path maps directly: `/getting-started/` -> `src/content/docs/getting-started.md`.

## Philosophy

saQut is a procedural programming language whose compiler is a **glass box**.
Every compilation phase (tokens, AST, symbols, IR) is inspectable, pipeable,
and machine-readable via CLI flags (`saqut tokens`, `saqut ast`, `saqut symbols`,
`saqut ir`).

The language is designed for **teaching compilers** and **learning how
programming languages work under the hood**. It is not a general-purpose
language to compete with C, Go, or Rust. Its purpose is to make the invisible
visible: show the token stream, print the AST, dump the symbol table, emit
three-address IR. All of it human-readable, all of it pipeable to other tools.

The documentation site mirrors this philosophy: it's built with Astro +
Starlight, the content is plain Markdown, and the structure is deliberately
flat and transparent. Open the source, read the docs, trace the pipeline.
