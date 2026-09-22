---
title: Operators
description: Arithmetic, comparison, logical, bitwise, and assignment operators in saQut.
---

saQut provides the operators listed below. The parser uses **Pratt parsing**:
each operator has a precedence level and an associativity, so an expression
like `-2 + -5` parses to a single unambiguous tree.

## Operator Precedence Table

Higher number = evaluated first.

| Level | Category | Operators | Associativity |
|-------|----------|-----------|---------------|
| 18 | Member access / call | `.` `[ ]` `( )` | Left |
| 17 | Postfix | `++` `--` | Left |
| 16 | Unary prefix | `++` `--` `+` `-` `!` `~` | Right |
| 15 | Exponentiation | `**` | **Right** |
| 14 | Multiply / Divide / Modulo | `*` `/` `%` | Left |
| 13 | Add / Subtract | `+` `-` | Left |
| 12 | Bitwise shift | `<<` `>>` | Left |
| 11 | Relational | `<` `<=` `>` `>=` | Left |
| 10 | Equality | `==` `!=` | Left |
| 9 | Bitwise AND | `&` | Left |
| 8 | Bitwise XOR | `^` | Left |
| 7 | Bitwise OR | `\|` | Left |
| 6 | Logical AND | `&&` | Left |
| 5 | Logical OR | `\|\|` | Left |
| 2 | Assignment | `=` `+=` `-=` `*=` etc. | **Right** |

> **Right-associative:** `a = b = 5` → `a = (b = 5)`
>
> **No ternary:** saQut has no `?:` conditional operator. `?` appears only in
> type positions as the nullable marker (`int?`, `Point?`), never in expressions.
>
> **No comma operator:** `,` separates arguments, parameters, and array
> elements. It is not an expression operator; `(a, b)` is a syntax error.
>
> **Exponentiation `**`:** right-associative, so `2 ** 3 ** 2` → `2 ** (3 ** 2)` = 512.
> `^` is **not** a power operator; it is bitwise XOR (`2 ^ 3` is 1).
>
> **Left-associative:** `10 - 4 - 3` → `(10 - 4) - 3` = 3

## Arithmetic Operators

```c
int sum = 10 + 5;       // 15
int diff = 10 - 5;      // 5
int product = 10 * 5;   // 50
int quotient = 10 / 5;  // 2
int remainder = 10 % 3; // 1

int neg = -10;          // unary minus
int pos = +10;          // unary plus
```

### Exponentiation

`**` raises the left operand to the power of the right. It is
**right-associative**, so `2 ** 3 ** 2` is `2 ** (3 ** 2)` = 512, and it binds
tighter than `*`: `2 * 3 ** 2` is 18.

```c
int cube = 2 ** 3;          // 8
int big  = 3 ** 5;          // 243

double base = 2.0;
double root = base ** 0.5;  // 1.414213562
double half = base ** -1.0; // 0.5 (a negative exponent is fine here)
```

On integers the result is exact: `**` multiplies repeatedly rather than going
through floating point, so large values do not lose precision, and overflow
wraps like any other integer arithmetic. A **negative exponent on an integer**
is a runtime error (`E_POWNEG`) because the true result would be fractional.
Write `2.0 ** -1.0` if that is what you want.

`decimal` does not support `**`: its scale is fixed, so the result is not
generally representable. Cast first: `value as double ** exponent`.

`^` is bitwise XOR, not a power operator: `2 ^ 3` is `1`, not `8`.

### Increment & Decrement

Both the **postfix** (`x++`) and **prefix** (`++x`) forms exist. The side
effect is the same; they differ in the value the expression yields. Postfix
returns the value from **before** the change, prefix the one from **after**:

```c
int x = 5;
int y = x++;            // y = 5, x = 6   (old value)

int w = 5;
int v = ++w;            // v = 6, w = 6   (new value)
```

They work on every numeric type, including `float`, `double`, `longint` and
`byte`:

```c
float f = 1.5;  f++;    // 2.5
byte b = 255;   b++;    // 0 (wraps to 8 bits, like other byte arithmetic)
```

The operand must be a **writable location**. Variables, array elements and
struct fields all qualify:

```c
int[] a = [10, 20];
a[0]++;                 // a[0] = 11

Point p;
p.x++;                  // p.x = 1
```

Anything else is a compile error, so `5++` or `f()++` is rejected rather than
silently ignored. A nullable operand is rejected too; check for null first.

## Comparison Operators

All comparison operators return a `bool` (`true` or `false`).

```c
int a = 5;
int b = 10;

bool eq  = a == b;      // false
bool neq = a != b;      // true
bool lt  = a <  b;      // true
bool lte = a <= b;      // true
bool gt  = a >  b;      // false
bool gte = a >= b;      // false
```

Comparisons work on `int`, `float`, and `bool` (which is stored as `int`).
`string` supports `==` and `!=` (content comparison) but not `<`, `>`, etc.

## Logical Operators

```c
bool a = true;
bool b = false;

bool and = a && b;       // false
bool or  = a || b;       // true
bool not = !a;           // false
```

The `&&` and `||` operators are **short-circuit**: they evaluate the right
side only when necessary.

```c
int x = 0;

// Right side never runs because left is false
if (false && (x = 10)) { }
// x is still 0

// Right side never runs because left is true
if (true || (x = 20)) { }
// x is still 0
```

## Bitwise Operators

Work on `int` values, bit-by-bit.

```c
int a = 0b1100;         // 12
int b = 0b1010;         // 10

int and = a & b;        // 0b1000 = 8
int or  = a | b;        // 0b1110 = 14
int xor = a ^ b;        // 0b0110 = 6
int not = ~a;           // flips all bits

int left  = a << 2;     // 0b110000 = 48
int right = a >> 2;     // 0b0011 = 3
```

## Assignment Operators

Simple assignment:

```c
int x = 5;
```

Compound assignments combine an operation with assignment. They are
**right-associative**: `a += b += 5` → `a += (b += 5)`.

```c
int x = 10;

x += 5;     // x = 15
x -= 3;     // x = 12
x *= 2;     // x = 24
x /= 4;     // x = 6
x %= 4;     // x = 2
x &= 3;     // x = 2
x |= 8;     // x = 10
x ^= 5;     // x = 15
x <<= 1;    // x = 30
x >>= 1;    // x = 15
```

## Type Cast Operator (`as`)

The `as` operator converts between compatible types. It is infix and
left-associative.

```c
float pi = 3.14;
int n = pi as int;          // 3 (truncates toward zero)

string s = 42 as string;    // "42"

int? maybe = "3.14" as int?;  // null (conversion failed)
```

[Learn more about type casting...](/operators/#type-cast-operator-as)

## What's Next?

- See how [if-else](/if-else/) uses comparison operators
- Learn about [loops](/loops/for-loop/) for repetition
