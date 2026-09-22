---
title: utf8 (Text Encoding)
description: Convert between byte[] and string with saQut's utf8 module.
---

The `utf8` module converts between the two ways saQut represents text: a
`string`, which is a sequence of characters, and a `byte[]`, which is a
sequence of bytes.

```c
import { encode, decode } from utf8;
```

The distinction matters because files, standard input, and network data are
bytes. saQut does not guess an encoding for them. [`fs::readFile`](/stdlib-fs/)
hands you a `byte[]`, and turning that into text is a step you take
deliberately, with `decode`.

## `byte[] encode(string text)`

Encodes text as UTF-8 bytes.

```c
import { encode } from utf8;

int main() {
    byte[] data = encode("hello");
    print(data.length());     // 5
    return 0;
}
```

## `string decode(byte[] data)`

Decodes UTF-8 bytes back into text.

```c
import { encode, decode } from utf8;

int main() {
    byte[] data = encode("hello");
    print(decode(data));      // hello
    return 0;
}
```

## Characters are not bytes

For text outside ASCII, the two counts differ. saQut counts a `string` in
Unicode code points, while a `byte[]` counts bytes:

```c
import { encode } from utf8;

int main() {
    string word = "çğüş";
    print(word.length());              // 4  characters
    print(encode(word).length());      // 8  bytes
    return 0;
}
```

Each of those four characters takes two bytes in UTF-8. An emoji or a CJK
character takes more. This is why cutting a `byte[]` at an arbitrary position
can split a character in half, while `substring` on a `string` cannot.

Work in `string` when you mean text, and in `byte[]` when you mean file
contents or wire data. Convert at the boundary, once.

## Round trip

```c
import { readFile, writeFile } from fs;
import { encode, decode } from utf8;

int main() {
    writeFile("note.txt", encode("merhaba"));

    byte[] raw = readFile("note.txt");
    string text = decode(raw);

    print(text);        // merhaba
    return 0;
}
```

## Complete function list

| Function | Returns | Purpose |
|---|---|---|
| `encode(text)` | `byte[]` | Text to UTF-8 bytes |
| `decode(data)` | `string` | UTF-8 bytes to text |

Both are pure calculations: the same input always produces the same output.
