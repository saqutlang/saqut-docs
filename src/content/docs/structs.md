---
title: Structs
description: Group multiple values into a single named type.
---

A **struct** bundles multiple values under one name. It lets you create your
own composite data types.

## Defining a Struct

```c
struct <Name> {
    <type> <field1>;
    <type> <field2>;
    ...
}
```

```c
struct Person {
    string name;
    string surname;
    int age;
}
```

Note: there is no `;` after the closing `}`.

## Creating and Using a Struct

```c
struct Person {
    string name;
    string surname;
    int age;
}

int main() {
    Person p;            // create a new Person
    p.name = "John";
    p.surname = "Doe";
    p.age = 30;

    print(p.name);       // "John"
    print(p.surname);    // "Doe"
    print(p.age);        // 30
    return 0;
}
```

## Fields Default to Zero

All fields start at their default value:

```c
struct Product {
    string title;
    float price;
    int stock;
}

Product item;
print(item.title);       // "" (empty string)
print(item.price);       // 0.0
print(item.stock);       // 0
```

## Reference Semantics

Structs are **reference types** (like objects in Java or C#). When you assign
or pass a struct, both variables refer to the **same underlying data**:

```c
struct Person {
    string name;
    int age;
}

int main() {
    Person a;
    a.name = "Alice";
    a.age = 25;

    Person b = a;         // b refers to the same data as a
    b.name = "Bob";       // changes the shared data

    print(a.name);        // "Bob", a was also changed!
    return 0;
}
```

This also applies when passing structs to functions:

```c
void celebrate(Person p) {
    p.age = p.age + 1;    // modifies the caller's struct
}

int main() {
    Person p;
    p.age = 30;
    celebrate(p);
    print(p.age);         // 31, modified inside the function
    return 0;
}
```

## Mixing Different Field Types

Struct fields can be any type, mix `string`, `int`, `float`, `bool`, `byte`,
or even other structs and arrays:

```c
struct Employee {
    string name;
    int id;
    float salary;
    bool active;
}

int main() {
    Employee e;
    e.name = "Charlie";
    e.id = 1001;
    e.salary = 4500.0;
    e.active = true;

    print(e.name);        // "Charlie"
    print(e.salary);      // 4500
    return 0;
}
```

## Nested Structs

A struct can contain another struct as a field. This creates a hierarchy:

```c
struct Address {
    string street;
    string city;
    int zipCode;
}

struct Person {
    string name;
    int age;
    Address address;        // nested struct
}

int main() {
    Person p;
    p.name = "Diana";
    p.age = 28;

    // Access nested fields with multiple dots
    p.address.street = "123 Main St";
    p.address.city = "New York";
    p.address.zipCode = 10001;

    print(p.name);              // "Diana"
    print(p.address.street);    // "123 Main St"
    print(p.address.city);      // "New York"
    return 0;
}
```

You can nest as deep as you need, `person.address.street`, `person.address.zipCode`, etc.

## Returning Structs from Functions

```c
struct Person {
    string name;
    int age;
}

Person createPerson(string name, int age) {
    Person p;
    p.name = name;
    p.age = age;
    return p;
}

int main() {
    Person p = createPerson("Eve", 35);
    print(p.name);             // "Eve"
    print(p.age);              // 35
    return 0;
}
```

## Struct Built-in Methods

Structs have built-in methods you can call with dot syntax:

```c
struct Point {
    int x;
    int y;
}

int main() {
    Point p;
    p.x = 10;
    p.y = 20;

    string json = p.toJson();    // machine-readable JSON
    string dump = p.dump();      // human-readable debug output
    print(dump);
    return 0;
}
```

| Method | Returns | Description |
|--------|---------|-------------|
| `s.toJson()` | `string` | Machine-readable JSON |
| `s.dump()` | `string` | Human-readable debug output |

See the [Built-in Functions](/builtin-functions/#struct-functions) page for
examples of both.

## Important Notes

- Structs **cannot** contain methods or functions (no OOP)
- Struct fields are accessed with `.` (dot notation)
- You cannot compare structs with `==`, `==` compares **identity**
  (is it the same object?), not field-by-field equality
- For deep equality, write a comparison function that checks each field

```c
struct Person {
    string name;
    int age;
}

bool samePerson(Person a, Person b) {
    return a.name == b.name && a.age == b.age;
}
```

## What's Next?

- Store sequences with [arrays](/arrays/)
- Work with text using [strings](/strings/)
