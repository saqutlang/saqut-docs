---
title: os / terminal (Environment)
description: Read the platform, architecture, host name, CPU count, and whether output is a terminal.
---

These two modules answer questions about the machine the program is running
on. They read only; nothing here changes the system.

```c
import { osName, osArch, osHostname, osUser, osCpuCount } from os;
import { isTTY } from terminal;
```

## os

| Function | Returns | Example |
|---|---|---|
| `osName()` | `string` | `linux`, `windows` |
| `osArch()` | `string` | `x86_64` |
| `osHostname()` | `string` | The machine's network name |
| `osUser()` | `string?` | The current user, or `null` if unavailable |
| `osCpuCount()` | `int` | Number of logical processors |

```c
import { osName, osArch, osCpuCount } from os;

int main() {
    print(osName());        // linux
    print("\n");
    print(osArch());        // x86_64
    print("\n");
    print(osCpuCount());    // 8
    print("\n");
    return 0;
}
```

`osUser()` returns `string?` because the current user is not always
determinable; check for `null` before using it.

These are diagnostic values. Use them to report an environment or to size a
piece of work, not to decide whether a feature exists: asking whether a file
is present tells you more than inferring it from the platform name.

## terminal

### `bool isTTY()`

Whether standard output is connected to a real terminal. `false` when output
is redirected to a file or piped into another program.

```c
import { isTTY } from terminal;

int main() {
    if (isTTY()) {
        print("=== Report ===\n");   // a person is reading
    } else {
        print("report\n");           // something is parsing
    }
    return 0;
}
```

This is the check that decides whether to decorate output. The compiler makes
the same decision for its own: `saqut ir` prints color on a terminal and plain
text when redirected, so piped output stays clean.

To emit an ANSI color code you have to build the escape byte yourself, since
string literals support only `\n`, `\t`, `\r`, `\b`, `\\`, and `\"`. There is
no `\x1b` or `\u001b`:

```c
import { decode } from utf8;

string escape() {
    byte[] esc = [27 as byte];      // ESC, decimal 27
    return decode(esc);
}
```

## Reproducibility

Every function on this page reports something about the environment, so the
same program prints different values on a different machine, or when its
output is redirected. Keep them out of code whose result has to be identical
everywhere.
