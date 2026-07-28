---
title: What is Programming
description: A gentle introduction to programming for absolute beginners.
---

If you have never written a line of code before, this page is for you. It
explains what programming is at its core, without assuming you already know
terms like "variable" or "loop."

## What is a program

A program is a list of instructions you give to a computer. The computer
follows them one by one, from top to bottom, exactly as written. It does not
guess. It does not get bored. It just executes.

Think of it like a recipe. A recipe says: take flour, add water, mix, put in
oven. A program says: take this number, add five, print the result. Same idea,
different kitchen.

## Why we need variables

When you cook, you put ingredients in bowls so you can use them later. In a
program, a **variable** is that bowl. You give it a name and put a value in
it:

```c
int age = 25;
string name = "Alex";
```

Later, you can read the value or change it. The program remembers it for you.

## Why we need conditions

A recipe sometimes says "if the dough is too dry, add water." That's a
**condition**. Programs do the same:

```c
if (score > 50) {
    print("You passed!");
}
```

The line inside the braces `{ }` only runs if `score` is greater than 50.
Otherwise the program skips it.

## Why we need loops

Imagine a recipe that says "knead the dough 100 times." Nobody wants to write
that out as 100 separate lines. A **loop** says "do this thing, then do it
again, until some condition is met." The most common loop is `for`:

```c
for (int i = 0; i < 5; i = i + 1) {
    print(i);
}
```

This prints `0`, `1`, `2`, `3`, `4`. Five lines of output from three lines of
code. A loop lets the machine handle repetitive work instead of you writing each
step by hand.

## Why we need functions

As your recipe grows, you might notice you do the same sub-recipe several times
: "make the base sauce" appears in three different dishes. Instead of
repeating it, you give it a name and refer to it. In programming, that's a
**function**:

```c
int doubleIt(int x) {
    return x * 2;
}
```

Now `doubleIt(5)` gives you `10` anywhere in the program. Write once, use
many times.

## Putting it together

A real program combines all of these:

```c
int calculateBonus(int salary) {
    if (salary > 5000) {
        return salary / 10;
    }
    return 0;
}

int main() {
    print(calculateBonus(6000));   // 600
    print(calculateBonus(3000));   // 0
    return 0;
}
```

A variable (`salary`), a condition (`if`), a function (`calculateBonus`), and
an output (`print`). That's a complete, working program.

## Where to go from here

Now that you have a mental model of what variables, conditions, loops, and
functions are for, the rest of this section teaches you how to use each one
in saQut. Start with [variables](/variables/).
