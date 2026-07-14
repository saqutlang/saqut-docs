---
title: Built-in Functions
description: The complete reference for saQut's built-in methods on strings, arrays, and structs, each one explained from scratch with runnable examples.
---

saQut ships with a set of **built-in functions** for the types you use most:
strings, arrays, and structs. You don't import them and you don't define them,
they are always available. This page explains every one of them from the ground
up, with a runnable example for each.

If you have never used a "method" before, start with the next section. If you
just want the signatures, jump to the [quick reference tables](#quick-reference).

## Calling a built-in

You call a built-in with the **dot call** syntax: write the value, a dot, the
method name, and any extra arguments in parentheses:

```c
string name = "saqut";
print(name.upper());        // "SAQUT"
```

Read this as: *"take `name`, and apply `upper` to it."* The value on the left of
the dot is what the function works on; anything inside the parentheses are extra
arguments:

```c
string s = "hello world";
print(s.replace("world", "saQut"));   // s is the value; "world" and
                                       // "saQut" are the two arguments
```

> **Not object-orientation.** The dot here is just convenient syntax. saQut has
> no classes, objects, or methods-on-types in the OOP sense, `name.upper()` is
> simply sugar for a plain function call that happens to read left to right.

Because most string built-ins return a new value, you can **chain** calls, each
result flows into the next dot:

```c
string title = "Hello World Post";
print(title.lower().replace(" ", "-"));   // "hello-world-post"
```

---

## String functions

Strings in saQut are **immutable**: none of these functions change the original
string. They **return a new string** (or a number/bool). If you want to keep a
result, assign it to a variable.

```c
string s = "hello";
s.upper();          // computes "HELLO" but THROWS IT AWAY, s is unchanged
s = s.upper();      // THIS keeps it, now s is "HELLO"
```

### `length()` (how long is the string?)

```c
print("hello".length());    // 5
print("".length());         // 0
```

Counts the **bytes** in the string, and for plain English/ASCII text one byte =
one character, so this is what you expect.

> **UTF-8 gotcha.** saQut stores text as UTF-8, where non-ASCII characters take
> more than one byte. `length()` returns the **byte count**, not the number of
> visible characters:
>
> ```c
> print("café".length());   // 5, not 4, 'é' is 2 bytes
> ```
>
> For pure ASCII text you can ignore this. For international text, be aware that
> `length()`, `substring()`, and `charAt()` all work in **bytes**.

### `upper()` / `lower()` (change case)

```c
print("Hello, World".upper());   // "HELLO, WORLD"
print("Hello, World".lower());   // "hello, world"
```

These transform **ASCII letters only** (`a`–`z` / `A`–`Z`). Accented and
non-Latin letters pass through unchanged:

```c
print("café".upper());   // "CAFé", the 'é' is NOT uppercased
```

### `trim()` (remove surrounding whitespace)

Strips spaces, tabs, and newlines from **both ends** (not the middle):

```c
print("|" + "   hi   ".trim() + "|");   // "|hi|"
print("a b c".trim());                  // "a b c", inner spaces stay
```

Common use: cleaning up user input before comparing it.

```c
string input = "  yes  ";
if (input.trim() == "yes") {
    print("confirmed");
}
```

### `replace(old, new)` (swap text, everywhere)

This is one of the most useful string functions, so here it is in full detail.

`replace` finds **every** occurrence of `old` in the string and returns a **new
string** with each one swapped for `new`. The original is untouched.

```c
string s = "the cat sat on the mat";
string r = s.replace("at", "og");
print(r);   // "the cog sog on the mog"
print(s);   // "the cat sat on the mat", original unchanged
```

Walk through what happened: `replace("at", "og")` scanned the text and found
`"at"` inside `c-at`, `s-at`, and `m-at`, replacing each with `"og"` to give
`cog`, `sog`, `mog`. The word `the` has no `at`, so it stayed.

**It replaces *all* matches, not just the first.** If you only wanted the first
one, `replace` is not the tool, it always does every match.

```c
print("a-a-a".replace("a", "X"));   // "X-X-X"  (all three)
```

**The replacement can be shorter, longer, or empty.** An empty replacement
*deletes* the matched text:

```c
print("hello world".replace("l", ""));    // "heo word", every 'l' removed
print("2024-01-15".replace("-", "/"));    // "2024/01/15"
print("a".replace("a", "bb"));            // "bb", grew from 1 to 2 chars
```

**Matches don't overlap.** After a match is replaced, scanning continues *after*
the inserted text, so the new text is never re-scanned:

```c
print("aaa".replace("aa", "b"));   // "ba", first "aa"→"b", one "a" left over
```

A practical example, turning a sentence into a URL slug:

```c
string title = "Hello World Post";
string slug = title.lower().replace(" ", "-");
print(slug);   // "hello-world-post"
```

Notice the **chaining**: `title.lower()` returns a string, and we immediately
call `.replace(...)` on that result. Because each call returns a new string, you
can line them up left to right.

### `substring(start, length)` (cut out a piece)

Returns a piece of the string **starting at byte index `start`**, taking
`length` bytes. Indices start at **0**.

> **Read the second argument carefully.** It is a **length (a count)**, *not* an
> end position. `substring(2, 3)` means "start at index 2 and take 3
> characters", it does **not** mean "from index 2 up to index 3".

```c
string s = "abcdef";       // index:  a=0 b=1 c=2 d=3 e=4 f=5
print(s.substring(0, 2));  // "ab"   (start 0, take 2)
print(s.substring(2, 3));  // "cde"  (start 2, take 3)
print(s.substring(1, 4));  // "bcde" (start 1, take 4)
print(s.substring(0, 0));  // ""     (take 0 characters)
```

If you ask for more characters than remain, you simply get whatever is left
(no error):

```c
print("abcdef".substring(4, 99));   // "ef"  (only 2 characters remained)
```

A `start` that is past the end of the string, or negative, is an error you can
catch with `try`/`catch`.

### `repeat(count)` (glue N copies together)

```c
print("ab".repeat(3));      // "ababab"
print("=".repeat(10));      // "==========", handy for separators
print("x".repeat(0));       // ""          (zero copies = empty string)
```

### `charAt(index)` (the character at one position)

Returns a **one-character string** at byte index `index` (starting at 0). saQut
has no separate "single character" type here, so you get back a length-1 string.

```c
string s = "saqut";
print(s.charAt(0));    // "s"
print(s.charAt(4));    // "t"
```

To loop over a string character by character (ASCII):

```c
string word = "hi!";
for (int i = 0; i < word.length(); i = i + 1) {
    print(word.charAt(i));
}
// s  →  h, i, !  (one per line)
```

### `indexOf(sub)` (where does it appear?)

Searches for `sub` and returns the byte index of its **first** occurrence. If
`sub` is not found, it returns **`null`**, so the result type is `int?`
(nullable). You must check for `null` before using the number.

```c
string s = "hello world";
int? at = s.indexOf("world");
if (at != null) {
    print(at);          // 6
}

int? missing = s.indexOf("xyz");
if (missing == null) {
    print("not found");
}
```

Returning `null` (instead of the C convention of `-1`) means the "not found"
case can't be silently mistaken for a real index, the compiler forces you to
handle it.

### `contains(sub)` (is it in there?)

A yes/no version of `indexOf`. Returns a `bool`, so it reads nicely in an `if`:

```c
string email = "user@example.com";
if (email.contains("@")) {
    print("looks like an email");
}
```

### `startsWith(prefix)` / `endsWith(suffix)`

Check the beginning or end of a string. Both return `bool`:

```c
string file = "report.pdf";
print(file.startsWith("report"));   // true
print(file.endsWith(".pdf"));       // true
print(file.endsWith(".txt"));       // false
```

### `split(separator)` (break into an array)

Splits the string wherever `separator` appears and returns a **`string[]`** of
the pieces:

```c
string csv = "apple,banana,cherry";
string[] parts = csv.split(",");
print(parts.length());   // 3
print(parts[0]);         // "apple"
print(parts[2]);         // "cherry"
```

**Empty pieces are kept.** Two separators in a row produce an empty string
between them:

```c
string data = "a,b,,c";
string[] fields = data.split(",");
print(fields.length());        // 4
print("[" + fields[2] + "]");  // "[]", the empty field is preserved
```

`split` pairs naturally with a loop to process each piece:

```c
string line = "10 20 30 40";
string[] nums = line.split(" ");
int total = 0;
for (int i = 0; i < nums.length(); i = i + 1) {
    int? n = nums[i] as int?;      // parse each piece
    if (n != null) { total = total + n; }
}
print(total);   // 100
```

---

## Array functions

Arrays are **reference types**, several of these functions change the array
**in place** (marked "mutates" below). Because arrays are shared, an in-place
change is visible through every variable that points at the same array.

### `length()` (how many elements?)

```c
int[] a = [10, 20, 30];
print(a.length());   // 3
```

Use it as the upper bound of a loop so your code adapts to any size:

```c
for (int i = 0; i < a.length(); i = i + 1) {
    print(a[i]);
}
```

### `push(value)` (add to the end *(mutates)*)

Appends `value` to the end and returns the index it landed at:

```c
int[] a = [1, 2];
a.push(3);           // a is now [1, 2, 3]
int idx = a.push(4); // a is now [1, 2, 3, 4]
print(idx);          // 3, the index of the new element
```

### `pop()` (remove the last element *(mutates)*)

Removes the final element and returns it. Classic stack behavior (last in,
first out):

```c
int[] a = [1, 2, 3];
int last = a.pop();  // last = 3, a is now [1, 2]
print(last);         // 3
print(a.length());   // 2
```

### `insert(index, value)` (add in the middle *(mutates)*)

Inserts `value` so that it ends up at position `index`, shifting everything
after it one place to the right:

```c
int[] a = [10, 20, 30];
a.insert(1, 99);     // a is now [10, 99, 20, 30]
print(a[1]);         // 99
```

### `remove(index)` (take one out *(mutates)*)

Removes the element at `index` and returns it, closing the gap:

```c
int[] a = [10, 20, 30];
int gone = a.remove(0);   // gone = 10, a is now [20, 30]
print(gone);              // 10
```

### `contains(value)` (is the value present?)

Returns `bool`:

```c
int[] a = [1, 2, 3];
print(a.contains(2));   // true
print(a.contains(9));   // false
```

### `indexOf(value)` (where is the value?)

Returns the index of the first match, or **`null`** if the value isn't there
(type `int?`, exactly like the string version):

```c
string[] names = ["ali", "veli", "deli"];
int? at = names.indexOf("veli");
if (at != null) { print(at); }   // 1
```

### `slice(start, end)` (copy out a range)

Returns a **new array** containing elements from index `start` up to **but not
including** `end`. The original is left alone.

> Unlike `string.substring` (which takes a *length*), `array.slice` takes an
> **end index** and excludes it: the range is `[start, end)`.

```c
int[] a = [10, 20, 30, 40, 50];
int[] mid = a.slice(1, 3);   // indices 1 and 2 → [20, 30]
print(mid.length());         // 2
print(mid[0]);               // 20
print(a.length());           // 5, original unchanged
```

### `concat(other)` (join two arrays)

Returns a **new array** with the elements of both, back to back:

```c
int[] a = [1, 2];
int[] b = [3, 4];
int[] both = a.concat(b);    // [1, 2, 3, 4]
print(both.length());        // 4
```

### `reverse()` (flip the order *(mutates)*)

Reverses the array **in place** and also returns the same array reference:

```c
int[] a = [1, 2, 3];
a.reverse();          // a is now [3, 2, 1]
print(a[0]);          // 3
```

Because it mutates, remember that other variables pointing at the same array
see the change too:

```c
int[] a = [1, 2, 3];
int[] b = a;          // b and a are the SAME array
a.reverse();
print(b[0]);          // 3, b changed as well
```

### `clear()` (empty it out *(mutates)*)

Removes every element, leaving an empty array:

```c
int[] a = [1, 2, 3];
a.clear();
print(a.length());   // 0
```

---

## Struct functions

Every struct, no matter what fields it has, comes with two functions for
turning it into text. They are handy for debugging and for producing output
other programs can read.

### `toJson()` (machine-readable JSON)

```c
struct Point { int x; int y; }

int main() {
    Point p;
    p.x = 10;
    p.y = 20;
    print(p.toJson());   // {"x":10,"y":20}
    return 0;
}
```

Use this when another tool or program needs to consume the data.

### `dump()` (human-readable debugging)

```c
Point p;
p.x = 10;
p.y = 20;
print(p.dump());   // a readable, labelled view of the fields
```

Use this when *you* are the one reading the output while hunting a bug.

---

## Quick reference

### String methods

| Method | Returns | What it does |
|--------|---------|--------------|
| `s.length()` | `int` | Number of bytes (= characters for ASCII) |
| `s.upper()` | `string` | ASCII letters to uppercase |
| `s.lower()` | `string` | ASCII letters to lowercase |
| `s.trim()` | `string` | Remove whitespace from both ends |
| `s.replace(old, new)` | `string` | Replace **all** occurrences |
| `s.substring(start, length)` | `string` | `length` chars starting at `start` |
| `s.repeat(count)` | `string` | The string repeated `count` times |
| `s.charAt(index)` | `string` | One-character string at `index` |
| `s.indexOf(sub)` | `int?` | First index, or `null` if absent |
| `s.contains(sub)` | `bool` | Is `sub` present? |
| `s.startsWith(prefix)` | `bool` | Does it begin with `prefix`? |
| `s.endsWith(suffix)` | `bool` | Does it end with `suffix`? |
| `s.split(sep)` | `string[]` | Break into pieces on `sep` |

### Array methods

| Method | Returns | Mutates? | What it does |
|--------|---------|----------|--------------|
| `a.length()` | `int` | no | Number of elements |
| `a.push(v)` | `int` | **yes** | Append `v`, return its index |
| `a.pop()` | `E` | **yes** | Remove & return the last element |
| `a.insert(i, v)` | `int` | **yes** | Insert `v` at index `i` |
| `a.remove(i)` | `E` | **yes** | Remove & return element at `i` |
| `a.slice(start, end)` | `E[]` | no | New array, range `[start, end)` |
| `a.concat(b)` | `E[]` | no | New array of `a` then `b` |
| `a.reverse()` | `E[]` | **yes** | Reverse in place |
| `a.contains(v)` | `bool` | no | Is `v` present? |
| `a.indexOf(v)` | `int?` | no | First index, or `null` |
| `a.clear()` | `void` | **yes** | Remove all elements |

*(`E` is the array's element type, `int` for `int[]`, `string` for
`string[]`, and so on.)*

### Struct methods

| Method | Returns | What it does |
|--------|---------|--------------|
| `s.toJson()` | `string` | Machine-readable JSON |
| `s.dump()` | `string` | Human-readable debug output |

---

## The `print()` host function

`print()` stands apart from the methods above: it is not a method on a type but
a **host function**, a function implemented in C++ inside the compiler and
exposed to your program through saQut's FFI seam. It takes one value of any type
and writes it out:

```c
print(42);          // 42
print(3.14);        // 3.14
print("text");      // text
print(true);        // 1   (bool prints as 1 / 0)
```

`print` is the first and simplest example of saQut reaching outside itself.
Richer standard-library functions (files, math, and so on) will arrive through
the same host-function mechanism.

## What's Next?

- Read more about [strings](/strings/) and their value semantics
- Learn how [arrays](/arrays/) store and share sequences
- Split your program across files with [modules](/modules/)
