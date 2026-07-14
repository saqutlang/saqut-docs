---
title: if / else
description: Make decisions in your code with conditional branching.
---

Conditionals let your program make decisions. Depending on whether a condition
is `true` or `false`, different code runs.

## Basic `if`

```c
int x = 5;

if (x > 0) {
    print("positive");
}
```

If the condition in parentheses is **truthy** (any non-zero value), the block
runs. If it's **falsy** (zero), the block is skipped.

saQut uses C-style truthiness: `0` is `false`, everything else is `true`.

## `if` / `else`

```c
int x = -3;

if (x > 0) {
    print("positive");
} else {
    print("not positive");
}
```

## `if` / `else if` / `else`

Chain multiple conditions:

```c
int score = 75;

if (score >= 90) {
    print("A");
} else if (score >= 70) {
    print("B");
} else if (score >= 50) {
    print("C");
} else {
    print("F");
}
```

## Nested `if`

You can put `if` statements inside other `if` statements:

```c
int x = 10;
int y = 5;

if (x > 0) {
    if (y > 0) {
        print("both positive");
    }
}
```

## Without Braces

If the block contains a single statement, you can omit the braces:

```c
if (x > 0)
    print("positive");
else
    print("not positive");
```

Be careful, omitting braces can lead to confusing code. When in doubt, use
`{ }` explicitly.

## Common Patterns

### Guard clause (early return)

```c
int divide(int a, int b) {
    if (b == 0) {
        return 0;      // guard, exit early
    }
    return a / b;
}
```

### Null check for nullable types

```c
int? value = getMaybeValue();

if (value != null) {
    // Inside this block, 'value' is known to be non-null
    print(value);
}
```

## What Makes a Condition True?

The condition must produce a value. Any non-zero value is truthy:

```c
if (1)    { print("runs"); }     // non-zero → truthy
if (0)    { print("no run"); }   // zero → falsy
if (42)   { print("runs"); }     // non-zero → truthy
if (-1)   { print("runs"); }     // non-zero → truthy
```

Conditions with comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`)
or logical operators (`&&`, `||`, `!`) always return `true` (1) or `false` (0).

## Combining Conditions

Join conditions with `&&` (and), `||` (or), and `!` (not):

```c
int age = 25;
bool hasTicket = true;

if (age >= 18 && hasTicket) {
    print("welcome");
}

if (age < 13 || age > 65) {
    print("discounted");
}
```

`&&` and `||` **short-circuit**: they stop as soon as the answer is known.
With `&&`, if the left side is `false`, the right side is never evaluated; with
`||`, if the left side is `true`, the right side is skipped. This lets you guard
a check with the test that makes it safe:

```c
// The 'b != 0' check protects the division, evaluated left to right
if (b != 0 && a / b > 2) {
    print("ratio is large");
}
```

See [operators](/operators/#logical-operators) for the full precedence rules.

## Advanced: narrowing nullable types

A [nullable](/data-types/#nullable-types) value (`int?`, `string?`, …) can't be
used directly: the compiler refuses, because it might be `null`:

```c
int? x = getValue();
print(x + 1);        // ERROR (E003), 'x' might be null
```

An `if (x != null)` check **narrows** the type: inside the block, the compiler
knows `x` is non-null and lets you use it as a plain `int`:

```c
int? x = getValue();

if (x != null) {
    print(x + 1);    // OK, narrowed to non-null int inside this block
}
```

Narrowing also works **through `&&`**: once you've checked for null on the left,
the right side already sees the value as non-null:

```c
int? x = getValue();

if (x != null && x > 5) {   // 'x > 5' is allowed: x is known non-null here
    print("big");
}
```

This is the only way to use a nullable value: there is **no** `x!` force-unwrap
and **no** `?.` operator. The check is visible in the code, and the safety is
proven at compile time with zero runtime cost. (See
[null safety in data types](/data-types/#nullable-types).)

## The Ternary Alternative

For a simple "choose one of two values," the [ternary
operator](/operators/#ternary-operator) `?:` is a compact expression instead of
a full `if`:

```c
int x = 5;

// if / else
string label;
if (x > 0) { label = "positive"; } else { label = "non-positive"; }

// same thing as a ternary
string label2 = x > 0 ? "positive" : "non-positive";
```

Use `if` for running statements; use `?:` when you just need to pick a value.

## What's Next?

- Use [switch](/switch/) when you have many specific values to compare
- Repeat code with [for loops](/loops/for-loop/)
- Understand truthiness and casts in [data types](/data-types/)
