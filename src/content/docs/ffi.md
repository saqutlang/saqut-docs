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
ffi float sqrt(float x) : MATH_SQRT from math;
ffi string readFile(string path) : FS_READFILE from fs requires fs;
```

Each declaration specifies: the **signature** (types for type checking), a
**symbolic host ID** (maps to C++ `HostFnId` enum), a **module** (for
import-gating), and optionally a **capability** and stability flag.

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

## Capability and FFI

Host functions that reach outside the VM (file I/O, network, system calls)
must declare `requires fs` (or `net`, `sys`). The compiler and runtime both
enforce this. A host function without a `requires` clause is pure and needs
no `--allow` flag.

## print() is also FFI

The `print()` function you've been using since Hello World is itself a host
function (`: PRINT from core`). It is always available because it is declared in
the core module, which needs no import and no capability.

## Writing your own host function

This is an advanced topic. In short: add a `ffi` declaration to the embedded
root, implement the C++ body in `host_functions.hpp`, assign a new
`HostFnId`, and recompile saQut. For step-by-step instructions, see the
[contributing guide](https://github.com/saqutlang/saqut/blob/main/CONTRIBUTING.md).

## FFI vs. standard library

| What | Mechanism | Import required | Capability required |
|---|---|---|---|
| `s.upper()`, `arr.append()` | UFCS built-in | No | No |
| `readFile()`, `sqrt()` | FFI (stdlib) | Yes | Depends on function |
| `print()` | FFI (core) | No | No |

The standard library is a set of FFI declarations shipped with the compiler.
You don't see the FFI machinery when using `import { readFile } from fs`
because it's already wired up. The seam is there if you ever need to extend
it.
