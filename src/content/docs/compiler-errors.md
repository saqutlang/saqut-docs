---
title: Compiler Errors & Warnings
description: Every diagnostic saQut can produce, what triggers it, what it means, and how to fix it. From "undefined variable" to circular modules.
---

When saQut can't accept your program, it doesn't just say "error": it gives you
a **code** (like `E002`), a message, a source location, and usually a hint. This
page is the catalogue: every diagnostic, what triggers it, and how to fix it.

Diagnostics come in two families:

- **Errors** (`E…`) stop compilation, the program will not run.
- **Warnings** (`W…`) don't stop anything, the program still runs, but the
  compiler is flagging something suspicious.

You can see diagnostics without running the program:

```bash
saqut check myfile.sqt        # type-check and report; no execution
```

---

## How to read a diagnostic

```
myfile.sqt:3:5: error [E002]: 'a' already defined in this scope
    hint: 'a' first defined at myfile.sqt:2:5, choose a different name
```

| Part | Meaning |
|------|---------|
| `myfile.sqt:3:5` | File, line 3, column 5 |
| `error` | Severity (error or warning) |
| `[E002]` | The diagnostic code |
| `'a' already defined…` | What went wrong |
| `hint:` | A concrete suggestion for fixing it |

The code is stable: you can search for it, and future tooling (`saqut explain
E002`) will be able to expand on it.

---

## Semantic errors (E001-E011)

These are caught after parsing, while the compiler is checking names, types,
and structure.

### E001 (Undefined variable/name)

You used a name that was never declared (or misspelled it). saQut can even
suggest a correction for close misspellings.

```c
int main() {
    print(cout);      // E001, 'cout' is not defined
    return 0;
}
```

**Fix:** declare it first, or correct the spelling. (Note: calling a function
defined *later* in the file is fine (see [functions](/functions/)) because
names are collected in a first pass.)

### E002 (Duplicate definition in same scope)

You declared the same name twice in the same block.

```c
int main() {
    int a = 1;
    int a = 2;        // E002, 'a' already defined in this scope
    return 0;
}
```

**Fix:** pick a different name, or use `=` (assignment) instead of a second
declaration if you meant to *change* the value:

```c
int a = 1;
a = 2;                // OK, reassignment, not redeclaration
```

### E003 (Type mismatch)

You used a value where a different type was required, and saQut does **not**
insert hidden conversions.

```c
int y = 1.5;          // E003, float literal in an int context
string s = 42;        // E003, int is not a string
```

**Fix:** use a matching literal, or convert explicitly with
[`as`](/operators/#type-cast-operator-as):

```c
int y = 1.5 as int;   // OK, explicit cast (truncates to 1)
string s = 42 as string;   // "42"
```

### E004 (`break` / `continue` outside a loop or switch)

```c
int main() {
    break;            // E004, nothing to break out of
    return 0;
}
```

**Fix:** only use `break`/`continue` inside a `for`, `while`, `do-while`, or
(for `break`) a `switch`.

### E005 (`return` outside a function)

`return` only makes sense inside a function body.

### E006 (A path has no return / an empty return)

A non-`void` function must return a value on **every** path, and a bare
`return;` isn't allowed when a value is expected.

```c
int getValue() {
    int x = 5;        // E006, falls off the end without returning
}

int other() {
    return;           // E006, empty return, but 'int' is required
}
```

**Fix:** make sure every path ends in `return <value>;` of the declared type.

> Returning the *wrong type* (e.g. `return 1.5;` from an `int` function) is a
> type mismatch and reports [`E003`](#e003--type-mismatch) instead, E006 is
> specifically about a **missing** or **valueless** return.

### E007 (Undefined type)

You named a type that doesn't exist (often a typo or a struct you forgot to
define).

```c
Persn p;              // E007, no type called 'Persn'
```

### E008 (Function call argument mismatch)

Wrong number of arguments, or an argument of the wrong type.

```c
int add(int a, int b) { return a + b; }

int main() {
    add(1, 2, 3);     // E008, expects 2 arguments, got 3
    return 0;
}
```

### E009 (Array size is not constant / invalid)

The declared size of an array isn't a valid constant.

### E010 (Recursive / cyclic struct definition *(currently not emitted)*)

Reserved for a struct that would contain itself **by value**, needing infinite
space. Because struct fields are **reference types** today (see
[data types](/data-types/#compound-types-reference-types)), a self-referential
struct is legal and does *not* trigger E010: it's exactly how you build linked
lists and trees:

```c
struct Node {
    int  value;
    Node next;        // OK, 'next' is a reference, not an embedded copy
}
```

E010 is kept in the catalogue and will be re-activated only if by-value struct
embedding is ever added.

### E011 (Declaration inside a function body)

Structs and functions must be declared at the top level, not nested inside
another function.

```c
int main() {
    struct Point { int x; int y; }   // E011, declare structs at top level
    return 0;
}
```

**Fix:** move the `struct`/function definition out to the top of the file.

---

## Syntax errors (E901-E904)

These come from the **parser**, the code doesn't form valid saQut grammar.
When the parser hits one, it reports the error and then tries to recover
(skip to a known boundary) so it can keep finding *more* problems in one run,
instead of stopping at the first.

| Code | Meaning | Typical cause |
|------|---------|---------------|
| `E901` | Unexpected token | A stray symbol, missing `;`, unbalanced `)` |
| `E902` | Expected a type name after `as` | `x as ` with nothing after it |
| `E903` | Expected a member name | `p.` with no field after the dot |
| `E904` | Expected a variable name | A type with no name after it |

---

## Warnings (W001-W006)

Warnings never stop the build. They point at code that is legal but probably
not what you meant.

| Code | Meaning | Notes |
|------|---------|-------|
| `W001` | Unused variable | Declared but never read |
| `W002` | Division by zero in a constant expression | e.g. `10 / 0` the compiler can see |
| `W003` | Unreachable (dead) code | Statements after `return`/`break`/`continue`/`throw` |
| `W004` | Implicit numeric widening | A narrower number silently used where a wider one fits |
| `W006` | Deprecated built-in call syntax | Old method-call form; use the dot call |

`W003` is produced by the optimizer's dead-code pass, so you'll see it when
optimization runs (for example `saqut ast myfile.sqt --optimized`):

```c
int f() {
    return 1;
    int x = 2;        // W003, this code is never reached
}
```

---

## Runtime errors (catchable)

The errors above are found **before** the program runs. A second group happens
**while** it runs, but these are not crashes: they are catchable with
[`try` / `catch`](/error-handling/). Each carries a `code` you can inspect.

| Code | Meaning |
|------|---------|
| `E_OOB` | Array index out of bounds |
| `E_DIVZERO` | Division by zero at runtime |
| `E_CAST` | A failing `as` cast into a non-nullable type |
| `E_TYPE` | A type error detected at runtime (FFI backstop) |
| `E_BUILTIN` | A built-in called with an invalid argument |
| `E_DECIMAL_DIVZERO` | Decimal division by zero |
| `E_DECIMAL_OVERFLOW` | Decimal value out of range |

```c
try {
    int[] a = [1, 2, 3];
    print(a[99]);         // throws E_OOB
} catch (Error e) {
    print(e.code);        // inspect which error it was
}
```

---

## Module errors

Raised while resolving `import` / `export` across files (see
[modules](/modules/)):

| Code | Meaning |
|------|---------|
| `E_MODULE_NOT_FOUND` | The imported file path doesn't exist |
| `E_MODULE_PARSE` | The imported file has a syntax error |
| `E_MODULE_CYCLE` | Two modules import each other (a cycle) |
| `E_IMPORT_NOT_EXPORTED` | You imported a name the other file didn't `export` |
| `E_IMPORT_UNKNOWN` | The imported name doesn't exist in that file at all |
| `E_SYMBOL_NOT_IMPORTED` | You used another module's symbol without importing it |

---

## Seeing every diagnostic at once

Because the parser recovers after a syntax error and the checker keeps going
after semantic errors, a single `saqut check` run reports **as many problems as
it can find**, not just the first:

```
myfile.sqt:3:5: error [E002]: 'a' already defined in this scope
myfile.sqt:7:9: error [E001]: 'total' is not defined
myfile.sqt:9:1: warning [W001]: unused variable 'tmp'
,  2 error(s), 1 warning(s)
```

## What's Next?

- Handle runtime errors with [try / catch / throw](/error-handling/)
- Understand types and conversions in [data types](/data-types/)
- Inspect the pipeline with the [compiler tools](/compiler-tools/)
