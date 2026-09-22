---
title: process (Process Control)
description: Exit codes, the working directory, and the process id with saQut's process module.
---

The `process` module covers the program's own execution: how it ends, where it
is running, and which process it is.

```c
import { exit, cwd, pid, chdir } from process;
```

## `void exit(int code)`

Ends the program immediately with the given exit code. Code `0` means success;
anything else signals failure to whatever started the program.

```c
import { exit } from process;
import { existsFile } from fs;

int main() {
    if (!existsFile("config.txt")) {
        print("config.txt is missing\n");
        exit(1);
    }

    print("running\n");
    return 0;
}
```

`exit` does not return, so nothing after it in the function runs. Returning a
value from `main` does the same thing in the ordinary case; reach for `exit`
when you need to stop from somewhere deeper than `main` without threading a
failure value back up through every caller.

## `string cwd()`

The current working directory as an absolute path. This is the directory the
program was started from, which is what relative paths in `fs` calls resolve
against.

```c
import { cwd } from process;

int main() {
    print(cwd());     // e.g. /home/saqut/project
    return 0;
}
```

## `void chdir(string path)`

Changes the working directory. Every relative path used afterwards resolves
against the new location.

```c
import { cwd, chdir } from process;

int main() {
    chdir("/tmp");
    print(cwd());     // /tmp
    return 0;
}
```

This changes state that the rest of the program depends on, including any
`fs` call that uses a relative path. Where a program does more than one thing,
absolute paths are easier to follow than a working directory that moves.

## `int pid()`

The operating system's process id for this run. Useful for a log line or a
lock file name that has to differ between concurrent runs.

## Complete function list

| Function | Returns | Purpose |
|---|---|---|
| `exit(code)` | `void` | End the program with an exit code |
| `cwd()` | `string` | The current working directory |
| `chdir(path)` | `void` | Change the working directory |
| `pid()` | `int` | This process's id |

`cwd()` and `pid()` read state from outside the program, so their results are
not reproducible between runs or between machines.
