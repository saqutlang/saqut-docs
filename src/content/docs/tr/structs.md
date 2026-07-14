---
title: Struct'lar (Yapılar)
description: Birden fazla değeri tek bir isimli tipte gruplandırın.
---

Bir **struct**, birden fazla değeri tek bir isim altında birleştirir. Kendi
bileşik veri tiplerinizi oluşturmanızı sağlar.

## Bir Struct Tanımlama

```c
struct <İsim> {
    <tip> <alan1>;
    <tip> <alan2>;
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

Not: kapatan `}` sonrasında `;` yoktur.

## Struct Oluşturma ve Kullanma

```c
struct Person {
    string name;
    string surname;
    int age;
}

int main() {
    Person p;            // yeni bir Person oluştur
    p.name = "John";
    p.surname = "Doe";
    p.age = 30;

    print(p.name);       // "John"
    print(p.surname);    // "Doe"
    print(p.age);        // 30
    return 0;
}
```

## Alanlar Varsayılan Olarak Sıfırdır

Tüm alanlar varsayılan değerleriyle başlar:

```c
struct Product {
    string title;
    float price;
    int stock;
}

Product item;
print(item.title);       // "" (boş string)
print(item.price);       // 0.0
print(item.stock);       // 0
```

## Referans Anlamsallığı

Struct'lar **referans tipleridir** (Java veya C#'taki nesneler gibi). Bir
struct'ı atadığınızda veya aktardığınızda, her iki değişken de **aynı alt
veriyi** referans alır:

```c
struct Person {
    string name;
    int age;
}

int main() {
    Person a;
    a.name = "Alice";
    a.age = 25;

    Person b = a;         // b, a ile aynı veriyi referans alır
    b.name = "Bob";       // paylaşılan veriyi değiştirir

    print(a.name);        // "Bob", a da değişti!
    return 0;
}
```

Bu, struct'ları fonksiyonlara aktarırken de geçerlidir:

```c
void celebrate(Person p) {
    p.age = p.age + 1;    // çağıranın struct'ını değiştirir
}

int main() {
    Person p;
    p.age = 30;
    celebrate(p);
    print(p.age);         // 31, fonksiyon içinde değiştirildi
    return 0;
}
```

## Farklı Alan Tiplerini Bir Arada Kullanma

Struct alanları herhangi bir tipte olabilir; `string`, `int`, `float`, `bool`,
`byte` ve hatta başka struct'lar ile dizileri bir arada kullanabilirsiniz:

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

## İç İçe Struct'lar

Bir struct, alan olarak başka bir struct içerebilir. Bu bir hiyerarşi
oluşturur:

```c
struct Address {
    string street;
    string city;
    int zipCode;
}

struct Person {
    string name;
    int age;
    Address address;        // iç içe struct
}

int main() {
    Person p;
    p.name = "Diana";
    p.age = 28;

    // İç içe alanlara birden fazla nokta ile erişin
    p.address.street = "123 Main St";
    p.address.city = "New York";
    p.address.zipCode = 10001;

    print(p.name);              // "Diana"
    print(p.address.street);    // "123 Main St"
    print(p.address.city);      // "New York"
    return 0;
}
```

İhtiyacınız olduğu kadar derine yuvalayabilirsiniz; `person.address.street`,
`person.address.zipCode` vb.

## Fonksiyonlardan Struct Döndürmek

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

## Struct Yerleşik Metotları

Struct'ların, nokta sözdizimi ile çağırabileceğiniz yerleşik metotları
vardır:

```c
struct Point {
    int x;
    int y;
}

int main() {
    Point p;
    p.x = 10;
    p.y = 20;

    string json = p.toJson();    // makine tarafından okunabilir JSON
    string dump = p.dump();      // insan tarafından okunabilir hata ayıklama çıktısı
    print(dump);
    return 0;
}
```

| Metot | Dönüş | Açıklama |
|-------|-------|----------|
| `s.toJson()` | `string` | Makine tarafından okunabilir JSON |
| `s.dump()` | `string` | İnsan tarafından okunabilir hata ayıklama çıktısı |

Her ikisinin de örnekleri için [Yerleşik Fonksiyonlar](/builtin-functions/#struct-functions)
sayfasına bakın.

## Önemli Notlar

- Struct'lar metot veya fonksiyon **içeremez** (OOP yok)
- Struct alanlarına `.` (nokta gösterimi) ile erişilir
- Struct'ları `==` ile karşılaştıramazsınız; `==` **kimliği** (aynı nesne
  mi?) karşılaştırır, alan alan eşitliği değil
- Derin eşitlik için her alanı kontrol eden bir karşılaştırma fonksiyonu
  yazın

```c
struct Person {
    string name;
    int age;
}

bool samePerson(Person a, Person b) {
    return a.name == b.name && a.age == b.age;
}
```

## Sonra Ne Var?

- Dizilerle sıralı veri saklayın: [diziler](/arrays/)
- Metinlerle çalışın: [string'ler](/strings/)
