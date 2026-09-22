---
title: sys (System)
description: Random numbers, environment variables, command-line arguments, and sleep with saQut's sys module.
---

The `sys` module reaches outside the program: to the operating system's random
source, its environment, the command line, and the clock. These are the
functions whose results the compiler cannot predict, which is why they live
together in one module.

## Import

```c
import { random, randomInt, env, args, sleep } from sys;
```

## `double random()`

Returns a pseudo-random `double` in `[0.0, 1.0)`. Zero is possible, `1.0` is
not. Takes no parameters.

```c
import { random } from sys;

int main() {
    double r = random();
    print(r);     // e.g. 0.8846772796
    return 0;
}
```

The bytes come from the operating system's CSPRNG, not from C's `rand()`. That
makes the sequence unpredictable, and it also means **two runs of the same
program produce different values**. Where you need a repeatable run, do not
call `random()`.

## `int randomInt(int lo, int hi)`

A random `int` in the half-open interval `[lo, hi)`: `lo` can come back,
`hi` cannot.

```c
import { randomInt } from sys;

int main() {
    int dice = randomInt(1, 7);   // 1 through 6
    print(dice);
    return 0;
}
```

The upper bound being excluded is what makes `randomInt(0, array.length())`
always a valid index.

## `string? env(string name)`

The value of an environment variable, or `null` when it is not set. The return
type is `string?`, so the null case has to be handled before use.

```c
import { env } from sys;

int main() {
    string? home = env("HOME");
    if (home != null) {
        print(home);
    } else {
        print("HOME is not set");
    }
    return 0;
}
```

## `string[] args()`

The arguments passed to the program, in order.

```c
import { args } from sys;

int main() {
    string[] a = args();
    int i = 0;
    while (i < a.length()) {
        print(a[i]);
        print("\n");
        i = i + 1;
    }
    return 0;
}
```

Arguments intended for the program go after `--`, which separates them from
the compiler's own flags:

```bash
saqut run prog.sqt -- hello world
```

```
a[0] = "hello"
a[1] = "world"
```

`a[0]` is the **first argument**, not the program name. The array holds only
what follows `--`, so a program run with no arguments gets an empty array and
`a.length()` is `0`.

## `void sleep(int millis)`

Pauses the program for the given number of milliseconds. The parameter is an
`int`: `sleep(1500)` waits a second and a half, while `sleep(1.5)` is a
compile error, because a float literal cannot be used where an `int` is
expected.

```c
import { sleep } from sys;

int main() {
    print("waiting...\n");
    sleep(1500);
    print("done\n");
    return 0;
}
```

## Determinism

`random()`, `randomInt()`, and `env()` read state from outside the program, so
the same source can produce different output on two runs. Everything else in
saQut's standard library is a pure calculation on the values you pass in. When
a program has to be reproducible, this module is where to look first.
