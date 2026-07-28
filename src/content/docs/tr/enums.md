---
title: Enum
description: Enum ile bir dizi isimlendirilmiş sabit tanımla; switch ve fonksiyon parametrelerinde kullan.
---

**Enum** (enumeration, sıralı liste), bir grup isimlendirilmiş sabit tanımlama
yöntemidir. `0`, `1`, `2` gibi anlamını ezberlemek zorunda kaldığın çıplak
sayılar yerine her değere bir isim verirsin.

## Enum tanımlamak

```c
enum Renk { Kirmizi, Yesil, Mavi }
```

Bu, `Renk` adında yeni bir tip ve üç olası değer oluşturur. Her değere `0`'dan
başlayan bir tamsayı indeks atanır: `Kirmizi` `0`, `Yesil` `1`, `Mavi` `2`.

## Enum kullanmak

Enum değerlerine nokta sözdizimiyle erişilir:

```c
Renk r = Renk.Yesil;
```

Enum değerini yazdırabilirsin; indeksini verir:

```c
print(Renk.Kirmizi);           // 0
print(Renk.Yesil);             // 1
print(Renk.Mavi);              // 2
```

## Switch ile enum

Enum ve `switch` doğal bir ikili oluşturur:

```c
enum Durum { Bekliyor, Aktif, Tamamlandi }

string durumAcikla(Durum d) {
    switch (d) {
        case Durum.Bekliyor:    return "beklemede";
        case Durum.Aktif:       return "devam ediyor";
        case Durum.Tamamlandi:  return "bitti";
    }
    return "";
}

int main() {
    Durum gorev = Durum.Aktif;
    print(durumAcikla(gorev));     // "devam ediyor"
    return 0;
}
```

Her `case` bir enum üyesini kapsar. Bir `switch`'in her üyeyi kapsaması zorunlu
değildir; tüketicilik (exhaustiveness) denetimi yoktur, bu yüzden bazı üyeler
işlenmiyorsa bir `default` ya da sonda bir `return` ekle.

## Enum'ları fonksiyon parametresi olarak kullanmak

Fonksiyonlara enum geçerek niyetini açıkça belirt:

```c
enum Yon { Kuzey, Dogu, Guney, Bati }

void ilerle(Yon y) {
    switch (y) {
        case Yon.Kuzey: print("yukari");   break;
        case Yon.Dogu:  print("saga");     break;
        case Yon.Guney: print("asagi");    break;
        case Yon.Bati:  print("sola");     break;
    }
}
```

Enum olmasaydı bu fonksiyon `int` alırdı ve `7` geçerli bir yön olmadığı halde
`ilerle(7)` derlenirdi. `Yon` parametresiyle tip denetleyici, `Yon` değeri
olmayan her argümanı reddeder.

## Enum değerleri tamsayıdır

Enum değerlerini karşılaştırabilir ve `int`'e dönüştürebilirsin:

```c
Yon y = Yon.Kuzey;
int indeks = y as int;         // 0

if (y == Yon.Kuzey) {
    print("kuzeye bakiyor");
}
```

Enum'lar doğrudan tamsayı **değildir**. Bir `Yon` değişkenine `0` atayamazsın;
`Yon.Kuzey` yazman gerekir. Bu, ilgisiz sabitlerin yanlışlıkla birbirine
karışmasını engeller.

## Neden int sabitler yerine enum

İki yaklaşımı karşılaştır:

```c
// int sabitlerle (hataya açık)
int SOLA_GIT  = 0;
int SAGA_GIT = 1;
int YUKARI_GIT = 2;

void ilerle(int yon) { /* ... */ }
ilerle(7);     // derlenir, hiçbir anlamı yok

// Enum ile (güvenli)
enum Hareket { Sola, Saga, Yukari }

void ilerle(Hareket yon) { /* ... */ }
// ilerle(7);                // derleme hatası
ilerle(Hareket.Sola);        // açık ve doğru
```

Enum ile `ilerle(7)`, anlamsız bir değerle çalışan bir çağrı yerine bir derleme
hatasıdır ve her çağrı yeri, çıplak bir tamsayı yerine geçirdiği değeri
adlandırır (`Hareket.Sola`).
