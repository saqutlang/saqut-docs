---
title: do-while Loop
description: Repeat code at least once, then check the condition.
---

A `do-while` loop is like a `while` loop, but the condition is checked
**after** the body runs. This guarantees the body executes **at least once**,
even if the condition is `false` from the start.

## Basic Syntax

```c
do {
    // body, runs at least once
} while (condition);
```

```c
int x = 5;
do {
    print(x);
    x = x + 1;
} while (x < 0);
// Output: 5
```

Notice: `x` starts at 5, and the condition `x < 0` is `false`.
But the body ran anyway, `5` was printed, because the check happens
at the end.

## When Would You Use This?

`do-while` is useful when you need to do something before deciding whether to
continue. For example: asking for input, processing one item, then checking if
there is more.

```c
// Process at least one item, then check if more remain
int i = 0;
do {
    print(arr[i]);
    i = i + 1;
} while (i < 5);
```

## Comparison: `while` vs `do-while`

| Situation | `while` | `do-while` |
|-----------|---------|------------|
| Condition `false` from start | Body **never** runs | Body runs **once** |
| Condition checked | Before body | After body |
| Guaranteed execution | No | Yes, at least one iteration |

```c
int x = 10;

while (x < 5) {       // condition is false → body never runs
    print("while");
}

do {
    print("do-while");  // runs once despite x < 5 being false
} while (x < 5);

// Output: "do-while"
```

## `break` and `continue`

### `break` (exit immediately)

```c
int i = 0;
do {
    if (i == 3) { break; }
    print(i);
    i = i + 1;
} while (i < 10);
// Output: 0 1 2
```

### `continue` (skip to condition check)

`continue` jumps to the condition check at the end:

```c
int i = 0;
do {
    i = i + 1;
    if (i == 3) { continue; }
    print(i);
} while (i < 5);
// Output: 1 2 4 5
```

## Truthy Conditions

saQut uses C-style truthiness: `0` is `false`, any non-zero value is `true`.

```c
int x = 5;
do {
    x = 0;
} while (x);           // x is 0 → condition is false → loop ends
```

## Real-World Example: Input Validation

```c
int value;
int attempts = 0;
do {
    // Simulate reading a value
    value = readInput();
    attempts = attempts + 1;
    if (attempts >= 3) { break; }
} while (value < 0);
```

## Advanced: process-then-check

The guaranteed first run makes `do-while` the natural fit whenever the **first
item must be handled before you can know if there's a second**, including edge
values like `0`. Printing a number's digits is a classic case: even `0` has one
digit, and only `do-while` guarantees it prints:

```c
int n = 0;
do {
    print(n % 10);      // last digit
    n = n / 10;
} while (n > 0);
// Output: 0   (a plain 'while (n > 0)' would print nothing)
```

With a `while` loop you'd have to duplicate the body once before the loop to
cover the zero case; `do-while` expresses "do it, then decide" directly.

## What's Next?

- Organize code with [functions](/functions/)
- Group data with [structs](/structs/)
