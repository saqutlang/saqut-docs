---
title: Error Handling (try / catch / throw)
description: Catch and handle runtime errors in your code.
---

saQut supports **unchecked** error handling with `try`, `catch`, and `throw`.
Errors are struct-based values that you can inspect and handle.

## Basic `try` / `catch`

Wrap code that might fail in a `try` block. If an error occurs, execution
jumps to the `catch` block:

```c
try {
    int[] arr = [1, 2, 3];
    print(arr[99]);          // out-of-bounds → error
} catch (Error e) {
    print("caught an error");
}
```

## The `Error` Struct

A caught error gives you an `Error` value with fields:

- `e.code`, numeric error code
- `e.message`, human-readable description (string)
- `e.trace`, stack trace information
- `e.line`, line where the error occurred

```c
try {
    int[] arr = [1];
    int x = arr[5];           // out of bounds
} catch (Error e) {
    print(e.code);            // numeric code for OOB
    print(e.message);         // description
}
```

## Common Runtime Errors

These operations can throw errors at runtime:

| Situation | Example | Error |
|-----------|---------|-------|
| Array index out of bounds | `arr[999]` on a 3-element array | OOB error |
| Division by zero | `x = 10 / 0` | Division by zero |
| Null dereference | accessing a null object's field | Null error |
| Failed cast | `"abc" as int` (non-nullable target) | Cast error |

```c
int main() {
    // Division by zero
    try {
        int x = 10 / 0;
    } catch (Error e) {
        print(e.code);
    }

    // Out of bounds
    try {
        int[] a = [1];
        int bad = a[5];
    } catch (Error e) {
        print(e.code);
    }

    // Failed cast
    try {
        int n = "abc" as int;
    } catch (Error e) {
        print(e.code);
    }

    return 0;
}
```

## `throw`

You can throw your own errors:

```c
void check(int value) {
    if (value < 0) {
        throw "negative value not allowed";
    }
}

int main() {
    try {
        check(-5);
    } catch (Error e) {
        print(e.message);     // "negative value not allowed"
    }
    return 0;
}
```

## Error Propagation

Errors bubble up through function calls. If a function doesn't catch an error,
it propagates to the caller:

```c
void level3() {
    int[] arr = [1, 2, 3];
    int bad = arr[99];        // error here
}

void level2() {
    level3();                 // error propagates through here
}

int main() {
    try {
        level2();             // caught here
    } catch (Error e) {
        print(1);             // reached
    }
    return 0;
}
```

## Errors in `switch`

You can switch on `e.code`:

```c
try {
    int[] arr = [1];
    int x = arr[10];
} catch (Error e) {
    switch (e.code) {
        case 1:  print("index out of bounds");
        case 2:  print("division by zero");
        default: print("unknown error");
    }
}
```

## Important Notes

- saQut uses **unchecked** errors (like Java/C# runtime exceptions).
  Functions are not marked with `throws`, the developer decides where
  to catch
- Runtime errors (null deref, OOB, division by zero) are catchable,
  they don't crash the program
- `throw` accepts a string message, which becomes `e.message`
- There is no `finally` block yet (planned: `defer` in the future)

## What's Next?

- Learn about the [compiler tools](/compiler-tools/), how to inspect
  tokens, AST, symbols, and IR
