---
title: Data Types
description: Every value in saQut has a type. Here is the complete list.
---

Every piece of data in saQut has a **type**. The type determines what kind of
value a variable can hold and what operations you can perform on it.

## Primitive Types (Value Types)

These types hold their value directly. When you assign one to another, the
value is **copied**, so the two variables become independent.

### `int` (Integer)

A 32-bit signed whole number.

```c
int a = 42;
int b = -100;
int c = 0xFF;      // hexadecimal, 255
int d = 0b1010;    // binary, 10
int e = 0777;      // octal, 511
```

Range: `-2,147,483,648` to `2,147,483,647`. Overflow wraps with defined
two's-complement behavior (it does not throw). If you need a wider integer,
use `longint`.

### `longint` (64-bit Integer)

A 64-bit signed whole number, for values that do not fit in `int` (file
sizes, offsets, hashes, timestamps).

```c
longint big = 9223372036854775807;   // int64 max
longint scaled = big + 1;            // wraps to -9223372036854775808
int small = 42;
longint widened = small;             // int to longint is lossless, allowed
```

Range: `-9,223,372,036,854,775,808` to `9,223,372,036,854,775,807`.

`longint` stays out of the numeric conversion tower on purpose. Widening an
`int` to `longint` is lossless and implicit. The reverse (`longint` to `int`)
and mixing `longint` with `float`, `double`, or `decimal` require an explicit
`as` cast, because those conversions can lose data and saQut does not perform
them silently.

### `float` (32-bit Floating-Point)

A 32-bit IEEE 754 single-precision number. It carries about 7 significant
decimal digits, so results show single-precision rounding.

```c
float x = 3.14;
float y = 0.5;
float f = 0.1;
print(f + 0.2);       // 0.300000012 (single precision)
```

### `double` (64-bit Floating-Point)

A 64-bit IEEE 754 double-precision number, about 15 to 16 significant digits.
A bare decimal literal like `0.2` is a `double` by default; it becomes a
`float` only in a `float` context. Use scientific notation with `e` or `E`.

```c
double d = 0.1;
print(d + 0.2);       // 0.3
double z = 1e5;       // 100000.0
double w = 2.5e-3;    // 0.0025
```

`float` and `double` are stored at their real widths, so a `double` to `float`
cast loses precision. That conversion needs an explicit `as float`.

### `bool` (Boolean)

A logical value, either `true` or `false`. Stored internally as an `int`
(1 for `true`, 0 for `false`).

```c
bool isReady = true;
bool done = false;
```

### `byte` (Unsigned 8-bit)

A small unsigned integer between **0 and 255**.

```c
byte b = 100;
byte c = 200;
// byte d = 300;     ERROR, out of range
```

`byte` automatically promotes to `int` in arithmetic (e.g. `byte + byte` → `int`).
Use `as byte` to cast back.

```c
byte a = 200;
byte b = 100;
int sum = a + b;      // byte → int promotion
byte result = sum as byte;  // explicit cast back
```

## Type Promotion Rules

saQut does **not** perform implicit (automatic) conversions between different
types without an explicit `as` cast. This avoids silent data loss.

### Arithmetic Widening

When two numeric types are used in an arithmetic operation (`+`, `-`, `*`,
`/`, `%`, etc.), the result type is the **wider** of the two operands:

```c
int a = 5;
float b = 3.0;

// int + float → float
float result = a + b;         // 8.0 (int promoted to float)
```

The numeric ranking from narrowest to widest:

| Rank | Type |
|------|------|
| 0 | `int` |
| 1 | `float` |
| 2 | `double` |
| 3 | `decimal` |

So:
- `int + int` → `int`
- `int + float` → `float`
- `float + double` → `double`
- `byte + byte` → `int` (byte is promoted to int first)

`longint` is not in this table. It has its own rule: `longint + int` promotes
the `int` and gives `longint`, but `longint` never mixes with `float`,
`double`, or `decimal` without an explicit cast.

#### Worked examples

```c
int   a = 5;
float b = 2.0;

int   x = a + a;      // int + int   → int    → 10
float y = a + b;      // int + float → float  → 7.0
float z = b + b;      // float+float → float  → 4.0
```

The rule looks at the **operands**, not at the variable you assign into. This
leads to one gotcha worth remembering:

```c
float half = 1 / 2;   // → 0.0, NOT 0.5 !
```

Why? Both `1` and `2` are **integers**, so `1 / 2` is computed as an *integer
division* first, which truncates toward zero and gives `0`. Only **then** is
that `0` widened to `0.0` for the `float` variable. Declaring the target as
`float` does **not** change how the division itself is done.

To get `0.5`, make at least one operand a float so the whole operation happens
in float:

```c
float ok = 1.0 / 2;   // → 0.5  (one float operand promotes the other)
```

Integer division always truncates (drops the fractional part):

```c
print(10 / 3);        // 3   (not 3.333)
print(1 / 2);         // 0
print(7 % 3);         // 1   (modulo, the remainder)
```

### No Implicit Narrowing

You **cannot** assign a wider type to a narrower type without an explicit
cast:

```c
int a = 1.5;            // ERROR, float literal to int (E003)
float b = 42;           // OK, int literal in float context
int c = b;              // ERROR, float to int requires 'as'
int d = b as int;       // OK, explicit cast (truncates)
```

### Literal Context-Typing

Integer literals adapt to the expected context:

```c
float x = 1;            // OK, literal 1 becomes 1.0 in float context
```

But float literals can never silently become integers:

```c
int y = 1.5;            // ERROR, float literal in int context (E003)
```

## Compound Types (Reference Types)

These types hold a **reference** to the data. When you assign one to another,
both variables share the same underlying value. Changing one affects the other.

### `string` (Text)

An immutable sequence of UTF-8 characters.

```c
string s = "Hello, saQut!";
string empty = "";
```

`string` is a value semantically (copy-on-write), but at runtime it is a
reference type. [Learn more about strings](/strings/).

### `struct` (Group of Fields)

A custom composite type that bundles multiple values under one name.

```c
struct Point {
    int x;
    int y;
}

Point p;
p.x = 10;
p.y = 20;
```

[Learn more about structs](/structs/).

### `Type[]` (Array)

A fixed-length sequence of values of the same type.

```c
int[] numbers = [1, 2, 3, 4, 5];
string[] names = ["ali", "veli", "deli"];
```

[Learn more about arrays](/arrays/).

## Nullable Types

Any type can be made **nullable** by adding `?` after it. A nullable variable
can hold `null` in addition to its normal values.

```c
int? maybeNumber = 42;
maybeNumber = null;          // OK, it's nullable

int  normalNumber = 42;
// normalNumber = null;      ERROR, int cannot hold null
```

Nullable types are checked at compile time. You cannot use a nullable value
without first checking it is not `null`:

```c
int? x = getValue();

// print(x);                ERROR, x might be null

if (x != null) {
    print(x);                // OK, narrowed to non-null
}
```

Use the `as` operator to safely convert. If the conversion fails, it returns
`null` when the target is nullable:

```c
string s = "42";
int? n = s as int?;          // 42
if (n != null) { /* use n */ }
```

## Enum Types

An `enum` defines a set of named constants.

```c
enum Color { Red, Green, Blue }

void main() {
    Color c = Color.Green;
    print(c);                // outputs 1 (the index)
}
```

Enums work with `switch`:

```c
switch (c) {
    case Color.Red:   print(0);
    case Color.Green: print(1);
    case Color.Blue:  print(2);
}
```

## Summary Table

| Type | Category | Assignment | Default |
|------|----------|------------|---------|
| `int` | Primitive | Copy | `0` |
| `float` | Primitive | Copy | `0.0` |
| `bool` | Primitive | Copy | `false` |
| `byte` | Primitive | Copy | `0` |
| `string` | Compound | Reference | `""` |
| `struct` | Compound | Reference | Zero fields |
| `Type[]` | Compound | Reference | `null` |
| `Type?` | Nullable | Reference | `null` |

## What's Next?

- Learn how to create and use [variables](/variables/)
- See how [operators](/operators/) work with different types
