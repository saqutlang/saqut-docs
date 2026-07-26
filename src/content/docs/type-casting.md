---
title: Type Casting (as)
description: Convert between types with the as operator, safely and explicitly.
---

saQut does not perform implicit type conversions. To turn an `int` into a
`float`, or a `string` into an `int`, you write the conversion explicitly with
the `as` operator.

## Basic conversions

```c
int   a = 42;
float b = a as float;          // 42.0
int   c = 3;                   // (int)3
float d = c as float;          // 3.0, not 3
```

The `as` operator makes the conversion explicit. There is no hidden promotion
from `int` to `float` during arithmetic: if you divide two integers, you get
integer division. If you want float division, cast one of them first.

## Numeric conversions

| From | To | Behavior |
|------|----|----------|
| `int` | `float` | Widening, always safe |
| `float` | `int` | Truncates toward zero |
| `int` | `byte` | Fail if out of 0-255 range |
| `byte` | `int` | Widening, always safe |
| `int` | `bool` | `0` becomes false, non-zero becomes true |
| `bool` | `int` | false becomes `0`, true becomes `1` |

```c
float pi = 3.99;
int   n  = pi as int;          // 3 (truncated)

byte  b  = 200;
int   i  = b as int;           // 200

int   big = 300;
// byte small = big as byte;   // runtime error: out of range
```

## String conversions

Numbers can be parsed from strings. When the conversion might fail, cast to a
**nullable** target:

```c
string s = "42";
int?   n = s as int?;          // 42
if (n != null) { print(n); }

string t = "hello";
int?   m = t as int?;          // null (not a number)
```

Floats work the same way:

```c
string s = "3.14";
float? f = s as float?;        // 3.14
```

## Converting to string

Any type can be cast to `string`:

```c
int   a = 42;
string s = a as string;        // "42"

float f = 3.14;
string t = f as string;        // "3.14"

bool  b = true;
string u = b as string;        // "true"
```

## Struct conversions

You cannot cast between different struct types. Each struct has its own layout;
there is no automatic conversion.

```c
struct Point  { int x; int y; }
struct Vector { int x; int y; }

Point p = Point(1, 2);
// Vector v = p as Vector;     // compile error
```

## Summary

- `as` is the only type conversion operator in saQut
- Int to float widens; float to int truncates
- String parsing returns `null` on failure when cast to nullable
- Any type can become `string` with `as string`
- Structs cannot be cast between each other
