---
title: Nullable Types
description: How to use T? for values that might be null, with compile-time safety.
---

Not every variable always has a value. A function may fail to find something, a
lookup may return nothing, or a field may not be set yet. saQut represents the
absence of a value with **nullable types**.

## Declaring a nullable

Add `?` after any type to make it nullable:

```c
int? maybeNumber = 42;
maybeNumber = null;            // allowed

string? maybeName = "Alex";
maybeName = null;              // allowed
```

A non-nullable variable cannot hold `null`:

```c
int normalNumber = 42;
// normalNumber = null;        // compile error
```

This is checked entirely at compile time. The check adds no run-time cost, and
a non-nullable variable cannot hold `null` at any point during execution.

## Null safety: you must check first

You cannot use a nullable value directly. The compiler requires you to prove
it is not `null` before you access it:

```c
int? x = getValue();

// print(x);                   // compile error: x might be null

if (x != null) {
    print(x);                  // OK, x is narrowed to non-null here
}
```

Inside the `if (x != null)` block, the type checker **narrows** the type from
`int?` to `int`. This is called flow-sensitive typing.

## Nullable with compound types

Structs, arrays, and strings can all be nullable:

```c
struct Point { int x; int y; }

Point? maybePoint = null;
maybePoint = Point(10, 20);

if (maybePoint != null) {
    print(maybePoint.x);       // OK
}

int[]? maybeList = null;
string? maybeText = null;
```

## Nullable in function returns

A function that might not produce a result should return a nullable type:

```c
int? findIndex(int[] arr, int target) {
    for (int i = 0; i < arr.length; i = i + 1) {
        if (arr[i] == target) {
            return i;
        }
    }
    return null;               // not found
}
```

The caller then checks the result:

```c
int[] numbers = [10, 20, 30];
int? pos = findIndex(numbers, 20);

if (pos != null) {
    print(pos);                // 1
} else {
    print("not found");
}
```

## Default value

A nullable variable declared without an initial value defaults to `null`:

```c
int? x;                        // x is null
string? s;                     // s is null
```

## Summary

- `T?` means the value may be null
- The type checker rejects any use of a nullable value that is not checked first
- `if (x != null)` narrows the type to non-null inside the block
- No run-time overhead; all checks happen at compile time
- Functions that may not produce a result return `T?`
