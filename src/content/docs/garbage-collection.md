---
title: Memory Management (Garbage Collection)
description: How saQut reclaims memory with a simple, deterministic mark-sweep collector. When it runs, what survives, what gets freed, and how to watch it.
---

Your program creates data as it runs: strings, arrays, and structs. Something has
to free the memory when that data is no longer needed. saQut does this
automatically with a **garbage collector (GC)**, so you never write `free` or
`delete`.

## First: not everything is garbage-collected

The GC only deals with **heap objects** (the reference types):

| Managed by the GC | Not managed (plain values) |
|-------------------|----------------------------|
| `string` | `int` |
| `struct` | `float` |
| `array` (`int[]`, `Point[]`, ...) | `bool` |
| | `byte` |

Primitives (`int`, `float`, `bool`, `byte`) are **values**. They live directly
in a variable's slot, are copied when assigned, and disappear when the slot goes
away. There is nothing to collect. (See
[data types](/data-types/) for the value-vs-reference split.)

---

## What survives: reachability, not counting

An object survives if it is still reachable from a live variable, and is freed
if nothing can reach it. saQut uses a **mark-sweep** collector in two phases:

1. **Mark.** Start from the **roots** (live variables the program can still
   touch right now) and follow every reference. Everything reachable gets
   marked alive.
2. **Sweep.** Walk the heap and free every unmarked object.

The roots are:

- **Global (module) variables** still in scope
- **Local variables** in every active function call (the call stack)
- A value currently being **thrown** (an in-flight error)

> If a live variable, or a chain of objects starting from a live variable,
> can reach an object, that object stays. If nothing can reach it, it is freed.

### Worked example

```c
int[] keep = [1, 2, 3];

for (int i = 0; i < 100000; i = i + 1) {
    int[] temp = [i, i, i];   // a fresh array every iteration
}

print(keep.length());          // 3
```

`keep` is referenced by a live variable the whole time and **never collected**.
Each `temp` array becomes unreachable the instant the next iteration starts:
no variable points at the old one anymore, so the collector reclaims it.

### Cycles are collected too

Because survival is based on reachability from roots, not on reference counting,
saQut correctly frees **cyclic** structures. Two structs that point at each
other but are unreachable from any root are still garbage.

```c
struct Node { Node other; }

void makeGarbage() {
    Node a;
    Node b;
    a.other = b;
    b.other = a;      // a and b point at each other
}                     // after this returns nothing reaches a or b;
                      // the cycle is unreachable and will be deleted
```

---

## When does it run?

The collector is **threshold-based**. When allocation crosses a threshold, the
next **safepoint** triggers a collection.

- **Safepoints are at instruction boundaries.** The collector never runs
  mid-operation; only between VM instructions, when every object is in a
  consistent state.
- **It is stop-the-world.** During collection the program pauses briefly,
  mark-sweep runs to completion, then execution resumes.
- **The threshold adapts.** After a collection, the next threshold is set
  relative to how much data survived (roughly live times 2).

The timing of collection is an implementation detail, but the outcome is
deterministic: the same program frees the same objects every time.

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

- `runs`: how many collections happened
- `freed`: total objects reclaimed
- `live`: objects still alive at the end

### `--gc-threshold=N` (change how eagerly it collects)

```bash
saqut run --gc-threshold=1000 --gc-stats myfile.sqt
```

A lower threshold collects more frequently: memory stays leaner. A higher
threshold does the opposite. This is a tuning knob and an inspection aid; you
never need it for correctness.

---

## Design notes

- **Simple on purpose.** No copying, no compaction, no generations, no
  concurrency. The collector is small and predictable.
- **Reachability beats counting.** Mark-sweep collects cycles that reference
  counting would leak.
- **Deterministic outcome.** Timing may vary with the threshold, but which
  objects are freed does not.

## What's next?

- Review the value-vs-reference distinction in [data types](/data-types/)
- See how references are shared in [structs](/structs/#reference-semantics) and [arrays](/arrays/#reference-semantics)
- Explore the executing VM in [compiler tools](/compiler-tools/)
