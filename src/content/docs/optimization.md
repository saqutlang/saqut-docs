---
title: Optimization
description: What saQut's optimizer does and what it deliberately does not do. Constant folding, dead-code elimination, and how to inspect both.
---

After your program type-checks, saQut can run an **optimizer** that rewrites the
code into a simpler-but-equivalent form. This page explains exactly what it does,
what it leaves alone, and how to watch it work.

Two principles shape the whole design:

1. **The optimizer never changes behavior.** An optimized program produces the
   same output as the unoptimized one: optimization is a rewrite, not a
   reinterpretation.
2. **It works on a *clone*.** Your original AST is preserved untouched; the
   optimizer transforms a copy. That's why you can ask for the "before" and the
   "after" and diff them.

---

## Seeing it happen

Every stage is inspectable, and optimization is no exception. Compare the tree
before and after:

```bash
saqut ast myfile.sqt               # original AST
saqut ast myfile.sqt --optimized   # AST after optimization
```

Nodes the optimizer computed are tagged, so the change is visible rather than
hidden:

```
VariableDecl (y : int)
  Literal {14} integer [folded]      ← was  2 + 3 * 4
```

---

## What it does

### 1. Constant folding

If an expression can be computed at compile time, the optimizer computes it
**once** and replaces the whole expression with the result. Your program then
carries the answer instead of the recipe.

```c
int x = 2 + 3 * 4;     // folded to:  int x = 14;
```

Folding respects precedence and associativity, so it always produces the value
the program would have computed anyway. It applies to:

- **Integer arithmetic**: `2 + 3 * 4` → `14`
- **Boolean / logical expressions**: `true && false` → `false`
- **Comparisons of constants**: `5 > 3` → `true`

Because folded sub-expressions can unlock further folding, the optimizer runs in
a **fixpoint loop**: it keeps folding until a full pass changes nothing, up to a
safety cap on the number of rounds. So a nested constant like `(2 + 2) * (3 + 3)`
collapses all the way to `24`, not just one level.

### 2. Dead-code elimination (DCE)

Code that can never run is removed. The classic case is anything **after** a
`return`, `break`, `continue`, or `throw`:

```c
int f() {
    return 1;
    int x = 2;         // removed, never reached
}
```

When DCE finds unreachable code, it also emits a **`W003` warning** so you know
something was dropped (it's usually a mistake):

```
warning [W003]: this code is never reached (after return/break/continue)
```

`W003` appears when the optimizer runs, e.g. `saqut ast myfile.sqt --optimized`.

### Related compile-time checks

While reasoning about constants, the compiler can also warn about a constant
**division by zero** before the program ever runs. That is the
[`W002`](/compiler-errors/#warnings-w001w006) warning.

---

## What it does *not* do

The boundaries are as important as the transforms. saQut's optimizer is
**deliberately conservative**. The goal is predictable speed with a determinism
guarantee, not the removal of every possible cycle. Knowing what the optimizer
leaves alone tells you what not to expect it to rewrite.

### Float expressions are not folded

Integer constants fold; **floating-point constants do not**:

```c
int   a = 2   + 3   * 4;    // → 14   (folded)
float b = 2.0 + 3.0 * 4.0;  // stays as an expression, computed at runtime
```

Floating-point results can depend on rounding and evaluation order, so folding
them at compile time risks producing a value subtly different from what the VM
would compute. saQut keeps float math where you can see it, in the running
program, rather than risk a mismatch.

### Variables are not folded across statements

Folding only looks at an expression's own literals. It does **not** track a
variable's value from a previous line:

```c
int a = 5;
int b = a + 1;    // NOT folded to 6; 'a' is a variable, not a literal
```

There is no constant *propagation*, no copy propagation, and no
common-subexpression elimination.

### No aggressive transforms

Deliberately absent: loop unrolling, function inlining, strength reduction,
vectorization, and reordering that could change floating-point results or
observable behavior. These are exactly the transforms that make an optimized
program behave differently from a naive one, and behaving identically is the
point.

---

## Why so conservative?

saQut's reference backend is a **deterministic bytecode VM**: the same input
must always produce the same output, and future backends (a MIR JIT, an
embedded-runtime AOT build) are validated against the VM with **differential
testing**: every backend must agree on every program. Aggressive, float-
reordering optimization is the natural enemy of that guarantee. By keeping the
optimizer small and behavior-preserving, every backend stays in agreement and
every stage stays inspectable.

If you want raw throughput, that job belongs to the future JIT/AOT backends
operating on the IR, not to a frontend that rewrites your source into something
you can no longer recognize.

## What's Next?

- See how the optimized tree becomes instructions in [compiler tools](/compiler-tools/#5-ir--intermediate-representation-saqut-ir)
- Learn which warnings the optimizer raises in [compiler errors](/compiler-errors/)
- Understand runtime memory in [garbage collection](/garbage-collection/)
