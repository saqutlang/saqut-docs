---
title: Nullable Tipler
description: Değeri null olabilecek durumlar için T? kullanımı, derleme zamanı güvenliğiyle.
---

Her değişken her zaman bir değere sahip olmayabilir. Bazen bir fonksiyon aradığını
bulamaz, bir sorgu sonuç döndürmez veya bir alan henüz atanmamıştır. saQut bu
durumları **nullable tipler** ile yönetir.

## Nullable tanımlamak

Herhangi bir tipin sonuna `?` ekleyerek nullable yapabilirsin:

```c
int? belkiSayi = 42;
belkiSayi = null;              // geçerli

string? belkiIsim = "Ali";
belkiIsim = null;              // geçerli
```

Nullable olmayan bir değişken `null` alamaz:

```c
int normalSayi = 42;
// normalSayi = null;          // derleme hatası
```

Bu denetim tamamen derleme zamanında yapılır. Denetim çalışma zamanına maliyet
eklemez ve null olamaz bir değişken, çalışma boyunca hiçbir anda `null`
tutamaz.

## Null güvenliği: önce kontrol etmelisin

Nullable bir değeri doğrudan kullanamazsın. Derleyici, değeri kullanmadan önce
`null` olmadığını kanıtlamanı ister:

```c
int? x = degerGetir();

// print(x);                   // derleme hatası: x null olabilir

if (x != null) {
    print(x);                  // geçerli, x burada null olmayacak biçimde daraltıldı
}
```

`if (x != null)` bloğunun içinde tip denetleyici tipi `int?`'ten `int`'e
**daraltır**. Buna akışa duyarlı tiplendirme denir.

## Bileşik tiplerle nullable

Struct, dizi ve metin tiplerinin hepsi nullable olabilir:

```c
struct Nokta { int x; int y; }

Nokta? belkiNokta = null;
belkiNokta = Nokta(10, 20);

if (belkiNokta != null) {
    print(belkiNokta.x);       // geçerli
}

int[]? belkiListe = null;
string? belkiMetin = null;
```

## Fonksiyon dönüşlerinde nullable

Sonuç üretemeyebilecek bir fonksiyon nullable tip döndürmelidir:

```c
int? indeksBul(int[] dizi, int hedef) {
    for (int i = 0; i < dizi.length; i = i + 1) {
        if (dizi[i] == hedef) {
            return i;
        }
    }
    return null;               // bulunamadı
}
```

Çağıran taraf sonucu kontrol eder:

```c
int[] sayilar = [10, 20, 30];
int? konum = indeksBul(sayilar, 20);

if (konum != null) {
    print(konum);              // 1
} else {
    print("bulunamadı");
}
```

## Varsayılan değer

Başlangıç değeri verilmeden tanımlanan nullable değişken `null` olur:

```c
int? x;                        // x null
string? s;                     // s null
```

## Özet

- `T?`, değerin null olabileceği anlamına gelir
- Tip denetleyici, nullable bir değerin önce kontrol edilmeyen her kullanımını reddeder
- `if (x != null)` tipi blok içinde null olmayacak biçimde daraltır
- Çalışma zamanında hiçbir yük yoktur; tüm denetimler derleme zamanındadır
- Sonuç üretemeyebilecek fonksiyonlar `T?` döndürür
