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
| 16 | Unary prefix | `+` `-` `!` `~` | Right |
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
> **No exponentiation operator:** there is no `**` or `^` power operator. Use
> `pow()` from the `math` module. `^` is bitwise XOR.
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

saQut has no exponentiation operator. Use `pow()` from the `math` module,
which takes and returns `double`:

```c
import { pow } from math;

int main() {
    double cube = pow(2.0, 3.0);     // 8.0
    int nine = pow(2.0, 9.0) as int; // 512
    return 0;
}
```

`^` is bitwise XOR, not a power operator: `2 ^ 3` is `1`, not `8`.

### Increment & Decrement

Only the **postfix** forms exist:

```c
int x = 5;
x++;                    // x = 6
x--;                    // x = 5
```

Used as an expression, postfix returns the value from **before** the change:

```c
int x = 5;
int y = x++;            // y = 5, x = 6
```

There is no prefix `++x` or `--x`. Where you would reach for one, write
`x = x + 1` as its own statement.

> `++` and `--` are currently reliable only on integer variables; on a
> floating-point variable they do not produce the expected result
> ([#238](https://github.com/saqutlang/saqut/issues/238)). Use `f = f + 1.0;`
> for those.

> Note: `++` and `--` work on `int` and `float` types. They are statements,
> not just expressions: you cannot write `foo(x++)` yet.

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
