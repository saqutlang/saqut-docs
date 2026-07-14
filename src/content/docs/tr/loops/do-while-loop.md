---
title: do-while Döngüsü
description: Kodu en az bir kez çalıştırın, sonra koşulu kontrol edin.
---

`do-while` döngüsü `while` döngüsüne benzer, ancak koşul gövde çalıştıktan
**sonra** kontrol edilir. Bu, koşul başlangıçta `false` olsa bile gövdenin
**en az bir kez** çalışmasını garanti eder.

## Temel Sözdizimi

```c
do {
    // gövde, en az bir kez çalışır
} while (koşul);
```

```c
int x = 5;
do {
    print(x);
    x = x + 1;
} while (x < 0);
// Çıktı: 5
```

Dikkat edin: `x` 5'ten başlar ve `x < 0` koşulu `false`'tur. Ancak gövde yine
de çalıştı, `5` yazdırıldı; çünkü kontrol en sonda yapılır.

## Ne Zaman Kullanılır?

`do-while`, devam edip etmemeye karar vermeden önce bir şey yapmanız
gerektiğinde kullanışlıdır. Örneğin: kullanıcıdan girdi almak, bir öğeyi
işlemek, sonra devamı var mı diye kontrol etmek.

```c
// En az bir öğeyi işle, sonra kalan var mı kontrol et
int i = 0;
do {
    print(arr[i]);
    i = i + 1;
} while (i < 5);
```

## Karşılaştırma: `while` vs `do-while`

| Durum | `while` | `do-while` |
|-----------|---------|------------|
| Koşul baştan `false` | Gövde **asla** çalışmaz | Gövde **bir kez** çalışır |
| Koşul kontrolü | Gövdeden önce | Gövdeden sonra |
| Garanti çalışma | Hayır | Evet, en az bir yineleme |

```c
int x = 10;

while (x < 5) {       // koşul false → gövde asla çalışmaz
    print("while");
}

do {
    print("do-while");  // x < 5 false olmasına rağmen bir kez çalışır
} while (x < 5);

// Çıktı: "do-while"
```

## `break` ve `continue`

### `break` (hemen çık)

```c
int i = 0;
do {
    if (i == 3) { break; }
    print(i);
    i = i + 1;
} while (i < 10);
// Çıktı: 0 1 2
```

### `continue` (koşul kontrolüne atla)

`continue`, sondaki koşul kontrolüne atlar:

```c
int i = 0;
do {
    i = i + 1;
    if (i == 3) { continue; }
    print(i);
} while (i < 5);
// Çıktı: 1 2 4 5
```

## Truthy Koşullar

saQut, C tarzı truthiness kullanır: `0` `false`, sıfırdan farklı her değer
`true` kabul edilir.

```c
int x = 5;
do {
    x = 0;
} while (x);           // x 0 → koşul false → döngü sona erer
```

## Gerçek Dünya Örneği: Girdi Doğrulama

```c
int value;
int attempts = 0;
do {
    // Bir değer okumayı simüle et
    value = readInput();
    attempts = attempts + 1;
    if (attempts >= 3) { break; }
} while (value < 0);
```

## İleri Seviye: işle-sonra-kontrol et

Garanti edilen ilk çalışma, `do-while`'ı **ilk öğenin, ikincinin olup
olmadığını bilmeden önce işlenmesi gereken** her durum için doğal tercih
haline getirir; `0` gibi uç değerler de buna dahildir. Bir sayının
basamaklarını yazdırmak klasik bir örnektir: `0` bile bir basamağa sahiptir ve
bunu yalnızca `do-while` garanti eder:

```c
int n = 0;
do {
    print(n % 10);      // son basamak
    n = n / 10;
} while (n > 0);
// Çıktı: 0   (düz bir 'while (n > 0)' hiçbir şey yazdırmazdı)
```

`while` döngüsüyle sıfır durumunu karşılamak için gövdeyi döngüden önce bir
kez daha yazmanız gerekirdi; `do-while` "yap, sonra karar ver"i doğrudan ifade
eder.

## Sırada Ne Var?

- Kodu [fonksiyonlarla](/functions/) düzenleyin
- Veriyi [struct'larla](/structs/) gruplandırın
