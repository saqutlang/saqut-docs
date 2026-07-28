---
title: switch / case
description: Compare one value against many cases, with automatic break, no fall-through, and support for int, float, bool, string, and enum.
---

When you need to compare one value against many possible options, `switch` is
cleaner than a long chain of `if / else if`.

## Basic Usage

```c
int x = 2;

switch (x) {
    case 1:
        print("one");
    case 2:
        print("two");
    case 3:
        print("three");
    default:
        print("something else");
}
// Output: two
```

The switch runs the statements of the **one** matching case and then exits.
Only `two` is printed.

## No fall-through (cases break automatically)

This is the most important rule, and it's the opposite of C and Java: **saQut
does not fall through.** After the matching case runs, the switch ends on its
own. You do **not** write `break` to separate cases.

```c
int x = 1;
switch (x) {
    case 1:
        print("one");     // runs
    case 2:
        print("two");     // does NOT run
    default:
        print("other");   // does NOT run
}
// Output: one
```

In a C-style language this would print `one two other`. In saQut it prints only
`one`. Each case is self-contained. The tradeoff is that sharing a body across
values is explicit rather than implicit; the next section shows how.

## Multiple statements per case (no braces needed)

A case can contain as many statements as you like, written directly after the
colon. They all belong to that case:

```c
switch (x) {
    case 2:
        print("two");
        print("still two");   // same case, both run
    default:
        print("other");
}
```

## Sharing one body across values

Because there's no fall-through, you share a body by **listing the values** on
one case, separated by commas:

```c
switch (x) {
    case 1, 2, 3:
        print("small");
    case 4, 5, 6:
        print("medium");
    default:
        print("large");
}
```

`case 1, 2, 3:` runs if `x` is any of 1, 2, or 3. This is the deliberate,
explicit replacement for C's "stack the cases and fall through" trick.

## `default`

`default` runs when no other case matches. It is **optional**: if you omit it
and nothing matches, the switch does nothing:

```c
switch (color) {
    case 0:
        print("red");
    case 1:
        print("green");
    default:
        print("unknown color");
}
```

## Supported types

`switch` works with more than integers:

| Type | Notes |
|------|-------|
| `int` | Whole numbers |
| `float` | Allowed; a literal that can't be represented exactly (e.g. `case 0.1:`) raises a warning |
| `bool` | `true` / `false` |
| `string` | Compared by **content** |
| `enum` | Named constants like `Color.Red` |

```c
// String switch, matched by content
string cmd = "stop";
switch (cmd) {
    case "start":
        print("beginning");
    case "stop":
        print("halting");   // this runs
    default:
        print("unknown command");
}

// Enum switch
enum Color { Red, Green, Blue }
Color c = Color.Green;
switch (c) {
    case Color.Red:   print(0);
    case Color.Green: print(1);   // this runs
    case Color.Blue:  print(2);
}

// Float switch
float v = 1.5;
switch (v) {
    case 1.0: print(1);
    case 1.5: print(2);   // this runs
    default:  print(0);
}
```

Cases must be the **same type** as the switch value: you can't mix `case 1:`
and `case "x":` in one switch. `struct` and `array` values are not switchable.

## `break` (leaving a case early)

Since cases break automatically, you rarely need `break`. But you *can* use it
to exit a case **before** its remaining statements, a guard inside the body:

```c
switch (x) {
    case 1:
        print("checking");
        if (someCondition) {
            break;              // leave the switch now
        }
        print("passed the guard");
    default:
        print("other");
}
```

Anything after a `break` in the same case is unreachable:

```c
case 1:
    print("a");
    break;
    print("never runs");   // unreachable
```

### `break` inside a loop's switch

If a `switch` sits inside a loop, `break` exits the **switch**, not the loop,
the loop keeps going:

```c
for (int i = 0; i < 3; i = i + 1) {
    switch (i) {
        case 1: break;          // leaves the switch only
        default: print(i);
    }
    print("loop-end");          // still runs every iteration
}
// Output: 0, loop-end, loop-end, 2, loop-end
```

## Switching on nullable types

You can switch on a nullable value and match `null` directly with `case null`:

```c
int? value = getValue();
switch (value) {
    case null:
        print("no value");
    case 1:
        print("one");
    default:
        print("other");
}
```

This lets you branch on the missing case alongside the value cases in one
statement.

## `switch` vs `if / else if`

| Reach for `switch` when… | Reach for `if / else if` when… |
|--------------------------|--------------------------------|
| Comparing one value against many fixed options | Conditions are ranges or complex booleans |
| The options are discrete (`1`, `"stop"`, `Color.Red`) | You need `<`, `>`, `&&`, `||` |
| You want each case self-contained | Branches share fall-through-style logic |

## What's Next?

- Branch on conditions with [if / else](/if-else/)
- Repeat code with [for loops](/loops/for-loop/)
- Handle the `null` case safely via [data types](/data-types/#nullable-types)
