---
title: Functions
description: Define, call, and return values from functions.
---

A **function** is a reusable block of code. You give it a name, optionally
pass data in, and optionally get data back.

## Defining a Function

```c
returnType functionName(parameterType parameterName, ...) {
    // body
    return value;
}
```

```c
int add(int a, int b) {
    return a + b;
}
```

- The **return type** (`int`, `float`, `bool`, `string`, `void`, etc.) is
  required and comes first
- The **name** follows
- **Parameters** go in parentheses, each with a type and a name
- The **body** goes in `{ }`
- `return` sends a value back to the caller

## `void` Functions

If a function doesn't return anything, use `void`:

```c
void greet(string name) {
    print("Hello");
    print(name);
    // no return needed
}
```

## Calling a Function

```c
int main() {
    int result = add(3, 4);
    print(result);          // 7

    greet("saQut");         // "Hello" "saQut"
    return 0;
}
```

## Parameters Are Local Copies

For primitive types (`int`, `float`, `bool`, `byte`), the function gets a
**copy** of the value. Changing it inside the function does not affect the
caller:

```c
void change(int x) {
    x = 100;            // only changes the local copy
}

int main() {
    int a = 5;
    change(a);
    print(a);           // 5, unchanged
    return 0;
}
```

For compound types (`struct`, `array`, `string`), the function gets a
**reference**: changing the contents affects the caller's data.

## Multiple Parameters

Separate parameters with commas:

```c
int multiply(int a, int b, int c) {
    return a * b * c;
}

int main() {
    print(multiply(2, 3, 4));   // 24
    return 0;
}
```

## `return` Early

You can return from anywhere in the function:

```c
int divide(int a, int b) {
    if (b == 0) {
        return 0;               // early return, guard clause
    }
    return a / b;
}
```

## Recursion

A function can call itself:

```c
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    print(factorial(5));        // 120
    return 0;
}
```

### Tower of Hanoi

```c
void hanoi(int n, int from, int to, int aux) {
    if (n == 0) { return; }
    hanoi(n - 1, from, aux, to);
    print(from);
    print(to);
    hanoi(n - 1, aux, to, from);
}

int main() {
    hanoi(3, 1, 3, 2);
    return 0;
}
```

## The `main()` Function

Every program starts at `main()`. It must exist and returns an `int`:

```c
int main() {
    // your code
    return 0;
}
```

Returning `0` usually means success. Non-zero values indicate an error.

## Passing Compound Types by Reference

The "local copy" rule above applies to **primitives**. Compound types
(`struct`, `array`, `string`) are passed **by reference**: the function
receives the same underlying data, so changes it makes are visible to the
caller:

```c
void fill(int[] a) {
    a[0] = 99;          // modifies the caller's array
}

int main() {
    int[] x = [1, 2, 3];
    fill(x);
    print(x[0]);        // 99, the change stuck
    return 0;
}
```

The same is true for structs: a function that sets a field changes the
caller's struct. (See [reference semantics](/structs/#reference-semantics).)
This is efficient (no copying) but means a function *can* mutate what you pass
it. If you don't want that, the function should avoid writing to its parameter.

## Returning Compound Types

When a function returns a **struct**, the caller receives a reference to the
returned value:

```c
struct Point { int x; int y; }

Point origin() {
    Point p;
    p.x = 0;
    p.y = 0;
    return p;
}
```

> **Limitation: array return types aren't supported.** You currently cannot
> write `int[] makeList() { ... }`: an array return type does not parse. The
> workaround is to wrap the array in a struct and return that:
>
> ```c
> struct IntList { int[] items; }
>
> IntList range() {
>     IntList r;
>     r.items = [1, 2, 3];
>     return r;
> }
> ```
>
> Alternatively, take the array as a reference parameter and fill it in place
> (see the `fill` example above).

## Limitations to Know

- **No overloading.** A function name refers to a single function; you can't
  define two functions with the same name but different parameters.
- **No default parameter values.** Every parameter must be passed explicitly;
  the argument count must match (or you get [`E008`](/compiler-errors/#e008--function-call-argument-mismatch)).
- **No nested functions.** Functions are declared at the top level, never
  inside another function's body (that's [`E011`](/compiler-errors/#e011--declaration-inside-a-function-body)).
- **Deep recursion uses the call stack.** Each call adds a frame; extremely deep
  recursion can exhaust the stack, so prefer an iterative version for very large
  inputs.

## Common Mistakes

### Wrong argument count

```c
int add(int a, int b) { return a + b; }

int main() {
    add(1, 2, 3);       // ERROR, 3 arguments, function expects 2
    return 0;
}
```

### Wrong return type

```c
int getValue() {
    return 1.5;         // ERROR, returning float, declared as int
}
```

### Missing function definition

```c
int main() {
    foo();              // ERROR, 'foo' is not defined
    return 0;
}
```

(But forward references work if the function is defined later in the same
file, thanks to the two-pass symbol collector.)

## What's Next?

- Group related data with [structs](/structs/)
- Use [arrays](/arrays/) to store sequences
