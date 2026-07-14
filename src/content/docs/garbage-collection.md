---
title: Garbage Collection
description: How saQut reclaims memory with a simple, deterministic mark-sweep collector. When it runs, what survives, what gets freed, and how to watch it.
---

Your program creates data as it runs: strings, arrays, and structs. Something has
to free the memory when that data is no longer needed. saQut does this
automatically with a **garbage collector (GC)**, so you never write `free` or
`delete`. This page explains, in plain terms, *when* it runs and *what survives*.

## First: not everything is garbage-collected

The GC only deals with **heap objects** (the reference types):

| Managed by the GC | Not managed (plain values) |
|-------------------|----------------------------|
| `string` | `int` |
| `struct` | `float` |
| `array` (`int[]`, `Point[]`, …) | `bool` |
| | `byte` |

Primitives (`int`, `float`, `bool`, `byte`) are **values**. They live directly
in a variable's slot, are copied when assigned, and simply vanish when the slot
goes away. There is nothing to collect. (See
[data types](/data-types/) for the value-vs-reference split.) So when we talk
about "garbage," we always mean unreachable *reference* objects.

---

## What survives: reachability, not counting

The key question, *"are all my variables deleted, or do the ones with
references stay?"*, has a precise answer: **an object survives if it is still
reachable, and is freed if it is not.**

saQut uses a **mark-sweep** collector, which works in two phases:

1. **Mark.** Start from the **roots**, the live variables the program can still
   touch right now, and follow every reference. Everything you can reach from a
   root gets marked as *alive*.
2. **Sweep.** Walk the heap and free every object that was **not** marked.
   Nothing reachable was skipped; everything unreachable is reclaimed.

The roots are:

- **Global (module) variables** that are still in scope
- **Local variables** in every active function call (the current call stack)
- A value currently being **thrown** (an in-flight error)

So the rule is exactly what you'd hope:

> If a live variable, or a chain of objects starting from a live variable,
> can reach an object, that object **stays**. If nothing can reach it, it is
> **freed**.

### A worked example

```c
int[] keep = [1, 2, 3];

for (int i = 0; i < 100000; i = i + 1) {
    int[] temp = [i, i, i];   // a fresh array every iteration
}

print(keep.length());          // 3
```

`keep` is referenced by a live variable for the whole program, so it is a root
and **never collected**. Each `temp` array, on the other hand, becomes
unreachable the instant the next iteration begins: no variable points at the
old one anymore, so the collector reclaims it. Running this with GC stats shows
tens of thousands of `temp` arrays freed while `keep` stays alive the whole time.

### Cycles are collected too

Because survival is based on *reachability from roots*, not on counting how many
things point at an object, saQut correctly frees **cyclic** structures. Two
structs that point at each other but are unreachable from any root are still
garbage, and mark-sweep collects them. (This is the trap a naive
reference-counting collector falls into, and a deliberate reason saQut does not
use one.)

```c
struct Node { Node other; }

void makeGarbage() {
    Node a;
    Node b;
    a.other = b;
    b.other = a;      // a ⇄ b point at each other
}                     // after this returns nothing reaches a or b;
                      // the cycle is unreachable and WILL be collected
```

---

## When does it run?

The collector is **threshold-based**. As your program allocates objects, saQut
tracks how much live data exists. When allocation crosses a threshold, the next
**safepoint** triggers a collection.

- **Safepoints are at instruction boundaries.** The collector never runs in the
  middle of an operation, only between VM instructions, when every object is in
  a consistent, fully-formed state. (An object being built mid-instruction is
  never mistaken for garbage.)
- **It's stop-the-world.** During a collection the program pauses briefly, the
  mark-sweep runs to completion, then execution resumes. There is no concurrent
  or incremental collection to reason about.
- **The threshold adapts.** After a collection, the next threshold is set
  relative to how much data survived (roughly *live × 2*). A program with a
  large working set collects less often; a program that churns through
  short-lived objects collects more often.

This makes the *timing* of collection an implementation detail, but the
*outcome* fully deterministic: the same program frees the same objects, a
property that matters for saQut's inspectable, reproducible design.

---

## Watching and tuning the GC

Two CLI flags let you observe and control the collector:

### `--gc-stats` (report what happened)

```bash
saqut run --gc-stats myfile.sqt
```

```
gc: runs=97 freed=99134 live=867
```

- **`runs`**: how many collections happened
- **`freed`**: total objects reclaimed
- **`live`**: objects still alive at the end

### `--gc-threshold=N` (change how eagerly it collects)

```bash
saqut run --gc-threshold=1000 --gc-stats myfile.sqt
```

A **lower** threshold collects more frequently: memory stays leaner but the GC
runs more often. A **higher** threshold does the opposite. On the example above,
dropping the threshold turns `runs=97 … live=867` into `runs=100 … live=201`:
more frequent sweeps, far less memory held at any moment.

This is a tuning knob and an inspection aid; you never *need* it for
correctness, but it lets you see the collector's behavior directly.

---

## Design notes

- **Simple on purpose.** No copying, no compaction, no generations, no
  concurrency. GC is historically a common source of performance problems, so
  saQut reduces that risk by keeping the collector small and predictable.
- **Reachability beats counting.** Mark-sweep collects cycles that reference
  counting would leak, which is why saQut does not lean on `shared_ptr`-style
  counting as its model.
- **Deterministic outcome.** Timing may vary with the threshold, but *which*
  objects are freed does not.

## What's Next?

- Review the value-vs-reference distinction in [data types](/data-types/)
- See how references are shared in [structs](/structs/#reference-semantics) and [arrays](/arrays/#reference-semantics)
- Explore the executing VM in [compiler tools](/compiler-tools/#6-bytecode-vm-saqut-run)
