---
title: Compiler Tools, Tokens, AST, Symbols & IR
description: What are these things, why do they exist, and when would you use them?
---

Most compilers are **black boxes**: you put source code in, you get a program
out, and what happens in between is hidden. saQut is different: it is a
**glass box**. Every stage of compilation is a separate step that you can
inspect and pipe into other tools.

This page explains what each stage is, why it exists, and when you might need
it.

---

## Pipeline Overview

```
Source Code
    │  saqut tokens
    ▼
TOKENS
    │  saqut ast
    ▼
AST (Abstract Syntax Tree)
    │  saqut symbols
    ▼
SYMBOL TABLE
    │  saqut check
    ▼
ANNOTATED AST
    │  (optional optimization)
    ▼
IR (Intermediate Representation)
    │  saqut ir
    ▼
BYTECODE VM → output
    │  saqut run
```

Each arrow is a CLI command you can run separately.

---

## 1. Tokens (`saqut tokens`)

### What is a token?

When you write code, the compiler first reads the source file character by
character and groups them into meaningful chunks called **tokens**. A token is
the smallest meaningful unit, like a word in a sentence.

For this code:

```c
int x = 42;
```

The tokenizer produces:

```
keyword "int"
identifier "x"
operator "="
number "42"
delimiter ";"
```

### Why do tokens exist?

The computer doesn't understand text: it needs structured pieces. The
tokenizer (also called a **lexer**) converts raw characters into a list of
tagged chunks. Comments and whitespace are stripped here.

### When would you use `saqut tokens`?

- **Learning:** See exactly how the compiler understands your code
- **Debugging:** If something isn't parsing, check what tokens are produced
- **Tooling:** Build a syntax highlighter or code formatter on top of the
  token stream

```bash
saqut tokens hello.sqt
```

Example output:

```json
[
  {"type": "keyword", "value": "int", "line": 1, "col": 1},
  {"type": "identifier", "value": "main", "line": 1, "col": 5},
  {"type": "delimiter", "value": "(", "line": 1, "col": 9},
  {"type": "delimiter", "value": ")", "line": 1, "col": 10},
  {"type": "delimiter", "value": "{", "line": 1, "col": 12}
]
```

---

## 2. AST (Abstract Syntax Tree (`saqut ast`))

### What is an AST?

Tokens are flat: they don't show structure. The **parser** takes the token
list and builds a tree called an **Abstract Syntax Tree (AST)**. This tree
represents the grammatical structure of your program.

For `2 + 3 * 4`:

```
    (+)
   /   \
  2     (*)
       /   \
      3     4
```

Each **node** in the tree is something meaningful: a function definition, a
variable declaration, an `if` statement, an arithmetic expression.

### Why does an AST exist?

The flat token list loses information about nesting and precedence. The tree
structure makes it clear that `*` binds tighter than `+`, and that the `if`
body belongs to the condition.

saQut uses a **Pratt parser**, a technique that handles operator precedence
through a table rather than writing separate grammar rules for each level. This
makes the parser smaller and easier to extend.

### When would you use `saqut ast`?

- **Learning:** See how the compiler interprets nested expressions
- **Debugging:** If a program doesn't behave as expected, check if the AST
  matches your intention
- **Tooling:** Generate documentation, compute complexity metrics, or build
  code-analysis tools

```bash
saqut ast hello.sqt --format=json
saqut ast hello.sqt --optimized    # AST after optimization
```

The `--optimized` flag shows the AST **after** constant folding and dead code
elimination; you can compare both to see what changed.

---

## 3. Symbol Table (`saqut symbols`)

### What is a symbol table?

A **symbol table** is a dictionary of every name in your program: functions,
variables, structs, parameters. It records where each name is defined, what
type it has, and where it is used.

```c
int x = 10;

int add(int a, int b) {
    return a + b;
}
```

The symbol table would contain:

| Name | Kind | Type | Scope |
|------|------|------|-------|
| `x` | Variable | `int` | Global |
| `add` | Function | `(int, int) → int` | Global |
| `a` | Parameter | `int` | Function `add` |
| `b` | Parameter | `int` | Function `add` |

### Why does a symbol table exist?

Code is full of names. The symbol table is built in **two passes**:

1. **First pass:** Scans the entire program and collects every name
   (this allows **forward references**, calling a function before it appears)
2. **Second pass:** Connects each use of a name to its definition

This separation is why you can call `fibonacci()` before defining it:

```c
int main() {
    print(fibonacci(10));   // forward reference, OK
    return 0;
}

int fibonacci(int n) {
    // ...
}
```

### When would you use `saqut symbols`?

- **Learning:** Understand scoping, where does each variable live?
- **Debugging:** "Undeclared identifier" errors become clear when you see
  what's in the table
- **Tooling:** The symbol table is enough to build a "Go to definition"
  feature, list all functions, or compute dependency graphs

```bash
saqut symbols hello.sqt
```

A stranger with no access to your source code could write an LSP (Language
Server Protocol) implementation from `saqut symbols` output alone. That is
the standard saQut was designed to meet.

---

## 4. Annotated AST & Optimizations

After semantic analysis (the `check` command verifies types, detects errors),
the AST is **annotated** with type information. Then the **optimizer** can
optionally run.

saQut's optimizer works on a **clone** of the AST, the original is preserved.
Two passes run in a fixpoint loop:

### Constant Folding

Replace expressions that can be computed at compile time:

```c
int x = 2 + 3 * 4;
// becomes:
int x = 14;
```

### Dead Code Elimination (DCE)

Remove code that never executes:

```c
int fn() {
    return 1;
    int x = 2;      // never reached, removed
}
```

The optimizer also gives warnings for code that can never run (warning W003).

```bash
saqut ast hello.sqt --optimized    # see optimized AST
```

---

## 5. IR (Intermediate Representation (`saqut ir`))

### What is IR?

The **Intermediate Representation** is a lower-level, instruction-based form
of your program, one step away from actual machine code. saQut uses a
**3-address code** with virtual slots (like registers).

For this code:

```c
int main() {
    int x = 2 + 3;
    print(x);
    return 0;
}
```

The IR looks like:

```
LOAD_CONST  s0 = 2
LOAD_CONST  s1 = 3
ADD         s2 = s0 + s1
STORE_LOCAL x = s2
LOAD_LOCAL  s3 = x
CALLHOST    print(s3)
LOAD_CONST  s4 = 0
RETURN      s4
```

Each instruction does one thing. Slots (`s0`, `s1`, ...) are temporary
values. `LOAD_CONST` puts a constant into a slot. `ADD` takes two slots,
adds them, and puts the result in a third. `CALLHOST` calls a host function
(like `print`).

### Why does IR exist?

The AST is great for analysis but not for execution. The IR bridges the gap
between the high-level tree and the low-level bytecode VM:

- **AST** = "what the code means" (tree)
- **IR** = "how to do it" (linear instructions)
- **Bytecode VM** = "do it" (interpreter loop)

Splitting IR from the VM makes it possible to add new backends (like a MIR
JIT compiler or an AOT packager) without changing the frontend.

### When would you use `saqut ir`?

- **Learning:** Understand how high-level code maps to low-level instructions
- **Debugging:** If a program crashes at runtime, the IR shows exactly what
  the VM is executing
- **Performance:** Count instructions, spot redundant operations, see how
  many slots a function uses

```bash
saqut ir hello.sqt
```

---

## 6. Bytecode VM (`saqut run`)

The **VM (Virtual Machine)** is the final stage. It takes the IR, resolves
function entry points, allocates frames and slots, and executes instructions
in a loop.

```bash
saqut run hello.sqt
```

The VM is the **reference backend**: it must produce the correct output
every time. Future backends (MIR JIT, AOT) will be validated against the VM
using **differential testing**: both backends must produce the same result
for the same input.

---

## Summary

| Command | What it shows | Why it exists |
|---------|---------------|---------------|
| `saqut tokens` | Flat list of tagged chunks (keywords, identifiers, operators...) | Convert text to structured pieces; build syntax highlighters |
| `saqut ast` | Tree structure showing how code is nested and grouped | Understand precedence, nesting; build code analysis tools |
| `saqut symbols` | Dictionary of every name with its type and scope | Understand scoping; build "go to definition", autocomplete |
| `saqut check` | Type errors and warnings | Catch bugs before running |
| `saqut ir` | Low-level 3-address instructions | Debug execution, count operations, optimize |
| `saqut run` | Program output | Execute the program |

### The Glass Box Philosophy

> "A stranger with no access to source could write an LSP from `saqut symbols`
> output alone. That is the test saQut is designed to pass."

Every stage is **machine-readable** (JSON), **pipeable** (Unix-friendly), and
**stable** (designed as a public interface). You are not locked into the CLI,
you can write scripts that consume `saqut ast --format=json` and build your
own tools on top of saQut's pipeline.
