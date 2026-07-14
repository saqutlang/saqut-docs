---
title: while Döngüsü
description: Bir koşul true olduğu sürece kodu tekrarlayın.
---

`while` döngüsü, bir koşul `true` kaldığı sürece bir kod bloğunu tekrarlar.
Döngünün kaç kez çalışacağını önceden bilmediğiniz durumlarda kullanın.

## Temel Sözdizimi

```c
while (koşul) {
    // gövde, koşul true olduğu sürece çalışır
}
```

Koşul her yinelemeden **önce** kontrol edilir. Başlangıçta `false` ise gövde
hiç çalışmaz.

```c
int i = 0;
while (i < 5) {
    print(i);
    i = i + 1;
}
// Çıktı: 0 1 2 3 4
```

## Geriye Sayma

```c
int count = 5;
while (count > 0) {
    print(count);
    count = count - 1;
}
// Çıktı: 5 4 3 2 1
```

## Dizi Okuma

```c
int[] arr = [2, 4, 6, 8];
int i = 0;
while (i < 4) {
    print(arr[i]);
    i = i + 1;
}
// Çıktı: 2 4 6 8
```

## Sonsuz Döngü

Koşul hiçbir zaman `false` olmazsa döngü sonsuza kadar çalışır:

```c
while (true) {
    // sonsuza kadar çalışır, çıkmak için break veya return kullanın
}
```

## `while` İçinde `break`

Döngüden hemen çıkın:

```c
int i = 0;
while (i < 10) {
    if (i == 3) { break; }
    print(i);
    i = i + 1;
}
// Çıktı: 0 1 2
```

## `while` İçinde `continue`

Sonraki yinelemeye atlayın. `for`'un aksine, güncelleme `continue`'dan **önce**
yapılmalıdır, yoksa o da atlanır:

```c
int i = 0;
while (i < 5) {
    i = i + 1;          // güncelleme önce yapılır
    if (i == 3) { continue; }
    print(i);
}
// Çıktı: 1 2 4 5  (3 atlandı)
```

Eğer `continue`'u güncellemeden önce koyarsanız sonsuz döngü oluşur, çünkü
sayaç asla ilerlemez:

```c
int i = 0;
while (i < 5) {
    if (i == 3) { continue; }  // i==3 olduğunda i asla değişmez!
    print(i);
    i = i + 1;
}
// UYARI: i 3'e ulaştığında sonsuz döngü
```

## İç İçe `while`

```c
int i = 1;
while (i <= 3) {
    int j = 1;
    while (j <= 3) {
        print(i * j);
        j = j + 1;
    }
    i = i + 1;
}
```

## Popcount Örneği (1-bitlerini Sayma)

```c
int popcount(int n) {
    int count = 0;
    while (n != 0) {
        count = count + (n & 1);
        n = n >> 1;
    }
    return count;
}

int main() {
    print(popcount(7));   // 3, binary 111
    print(popcount(256)); // 1, binary 100000000
    return 0;
}
```

## İleri Seviye: `break` ile `while (true)`

Çıkış koşulunu döngünün başında değil de **içinde** ifade etmek daha kolay
olduğunda, yaygın bir deyim olarak kasıtlı sonsuz döngü ve `break` kullanılır:

```c
int n = 100;
int steps = 0;
while (true) {
    if (n == 1) { break; }          // çıkış koşulu, döngü ortasında
    if (n % 2 == 0) { n = n / 2; }
    else { n = 3 * n + 1; }
    steps = steps + 1;
}
print(steps);                        // 1'e ulaşmak için Collatz adımları
```

Bu, her çıkış sebebini tek bir döngü-başı koşuluna sıkıştırmak yerine döngünün
*bir* olay gerçekleşene kadar devam etmesini sağlar. Yalnızca en az bir
`break` (veya `return`) erişilebilir olduğundan emin olun, yoksa döngü asla
sona ermez.

## `while` vs `for` Ne Zaman Kullanılır?

| `for` şu durumlarda… | `while` şu durumlarda… |
|---|---|
| Yineleme sayısını biliyorsanız | Sayı dinamik bir koşula bağlıysa |
| Bir diziyi indeksle dolaşıyorsanız | Bir durum değişikliği bekliyorsanız |
| Net bir başlatma/koşul/güncelleme kalıbı varsa | Yalnızca "X olduğu sürece devam et" gerekiyorsa |

## Sırada Ne Var?

- İlk yinelemenin garanti olması için [do-while döngülerine](/loops/do-while-loop/) bakın
- Kodunuzu düzenlemek için [fonksiyonları](/functions/) öğrenin
