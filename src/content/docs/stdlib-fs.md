---
title: fs (File System)
description: Read, write, and list files with saQut's fs module.
---

The `fs` module lets your program interact with the file system. All functions
require `--allow fs` at runtime.

## Import

```c
import { readFile, writeFile, readDir, exists, remove } from fs;
```

## Functions

### readFile

Reads the entire contents of a file and returns it as a string.

```c
import { readFile } from fs;

int main() {
    string content = readFile("data.txt");
    print(content);
    return 0;
}
```

If the file does not exist, `readFile` throws a catchable error. Wrap it in
`try`/`catch` or check with `exists` first.

### writeFile

Writes a string to a file. Creates the file if it does not exist; overwrites
it if it does.

```c
import { writeFile } from fs;

int main() {
    writeFile("output.txt", "Hello, saQut!");
    return 0;
}
```

### readDir

Returns an array of entry names in a directory.

```c
import { readDir } from fs;

int main() {
    string[] entries = readDir(".");
    for (int i = 0; i < entries.length; i = i + 1) {
        print(entries[i]);
    }
    return 0;
}
```

### exists

Returns `true` if a file or directory exists at the given path.

```c
import { exists } from fs;

int main() {
    if (exists("config.txt")) {
        string c = readFile("config.txt");
        print(c);
    } else {
        print("no config found");
    }
    return 0;
}
```

### remove

Deletes a file. Throws if the path does not exist or is a directory.

```c
import { remove } from fs;

int main() {
    remove("temp.txt");
    return 0;
}
```

## Run with fs access

```bash
saqut run --allow fs program.sqt
```
