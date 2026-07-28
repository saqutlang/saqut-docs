---
title: Enums
description: Define a set of named constants with enum, and use them in switch and function parameters.
---

An **enum** (short for enumeration) is a way to define a set of named
constants. Instead of passing around bare numbers like `0`, `1`, `2` whose
meaning you have to remember, you give each value a name.

## Declaring an enum

```c
enum Color { Red, Green, Blue }
```

This creates a new type called `Color` with three possible values. Each value
gets an integer index starting from `0`: `Red` is `0`, `Green` is `1`, `Blue`
is `2`.

## Using enums

Access enum values with the dot syntax:

```c
Color c = Color.Green;
```

You can print an enum value; it outputs its index:

```c
print(Color.Red);              // 0
print(Color.Green);            // 1
print(Color.Blue);             // 2
```

## Enums in switch

Enums and `switch` work naturally together:

```c
enum Status { Pending, Active, Done }

string describeStatus(Status s) {
    switch (s) {
        case Status.Pending: return "waiting";
        case Status.Active:  return "in progress";
        case Status.Done:    return "finished";
    }
    return "";
}

int main() {
    Status task = Status.Active;
    print(describeStatus(task));   // "in progress"
    return 0;
}
```

Each `case` covers one enum member. A `switch` is not required to cover every
member; there is no exhaustiveness check, so add a `default` or a trailing
`return` if some members are unhandled.

## Enums as function parameters

Pass enums to functions to make the intention clear:

```c
enum Direction { North, East, South, West }

void move(Direction d) {
    switch (d) {
        case Direction.North: print("going up");    break;
        case Direction.East:  print("going right"); break;
        case Direction.South: print("going down");  break;
        case Direction.West:  print("going left");  break;
    }
}
```

Without an enum, this function would take an `int`, and `move(7)` would compile
even though `7` is not a valid direction. With a `Direction` parameter, the
type checker rejects any argument that is not a `Direction` value.

## Enum values are integers

You can compare enum values and cast them to `int`:

```c
Direction d = Direction.North;
int idx = d as int;            // 0

if (d == Direction.North) {
    print("facing north");
}
```

Enums are **not** integers directly. You cannot assign `0` to a `Direction`
variable; you must write `Direction.North`. This prevents accidentally mixing
up unrelated constants.

## Why use enums instead of int constants

Compare these two approaches:

```c
// With int constants (error-prone)
int MOVE_LEFT  = 0;
int MOVE_RIGHT = 1;
int MOVE_UP    = 2;

void move(int direction) { /* ... */ }
move(7);   // compiles, means nothing

// With enum (safe)
enum Move { Left, Right, Up }

void move(Move direction) { /* ... */ }
// move(7);                  // compile error
move(Move.Left);              // explicit and correct
```

With the enum, `move(7)` is a compile error rather than a call that runs with a
meaningless value, and each call site names the value it passes (`Move.Left`)
instead of a bare integer.
