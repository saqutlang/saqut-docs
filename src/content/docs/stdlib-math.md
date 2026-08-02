---
title: math
description: Exact signatures for saQut's capability-free math functions.
---

The `math` module is pure and requires no capability. There is no overload
resolution: integer and floating-point variants have different names.

## Exact signatures

| Function | Signature | Result |
|---|---|---|
| `abs` | `int abs(int x)` | `int` |
| `absf` | `double absf(double x)` | `double` |
| `min` | `int min(int a, int b)` | `int` |
| `max` | `int max(int a, int b)` | `int` |
| `minf` | `double minf(double a, double b)` | `double` |
| `maxf` | `double maxf(double a, double b)` | `double` |
| `sqrt` | `double sqrt(double x)` | `double` |
| `pow` | `double pow(double base, double exponent)` | `double` |
| `floor` | `double floor(double x)` | `double` |
| `ceil` | `double ceil(double x)` | `double` |
| `round` | `double round(double x)` | `double` |
| `PI` | `double PI()` | `double` |
| `E` | `double E()` | `double` |

`double` is saQut's 64-bit floating-point type. The `f` suffix in names such
as `absf` and `minf` is historical; those functions still use `double`.
`PI` and `E` are zero-argument functions, not importable constants.

```c
import { abs, absf, max, maxf, PI } from math;

int main() {
    int largest = max(10, 20);
    double precise = maxf(3.5, 2.1);
    print(abs(-42));
    print(absf(-3.14));
    print(PI());
    print(largest);
    print(precise);
    return 0;
}
```
