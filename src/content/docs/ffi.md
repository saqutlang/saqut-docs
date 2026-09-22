---
title: FFI (Foreign Function Interface)
description: How saQut calls C/C++ host functions through the FFI seam.
---

saQut is a small language by design. It does not try to replace every library
ever written. Instead, it provides a single, controlled door to C and C++
code: the **Foreign Function Interface (FFI)**.

## What FFI is for

The FFI lets you call functions written in C or C++ from saQut. These **host
functions** are declared in a special file inside the compiler and dispatched
by numeric ID. You don't need to write C code yourself to use the standard
library (`fs`, `math`, `sys`, `date`); that's already done for you.

You would use the FFI directly when:
- You are extending saQut with your own host function
- You are embedding saQut as a scripting engine in a larger C++ application

## How it works

Host functions are declared in the compiler's embedded `root.sqt` using the
`ffi` keyword:

```
ffi double sqrt(double x) : MATH_SQRT from math;
ffi byte[] readFile(string path, int? seek, int? size) : FS_READ_FILE from fs;
```

Each declaration specifies three things: the **signature** (the types the type
checker uses), a **symbolic host ID** (which maps to the C++ implementation),
and a **module** (which import brings the name into scope).

These declarations are not hidden inside the compiler's C++ source. They live
in `src/internal/ffi.sqt`, a real saQut file that is embedded into the binary
at build time, so it opens in an editor with syntax highlighting and is visible
to the language server. Reading that file is the authoritative way to see every
host function the compiler provides, with exact signatures.

When you write:

```c
import { sqrt } from math;

int main() {
    print(sqrt(81));   // 9.0
    return 0;
}
```

- The import gate resolves `math` to the embedded module
- The `sqrt` call becomes a `CALLHOST MATH_SQRT` instruction in the IR
- The VM dispatches to the C++ function via the `HostFnId` enum (O(1) lookup)
- The result is pushed back as a saQut value

No string matching. No runtime reflection. A single numeric dispatch.

## No capability gate

Earlier versions gated host functions behind a capability system: a
declaration carried a `requires fs` clause, and running the program needed a
matching `--allow` flag. That system was removed in 0.9.4 (ADR-043). Host
calls are open by default, there is no `requires` clause, and `--allow` is not
a flag.

What still gates a host function is the import: a name you have not imported
is not in scope, so the set of outside functions a file can reach is visible
at the top of that file.

## print() is also FFI

The `print()` function you've been using since Hello World is itself a host
function. It is always available because it belongs to the core module, which
needs no import.

## Writing your own host function

This is an advanced topic. In short: add a `ffi` declaration to the embedded
root, implement the C++ body in `host_functions.hpp`, assign a new
`HostFnId`, and recompile saQut. For step-by-step instructions, see the
[contributing guide](https://github.com/saqutlang/saqut/blob/main/CONTRIBUTING.md).

## FFI vs. standard library

| What | Mechanism | Import required |
|---|---|---|
| `s.upper()`, `arr.push()` | UFCS built-in | No |
| `readFile()`, `sqrt()` | FFI (stdlib) | Yes |
| `print()` | FFI (core) | No |

The standard library is a set of FFI declarations shipped with the compiler.
You don't see the FFI machinery when using `import { readFile } from fs`
because it's already wired up. The seam is there if you ever need to extend
it.
