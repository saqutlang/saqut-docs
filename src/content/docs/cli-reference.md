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
| `--jit` | Run through the experimental MIR JIT instead of the VM |
| `--dont-optimize` | Turn off constant folding and dead code elimination |
| `--gc-threshold=N` | GC threshold in bytes; `0` uses the default, a negative value disables collection |
| `--gc-stats` | Print GC statistics on exit |
| `--profile` | Report per-stage timings |
| `--verbose` | Print stage progress |
| `-- args` | Pass everything after `--` to the program, readable with `sys::args()` |

Optimization is **on by default**. `--dont-optimize` turns it off;
`--optimized` is still accepted as a no-op so older commands keep working.

The bytecode VM is the default and reference backend. `--jit` runs the program
through the experimental MIR JIT, which is required to produce the same output
and exit code as the VM. Embedded-runtime AOT (a `--output` binary) is still
planned.

```bash
saqut run program.sqt -- input.txt 42
```

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
saqut ir --cfg program.sqt
saqut ir --dont-optimize program.sqt
```

`--cfg` prints the control flow graph instead of a flat instruction list: each
basic block with its predecessors, successors, and terminator. Use it to see
how branches and loops were laid out.

`--dont-optimize` shows the IR before constant folding and dead code
elimination, which is the way to see exactly what the optimizer changed.

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
saqut bench program.sqt [--jit] --runs=<iterations>
```

The JIT is warmed up once before timing iterations. The timing table reports
the measured execution phase separately from compilation/warmup.

## Comparing performance fairly

Use the same algorithm, input, output behavior, compiler optimization level,
and number of repetitions in every language. Report at least two numbers:

- **compile/warmup time**: time before the first measured execution;
- **steady-state execution time**: the repeated program body after setup.

For saQut, use `vm-execute` and `jit-execute` from the timing table. Do not
compare saQut's JIT warmup against another language's already-built binary.
For C++, Rust, Go, or Java, record the compiler and flags, runtime version,
machine, operating-system version, input size, and whether garbage collection
or bounds checks are active. A single VM/JIT ratio is a useful local result,
not a universal language ranking.

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
saqut run --gc-stats --profile program.sqt

# Check before running
saqut check program.sqt && saqut run program.sqt

# Compare the two backends on the same program
saqut run program.sqt > vm.txt
saqut run --jit program.sqt > jit.txt
diff vm.txt jit.txt

# See what optimization changed
saqut ast program.sqt --json > optimized.json
saqut ast program.sqt --dont-optimize --json > original.json
diff original.json optimized.json
```
