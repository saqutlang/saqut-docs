---
title: Veri Türleri
description: saQut'taki her değerin bir türü vardır. İşte tam liste.
---

saQut'taki her veri parçasının bir **türü (type)** vardır. Tür, bir değişkenin
hangi tür değerleri tutabileceğini ve o değer üzerinde hangi işlemleri
yapabileceğinizi belirler.

## Temel Türler (Değer Türleri)

Bu türler değerlerini doğrudan taşır. Birini diğerine atadığınızda değer
**kopyalanır**; böylece iki değişken birbirinden bağımsız hale gelir.

### `int` (Tam Sayı)

32 bitlik işaretli tam sayı.

```c
int a = 42;
int b = -100;
int c = 0xFF;      // onaltılık, 255
int d = 0b1010;    // ikilik, 10
int e = 0777;      // sekizlik, 511
```

Aralık: `-2.147.483.648` ile `2.147.483.647`

### `float` (Ondalıklı Sayı)

32 bitlik ondalıklı sayı. `e` veya `E` ile bilimsel gösterim kullanabilirsiniz.

```c
float x = 3.14;
float y = 0.5;
float z = 1e5;        // 100.000,0
float w = 2.5e-3;     // 0,0025
```

### `bool` (Mantıksal)

`true` ya da `false` değerini alan mantıksal bir türdür. Dahili olarak `int`
biçiminde saklanır (`true` için 1, `false` için 0).

```c
bool isReady = true;
bool done = false;
```

### `byte` (İşaretsiz 8-bit)

**0 ile 255** arasında küçük bir işaretsiz tam sayı.

```c
byte b = 100;
byte c = 200;
// byte d = 300;     HATA, aralık dışı
```

`byte`, aritmetik işlemlerde otomatik olarak `int` türüne genişletilir
(örn. `byte + byte` → `int`). Geri dönüştürmek için `as byte` kullanın.

```c
byte a = 200;
byte b = 100;
int sum = a + b;           // byte → int genişletme
byte result = sum as byte; // açık geri dönüşüm
```

## Tür Genişletme Kuralları

saQut, farklı türler arasında açık bir `as` dönüşümü olmadan **örtük
(otomatik) dönüşüm yapmaz**. Bu, sessizce veri kaybını önler.

### Aritmetik Genişletme

İki sayısal tür bir aritmetik işlemde (`+`, `-`, `*`, `/`, `%` vb.)
kullanıldığında, sonuç türü iki işlenenin **daha geniş** olanıdır:

```c
int a = 5;
float b = 3.0;

// int + float → float
float result = a + b;         // 8.0 (int, float'a genişletildi)
```

En dardan en genişe sayısal sıralama:

| Sıra | Tür |
|------|-----|
| 0 | `int` |
| 1 | `float` |
| 2 | `double` |
| 3 | `decimal` |

Buna göre:
- `int + int` → `int`
- `int + float` → `float`
- `float + double` → `double`
- `byte + byte` → `int` (byte önce int'e yükseltilir)

#### Örneklerle Açıklama

```c
int   a = 5;
float b = 2.0;

int   x = a + a;      // int + int   → int    → 10
float y = a + b;      // int + float → float  → 7.0
float z = b + b;      // float+float → float  → 4.0
```

Kural **işlenenlere** bakar, atama yaptığınız değişkene değil. Bu, akılda
tutulması gereken bir tuzak doğurur:

```c
float half = 1 / 2;   // → 0.0, 0.5 DEĞİL!
```

Neden? Hem `1` hem `2` **tam sayıdır**, bu yüzden `1 / 2` önce *tam sayı
bölmesi* olarak hesaplanır, sıfıra doğru budanır ve `0` verir. Ancak **ondan
sonra** bu `0`, `float` değişken için `0.0`'a genişletilir. Hedefi `float`
olarak bildirmek, bölme işleminin nasıl yapılacağını **değiştirmez**.

`0.5` elde etmek için işlenenlerden en az birini float yapın ki tüm işlem
float olarak gerçekleşsin:

```c
float ok = 1.0 / 2;   // → 0.5  (bir float işlenen diğerini de yükseltir)
```

Tam sayı bölmesi her zaman budar (kesirli kısmı atar):

```c
print(10 / 3);        // 3   (3.333 değil)
print(1 / 2);         // 0
print(7 % 3);         // 1   (modül, kalan)
```

### Örtük Daraltma Yok

Daha geniş bir türü, açık bir dönüşüm olmadan daha dar bir türe
**atayamazsınız**:

```c
int a = 1.5;            // HATA, float sabit int'e atanamaz (E003)
float b = 42;           // GEÇERLİ, int sabit float bağlamında
int c = b;              // HATA, float'tan int'e 'as' gerekir
int d = b as int;       // GEÇERLİ, açık dönüşüm (budar)
```

### Sabitlerin Bağlama Göre Türlenmesi

Tam sayı sabitleri, beklendiği bağlama uyum sağlar:

```c
float x = 1;            // GEÇERLİ, 1 sabiti float bağlamında 1.0 olur
```

Ancak ondalıklı sabitler asla sessizce tam sayıya dönüşmez:

```c
int y = 1.5;            // HATA, float sabit int bağlamında (E003)
```

## Birleşik Türler (Referans Türleri)

Bu türler veriye bir **referans** tutar. Birini diğerine atadığınızda, iki
değişken de aynı alt değeri paylaşır. Birini değiştirmek diğerini de etkiler.

### `string` (Metin)

UTF-8 karakterlerinden oluşan değişmez (immutable) bir dizidir.

```c
string s = "Merhaba, saQut!";
string empty = "";
```

`string` anlamsal olarak bir değer türüdür (yazarken kopyalama, copy-on-write),
ancak çalışma zamanında bir referans türüdür. [Metinler hakkında daha
fazlası...](/tr/strings/)

### `struct` (Alanlar Kümesi)

Birden çok değeri tek bir isim altında toplayan özel bir bileşik türdür.

```c
struct Point {
    int x;
    int y;
}

Point p;
p.x = 10;
p.y = 20;
```

[Yapılar hakkında daha fazlası...](/tr/structs/)

### `Type[]` (Dizi)

Aynı türden değerlerin sabit uzunluklu bir dizisidir.

```c
int[] numbers = [1, 2, 3, 4, 5];
string[] names = ["ali", "veli", "deli"];
```

[Diziler hakkında daha fazlası...](/tr/arrays/)

## Nullable (Boşlanabilir) Türler

Herhangi bir tür, sonuna `?` eklenerek **nullable** yapılabilir. Nullable bir
değişken normal değerlerinin yanı sıra `null` da tutabilir.

```c
int? maybeNumber = 42;
maybeNumber = null;          // GEÇERLİ, nullable

int  normalNumber = 42;
// normalNumber = null;      HATA, int null tutamaz
```

Nullable türler derleme zamanında denetlenir. Nullable bir değeri, önce `null`
olmadığını kontrol etmeden kullanamazsınız:

```c
int? x = getValue();

// print(x);                HATA, x null olabilir

if (x != null) {
    print(x);                // GEÇERLİ, null değil'e daraltıldı
}
```

Güvenli dönüşüm için `as` işlecini kullanın. Dönüşüm başarısız olursa, hedef
nullable olduğunda `null` döner:

```c
string s = "42";
int? n = s as int?;          // 42
if (n != null) { /* n'yi kullan */ }
```

## Enum Türleri

`enum`, adlandırılmış sabitler kümesi tanımlar.

```c
enum Color { Red, Green, Blue }

void main() {
    Color c = Color.Green;
    print(c);                // 1 çıktısı verir (indis)
}
```

Enum'lar `switch` ile çalışır:

```c
switch (c) {
    case Color.Red:   print(0);
    case Color.Green: print(1);
    case Color.Blue:  print(2);
}
```

## Özet Tablo

| Tür | Kategori | Atama | Varsayılan |
|-----|----------|-------|------------|
| `int` | Temel | Kopya | `0` |
| `float` | Temel | Kopya | `0.0` |
| `bool` | Temel | Kopya | `false` |
| `byte` | Temel | Kopya | `0` |
| `string` | Birleşik | Referans | `""` |
| `struct` | Birleşik | Referans | Sıfır alanlar |
| `Type[]` | Birleşik | Referans | `null` |
| `Type?` | Nullable | Referans | `null` |

## Sırada Ne Var?

- [Değişkenleri](/tr/variables/) nasıl oluşturacağınızı ve kullanacağınızı öğrenin
- [İşleçlerin](/tr/operators/) farklı türlerle nasıl çalıştığını görün
