---
title: math (Mathematical Functions)
description: Constants, trigonometric functions, and number utilities in saQut's math module.
---

The `math` module provides mathematical constants and functions. It does not
require any capability; pure computation only.

## Import

```c
import { E, PI, sqrt, abs, min, max, floor, ceil, round, pow, sin, cos } from math;
```

## Constants

| Constant | Value |
|---|---|
| `E` | 2.7182818284 |
| `PI` | 3.1415926535 |

```c
import { PI } from math;

int main() {
    print(PI);                    // 3.141593
    float area = PI * 5 * 5;     // circle area, radius 5
    print(area);
    return 0;
}
```

## Functions

### sqrt

Square root.

```c
import { sqrt } from math;

int main() {
    print(sqrt(25));    // 5.0
    return 0;
}
```

### abs

Absolute value. Works for `int` and `float`.

```c
import { abs } from math;

int main() {
    print(abs(-42));       // 42
    print(abs(-3.14));     // 3.14
    return 0;
}
```

### min / max

Returns the smaller or larger of two numbers.

```c
import { min, max } from math;

int main() {
    print(min(10, 20));    // 10
    print(max(3.5, 2.1));  // 3.5
    return 0;
}
```

### floor / ceil / round

Round a float to the nearest integer.

```c
import { floor, ceil, round } from math;

int main() {
    print(floor(3.9));    // 3
    print(ceil(3.1));     // 4
    print(round(3.5));    // 4
    return 0;
}
```

### pow

Returns `base` raised to the power of `exponent`. Both arguments are `float`.

```c
import { pow } from math;

int main() {
    print(pow(3, 4));     // 81.0
    return 0;
}
```

### sin / cos

Sine and cosine. Input is in radians.

```c
import { sin, cos, PI } from math;

int main() {
    print(sin(PI / 2));   // ~1.0
    print(cos(PI));        // ~-1.0
    return 0;
}
```
