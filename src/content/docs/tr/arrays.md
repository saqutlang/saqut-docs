---
title: Diziler
description: Aynı tipteki değerleri sıralı olarak saklayın.
---

Bir **dizi**, aynı tipteki birden fazla değeri sıralı olarak tutar. Her
değere indisi (konumu) ile erişilir.

## Dizi Tanımlama

`Tip[]` sözdizimini kullanın:

```c
int[] numbers;
numbers = [10, 20, 30, 40];

string[] names = ["John", "Alice", "Bob"];
```

## Varsayılan Değer

Başlatılmamış bir dizi değişkeni `null` olarak başlar. Kullanmadan önce atama
yapmalısınız:

```c
int[] items;
// print(items[0]);       HATA, dizi null

items = [1, 2, 3];        // artık hazır
```

## Elemanlara Erişim

İndis ile köşeli parantez kullanın. İndisler **0**'dan başlar:

```c
int[] arr = [10, 20, 30];

print(arr[0]);            // 10
print(arr[1]);            // 20
print(arr[2]);            // 30

arr[1] = 99;              // 1. indisteki değeri değiştir
print(arr[1]);            // 99
```

## Sınır Dışı Erişim

Var olmayan bir indise erişmek, `try/catch` ile yakalanabilen bir çalışma
zamanı hatasına neden olur:

```c
int[] arr = [1, 2, 3];

try {
    print(arr[99]);       // indis sınır dışı
} catch (Error e) {
    print(e.code);
}
```

## Referans Anlamsallığı

Diziler **referans tipleridir**: bir diziyi diğerine atamak aynı veriyi
paylaşır:

```c
int[] a = [1, 2, 3];
int[] b = a;              // b aynı diziyi referans alır

b[0] = 99;
print(a[0]);              // 99, a da değişti!
```

## Yerleşik Dizi Metotları

Diziler bir dizi yerleşik metotla gelir. Bunları nokta sözdizimi ile
çağırın:

```c
int[] arr = [10, 20, 30];

int len = arr.length();     // 3, eleman sayısı
arr.push(40);               // sona ekle  → [10, 20, 30, 40]
int last = arr.pop();       // sondan çıkar → 40, arr artık [10, 20, 30]
arr.reverse();              // yerinde ters çevir → [30, 20, 10]
```

Tam liste:

| Metot | Dönüş | Açıklama |
|-------|-------|----------|
| `arr.length()` | `int` | Eleman sayısı |
| `arr.push(val)` | `int` | Sona ekle (yeni indisi döndürür) |
| `arr.pop()` | `E` | Son elemanı çıkar ve döndür |
| `arr.insert(index, val)` | `int` | Belirtilen konuma ekle (indisi döndürür) |
| `arr.remove(index)` | `E` | Belirtilen indisteki elemanı çıkar ve döndür |
| `arr.slice(start, end)` | `E[]` | `[start, end)` aralığından yeni dizi |
| `arr.reverse()` | `E[]` | Yerinde ters çevir (aynı referans döndürülür) |
| `arr.concat(other)` | `E[]` | İkisini birleştiren yeni dizi |
| `arr.contains(val)` | `bool` | Değerin var olup olmadığını kontrol et |
| `arr.indexOf(val)` | `int?` | İndisi bul (bulunamazsa `null` döner) |
| `arr.clear()` | `void` | Tüm elemanları kaldır |

> Bu metotlardan bazıları (`push`, `pop`, `insert`, `remove`, `reverse`,
> `clear`) diziyi **yerinde** değiştirir ve diziler paylaşılan referanslar
> olduğu için bu değişiklik aynı diziyi işaret eden tüm değişkenlerden
> görülür. Hangi metotların değişiklik yaptığı da dahil olmak üzere her
> metodun sıfırdan anlatımı için [Yerleşik Fonksiyonlar](/builtin-functions/#array-functions)
> sayfasına bakın.

## Dizilerde Döngü

```c
string[] names = ["John", "Alice", "Bob"];

for (int i = 0; i < 3; i = i + 1) {
    print(names[i]);
}
// Çıktı: John Alice Bob
```

## Struct'lar ile Diziler

Dizilerde struct saklayabilirsiniz:

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

    people[0].age = 31;       // dizi üzerinden değiştir
    return 0;
}
```

## Nullable Tipli Diziler

```c
int?[] values = [10, null, 30, null, 50];

for (int i = 0; i < 5; i = i + 1) {
    if (values[i] != null) {
        print(values[i]);
    }
}
// Çıktı: 10 30 50
```

## Sık Kullanılan Kalıplar

### Tüm elemanları topla

```c
int sum(int[] arr) {
    int total = 0;
    for (int i = 0; i < arr.length(); i = i + 1) {
        total = total + arr[i];
    }
    return total;
}
```

### En büyüğü bul

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

## Sonra Ne Var?

- [String'ler](/strings/) ile metinlerle çalışın
- [try/catch/throw](/error-handling/) ile hataları yönetin
