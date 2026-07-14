---
title: Getting Started
description: Install saQut and run your first program.
---

Welcome to saQut. This guide walks through building the compiler, writing your
first program, and understanding the basic structure of a saQut project.

## Build the Compiler

saQut requires **C++17**, **CMake ≥ 3.16**, and **Ninja**.

```bash
git clone https://github.com/abdussamedulutas/saqut
cd saqut
cmake -B build -G Ninja
cmake --build build
```

The binary lands at `build/saqut`. Tested on Linux (x86-64). macOS and Windows
are untested but no platform-specific code is used, so they should work.

Check that it works:

```bash
./build/saqut --help
```

You should see a list of available commands.

## Your First Program

Create a file called `hello.sqt`:

```c
int main() {
    print("Hello, world!");
    return 0;
}
```

Run it:

```bash
./build/saqut run hello.sqt
```

Output:

```
Hello, world!
```

You just compiled and ran your first saQut program.

## Program Structure

A saQut program is a list of **function definitions** and **global variable
declarations**. There is no mandatory `class` or boilerplate; execution starts
at a function called `main`.

```c
// Function definitions come first
int greet(string name) {
    print("Hello");
    print(name);
    return 0;
}

// Then the entry point
int main() {
    greet("saQut");
    return 0;
}
```

Each statement ends with `;`. Blocks are enclosed in `{ }`.

## The `print()` Function

`print()` is a built-in **host function**: it is implemented in C++ inside the
compiler itself, not in saQut code. It accepts a single argument of any type
and writes it to the terminal:

```c
print(42);           // integer
print(3.14);         // float
print("text");       // string
print(true);         // boolean, outputs "1" or "0"
```

## What's Next?

- Learn about [variables](/variables/) and how to store and name data
- Explore [data types](/data-types/) to see what kinds of values exist
- Try the interactive `saqut exec` command to experiment with expressions
