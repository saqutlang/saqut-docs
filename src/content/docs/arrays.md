---
title: Arrays
description: Store a sequence of values of the same type.
---

An **array** holds multiple values of the same type in a sequence. Each value
is accessed by its index (position).

## Declaring an Array

Use `Type[]` syntax:

```c
int[] numbers;
numbers = [10, 20, 30, 40];

string[] names = ["John", "Alice", "Bob"];
```

## Default Value

An uninitialized array variable starts at `null`. You must assign it before
use:

```c
int[] items;
// print(items[0]);       ERROR, array is null

items = [1, 2, 3];        // now it's ready
```

## Accessing Elements

Use square brackets with the index. Indices start at **0**:

```c
int[] arr = [10, 20, 30];

print(arr[0]);            // 10
print(arr[1]);            // 20
print(arr[2]);            // 30

arr[1] = 99;              // change value at index 1
print(arr[1]);            // 99
```

## Out of Bounds

Accessing an index that doesn't exist causes a runtime error that can be
caught with `try/catch`:

```c
int[] arr = [1, 2, 3];

try {
    print(arr[99]);       // index out of bounds
} catch (Error e) {
    print(e.code);
}
```

## Reference Semantics

Arrays are **reference types**: assigning one array to another shares the
same data:

```c
int[] a = [1, 2, 3];
int[] b = a;              // b refers to the same array

b[0] = 99;
print(a[0]);              // 99, a changed too!
```

## Built-in Array Methods

Arrays come with several built-in methods. Use dot syntax to call them:

```c
int[] arr = [10, 20, 30];

int len = arr.length();     // 3, number of elements
arr.push(40);               // add to end  → [10, 20, 30, 40]
int last = arr.pop();       // remove end  → 40, arr is [10, 20, 30]
arr.reverse();              // reverse in-place → [30, 20, 10]
```

Full list:

| Method | Returns | Description |
|--------|---------|-------------|
| `arr.length()` | `int` | Number of elements |
| `arr.push(val)` | `int` | Add to end (returns new index) |
| `arr.pop()` | `E` | Remove and return last element |
| `arr.insert(index, val)` | `int` | Insert at position (returns index) |
| `arr.remove(index)` | `E` | Remove and return element at index |
| `arr.slice(start, end)` | `E[]` | New array from range `[start, end)` |
| `arr.reverse()` | `E[]` | Reverse in-place (same reference returned) |
| `arr.concat(other)` | `E[]` | New array combining both |
| `arr.contains(val)` | `bool` | Check if value exists |
| `arr.indexOf(val)` | `int?` | Find index (returns `null` if not found) |
| `arr.clear()` | `void` | Remove all elements |

> Some of these methods (`push`, `pop`, `insert`, `remove`, `reverse`, `clear`)
> change the array **in place**, and because arrays are shared references, that
> change is visible through every variable pointing at the same array. See the
> [Built-in Functions](/builtin-functions/#array-functions) page for a
> from-scratch walkthrough of each method, including which ones mutate.

## Looping Through Arrays

```c
string[] names = ["John", "Alice", "Bob"];

for (int i = 0; i < 3; i = i + 1) {
    print(names[i]);
}
// Output: John Alice Bob
```

## Arrays with Structs

You can store structs in arrays:

```c
struct Person {
    string name;
    int age;
}

int main() {
    Person p1;
    p1.name = "John"; p1.age = 30;

    Person p2;
    p2.name = "Alice"; p2.age = 25;

    Person[] people = [p1, p2];

    print(people[0].name);    // "John"
    print(people[1].age);     // 25

    people[0].age = 31;       // modify through array
    return 0;
}
```

## Arrays of Nullable Types

```c
int?[] values = [10, null, 30, null, 50];

for (int i = 0; i < 5; i = i + 1) {
    if (values[i] != null) {
        print(values[i]);
    }
}
// Output: 10 30 50
```

## Common Patterns

### Sum all elements

```c
int sum(int[] arr) {
    int total = 0;
    for (int i = 0; i < arr.length(); i = i + 1) {
        total = total + arr[i];
    }
    return total;
}
```

### Find max

```c
int findMax(int[] arr) {
    int result = arr[0];
    for (int i = 1; i < arr.length(); i = i + 1) {
        if (arr[i] > result) {
            result = arr[i];
        }
    }
    return result;
}
```

## What's Next?

- Work with text using [strings](/strings/)
- Handle errors with [try/catch/throw](/error-handling/)
