---
title: path (Paths)
description: Build and split file path strings with saQut's path module, without touching the disk.
---

The `path` module works on path strings as text. Nothing here opens a file or
asks the operating system whether a path exists: `dirname("/a/b/c.txt")`
answers `/a/b` whether or not that directory is real. For anything that touches
the disk, use [`fs`](/stdlib-fs/).

Because these are pure string operations, they give the same answer on every
run and on every machine.

```c
import { join, basename, extension } from path;
```

## `string join(string[] parts)`

Joins path segments with the platform separator, inserting exactly one between
each pair.

```c
import { join } from path;

int main() {
    string[] parts = ["usr", "local", "bin"];
    print(join(parts));      // usr/local/bin
    return 0;
}
```

`join` takes an array rather than a variable number of arguments, because
saQut has no variadic functions. Build the array first when the number of
segments is not fixed.

## `string normalize(string path)`

Resolves `.` and `..` segments textually and collapses repeated separators.

```c
normalize("/usr/local/../bin/./tool")   // /usr/bin/tool
```

This is a calculation on the string, not a resolution against the file system.
A `..` is removed along with the segment before it, even when that segment is
a symbolic link that would have led somewhere else.

## `string dirname(string path)` / `string basename(string path)`

Splits a path into the directory part and the final component.

```c
dirname("/home/saqut/report.txt")    // /home/saqut
basename("/home/saqut/report.txt")   // report.txt
```

## `string extension(string path)`

The final extension, **including the dot**.

```c
extension("/home/saqut/report.txt")   // .txt
```

## `bool isAbsolute(string path)`

Whether the path starts from the root rather than from the current directory.

```c
isAbsolute("/usr/bin")   // true
isAbsolute("usr/bin")    // false
```

## `string separator()`

The platform path separator: `/` on Linux, `\` on Windows. Use `join` where
you can and reach for `separator()` only when you are formatting a path
yourself.

## Worked example

Turning a source file name into an output file name next to it:

```c
import { dirname, basename, extension, join } from path;

string outputFor(string source) {
    string dir = dirname(source);
    string name = basename(source);
    string ext = extension(source);

    // Drop the extension from the file name.
    string stem = name.substring(0, name.length() - ext.length());

    string[] parts = [dir, stem + ".out"];
    return join(parts);
}

int main() {
    print(outputFor("/home/saqut/src/main.sqt"));   // /home/saqut/src/main.out
    return 0;
}
```

## Complete function list

| Function | Returns | Purpose |
|---|---|---|
| `join(parts)` | `string` | Join segments with the separator |
| `normalize(path)` | `string` | Resolve `.` and `..` textually |
| `dirname(path)` | `string` | The directory part |
| `basename(path)` | `string` | The final component |
| `extension(path)` | `string` | The extension, with the dot |
| `isAbsolute(path)` | `bool` | Does it start from the root |
| `separator()` | `string` | The platform separator |

There is no `absolute()` or `relative()`. Both would have to read the current
working directory, which would make them depend on outside state; the rest of
this module does not. Where you need an absolute path, combine
`process::cwd()` with `join`.
