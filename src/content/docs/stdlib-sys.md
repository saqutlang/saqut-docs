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

### random

Returns a random positive integer.

```c
import { random } from sys;

int main() {
    int r = random();
    print(r);     // e.g. 1634872934
    return 0;
}
```

The result comes from a general-purpose CSPRNG. For cryptographic randomness
use the planned `crypto` module.

### randomRange

Returns a random integer between `min` (inclusive) and `max` (exclusive).

```c
import { randomRange } from sys;

int main() {
    int dice = randomRange(1, 7);   // 1 to 6
    print(dice);
    return 0;
}
```

### env

Returns the value of an environment variable, or an empty string if not set.

```c
import { env } from sys;

int main() {
    string home = env("HOME");
    print(home);     // e.g. "/home/saqut"
    return 0;
}
```

### args

Returns the command-line arguments passed to the program as a string array.

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

### sleep

Pauses the program for the given number of seconds (supports fractional).

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
