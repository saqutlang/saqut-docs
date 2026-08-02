---
title: sys (System)
description: Random numbers, environment variables, command-line arguments, and sleep with saQut's sys module.
---

The `sys` module provides access to system-level features. All functions
require `--allow sys` at runtime.

## Import

```c
import { random, randomRange, env, args, sleep } from sys;
```

## Functions

### `float random()`

Returns a pseudo-random `float` in the interval `[0.0, 1.0)`: zero can be
returned, but `1.0` cannot. This function does not accept parameters.

```c
import { random } from sys;

int main() {
    float r = random();
    print(r);     // e.g. 1634872934
    return 0;
}
```

The result comes from a general-purpose CSPRNG. For cryptographic randomness
use the planned `crypto` module.

### `int randomInt(int min, int max)`

Returns a random 32-bit `int` in the half-open interval `[min, max)`. `min` is
included and `max` is excluded; `min` must be smaller than `max`.

```c
import { randomRange } from sys;

int main() {
    int dice = randomRange(1, 7);   // 1 to 6
    print(dice);
    return 0;
}
```

### `string? env(string name)`

Returns the value of the environment variable named by `name`. Returns `null`
when the variable does not exist.

```c
import { env } from sys;

int main() {
    string home = env("HOME");
    print(home);     // e.g. "/home/saqut"
    return 0;
}
```

### `string[] args()`

Returns the command-line arguments passed to the program as a `string[]`. This
function has no parameters.

```c
import { args } from sys;

int main() {
    string[] a = args();
    for (int i = 0; i < a.length; i = i + 1) {
        print(a[i]);
    }
    return 0;
}
```

The first element (`a[0]`) is the program name; following elements are the
arguments.

```bash
saqut run --allow sys prog.sqt hello world
# a[0] = "prog.sqt"
# a[1] = "hello"
# a[2] = "world"
```

### `void sleep(int millis)`

Pauses the program for `millis` milliseconds. The parameter is an `int` and
fractional seconds are not accepted.

```c
import { sleep } from sys;

int main() {
    print("waiting...");
    sleep(1.5);
    print("done");
    return 0;
}
```

## Run with sys access

```bash
saqut run --allow sys program.sqt
```
