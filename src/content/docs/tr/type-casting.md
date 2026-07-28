---
title: Tip Dönüşümü (as)
description: as operatörü ile tipler arasında güvenli ve açık dönüşüm.
---

saQut örtük tip dönüşümü yapmaz. Bir `int`'i `float`'a veya bir `string`'i
`int`'e çevirmen gerekiyorsa dönüşümü `as` operatörü ile açıkça yazarsın.

## Temel dönüşümler

```c
int   a = 42;
float b = a as float;          // 42.0
int   c = 3;                   // (int)3
float d = c as float;          // 3.0
```

`as` operatörü dönüşümü açık hale getirir. Aritmetik işlemlerde `int`'ten
`float`'a gizli yükseltme yapılmaz: iki tamsayıyı bölersen tamsayı bölmesi
alırsın. Float bölme istiyorsan bir tarafı önce dönüştür.

## Sayısal dönüşümler

| Kimden | Kime | Davranış |
|------|----|----------|
| `int` | `float` | Genişletme, her zaman güvenli |
| `float` | `int` | Sıfıra doğru budar |
| `int` | `byte` | 0-255 aralığı dışındaysa hata |
| `byte` | `int` | Genişletme, her zaman güvenli |
| `int` | `bool` | `0` false, sıfır olmayan true |
| `bool` | `int` | false `0`, true `1` |

```c
float pi = 3.99;
int   n  = pi as int;          // 3 (budandı)

byte  b  = 200;
int   i  = b as int;           // 200

int   buyuk = 300;
// byte kucuk = buyuk as byte; // çalışma zamanı hatası: aralık dışı
```

## Metin dönüşümleri

Sayılar metinden ayrıştırılabilir. Dönüşüm başarısız olabileceği için
**nullable** hedefe dönüştür:

```c
string s = "42";
int?   n = s as int?;          // 42
if (n != null) { print(n); }

string t = "merhaba";
int?   m = t as int?;          // null (sayı değil)
```

Float için de aynısı geçerlidir:

```c
string s = "3.14";
float? f = s as float?;        // 3.14
```

## Metne dönüştürme

Herhangi bir tip `string`'e dönüştürülebilir:

```c
int   a = 42;
string s = a as string;        // "42"

float f = 3.14;
string t = f as string;        // "3.14"

bool  b = true;
string u = b as string;        // "true"
```

## Struct dönüşümleri

Farklı struct tipleri arasında dönüşüm yapamazsın. Her struct'ın kendi yerleşim
düzeni vardır; otomatik dönüşüm yoktur.

```c
struct Nokta  { int x; int y; }
struct Vektor { int x; int y; }

Nokta n = Nokta(1, 2);
// Vektor v = n as Vektor;     // derleme hatası
```

## Özet

- `as` saQut'taki tek tip dönüşüm operatörüdür
- int'ten float'a genişletir; float'tan int'e budar
- Metin ayrıştırma başarısız olursa nullable hedefte `null` döner
- Her tip `as string` ile metne dönüşür
- Struct'lar birbirine dönüştürülemez
