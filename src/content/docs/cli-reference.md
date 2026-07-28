---
title: CLI Reference
description: 'Complete reference for the saqut command-line interface: run, compile, debug, and diagnostic flags.'
---

This page covers every `saqut` subcommand and flag a practitioner needs. For
installing the compiler, see [Getting Started](/getting-started/).

## Subcommands

### run

Compile and execute a program.

```bash
saqut run program.sqt
```

| Flag | Purpose |
|---|---|
| `--allow fs,net,sys` | Grant runtime capabilities |
| `--jit` | Run through the experimental MIR JIT instead of the VM |
| `--optimized` | Apply constant folding and DCE |
| `--gc-threshold N` | Trigger GC after N allocations |
| `--gc-stats` | Print GC statistics after execution |
| `--profile` | Print a per-stage profile (tokenizing, parsing, IR generation, execution) with a work count per stage |

The bytecode VM is the default and reference backend. The `--jit` flag runs the
program through the experimental MIR JIT, which currently handles whole programs
made of integer and float scalar code; a program that uses anything else stops
with an explicit error instead of running partially. Embedded-runtime AOT (a
`--output` binary) is still planned.

### tokens

Print the token stream as JSON.

```bash
saqut tokens program.sqt
```

Each token includes: kind, text, line, column, and byte offset. Useful for
writing syntax highlighters or custom tooling.

### ast

Print the abstract syntax tree as JSON.

```bash
saqut ast program.sqt
saqut ast program.sqt --optimized
```

The `--optimized` flag prints the tree after constant folding and dead code
elimination. The original AST is preserved; optimization works on a clone.

### symbols

Print the symbol table as JSON.

```bash
saqut symbols program.sqt
```

Shows all functions, variables, structs, enums, and their types. Includes
scope information.

### ir

Print the intermediate representation (three-address code).

```bash
saqut ir program.sqt
saqut ir --capabilities program.sqt
```

The `--capabilities` flag scans the IR and reports which capabilities
(`fs`, `net`, `sys`) the program needs, without executing it.

### check

Run semantic analysis only; report errors and warnings as JSON.

```bash
saqut check program.sqt
```

Exit code 0 means no errors. Non-zero means errors found. Warnings do not affect
the exit code.

### exec

Run a single expression or statement interactively.

```bash
saqut exec "3 + 4 * 2"
```

Outputs the result directly. Useful for quick experiments without creating a
file.

### bench

Measure execution time of a program.

```bash
saqut bench program.sqt
```

Runs the program multiple times and prints timing statistics.

### lsp / dap

Start the Language Server or Debug Adapter. These are used by the VS Code
extension, not run directly:

```bash
saqut lsp
saqut dap
```

## Common patterns

```bash
# Run with full introspection
saqut run --allow fs --gc-stats --profile program.sqt

# Check before running
saqut check program.sqt && saqut run program.sqt

# Inspect what a program needs
saqut ir --capabilities program.sqt

# See the optimized AST
saqut ast program.sqt --optimized
```
