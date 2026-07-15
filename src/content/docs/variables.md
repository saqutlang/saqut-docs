---
title: Variables
description: How to create, name, and use variables in saQut.
---

A **variable** is a named box that holds a value. You can put a value in it,
look at the value later, or replace it with a different value.

## Declaring a Variable

To create a variable, write the **type** followed by the **name**:

```c
int score;
```

This creates a variable called `score` that can hold whole numbers. Its initial
value is `0`.

You can also set the initial value right away using `=`:

```c
int score = 10;
float pi = 3.14;
bool isReady = true;
string name = "saQut";
```

The general form is:

```
<type> <name> [= <initial value>];
```

## Default Values

If you don't provide an initial value, the variable starts at zero:

| Type | Default Value |
|------|---------------|
| `int` | `0` |
| `float` | `0.0` |
| `bool` | `false` |
| `string` | `""` (empty) |
| `byte` | `0` |
| Any nullable type (`int?`, `string?`) | `null` |
| `struct` | All fields set to zero/default |
| `int[]` (array) | `null` (must be assigned before use) |

## Assigning a New Value

Use `=` to change a variable's value:

```c
int x = 5;
x = 10;       // x is now 10
x = x + 3;    // x is now 13
```

## Naming Rules

Names can contain:

- Letters (`a`-`z`, `A`-`Z`)
- Digits (`0`-`9`)
- Underscore (`_`)
- Dollar sign (`$`)

A name **must not** start with a digit.

```c
int age;          // valid
int _counter;     // valid
int 2ndPlace;     // INVALID, starts with a digit
int total$;       // valid
```

Names are **case-sensitive**: `score` and `Score` are two different variables.

## Scope

A variable exists only inside the block `{ }` where it was declared.

```c
int main() {
    int a = 5;       // 'a' exists from here

    if (a > 0) {
        int b = 10;  // 'b' exists only inside this if-block
        a = b;       // OK, 'a' is visible here
    }

    // b = 20;       ERROR, 'b' does not exist here

    return 0;
}
```

## Local vs Global Variables

A variable declared **inside** a function (or a block) is **local**: it exists
only there, and each call to the function gets its own fresh copy.

A variable declared at the **top level** of the file (outside every function)
is **global**. It exists for the whole program, and **any** function can read or
write it:

```c
int counter = 0;        // global, declared at top level

void increment() {
    counter = counter + 1;   // reads and writes the global
}

int main() {
    increment();
    increment();
    print(counter);          // 2
    return 0;
}
```

- **Locals** are the default; prefer them. They keep each function's data
  self-contained and easy to reason about.
- **Globals** are useful for a small amount of shared state, but because *any*
  function can change them, overusing them makes a program harder to follow.

> A dedicated page on local vs global variables and the call stack is planned.
> For now: locals live inside their function/block; globals live at the top
> level and are shared.

## Constants?

saQut does not have a `const` keyword yet. The convention is to use a
variable and not reassign it; the compiler trusts you.

## Common Mistakes

```c
int x = 5;
int x = 10;       // ERROR, 'x' already declared in this scope
```

```c
int a;
int b = a + 5;    // OK, 'a' is 0, so 'b' is 5
```

## What's Next?

- See all [data types](/data-types/) available in saQut
- Learn about [operators](/operators/) to work with values
