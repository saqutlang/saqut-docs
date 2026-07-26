---
title: Hello World
description: Write and run your first saQut program.
---

This page walks you through writing, running, and understanding your first
saQut program. If you haven't installed the compiler yet, follow the
[Getting Started](/getting-started/) guide first.

## Write it

Create a file called `hello.sqt`:

```c
int main() {
    print("Hello, world!");
    return 0;
}
```

Those four lines are the complete program.

## What each line does

```c
int main() {
```

`main` is a function. Every saQut program must have one; execution starts here.
`int` is the return type: `main` gives back an integer to the operating system.

```c
    print("Hello, world!");
```

`print()` writes text to the terminal. The argument `"Hello, world!"` is a
**string literal**, text between double quotes. Each statement ends with `;`.

```c
    return 0;
```

Returning `0` from `main` means "everything went fine." The `{ }` braces group
statements into a block.

## Run it

```bash
saqut run hello.sqt
```

If you built from source the command is `./build/saqut run hello.sqt`.

Output:

```
Hello, world!
```

## Try a few variations

Change the string inside `print()` and run again:

```c
int main() {
    print("Hello from saQut!");
    return 0;
}
```

Add a second `print()`:

```c
int main() {
    print("First line");
    print("Second line");
    return 0;
}
```

Each `print()` writes to its own line.

## Next steps

Now that you can run a program, learn how to store and name data with
[variables](/variables/). If you want to understand the overall structure of a
saQut program (functions, blocks, entry point), the [Getting
Started](/getting-started/#program-structure) guide covers it in detail.
