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
| stdlib-path | path (Paths) / path (Yollar) |
| stdlib-utf8 | utf8 (Text Encoding) / utf8 (Metin Kodlama) |
| stdlib-io | stdin / stdout / stderr |
| stdlib-sys | sys (System) / sys (Sistem) |
| stdlib-process | process (Process Control) / process (Süreç Kontrolü) |
| stdlib-os | os / terminal |
| stdlib-math | math |
| stdlib-date | date |
| ffi | FFI |
| editor-setup | Editor Setup / Editör Kurulumu |
| cli-reference | CLI Reference / CLI Referansı |

There is no `capabilities` page: the capability system was removed in 0.9.4
(ADR-043) and the page was deleted with it. There is no `stdlib-net` page
either; `net` is not a shipped module and importing it is an error.

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
  experimental MIR JIT runs via `saqut run --jit`. It is no longer limited to
  scalar code: strings, arrays, structs, `try`/`catch`, and host calls all run
  on it, and it is required to match the VM byte for byte. Embedded-runtime AOT
  (a `--output` binary) is still planned.
  - Known JIT gaps, verified 2026-09-22 on `e4863e9`: `string?`-returning host
    functions (`sys::env`, `os::osUser`, `stdin::readLine`) return a raw
    pointer instead of the string (#239), and `++` on a `float`/`double`
    crashes the JIT while the VM silently yields `1` (#238).
- **Target platforms:** Linux x86-64 and Windows 11 x86-64 only. macOS is not
  a target and will not be supported. ARM (aarch64) and cross-compiling are
  planned for later, not shipped yet. Do not claim 32-bit support.
- **`net` module:** planned, not shipped. Importing it is an `E_IMPORT_UNKNOWN`
  error, so no page documents it as available.
- **Embedded modules:** the full list the compiler accepts is `math`, `core`,
  `fs`, `sys`, `date`, `process`, `stdin`, `stdout`, `stderr`, `path`, `utf8`,
  `os`, `terminal`. The authoritative declarations, with exact signatures, are
  in the compiler repo at `src/internal/ffi.sqt`. Check any stdlib claim
  against that file, not against an older page.
- **Capability system:** removed in 0.9.4 (ADR-043). There is no `--allow`
  flag, no `caps` module, and no `saqut ir --capabilities`. Host calls are open
  by default. Do not reintroduce capability language into any page.
- **FFI:** a curated host-function seam (how `fs`, `sys`, `math`, `date` reach
  your program). It is not a mechanism for loading arbitrary C/C++ libraries.
- **VS Code extension:** distributed as a `.vsix` (current: `saqut-0.4.0.vsix`).
  End users install the file downloaded from GitHub Releases by its full path;
  the `editor/vscode/...` repo-relative path only works from a source checkout.

### Language details that pages have gotten wrong before

Each of these was verified by running the compiler on `e4863e9` (2026-09-22).
Do not write the crossed-out form back into a page.

- **No exponentiation operator.** `**` tokenizes and parses but is implemented
  nowhere, so `2 ** 3` silently evaluates to `0` (#237). `^` is bitwise XOR.
  Use `math::pow()`, which takes and returns `double`.
- **No prefix `++x` / `--x`.** It parses and does nothing (#237). Postfix
  `x++` works, including as an expression (`int y = x++;` gives `y = 5`,
  `x = 6`).
- **No comma operator.** `(a, b)` is a syntax error.
- **String escapes are only** `\n`, `\t`, `\r`, `\b`, `\\`, `\"`. There is no
  `\x1b`, `\u001b`, or `\033`; the backslash is dropped and the letters print
  literally.
- **No wildcard import.** `import * from fs;` is a syntax error. `import { x
  as y } from fs;` does work.
- **`args()[0]` is the first user argument**, not the program name. Arguments
  come after `--`: `saqut run prog.sqt -- a b`.
- **`readFile` returns `byte[]`**, not `string`, and takes optional `seek` and
  `size`. Convert with `utf8::decode`.
- **`date::parse` accepts only** a 20-character ISO-8601 UTC string ending in
  `Z`. A date-only string returns `null`.
- **`date::format` tokens are** `yyyy MM dd HH mm ss` (month uppercase, minute
  lowercase). `%Y-%m-%d` and `YYYY-MM-DD` are not patterns; unknown tokens are
  copied through literally.
- **A null check in a `while` condition does not narrow inside the body.** The
  working idiom for `stdin::readLine` is `while (true) { ...; if (x == null)
  { break; } }`.
- **String methods** are `upper, lower, trim, split, substring, replace,
  repeat, charAt, indexOf, contains, startsWith, endsWith`. There is no
  `slice` on a string; `slice` is an array method. `toJson()` exists on a
  struct but not on an array.

When a page shows code, run it before publishing. Several of the errors above
were shipped for months because the examples were never compiled.

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