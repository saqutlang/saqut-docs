---
title: Standard Library
description: An overview of saQut's standard library modules, import model, and capability system.
---

saQut's standard library is a set of **import-gated modules** that give your
programs access to the file system, networking, system information, math, and
dates. Unlike the built-in functions (`.upper()`, `.append()`) which are always
available, standard library functions must be explicitly imported.

## How importing works

Each module is imported by name without quotes:

```c
import { readFile, writeFile } from fs;
import { sqrt, abs } from math;
```

A quoted name means a file path; an unquoted name means a standard library
module:

```c
import { greet } from "./helpers.sqt";   // file
import { readFile } from fs;             // stdlib module
```

You can import multiple functions in one statement, or use `*` for everything:

```c
import * from fs;       // all fs functions
import { readFile } from fs;  // just one
```

## Capability gates

Some modules require **runtime permission**. By default saQut denies all
external access. You grant it on the command line:

```bash
saqut run --allow fs prog.sqt
saqut run --allow fs,net,sys prog.sqt
```

| Capability | What it allows |
|---|---|
| `fs` | File system access (read, write, list) |
| `net` | Network access (HTTP, sockets) |
| `sys` | System calls: current time, random, environment, args |

Functions that require a capability declare it (`requires fs`). If you try to
use them without the matching `--allow` flag, the compiler produces an error
at compile time. The runtime also checks before each call as a backstop.

You can query which capabilities a program needs without running it:

```bash
saqut ir --capabilities prog.sqt
```

## Module index

| Module | Import from | Requires | Status |
|---|---|---|---|
| File system | `fs` | `--allow fs` | Available |
| System | `sys` | `--allow sys` | Available |
| Math | `math` | none | Available |
| Date | `date` | `--allow sys` (only `now()`) | Available |
| Network | `net` | `--allow net` | Planned (0.9) |

## Does not import from anywhere

The built-in type methods (`.upper()`, `.append()`, `.toJson()`) are not part
of the standard library. They use UFCS (Uniform Function Call Syntax) dot
notation and are always available without import. See [Built-in Functions
(UFCS)](/builtin-functions/).
