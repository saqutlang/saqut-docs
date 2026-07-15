---
title: Strings
description: Working with text in saQut using immutable UTF-8 strings.
---

A **string** is a sequence of UTF-8 characters. Strings in saQut are
**immutable value types**: operations like concatenation create a new string
without modifying the original.

## String Literals

Strings are written with double quotes:

```c
string s = "Hello, saQut!";
string empty = "";
string escaped = "Line 1\nLine 2";
```

Supported escape sequences inside strings:

| Escape | Meaning |
|--------|---------|
| `\\` | Backslash |
| `\"` | Double quote |
| `\n` | Newline |
| `\t` | Tab |
| `\r` | Carriage return |
| `\b` | Backspace |

## Concatenation (`+`)

Use `+` to join strings. This creates a **new** string:

```c
string a = "Hello";
string b = "World";
string c = a + " " + b;     // "Hello World"
```

Since strings are immutable, `a` and `b` are unchanged.

Building a string in a loop:

```c
string result = "";
for (int i = 0; i < 10; i = i + 1) {
    result = result + "x";
}
print(result);              // "xxxxxxxxxx"
```

## Equality (`==`)

String `==` compares **content**, not identity:

```c
string a = "hello";
string b = "hello";
string c = "world";

print(a == b);              // true (same content)
print(a == c);              // false (different content)
```

This avoids the common Java gotcha where `==` checks reference identity.
String `!=` also works as expected.

String ordering operators (`<`, `>`, `<=`, `>=`) are not available.

```c
// if (a < b) { }          ERROR
```

## Converting to and from String

Use the `as` operator:

```c
string s = 42 as string;          // "42"
string t = 3.14 as string;        // "3.14"

// Safe conversion from string, use nullable target
string input = "42";
int? n = input as int?;           // 42
if (n != null) { print(n); }

string bad = "hello";
int? m = bad as int?;             // null, not a number
```

## Built-in String Methods

Strings come with a full set of built-in methods using dot syntax:

```c
string s = "  Hello, World!  ";

int len = s.length();             // 17
string upper = s.upper();         // "  HELLO, WORLD!  "
string lower = s.lower();         // "  hello, world!  "
string trimmed = s.trim();        // "Hello, World!"
```

### Complete Method Reference

| Method | Returns | Description |
|--------|---------|-------------|
| `s.length()` | `int` | Number of characters |
| `s.upper()` | `string` | All uppercase |
| `s.lower()` | `string` | All lowercase |
| `s.trim()` | `string` | Strip leading/trailing whitespace |
| `s.substring(start, length)` | `string` | `length` characters starting at `start` |
| `s.replace(old, new)` | `string` | Replace all occurrences |
| `s.repeat(count)` | `string` | Repeat the string N times |
| `s.charAt(index)` | `string` | Character at position (as a 1-char string) |
| `s.split(separator)` | `string[]` | Split into array by delimiter |
| `s.indexOf(substring)` | `int?` | First index (returns `null` if not found) |
| `s.contains(substring)` | `bool` | Check if substring exists |
| `s.startsWith(prefix)` | `bool` | Check if string starts with prefix |
| `s.endsWith(suffix)` | `bool` | Check if string ends with suffix |

> Every method above has a from-scratch walkthrough with edge cases on the
> [Built-in Functions](/builtin-functions/#string-functions) page.

### Examples

```c
string s = "Hello, saQut!";

// Length
print(s.length());                // 13

// Case conversion
string shout = s.upper();         // "HELLO, SAQUT!"
string whisper = s.lower();       // "hello, saqut!"

// Replace
string greet = "hello world";
string replaced = greet.replace("world", "Alice");
print(replaced);                  // "hello Alice"

// Split
string data = "apple,banana,cherry";
string[] parts = data.split(",");
print(parts[0]);                  // "apple"
print(parts[1]);                  // "banana"
print(parts[2]);                  // "cherry"

// Check and find
string email = "user@example.com";
if (email.contains("@")) {
    print("valid email");
}

string name = "saQut";
if (name.startsWith("sa")) {
    print("yes");                 // "yes"
}
```

## Important Notes

- Strings are **immutable**: once created, they cannot be changed
- `string` behaves like a value type: `==` compares content
- Internally strings are stored inline when short, heap-allocated when long
- UTF-8 encoding: a non-ASCII character may span 1-4 bytes. The current
  built-ins (`length()`, `substring()`, `charAt()`, `indexOf()`) operate on
  **bytes**, so for ASCII text one index = one character, but for accented or
  non-Latin text a single character may occupy several byte positions. Keep this
  in mind until code-point/grapheme-aware helpers are added

## What's Next?

- Group data with [structs](/structs/)
- Handle errors with [try/catch/throw](/error-handling/)
