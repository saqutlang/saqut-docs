---
title: Capabilities & Permissions
description: How --allow works, the three capability categories, and runtime capability enforcement.
---

saQut uses an explicit capability policy. With no `--allow` option, all three
currently defined capabilities are enabled. If `--allow` is present, it becomes
a whitelist and only the listed capabilities are enabled.

## The three capabilities

| Capability | Flag | What it unlocks |
|---|---|---|
| File system | `--allow fs` | `readFile`, `writeFile`, `readDir`, `exists`, `remove` |
| Network | `--allow net` | HTTP requests, sockets (planned 0.9) |
| System | `--allow sys` | `random`, `randomRange`, `env`, `args`, `sleep`, `date::now()` |

Multiple capabilities are comma-separated:

```bash
saqut run --allow fs,net prog.sqt
saqut run --allow fs,net,sys prog.sqt
```

The older `--allow-fs`, `--allow-net`, and `--allow-sys` forms are not valid.

## How enforcement works

Capability checks happen at the point where a gated function is called:

Importing a capability-gated function is allowed even when that capability is
currently disabled. The VM checks the active capability set immediately before
the call. If the capability is missing, the call fails with `E_CAP_MISSING`.
This also makes dynamic changes such as `caps::drop("fs")` effective for later
calls. The import itself is not rejected.

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

Each program can inspect its active capability set at runtime. The CLI policy
and runtime call checks enforce the boundary; importing a module alone does
not grant or consume a capability.
