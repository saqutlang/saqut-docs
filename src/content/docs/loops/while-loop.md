---
title: while Loop
description: Repeat code as long as a condition is true.
---

The `while` loop repeats a block of code as long as a condition remains `true`.
Use it when you don't know in advance how many times the loop will run.

## Basic Syntax

```c
while (condition) {
    // body, runs while condition is true
}
```

The condition is checked **before** each iteration. If it is `false` from the
start, the body never runs.

```c
int i = 0;
while (i < 5) {
    print(i);
    i = i + 1;
}
// Output: 0 1 2 3 4
```

## Counting Down

```c
int count = 5;
while (count > 0) {
    print(count);
    count = count - 1;
}
// Output: 5 4 3 2 1
```

## Reading an Array

```c
int[] arr = [2, 4, 6, 8];
int i = 0;
while (i < 4) {
    print(arr[i]);
    i = i + 1;
}
// Output: 2 4 6 8
```

## Infinite Loop

If the condition never becomes `false`, the loop runs forever:

```c
while (true) {
    // runs forever, use break or return to exit
}
```

## `break` in `while`

Exit the loop immediately:

```c
int i = 0;
while (i < 10) {
    if (i == 3) { break; }
    print(i);
    i = i + 1;
}
// Output: 0 1 2
```

## `continue` in `while`

Skip to the next iteration. Unlike `for`, the update must happen **before**
the `continue`, or it gets skipped too:

```c
int i = 0;
while (i < 5) {
    i = i + 1;          // update happens first
    if (i == 3) { continue; }
    print(i);
}
// Output: 1 2 4 5  (3 skipped)
```

If you put `continue` before the update, you create an infinite loop, because
the counter never advances:

```c
int i = 0;
while (i < 5) {
    if (i == 3) { continue; }  // i never changes when i==3!
    print(i);
    i = i + 1;
}
// WARNING: infinite loop when i reaches 3
```

## Nested `while`

```c
int i = 1;
while (i <= 3) {
    int j = 1;
    while (j <= 3) {
        print(i * j);
        j = j + 1;
    }
    i = i + 1;
}
```

## Popcount Example (Counting 1-bits)

```c
int popcount(int n) {
    int count = 0;
    while (n != 0) {
        count = count + (n & 1);
        n = n >> 1;
    }
    return count;
}

int main() {
    print(popcount(7));   // 3, binary 111
    print(popcount(256)); // 1, binary 100000000
    return 0;
}
```

## Advanced: `while (true)` with `break`

When the exit condition is easier to express **inside** the loop than at the top,
a common idiom is an intentional infinite loop with a `break`:

```c
int n = 100;
int steps = 0;
while (true) {
    if (n == 1) { break; }          // exit condition, mid-loop
    if (n % 2 == 0) { n = n / 2; }
    else { n = 3 * n + 1; }
    steps = steps + 1;
}
print(steps);                        // Collatz steps to reach 1
```

This keeps the loop going until *some* event happens, rather than forcing every
exit reason into a single top-of-loop condition. At least one `break` (or
`return`) must be reachable, or the loop never ends.

## When to Use `while` vs `for`

| Use `for` when... | Use `while` when... |
|---|---|
| You know the number of iterations | The number depends on a dynamic condition |
| You're iterating over an array by index | You're waiting for a state change |
| You have a clear init/condition/update pattern | You just need "keep going while X" |

## What's Next?

- See [do-while loops](/loops/do-while-loop/) for a guaranteed first iteration
- Learn about [functions](/functions/) to organize your code
