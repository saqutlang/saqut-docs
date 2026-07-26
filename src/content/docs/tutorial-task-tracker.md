---
title: Build a Task Tracker
description: Follow along and build a small but real program from scratch. Covers structs, arrays, loops, functions, and if/else in one coherent example.
---

You have learned the pieces. Now put them together. This tutorial walks through
building a small **task tracker** step by step. By the end you will have a
working program that stores tasks, marks them done, and prints a summary.

## What we are building

The program lets you:

- Add tasks with a title and priority (Low, Medium, High)
- Mark a task as done
- Print all tasks with their status

A session looks like this:

```
--- Tasks ---
[ ] Buy groceries (Medium)
[x] Pay bills (High)
[ ] Call mom (Low)
Done: 1 / 3
```

## Step 1: Define the data

We need two things: a way to represent a task, and a place to store several
tasks.

```c
enum Priority { Low, Medium, High }

struct Task {
    string title;
    Priority priority;
    bool   done;
}
```

`enum Priority` gives us three named levels. `struct Task` bundles a title, a
priority, and a done flag into one unit. Create a file called `tasks.sqt` and
put this at the top.

## Step 2: Store the task list

We will keep tasks in an array. Since we don't know how many tasks there will
be, we start with an empty array and append to it:

```c
Task[] tasks;
```

Add a function to create and append a task:

```c
void addTask(string title, Priority prio) {
    Task t;
    t.title    = title;
    t.priority = prio;
    t.done     = false;
    tasks.append(t);
}
```

`tasks.append(t)` puts `t` at the end of the array and grows it by one.

## Step 3: Mark a task as done

We need a way to find a task by its position and mark it:

```c
void markDone(int index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].done = true;
    }
}
```

The `if` check prevents going out of bounds.

## Step 4: Print the list

Now we loop through every task and print it:

```c
string prioLabel(Priority p) {
    switch (p) {
        case Priority.Low:    return "Low";
        case Priority.Medium: return "Medium";
        case Priority.High:   return "High";
    }
    return "";
}

void printTasks() {
    print("--- Tasks ---");
    int doneCount = 0;
    for (int i = 0; i < tasks.length; i = i + 1) {
        string checkbox = "[ ]";
        if (tasks[i].done) {
            checkbox = "[x]";
            doneCount = doneCount + 1;
        }
        print(checkbox + " " + tasks[i].title +
              " (" + prioLabel(tasks[i].priority) + ")");
    }
    print("Done: " + (doneCount as string) + " / " +
          (tasks.length as string));
}
```

## Step 5: Put it all together

Now `main` ties everything together:

```c
int main() {
    addTask("Buy groceries", Priority.Medium);
    addTask("Pay bills",     Priority.High);
    addTask("Call mom",      Priority.Low);

    markDone(1);   // the second task (index 1)

    printTasks();
    return 0;
}
```

## The full program

Here is the complete file:

```c
enum Priority { Low, Medium, High }

struct Task {
    string title;
    Priority priority;
    bool   done;
}

Task[] tasks;

void addTask(string title, Priority prio) {
    Task t;
    t.title    = title;
    t.priority = prio;
    t.done     = false;
    tasks.append(t);
}

void markDone(int index) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].done = true;
    }
}

string prioLabel(Priority p) {
    switch (p) {
        case Priority.Low:    return "Low";
        case Priority.Medium: return "Medium";
        case Priority.High:   return "High";
    }
    return "";
}

void printTasks() {
    print("--- Tasks ---");
    int doneCount = 0;
    for (int i = 0; i < tasks.length; i = i + 1) {
        string checkbox = "[ ]";
        if (tasks[i].done) {
            checkbox = "[x]";
            doneCount = doneCount + 1;
        }
        print(checkbox + " " + tasks[i].title +
              " (" + prioLabel(tasks[i].priority) + ")");
    }
    print("Done: " + (doneCount as string) + " / " +
          (tasks.length as string));
}

int main() {
    addTask("Buy groceries", Priority.Medium);
    addTask("Pay bills",     Priority.High);
    addTask("Call mom",      Priority.Low);

    markDone(1);

    printTasks();
    return 0;
}
```

Run it:

```bash
saqut run tasks.sqt
```

Output:

```
--- Tasks ---
[ ] Buy groceries (Medium)
[x] Pay bills (High)
[ ] Call mom (Low)
Done: 1 / 3
```

## What this program uses

| Concept | Where |
|---|---|
| `enum` | Priority levels |
| `struct` | Task data |
| Array | Task list |
| Function | `addTask`, `markDone`, `prioLabel`, `printTasks` |
| `for` loop | Iterating tasks |
| `if` / `else` | Checkbox and bounds |
| `switch` | Priority label |
| `as` (cast) | `int` to `string` for output |
| String concat | `+` in `print()` |
| `.length` | Array size |
| `.append()` | Adding to array |

## Try these on your own

- Add a `removeTask` function that deletes a task by index
- Sort tasks so high-priority ones appear first
- Read task titles from user input (using a placeholder for now)
- Add a due date field to `Task`

This program combines the features from the previous pages in one place: data
modeling with `struct` and `enum`, storage in an array, iteration with a `for`
loop, conditionals, a `switch`, and formatted output. The exercises above extend
it in the same style.
