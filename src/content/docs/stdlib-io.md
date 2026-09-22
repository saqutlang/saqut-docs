---
title: stdin / stdout / stderr
description: Read standard input and write to standard output and standard error in saQut.
---

Three small modules connect a program to the streams it was started with, so
it can take input from a pipe and split its output from its diagnostics.

```c
import { readLine, readAll, readBytes } from stdin;
import { write, writeBytes } from stdout;
```

Both `stdout` and `stderr` export `write` and `writeBytes`. Importing the same
name from both in one file is a collision, so rename one with `as`:

```c
import { write } from stdout;
import { write as writeError } from stderr;
```

## Reading

### `string? readLine()`

Reads one line, without its newline. Returns `null` at end of input, which is
how a loop knows to stop.

The return type is `string?`, and a null check in a `while` condition does not
narrow the type inside the loop body. Read inside the loop and break on null:

```c
import { readLine } from stdin;
import { write } from stdout;

int main() {
    while (true) {
        string? line = readLine();
        if (line == null) {
            break;
        }
        write("> ");
        write(line);
        write("\n");
    }
    return 0;
}
```

```bash
printf "one\ntwo\n" | saqut run echo.sqt
```

```
> one
> two
```

### `string readAll()`

Reads all of standard input as one string. Convenient for small inputs;
remember that it holds the entire input in memory at once.

### `byte[] readBytes()`

Reads all of standard input as raw bytes, for binary data that is not text.
Use [`utf8::decode`](/stdlib-utf8/) if you decide to treat it as text after
all.

## Writing

### `void write(string text)`

Writes text to the stream, with no trailing newline. Unlike `print()`, it adds
nothing: write `"\n"` yourself when you want a line break.

### `void writeBytes(byte[] data)`

Writes raw bytes, for output that is not text.

## Which stream to use

Standard output carries the program's result; standard error carries messages
about the run. The split is what lets a caller redirect one and still see the
other:

```bash
saqut run report.sqt > result.txt     # result saved, errors still on screen
```

```c
import { write } from stdout;
import { write as writeError } from stderr;

int main() {
    writeError("reading input...\n");   // progress, not part of the result
    write("42\n");                      // the result
    return 0;
}
```

Sending a progress message to standard output would put it in `result.txt`,
mixed in with the data.

## Complete function list

| Module | Function | Returns | Purpose |
|---|---|---|---|
| `stdin` | `readLine()` | `string?` | One line, or `null` at end of input |
| `stdin` | `readAll()` | `string` | All input as text |
| `stdin` | `readBytes()` | `byte[]` | All input as raw bytes |
| `stdout` | `write(text)` | `void` | Write text, no newline added |
| `stdout` | `writeBytes(data)` | `void` | Write raw bytes |
| `stderr` | `write(text)` | `void` | Write text to standard error |
| `stderr` | `writeBytes(data)` | `void` | Write raw bytes to standard error |

Reading from standard input depends on what was piped in, so a program that
reads it is not reproducible on its own; the same program with the same input
file is.
