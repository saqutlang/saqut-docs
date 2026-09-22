---
title: Standard Library
description: An overview of saQut's standard library modules and how importing works.
---

The standard library is a set of modules that reach things the language itself
does not describe: files, the clock, the environment, the terminal. Unlike the
built-in type methods (`.upper()`, `.push()`), which are always available,
these functions have to be imported by name.

## How importing works

Each module is imported by name, without quotes:

```c
import { readFile, writeFile } from fs;
import { sqrt, abs } from math;
```

A quoted name is a file path; an unquoted name is a standard library module:

```c
import { greet } from "./helpers.sqt";   // another file
import { readFile } from fs;             // stdlib module
```

You can rename on import with `as`, which is how you resolve a collision
between two modules that export the same name:

```c
import { readFile as loadConfig } from fs;
```

There is no wildcard import: every name you use has to be listed. `import *
from fs;` is a syntax error. Naming each import keeps the reader able to tell,
from the top of the file, exactly which outside functions the program can
reach.

## Module index

| Module | Import from | What it covers |
|---|---|---|
| File system | `fs` | Read, write, copy, list files and directories |
| Path | `path` | Build and split path strings, no disk access |
| UTF-8 | `utf8` | Convert between `byte[]` and `string` |
| System | `sys` | Random numbers, environment, arguments, sleep |
| Process | `process` | Exit code, working directory, process id |
| Standard input | `stdin` | Read from standard input |
| Standard output | `stdout` | Write to standard output |
| Standard error | `stderr` | Write to standard error |
| Math | `math` | Absolute value, min/max, roots, powers, rounding |
| Date | `date` | UTC timestamps, calendar fields, formatting |
| Operating system | `os` | Platform name, architecture, host name, CPU count |
| Terminal | `terminal` | Whether output is going to a real terminal |
| Core | `core` | Compiler version |

Every module in this table is available now. There is no network module: `net`
is planned but not shipped, and importing it is an error.

## Determinism

Most of these functions are pure calculations on the values you pass in: the
same input gives the same result on every run. A few read state from outside
the program and therefore cannot promise that:

| Function | Why it varies |
|---|---|
| `sys::random`, `sys::randomInt` | Operating system randomness |
| `sys::env`, `sys::args` | Depends on how the program was started |
| `date::now` | Reads the system clock |
| `fs::*` | The file system changes underneath the program |
| `stdin::*` | Depends on what is piped in |
| `os::*`, `terminal::isTTY` | Depends on the machine and how it was run |

Everything else, including all of `math`, `path`, `utf8`, and every `date`
function except `now()`, computes only from its arguments.

## Not part of the standard library

The built-in type methods (`.upper()`, `.push()`, `.length()`) are not
imported. They are called with dot notation on a value and are always
available. See [Built-in Functions (UFCS)](/builtin-functions/).
