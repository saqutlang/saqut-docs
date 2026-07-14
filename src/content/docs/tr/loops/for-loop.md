---
title: for Döngüsü
description: Kodu belirli sayıda tekrarlayın.
---

`for` döngüsü, kaç kez çalıştırmak istediğinizi bildiğiniz durumlarda kodu
tekrarlamanın en yaygın yoludur.

## Temel Sözdizimi

```c
for (başlatma; koşul; güncelleme) {
    // gövde, koşul true olduğu sürece çalışır
}
```

1. **Başlatma** başlangıçta bir kez çalışır
2. **Koşul** her yinelemeden önce kontrol edilir; `false` ise döngü durur
3. **Gövde** koşul `true` ise çalışır
4. **Güncelleme** gövdeden sonra çalışır, ardından 2. adıma dönülür

```c
for (int i = 0; i < 5; i = i + 1) {
    print(i);
}
// Çıktı: 0 1 2 3 4
```

Adım adım:

| Yineleme | `i` | `i < 5` | Eylem |
|-----------|-----|---------|--------|
| Önce | 0 | | başlatma |
| 1 | 0 | true | print(0), sonra `i = 0 + 1` |
| 2 | 1 | true | print(1), sonra `i = 1 + 1` |
| 3 | 2 | true | print(2), sonra `i = 2 + 1` |
| 4 | 3 | true | print(3), sonra `i = 3 + 1` |
| 5 | 4 | true | print(4), sonra `i = 4 + 1` |
| 6 | 5 | **false** | dur |

## Diziler Üzerinde Döngü

Bir dizinin her elemanına indeksle erişmek için `for` kullanın:

```c
int[] arr = [10, 20, 30, 40];
for (int i = 0; i < 4; i = i + 1) {
    print(arr[i]);
}
// Çıktı: 10 20 30 40
```

## İç İçe `for` Döngüleri

Bir döngü içinde başka bir döngü; tablolar veya ızgaralarla çalışırken
kullanışlıdır:

```c
for (int i = 1; i <= 3; i = i + 1) {
    for (int j = 1; j <= 3; j = j + 1) {
        print(i * j);
    }
}
// Çıktı: 1 2 3 2 4 6 3 6 9
```

## İsteğe Bağlı Kısımlar

`for` döngüsündeki üç kısmın her biri isteğe bağlıdır. Hepsini boş bırakarak
sonsuz bir döngü yazabilirsiniz:

```c
for ( ; ; ) {
    // sonsuza kadar çalışır (break veya return olana kadar)
}
```

Ya da değişken zaten varsa başlatmayı atlayabilirsiniz:

```c
int i = 0;
for ( ; i < 5; i = i + 1) {
    print(i);
}
```

## `break` ve `continue`

### `break` (döngüden hemen çık)

```c
for (int i = 1; i <= 5; i = i + 1) {
    if (i == 3) { break; }
    print(i);
}
// Çıktı: 1 2
```

### `continue` (sonraki yinelemeye atla)

`continue` gövdenin kalanını atlar ama **güncelleme** adımı yine de çalışır:

```c
for (int i = 1; i <= 5; i = i + 1) {
    if (i == 2) { continue; }
    if (i == 4) { continue; }
    print(i);
}
// Çıktı: 1 3 5  (2 ve 4 atlandı, ama i++ yine de çalıştı)
```

## Kabarcık Sıralama Örneği

```c
int[] arr = [5, 2, 8, 1, 9];
int n = 5;

for (int i = 0; i < n - 1; i = i + 1) {
    for (int j = 0; j < n - i - 1; j = j + 1) {
        if (arr[j] > arr[j + 1]) {
            int tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;
        }
    }
}

for (int k = 0; k < n; k = k + 1) {
    print(arr[k]);
}
// Çıktı: 1 2 5 8 9
```

## İleri Seviye Kalıplar

### Geriye sayma

Güncelleme adımı sayacı artırmak yerine azaltabilir:

```c
for (int i = 3; i > 0; i = i - 1) {
    print(i);
}
// Çıktı: 3 2 1
```

### Birden fazla artırarak ilerleme

```c
for (int i = 0; i < 10; i = i + 2) {
    print(i);
}
// Çıktı: 0 2 4 6 8
```

### Diziyi uzunluğuna göre dolaşma

Boyutu sabit yazmak yerine `.length()` kullanın; böylece dizi değişse bile
döngü uyum sağlar:

```c
int[] arr = [10, 20, 30, 40];
for (int i = 0; i < arr.length(); i = i + 1) {
    print(arr[i]);
}
```

### Döngü değişkeni döngüye kapsamlıdır

Başlatmada tanımlanan bir değişken **yalnızca döngü içinde** yaşar:

```c
for (int i = 0; i < 3; i = i + 1) {
    print(i);
}
// print(i);    HATA, 'i' burada mevcut değil
```

Son değere daha sonra ihtiyacınız varsa değişkeni döngüden önce tanımlayın:

```c
int i = 0;
for ( ; i < 3; i = i + 1) { }
print(i);       // 3, 'i' dışarıda tanımlandığı için yaşamaya devam eder
```

## Sık Yapılan Hata: Sonsuz Döngü

Koşul hiçbir zaman `false` olmazsa döngü asla durmaz:

```c
for (int i = 0; i >= 0; i = i + 1) {
    print(i);  // sonsuza kadar çalışır, i her zaman >= 0
}
```

## Sırada Ne Var?

- Yineleme sayısını bilmediğinizde [while döngüsü](/loops/while-loop/) kullanın
- En az bir kez çalışması gerektiğinde [do-while döngüsü](/loops/do-while-loop/) deneyin
