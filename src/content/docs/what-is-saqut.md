---
title: What is saQut
description: Learn what saQut is, who it is for, and which path to start with.
---

saQut is a programming language whose **compiler is a glass box**. Most
compilers take source code in, give an executable out, and show nothing in
between. saQut exposes **every internal stage** as a separate command: tokens,
AST (abstract syntax tree), symbol table, and IR (intermediate representation).

The same output serves two audiences: someone **learning to code for the first
time** and a developer **reading how a compiler works internally**.

---

## What saQut is not

saQut was not designed to compete with C, Go, or Rust as a general-purpose
language, and it is not intended for large production systems. Its purpose is
to make **every step from source to execution visible**. The language surface
is small and deliberate, which keeps the number of edge cases a reader has to
hold in mind while learning one concept low.

---

## Who it is for

This site offers three paths. Pick the one that fits you best.

### 1. I am new to programming

If you have never written code, or you know the basics from another language,
the **Getting Started** section is for you. It follows a step-by-step order:

- Variables, data types, operators
- if/else, loops, functions
- Arrays, strings, structs

Every topic comes with small examples. You can run everything with `saqut run`
before moving to the next topic.

[Follow the beginner path →](/getting-started/)

### 2. I want to write programs with saQut

You already know how to program. You want to learn saQut's tools and
libraries. This path covers:

- Built-in functions (string, array, and struct methods)
- Module system (`import` / `export`)
- Error handling (`try` / `catch` / `throw`)
- Compiler tools (`saqut ast`, `saqut tokens`, `saqut ir`)
- FFI (foreign function interface): the curated host-function seam that exposes the standard library (`fs`, `sys`, `math`, `date`) to your program

It also shows how to add syntax highlighting and completion support to your
editor.

[Start with built-in functions →](/builtin-functions/)

### 3. I want to understand how the compiler works

You are less interested in the language as a tool and more interested in it
as a **system to study**. Head straight for the internals:

- Compiler tools: what each command (`tokens`, `ast`, `symbols`, `ir`)
  produces and how to read the output
- Optimization: constant folding, dead code elimination, what changes at the
  IR level
- Garbage collection: mark-sweep algorithm, memory model
- Virtual machine: bytecode instruction set, deterministic execution
- MIR JIT and embedded AOT: the second execution path (MIR-based). An experimental JIT already runs via `--jit`; embedded AOT is planned

These sections explain the **compiler**, not just the language.

[Explore the compiler tools →](/compiler-tools/)

---

## The language at a glance

```c
// A simple function
int square(int x) {
    return x * x;
}

// Arrays and loops
int sum(int[] numbers) {
    int result = 0;
    for (int i = 0; i < numbers.length; i = i + 1) {
        result = result + numbers[i];
    }
    return result;
}

int main() {
    print(square(5));           // 25
    print(sum([1, 2, 3]));     // 6
    return 0;
}
```

- `int`, `float`, `bool`, `byte`, `string` as primitive types
- `struct` for custom data structures
- Arrays (`int[]`) and strings (`string`) are passed by reference
- No pointers (`&`, `*`); opt-in null with `T?`
- No classes, inheritance, generics, or automatic type inference
- `import` / `export` for splitting into modules

---

## When to use saQut vs. another language

| Situation | Recommendation |
|---|---|
| I am learning to code and want to understand compiler concepts too | saQut |
| I need a quick script to get something done | Python, Node.js |
| I am building a web server or API | Go, Rust, C# |
| I am working on embedded systems or an OS | C, Rust |
| I want to see every step inside a compiler | saQut |
| I am building a large-scale, team-developed project | Any mainstream language with Git support |

saQut is built for **learning, teaching, and querying the compiler**.
It is not built for production systems.

---

Ready? Continue with [Getting Started](/getting-started/).
