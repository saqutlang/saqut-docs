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
page is accessible at `src/content/docs/<slug>.md` (English) or
`src/content/docs/tr/<slug>.md` (Turkish). Start with the index, then follow
the sidebar order.

**IMPORTANT: keep this map current.** When you add, rename, or remove a page,
update the tables below and the sidebar in `astro.config.mjs` in the same
change. A stale map here caused wrong assumptions about what exists.

The sidebar has four groups (authoritative order lives in `astro.config.mjs`):
Introduction, Learn the Language, Libraries & Real Programs, Under the Hood.
Each `<slug>` below exists in English at `/<slug>/` and in Turkish at
`/tr/<slug>/`.

### Introduction

| Slug | Page |
|------|------|
| (index) | Home / Ana Sayfa |
| what-is-saqut | What is saQut / saQut Nedir |
| hello-world | Hello World / Merhaba Dünya |
| getting-started | Getting Started / Hızlı Başlangıç |

### Learn the Language

| Slug | Page |
|------|------|
| what-is-programming | What is Programming / Programlama Nedir |
| variables | Variables / Değişkenler |
| data-types | Data Types / Veri Tipleri |
| nullable-types | Nullable Types / Nullable Tipler |
| operators | Operators / Operatörler |
| type-casting | Type Casting (as) / Tip Dönüşümü (as) |
| if-else | if / else |
| switch | switch / case |
| loops/for-loop | for Loop / for Döngüsü |
| loops/while-loop | while Loop / while Döngüsü |
| loops/do-while-loop | do-while Loop / do-while Döngüsü |
| functions | Functions / Fonksiyonlar |
| structs | Structs / Struct (Yapılar) |
| arrays | Arrays / Diziler |
| strings | Strings / Metinler |
| enums | Enums / Enum |
| error-handling | Error Handling / Hata Yönetimi |
| modules | Modules (import/export) / Modüller |
| tutorial-task-tracker | Build a Task Tracker / Görev Takip Programı |

### Libraries & Real Programs

| Slug | Page |
|------|------|
| builtin-functions | Built-in Functions (UFCS) / Yerleşik Fonksiyonlar |
| stdlib-overview | Standard Library / Standart Kütüphane |
| stdlib-fs | fs (File System) / fs (Dosya Sistemi) |
| stdlib-sys | sys (System) / sys (Sistem) |
| stdlib-math | math |
| stdlib-date | date |
| stdlib-net | net (Network) / net (Ağ), status: planned for 0.9 |
| capabilities | Capabilities & Permissions / Capability & İzinler |
| ffi | FFI |
| editor-setup | Editor Setup / Editör Kurulumu |
| cli-reference | CLI Reference / CLI Referansı |

### Under the Hood

| Slug | Page |
|------|------|
| compiler-tools | Compiler Tools / Derleyici Araçları |
| compiler-errors | Compiler Errors / Derleyici Hataları |
| optimization | Optimization / Optimizasyon |
| garbage-collection | Memory Management / Bellek Yönetimi |

### Current compiler status (keep this in sync with the docs)

Facts that content must not contradict. Update this block when the compiler
changes, and fix any page that disagrees with it.

- **Backends:** the bytecode VM is the default and reference backend. An
  experimental MIR JIT runs via `saqut run --jit` and currently handles whole
  programs made of integer and float scalar code only; anything else is
  rejected with an explicit error (no silent fallback, no partial JIT).
  Embedded-runtime AOT (a `--output` binary) is still planned.
- **Target platforms:** Linux x86-64 and Windows 11 x86-64 only. macOS is not
  a target and will not be supported. ARM (aarch64) and cross-compiling are
  planned for later, not shipped yet. Do not claim 32-bit support.
- **`net` module:** planned for 0.9, not shipped. `stdlib-net` is a planned-API
  page and says so.
- **FFI:** a curated host-function seam (how `fs`, `sys`, `math`, `date` reach
  your program). It is not a mechanism for loading arbitrary C/C++ libraries.
- **VS Code extension:** distributed as a `.vsix` (current: `saqut-0.4.0.vsix`).
  End users install the file downloaded from GitHub Releases by its full path;
  the `editor/vscode/...` repo-relative path only works from a source checkout.

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

------

# saQut Documentation Writing Rules

The documentation must reflect the philosophy of the language, not marketing.

## Core principles

Everything written for saQut must reinforce these ideas.

- Deterministic behavior.
- Transparent compiler.
- Developer remains in control.
- Explicit over implicit.
- Observable compilation.
- Machine-readable outputs.
- Predictable execution.
- Honest tradeoffs.

Never describe saQut as "the fastest", "the safest", or "the smartest".

Instead explain why the compiler behaves the way it does.

---

## Never hide compiler behavior

Whenever a compiler feature is explained, also explain:

- what the compiler actually does
- why it behaves that way
- how developers can inspect it

Prefer:

"The compiler generated this IR."

instead of

"The compiler optimized your code."

---

## Do not anthropomorphize the compiler.

Never write

"The compiler magically..."

"The compiler automatically figures out..."

"The compiler is smart enough..."

Instead write

"The compiler performs..."

"The compiler analyzes..."

"The compiler reports..."

"The compiler exposes..."

---

## Developer is responsible.

The compiler may suggest.

The compiler may analyze.

The compiler may explain.

The compiler may generate diagnostics.

The compiler must never silently rewrite user intent.

---

## Explain tradeoffs honestly.

Every feature has advantages.

Every feature has costs.

Documentation must explain both.

Never present features as universally better.

---

## Documentation is descriptive.

Do not sell features.

Explain them.

---

## Machine-readable outputs are first-class citizens.

Whenever possible provide both

CLI output

and

JSON output.

Both are official interfaces.

---

## AI is not the target.

Machine-readable APIs exist for

- IDEs
- LSP
- MCP
- CLI tools
- CI systems
- AI assistants

Never write documentation that assumes AI is the only consumer.

---

## Prefer precise language.

Avoid words like

magic
automatic
simply
just
easy

Prefer concrete explanations.

---

## Use compiler terminology consistently.

Compiler stages are:

Tokenizer

Parser

AST

Symbols

Type Checker

IR

Optimizer

VM

Diagnostics

Bench

Never invent alternative terminology.

---

## Transparency is more important than convenience.

If something is hidden from the user, explain why.

If something can be inspected, show how.

---

## Every compiler stage should be queryable.

Documentation should encourage users to inspect

tokens

AST

symbols

IR

diagnostics

benchmark data

rather than guessing compiler behavior.

---

## Performance philosophy

The compiler rewards well-written code.

It does not promise to fix poorly-written code.

Optimizations improve code when possible.

They are not guarantees.

Developers should understand performance rather than depend on hidden optimizations.

---

## Tone

Professional.

Technical.

Calm.

Never exaggerated.

Never compare against competitors unless discussing technical tradeoffs.

Explain.

Do not advertise.