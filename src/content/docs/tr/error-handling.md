---
title: Hata Yönetimi (try / catch / throw)
description: Kodunuzdaki çalışma zamanı hatalarını yakalayın ve yönetin.
---

saQut, `try`, `catch` ve `throw` ile **denetlenmeyen** (unchecked) hata
yönetimini destekler. Hatalar, inceleyip yönetebileceğiniz struct tabanlı
değerlerdir.

## Temel `try` / `catch`

Hata verebilecek kodu bir `try` bloğuna sarın. Bir hata oluşursa, yürütme
`catch` bloğuna atlar:

```c
try {
    int[] arr = [1, 2, 3];
    print(arr[99]);          // sınır dışı → hata
} catch (Error e) {
    print("bir hata yakalandı");
}
```

## `Error` Struct'ı

Yakalanan bir hata size şu alanlara sahip bir `Error` değeri verir:

- `e.code`, sayısal hata kodu
- `e.message`, insan tarafından okunabilir açıklama (string)
- `e.trace`, yığın izi bilgisi
- `e.line`, hatanın oluştuğu satır

```c
try {
    int[] arr = [1];
    int x = arr[5];           // sınır dışı
} catch (Error e) {
    print(e.code);            // sınır dışı hatasının sayısal kodu
    print(e.message);         // açıklama
}
```

## Sık Karşılaşılan Çalışma Zamanı Hataları

Şu işlemler çalışma zamanında hata fırlatabilir:

| Durum | Örnek | Hata |
|-----------|---------|-------|
| Dizi indeksi sınır dışı | 3 elemanlı dizide `arr[999]` | Sınır dışı hatası |
| Sıfıra bölme | `x = 10 / 0` | Sıfıra bölme |
| Null erişimi | null bir nesnenin alanına erişmek | Null hatası |
| Başarısız tür dönüşümü | `"abc" as int` (null olamaz hedef) | Tür dönüşüm hatası |

```c
int main() {
    // Sıfıra bölme
    try {
        int x = 10 / 0;
    } catch (Error e) {
        print(e.code);
    }

    // Sınır dışı
    try {
        int[] a = [1];
        int bad = a[5];
    } catch (Error e) {
        print(e.code);
    }

    // Başarısız tür dönüşümü
    try {
        int n = "abc" as int;
    } catch (Error e) {
        print(e.code);
    }

    return 0;
}
```

## `throw`

Kendi hatalarınızı fırlatabilirsiniz:

```c
void check(int value) {
    if (value < 0) {
        throw "negatif değere izin verilmez";
    }
}

int main() {
    try {
        check(-5);
    } catch (Error e) {
        print(e.message);     // "negatif değere izin verilmez"
    }
    return 0;
}
```

## Hataların Yayılması

Hatalar fonksiyon çağrıları boyunca yukarı doğru yayılır. Bir fonksiyon
hatayı yakalamazsa, hata çağırana iletilir:

```c
void level3() {
    int[] arr = [1, 2, 3];
    int bad = arr[99];        // hata burada
}

void level2() {
    level3();                 // hata buradan yayılır
}

int main() {
    try {
        level2();             // burada yakalanır
    } catch (Error e) {
        print(1);             // çalışır
    }
    return 0;
}
```

## `switch` ile Hatalar

`e.code` üzerinde `switch` yapabilirsiniz:

```c
try {
    int[] arr = [1];
    int x = arr[10];
} catch (Error e) {
    switch (e.code) {
        case 1:  print("dizi indeksi sınır dışı");
        case 2:  print("sıfıra bölme");
        default: print("bilinmeyen hata");
    }
}
```

## Önemli Notlar

- saQut **denetlenmeyen** (unchecked) hatalar kullanır (Java/C# çalışma zamanı
  istisnaları gibi). Fonksiyonlar `throws` ile işaretlenmez; nerede
  yakalanacağına geliştirici karar verir.
- Çalışma zamanı hataları (null erişimi, sınır dışı, sıfıra bölme)
  yakalanabilir; programı çökertmezler.
- `throw` bir string mesaj kabul eder, bu mesaj `e.message` olur.
- Henüz bir `finally` bloğu yoktur (planlanan: gelecekte `defer`).

## Sırada Ne Var?

- Token'ları, AST'yi, sembolleri ve IR'yi incelemek için [derleyici araçlarını](/tr/compiler-tools/) öğrenin
