---
title: Capabilities & Permissions
description: How --allow flags work, the three capability categories, and the A+B enforcement model.
---

saQut runs programs in a **deny-by-default** sandbox. Your program has no
access to the file system, network, or system calls unless you explicitly
grant it. This page explains the permission model for practitioners building
real programs.

## The three capabilities

| Capability | Flag | What it unlocks |
|---|---|---|
| File system | `--allow fs` | `readFile`, `writeFile`, `readDir`, `exists`, `remove` |
| Network | `--allow net` | HTTP requests, sockets (planned 0.9) |
| System | `--allow sys` | `random`, `randomRange`, `env`, `args`, `sleep`, `date::now()` |

Multiple capabilities are comma-separated:

```bash
saqut run --allow fs,net prog.sqt
saqut run --allow fs --allow sys prog.sqt   # repeated flag also works
```

## How enforcement works

saQut uses a **two-layer model** (A+B):

**Layer A: compile time.** When you import a function that requires a
capability (e.g. `readFile` requires `fs`), the compiler checks whether the
matching `--allow` flag was passed. If not, you get a compile error before the
program ever runs.

**Layer B: runtime backstop.** Even if layer A passes, the VM checks again
before every capability-gated call. This catches edge cases like
`caps::drop()` removing a capability mid-program. If a call is blocked, the
program throws a catchable `E_CAP_MISSING` error.

## Querying capabilities

You can ask the compiler which capabilities a program needs without running it:

```bash
saqut ir --capabilities prog.sqt
```

Output:

```
fs, sys
```

This scans all imported functions and reports every capability they declare.

## caps module

The `caps` module lets your program inspect and manage its own permissions at
runtime:

```c
import { has, drop } from caps;

if (caps::has("fs")) {
    string data = readFile("secret.txt");
    caps::drop("fs");     // renounce fs for the rest of the program
}
```

- `caps::has(name)` returns `true` if the capability is currently active
- `caps::drop(name)` removes it permanently; there is no way to regain it

This lets you follow the principle of least privilege: keep a capability only
for as long as you need it.

## Why this matters for practitioners

- Your build script can read source files and write output, but cannot open
  sockets; `--allow fs` is enough
- Your HTTP client program needs network but should not touch the file system;
  grant `--allow net` only
- A utility that reads environment variables and command-line arguments
  only needs `--allow sys`

Each program declares exactly what it needs. The compiler and runtime enforce
it. There is no ambient authority.
