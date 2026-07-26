---
title: Modules (import / export)
description: Split a program across multiple files with import and export, from a two-file program to diamond dependencies and cycle detection.
---

As a program grows, splitting it across several files keeps each file focused.
saQut lets you split code across many `.sqt` files and share pieces between them
using two keywords: **`export`** (make something available to other files) and
**`import`** (pull something in from another file).

This page starts with a two-file program and builds up to multi-file dependency
graphs, path resolution rules, and how the compiler handles circular imports.

## A minimal two-file program

```c
// math.sqt
export int square(int n) {
    return n * n;
}
```

```c
// main.sqt
import {square} from "math.sqt";

int main() {
    print(square(5));   // 25
    return 0;
}
```

Run the file that contains `main()`:

```bash
saqut run main.sqt
```

The compiler resolves `math.sqt` from the `import` statement, compiles it, and
links `square` in. You do not list `math.sqt` on the command line; the `import`
statement is the only place the dependency is named.

The rest of this page fills in the details.

---

## Exporting: making things public

By default, everything you write in a file is **private** to that file. Nothing
leaks out. To let another file use a function, struct, or enum, put `export` in
front of its definition:

```c
// shapes.sqt

export struct Circle {      // exported, other files can use it
    float radius;
}

export float area(Circle c) {   // exported
    return 3.14159 * c.radius * c.radius;
}

float helper(float x) {     // NOT exported, private to shapes.sqt
    return x * 2.0;
}
```

Here `Circle` and `area` are visible to any file that imports them. `helper` is
invisible to the outside world, but `area` can still call it internally,
because private symbols are perfectly usable *within their own file*.

### What can be exported

| Can export | Cannot export (yet) |
|------------|---------------------|
| `export` functions | Global variables |
| `export struct` | |
| `export enum` | |

```c
export int add(int a, int b) { return a + b; }   // ok

export struct Vec { int x; int y; }              // ok

export enum State { Idle, Running, Done }         // ok

export int counter = 0;   // ERROR, globals cannot be exported
```

If you need shared state, expose it through exported functions rather than an
exported global.

---

## Importing: pulling things in

An `import` statement names the symbols you want and the file they come from:

```c
import {area, Circle} from "shapes.sqt";
```

- The names inside `{ }` must be **exactly** the exported names.
- Separate multiple names with commas.
- The path in quotes is a **file path** (more on paths below).

Import statements go at the **top of the file**, before your functions.

### You must import what you use

saQut does not give you access to another module's symbols unless you import
them by name. This is deliberate: every dependency is written down explicitly.

```c
// If shapes.sqt exports 'area' but you forget to import it:
int main() {
    Circle c;
    print(area(c));   // ERROR, 'area' is from another module
                      //         and must be imported explicitly
    return 0;
}
```

Importing a name that the other file **didn't** export is also an error:

```c
import {helper} from "shapes.sqt";
// ERROR, 'helper' is defined in 'shapes.sqt' but not exported
```

These two rules (*export to publish*, *import to consume*) are the entire
access-control model. There is no `public`/`private` keyword; `export` **is**
"public", and the absence of it **is** "private".

---

## How file paths are resolved

The path in an `import` is resolved **relative to the file that contains the
`import`**, not relative to your terminal's working directory.

```
project/
├── main.sqt          import {square} from "math/util.sqt";
└── math/
    └── util.sqt       import {PI} from "constants.sqt";   ← looks in math/
    └── constants.sqt
```

- `main.sqt` imports `"math/util.sqt"` → found at `math/util.sqt`.
- Inside `math/util.sqt`, importing `"constants.sqt"` looks in the **same
  folder as `util.sqt`** → `math/constants.sqt`.

This means you can move a whole folder of related modules around and their
internal imports keep working.

---

## A realistic multi-file example

```c
// geometry.sqt, pure data + math, no main()
export struct Point {
    int x;
    int y;
}

export int manhattan(Point a, Point b) {
    int dx = a.x - b.x;
    int dy = a.y - b.y;
    if (dx < 0) { dx = -dx; }
    if (dy < 0) { dy = -dy; }
    return dx + dy;
}
```

```c
// main.sqt, the entry point
import {Point, manhattan} from "geometry.sqt";

int main() {
    Point origin;
    origin.x = 0;
    origin.y = 0;

    Point target;
    target.x = 3;
    target.y = 4;

    print(manhattan(origin, target));   // 7
    return 0;
}
```

The module that defines `main()` is the one you run. Modules like
`geometry.sqt` are libraries: they don't need a `main()`.

---

## Diamond dependencies

What happens when two modules both import the same third module?

```
       main.sqt
       /       \
  left.sqt   right.sqt
       \       /
      base.sqt        ← imported by BOTH left and right
```

This shape is called a **diamond**. The compiler loads each module **exactly
once** and reuses it, so `base.sqt` is compiled a single time even though two
modules depend on it:

```c
// base.sqt
export int base() { return 10; }
```

```c
// left.sqt
import {base} from "base.sqt";
export int fromLeft() { return base() + 1; }
```

```c
// right.sqt
import {base} from "base.sqt";
export int fromRight() { return base() + 2; }
```

```c
// main.sqt
import {fromLeft} from "left.sqt";
import {fromRight} from "right.sqt";

int main() {
    print(fromLeft() + fromRight());   // 23  → (10+1) + (10+2)
    return 0;
}
```

---

## Circular imports are rejected

A **cycle** is different from a diamond. If module A imports B, and B imports A
(directly or through a chain), there is no valid order to load them: each needs
the other to already exist. saQut detects this and stops with a clear error
instead of looping forever:

```c
// a.sqt
import {helper} from "b.sqt";
export int foo() { return 1; }
```

```c
// b.sqt
import {foo} from "a.sqt";     // ← closes the loop
export int helper() { return 2; }
```

```
error [E_MODULE_CYCLE]: circular module dependency detected:
    a.sqt -> b.sqt -> a.sqt
```

A file importing **itself** is the smallest cycle and is caught the same way:

```c
// self.sqt
import {x} from "self.sqt";    // E_MODULE_CYCLE: self.sqt -> self.sqt
```

### Breaking a cycle

Cycles almost always mean two modules are doing too much together. The fix is
to pull the shared piece into a third module that **both** depend on, turning
a cycle into a diamond:

```
Before (cycle):   a ⇄ b
After  (diamond): a → common ← b
```

Move the functions that A and B both need into `common.sqt`, have both A and B
import from `common.sqt`, and remove the A↔B imports.

---

## Module errors at a glance

| Error | Meaning | Fix |
|-------|---------|-----|
| `E_IMPORT_NOT_EXPORTED` | You imported a name the other file didn't `export` | Add `export`, or import a name that is exported |
| `E_SYMBOL_NOT_IMPORTED` | You used another module's symbol without importing it | Add it to the `import {...}` list |
| `E_MODULE_CYCLE` | Two modules import each other (directly or in a chain) | Extract the shared code into a common module |

---

## Design notes

- **Explicit over implicit.** There is no wildcard `import *` and no ambient
  global namespace. Every cross-file name is written down once in an `import`.
- **`export` is the only visibility control.** Exported = public, everything
  else = private to its file.
- **Loaded once.** Each module compiles a single time no matter how many other
  modules depend on it (see the diamond example).
- **Deterministic.** Import resolution and cycle detection are part of the
  compiler's inspectable pipeline: the same file set always produces the same
  module graph.

## What's Next?

- Reuse logic with [functions](/functions/)
- Bundle data with [structs](/structs/)
- Explore the compiler pipeline with the [compiler tools](/compiler-tools/)
