---
title: İşleçler
description: saQut'taki aritmetik, karşılaştırma, mantıksal, bitsel ve atama işleçleri.
---

saQut geniş bir işleç yelpazesi sunar. Ayrıştırıcı **Pratt ayrıştırması
(Pratt parsing)** kullanır; her işlecin bir öncelik seviyesi ve birleşme
yönü vardır. Böylece `-2 + -5` gibi ifadeler belirsizliğe yer kalmadan doğru
biçimde ayrıştırılır.

## İşleç Öncelik Tablosu

Yüksek sayı = önce değerlendirilir.

| Seviye | Kategori | İşleçler | Birleşme |
|--------|----------|----------|----------|
| 18 | Üye erişimi / çağrı | `.` `[ ]` `( )` | Sol |
| 17 | Sonek | `++` `--` | Sol |
| 16 | Tekil önek | `+` `-` `!` `~` | Sağ |
| 15 | Üs alma | `**` `^` | **Sağ** |
| 14 | Çarpma / Bölme / Modül | `*` `/` `%` | Sol |
| 13 | Toplama / Çıkarma | `+` `-` | Sol |
| 12 | Bitsel kaydırma | `<<` `>>` | Sol |
| 11 | İlişkisel | `<` `<=` `>` `>=` | Sol |
| 10 | Eşitlik | `==` `!=` | Sol |
| 9 | Bitsel VE | `&` | Sol |
| 8 | Bitsel XOR | `^` | Sol |
| 7 | Bitsel VEYA | `\|` | Sol |
| 6 | Mantıksal VE | `&&` | Sol |
| 5 | Mantıksal VEYA | `\|\|` | Sol |
| 4 | Üçlü koşul | `?` | **Sağ** |
| 3 | Üçlü else | `:` | **Sağ** |
| 2 | Atama | `=` `+=` `-=` `*=` vb. | **Sağ** |
| 1 | Virgül | `,` | Sol |

> **Sağ-birleşmeli:** `a = b = 5` → `a = (b = 5)`
> **Sol-birleşmeli:** `10 - 4 - 3` → `(10 - 4) - 3` = 3

## Aritmetik İşleçler

```c
int sum = 10 + 5;       // 15
int diff = 10 - 5;      // 5
int product = 10 * 5;   // 50
int quotient = 10 / 5;  // 2
int remainder = 10 % 3; // 1

int neg = -10;          // tekil eksi
int pos = +10;          // tekil artı
```

### Üs Alma

```c
int a = 2 ** 3;         // 8  (2³)
int b = 2 ^ 3;          // yine 8
```

Hem `**` hem `^` üs alma anlamına gelir. **Sağ-birleşmelidir**:
`2 ^ 3 ^ 2` → `2 ^ (3 ^ 2)` = `2 ^ 9` = 512

### Artırma ve Azaltma

```c
int x = 5;
x++;                    // x = 6  (sonek, eski değeri döndürür)
++x;                    // x = 7  (önek, yeni değeri döndürür)
x--;                    // x = 6
--x;                    // x = 5
```

> Not: `++` ve `--`, `int` ve `float` türlerinde çalışır. Bunlar yalnızca birer
> ifade değil, aynı zamanda birer deyimdir (statement): şimdilik `foo(x++)`
> yazamazsınız.

## Karşılaştırma İşleçleri

Tüm karşılaştırma işleçleri `bool` (`true` veya `false`) döndürür.

```c
int a = 5;
int b = 10;

bool eq  = a == b;      // false
bool neq = a != b;      // true
bool lt  = a <  b;      // true
bool lte = a <= b;      // true
bool gt  = a >  b;      // false
bool gte = a >= b;      // false
```

Karşılaştırmalar `int`, `float` ve `bool` (`int` olarak saklandığı için)
türlerinde çalışır. `string`, `==` ve `!=` işleçlerini (içerik karşılaştırması)
destekler ancak `<`, `>` gibi işleçleri desteklemez.

## Mantıksal İşleçler

```c
bool a = true;
bool b = false;

bool and = a && b;       // false
bool or  = a || b;       // true
bool not = !a;           // false
```

`&&` ve `||` işleçleri **kısa devre (short-circuit)** çalışır: sağ tarafı
yalnızca gerektiğinde değerlendirir.

```c
int x = 0;

// Sol taraf false olduğu için sağ taraf hiç çalışmaz
if (false && (x = 10)) { }
// x hâlâ 0

// Sol taraf true olduğu için sağ taraf hiç çalışmaz
if (true || (x = 20)) { }
// x hâlâ 0
```

## Bitsel İşleçler

`int` değerler üzerinde, bit bit çalışır.

```c
int a = 0b1100;         // 12
int b = 0b1010;         // 10

int and = a & b;        // 0b1000 = 8
int or  = a | b;        // 0b1110 = 14
int xor = a ^ b;        // 0b0110 = 6
int not = ~a;           // tüm bitleri ters çevirir

int left  = a << 2;     // 0b110000 = 48
int right = a >> 2;     // 0b0011 = 3
```

## Atama İşleçleri

Basit atama:

```c
int x = 5;
```

Bileşik atamalar bir işlemi atamayla birleştirir. **Sağ-birleşmelidir**:
`a += b += 5` → `a += (b += 5)`.

```c
int x = 10;

x += 5;     // x = 15
x -= 3;     // x = 12
x *= 2;     // x = 24
x /= 4;     // x = 6
x %= 4;     // x = 2
x &= 3;     // x = 2
x |= 8;     // x = 10
x ^= 5;     // x = 15
x <<= 1;    // x = 30
x >>= 1;    // x = 15
```

## Üçlü İşleç (Ternary)

Değer döndüren kısa bir if-else:

```c
int x = 5;
string result = x > 0 ? "positive" : "zero or negative";
```

## Tür Dönüşüm İşleci (`as`)

`as` işleci uyumlu türler arasında dönüşüm yapar. Ara konumlu (infix) ve
sol-birleşmelidir.

```c
float pi = 3.14;
int n = pi as int;          // 3 (sıfıra doğru budar)

string s = 42 as string;    // "42"

int? maybe = "3.14" as int?;  // null (dönüşüm başarısız)
```

[Tür dönüşümü hakkında daha fazlası...](#tür-dönüşüm-i̇şleci-as)

## Sırada Ne Var?

- [if-else](if-else/) yapısının karşılaştırma işleçlerini nasıl kullandığını görün
- Tekrar için [döngüleri](loops/for-loop/) öğrenin
