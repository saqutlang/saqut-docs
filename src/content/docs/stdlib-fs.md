---
title: fs (File System)
description: Read, write, copy, and list files and directories with saQut's fs module.
---

The `fs` module reads and writes files and directories. Every function is
imported by name:

```c
import { readFile, writeFile, existsFile } from fs;
```

File contents are `byte[]`, not `string`. saQut does not guess a text encoding
for you: a file is a sequence of bytes, and you decide how to interpret it. To
convert, use the [`utf8`](/stdlib-utf8/) module.

```c
import { readFile, writeFile } from fs;
import { encode, decode } from utf8;

int main() {
    writeFile("note.txt", encode("hello"));
    byte[] raw = readFile("note.txt");
    print(decode(raw));
    return 0;
}
```

There are no file handles. Each call opens the file, does its work, and closes
it. This keeps every operation a single observable step, which is what makes
record and replay of a program's file activity possible.

## Reading

### `byte[] readFile(string path, int? seek, int? size)`

Reads a file and returns its bytes. `seek` and `size` are optional: pass
neither to read the whole file, or pass both to read a window of it.

```c
import { readFile } from fs;
import { decode } from utf8;

int main() {
    byte[] all = readFile("data.txt");           // whole file
    byte[] part = readFile("data.txt", 3, 4);    // 4 bytes, starting at byte 3
    print(decode(part));
    return 0;
}
```

If the file does not exist, `readFile` raises a catchable error. Either check
with `existsFile` first or wrap the call in `try` / `catch`.

### `longint fileSize(string path)`

Size in bytes. Returns `longint` because a file can be larger than `int`
holds.

### `bool existsFile(string path)`

`true` if something exists at that path, file or directory.

### `bool isFile(string path)` / `bool isDirectory(string path)`

Distinguishes the two. Use these when the difference matters, since
`existsFile` answers `true` for both.

### `bool isEmpty(string path)`

`true` for a zero-byte file, or for a directory with no entries.

## Writing

### `void writeFile(string path, byte[] data)`

Writes bytes, creating the file if needed and replacing its contents if it
already exists.

### `void appendFile(string path, byte[] data)`

Adds bytes to the end, leaving what is already there untouched.

```c
import { writeFile, appendFile } from fs;
import { encode } from utf8;

int main() {
    writeFile("log.txt", encode("first line\n"));
    appendFile("log.txt", encode("second line\n"));
    return 0;
}
```

### `void createFile(string path)`

Creates an empty file.

### `void copyFile(string src, string dst)`

Copies a file to a new path.

### `void renameFile(string from, string to)`

Renames a file, which also moves it when the target is in another directory.

### `void removeFile(string path)`

Deletes a file. Raises an error if the path does not exist or is a directory;
use `removeDirectory` for directories.

## Directories

### `string[] list(string path)`

Entry names in one directory, sorted. Names only, not full paths, and it does
not descend into subdirectories.

```c
import { list } from fs;

int main() {
    string[] entries = list(".");
    int i = 0;
    while (i < entries.length()) {
        print(entries[i]);
        print("\n");
        i = i + 1;
    }
    return 0;
}
```

### `string[] walk(string path)`

Every entry underneath a directory, recursively, as full paths. Where `list`
answers "what is in this directory", `walk` answers "everything under this
tree".

### `void createDirectory(string path)` / `void removeDirectory(string path)`

Creates or deletes a directory.

### `longint modifiedTime(string path)`

Last modification time as a Unix timestamp in milliseconds. Pass it to
`date::fromEpochMillis()` to get a `date` value.

```c
import { modifiedTime } from fs;
import { fromEpochMillis, format } from date;

int main() {
    date changed = fromEpochMillis(modifiedTime("report.txt"));
    print(format(changed, "yyyy-MM-dd"));
    return 0;
}
```

## Errors

File operations fail for reasons your program cannot rule out in advance: the
file disappears between the check and the read, the permission is missing, the
disk is full. These raise catchable errors rather than terminating the
program.

```c
import { readFile } from fs;
import { decode } from utf8;

int main() {
    try {
        byte[] data = readFile("maybe-missing.txt");
        print(decode(data));
    } catch (Error e) {
        print("could not read the file");
    }
    return 0;
}
```

Checking with `existsFile` first narrows the window but does not close it: the
file can still be removed between the two calls. For code that must not fail,
handle the error rather than relying on the check.

## Complete function list

| Function | Returns | Purpose |
|---|---|---|
| `readFile(path, seek, size)` | `byte[]` | Read a whole file or a window of it |
| `writeFile(path, data)` | `void` | Write, replacing existing contents |
| `appendFile(path, data)` | `void` | Add to the end |
| `createFile(path)` | `void` | Create an empty file |
| `copyFile(src, dst)` | `void` | Copy |
| `renameFile(from, to)` | `void` | Rename or move |
| `removeFile(path)` | `void` | Delete a file |
| `existsFile(path)` | `bool` | Does the path exist |
| `isFile(path)` | `bool` | Is it a file |
| `isDirectory(path)` | `bool` | Is it a directory |
| `isEmpty(path)` | `bool` | Empty file or empty directory |
| `fileSize(path)` | `longint` | Size in bytes |
| `modifiedTime(path)` | `longint` | Modification time, epoch ms |
| `list(path)` | `string[]` | Entry names in one directory |
| `walk(path)` | `string[]` | Full paths, recursive |
| `createDirectory(path)` | `void` | Create a directory |
| `removeDirectory(path)` | `void` | Delete a directory |

## See also

- [`path`](/stdlib-path/) builds and splits path strings without touching the disk.
- [`utf8`](/stdlib-utf8/) converts between `byte[]` and `string`.
