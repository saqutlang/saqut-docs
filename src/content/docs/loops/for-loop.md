---
title: for Loop
description: Repeat code a specific number of times.
---

The `for` loop is the most common way to repeat code when you know how many
times you want to run.

## Basic Syntax

```c
for (initialization; condition; update) {
    // body, runs while condition is true
}
```

1. **Initialization** runs once at the start
2. **Condition** is checked before each iteration; if `false`, the loop stops
3. **Body** runs if the condition is `true`
4. **Update** runs after the body, then goes back to step 2

```c
for (int i = 0; i < 5; i = i + 1) {
    print(i);
}
// Output: 0 1 2 3 4
```

Step by step:

| Iteration | `i` | `i < 5` | Action |
|-----------|-----|---------|--------|
| Before | 0 | | initialize |
| 1 | 0 | true | print(0), then `i = 0 + 1` |
| 2 | 1 | true | print(1), then `i = 1 + 1` |
| 3 | 2 | true | print(2), then `i = 2 + 1` |
| 4 | 3 | true | print(3), then `i = 3 + 1` |
| 5 | 4 | true | print(4), then `i = 4 + 1` |
| 6 | 5 | **false** | stop |

## Looping Through Arrays

Use `for` to access each element of an array by index:

```c
int[] arr = [10, 20, 30, 40];
for (int i = 0; i < 4; i = i + 1) {
    print(arr[i]);
}
// Output: 10 20 30 40
```

## Nested `for` Loops

A loop inside another loop, useful for working with tables or grids:

```c
for (int i = 1; i <= 3; i = i + 1) {
    for (int j = 1; j <= 3; j = j + 1) {
        print(i * j);
    }
}
// Output: 1 2 3 2 4 6 3 6 9
```

## Optional Parts

Each of the three parts in a `for` loop is optional. You can write an
infinite loop by leaving them all empty:

```c
for ( ; ; ) {
    // runs forever (until break or return)
}
```

Or skip the initialization if the variable already exists:

```c
int i = 0;
for ( ; i < 5; i = i + 1) {
    print(i);
}
```

## `break` and `continue`

### `break` (exit the loop immediately)

```c
for (int i = 1; i <= 5; i = i + 1) {
    if (i == 3) { break; }
    print(i);
}
// Output: 1 2
```

### `continue` (skip to the next iteration)

`continue` skips the rest of the body but still runs the **update** step:

```c
for (int i = 1; i <= 5; i = i + 1) {
    if (i == 2) { continue; }
    if (i == 4) { continue; }
    print(i);
}
// Output: 1 3 5  (2 and 4 skipped, but their i++ still ran)
```

## Bubble Sort Example

```c
int[] arr = [5, 2, 8, 1, 9];
int n = 5;

for (int i = 0; i < n - 1; i = i + 1) {
    for (int j = 0; j < n - i - 1; j = j + 1) {
        if (arr[j] > arr[j + 1]) {
            int tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;
        }
    }
}

for (int k = 0; k < n; k = k + 1) {
    print(arr[k]);
}
// Output: 1 2 5 8 9
```

## Advanced Patterns

### Counting down

The update step can decrease the counter instead of increasing it:

```c
for (int i = 3; i > 0; i = i - 1) {
    print(i);
}
// Output: 3 2 1
```

### Stepping by more than one

```c
for (int i = 0; i < 10; i = i + 2) {
    print(i);
}
// Output: 0 2 4 6 8
```

### Iterating an array by its length

Instead of hard-coding the size, use `.length()` so the loop adapts if the
array changes:

```c
int[] arr = [10, 20, 30, 40];
for (int i = 0; i < arr.length(); i = i + 1) {
    print(arr[i]);
}
```

### The loop variable is scoped to the loop

A variable declared in the initialization exists **only inside the loop**:

```c
for (int i = 0; i < 3; i = i + 1) {
    print(i);
}
// print(i);    ERROR, 'i' does not exist out here
```

Declare it before the loop if you need the final value afterward:

```c
int i = 0;
for ( ; i < 3; i = i + 1) { }
print(i);       // 3, 'i' survives because it was declared outside
```

## Common Mistake: Infinite Loop

If the condition never becomes `false`, the loop never stops:

```c
for (int i = 0; i >= 0; i = i + 1) {
    print(i);  // runs forever, i is always >= 0
}
```

## What's Next?

- Use [while loops](/loops/while-loop/) when you don't know the number of iterations
- Try [do-while loops](/loops/do-while-loop/) when you need at least one run
