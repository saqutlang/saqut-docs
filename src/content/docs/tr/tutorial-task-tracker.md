---
title: Görev Takip Programı
description: Adım adım takip ederek sıfırdan küçük ama gerçek bir program yaz. Struct, dizi, döngü, fonksiyon ve if/else konularını tek bir örnekte birleştir.
---

Parçaları öğrendin. Şimdi onları bir araya getir. Bu rehber, adım adım küçük
bir **görev takip programı** yazmanı sağlar. Sonunda görevleri saklayan,
tamamlandı olarak işaretleyen ve özet çıkaran çalışan bir programın olacak.

## Ne inşa ediyoruz

Program şunları yapmana izin verecek:

- Başlık ve öncelikle (Düşük, Orta, Yüksek) görev ekleme
- Bir görevi tamamlandı olarak işaretleme
- Tüm görevleri durumlarıyla birlikte listeleme

Bir oturum şöyle görünür:

```
--- Görevler ---
[ ] Market alışverişi (Orta)
[x] Faturaları öde (Yüksek)
[ ] Annemi ara (Düşük)
Tamamlanan: 1 / 3
```

## Adım 1: Veriyi tanımla

İki şeye ihtiyacımız var: bir görevi temsil edecek yapı ve birden fazla
görevi saklayacak yer.

```c
enum Oncelik { Dusuk, Orta, Yuksek }

struct Gorev {
    string baslik;
    Oncelik oncelik;
    bool   tamamlandi;
}
```

`enum Oncelik` bize üç isimlendirilmiş seviye verir. `struct Gorev` bir
başlığı, önceliği ve tamamlanma durumunu tek bir birimde toplar. `gorevler.sqt`
adında bir dosya oluştur ve bunu en üste koy.

## Adım 2: Görev listesini sakla

Görevleri bir dizide tutacağız. Kaç görev olacağını bilmediğimiz için boş
bir diziyle başlayıp sonuna ekleyeceğiz:

```c
Gorev[] gorevler;
```

Görev oluşturup ekleyen bir fonksiyon yaz:

```c
void gorevEkle(string baslik, Oncelik oncelik) {
    Gorev g;
    g.baslik     = baslik;
    g.oncelik    = oncelik;
    g.tamamlandi = false;
    gorevler.append(g);
}
```

`gorevler.append(g)`, `g`'yi dizinin sonuna koyar ve diziyi bir büyütür.

## Adım 3: Görevi tamamlandı olarak işaretle

Bir görevi konumuna göre bulup işaretlemenin yolunu yazalım:

```c
void tamamlandiIsaretle(int indeks) {
    if (indeks >= 0 && indeks < gorevler.length) {
        gorevler[indeks].tamamlandi = true;
    }
}
```

`if` kontrolü sınırların dışına çıkmayı engeller.

## Adım 4: Listeyi yazdır

Şimdi her görevin üzerinde dönüp yazdıralım:

```c
string oncelikEtiketi(Oncelik o) {
    switch (o) {
        case Oncelik.Dusuk:  return "Düşük";
        case Oncelik.Orta:   return "Orta";
        case Oncelik.Yuksek: return "Yüksek";
    }
    return "";
}

void gorevleriYazdir() {
    print("--- Görevler ---");
    int tamamSayisi = 0;
    for (int i = 0; i < gorevler.length; i = i + 1) {
        string kutu = "[ ]";
        if (gorevler[i].tamamlandi) {
            kutu = "[x]";
            tamamSayisi = tamamSayisi + 1;
        }
        print(kutu + " " + gorevler[i].baslik +
              " (" + oncelikEtiketi(gorevler[i].oncelik) + ")");
    }
    print("Tamamlanan: " + (tamamSayisi as string) + " / " +
          (gorevler.length as string));
}
```

## Adım 5: Hepsini birleştir

Şimdi `main` her şeyi birbirine bağlar:

```c
int main() {
    gorevEkle("Market alışverişi", Oncelik.Orta);
    gorevEkle("Faturaları öde",    Oncelik.Yuksek);
    gorevEkle("Annemi ara",        Oncelik.Dusuk);

    tamamlandiIsaretle(1);   // ikinci görev (indeks 1)

    gorevleriYazdir();
    return 0;
}
```

## Programın tamamı

İşte dosyanın tam hali:

```c
enum Oncelik { Dusuk, Orta, Yuksek }

struct Gorev {
    string baslik;
    Oncelik oncelik;
    bool   tamamlandi;
}

Gorev[] gorevler;

void gorevEkle(string baslik, Oncelik oncelik) {
    Gorev g;
    g.baslik     = baslik;
    g.oncelik    = oncelik;
    g.tamamlandi = false;
    gorevler.append(g);
}

void tamamlandiIsaretle(int indeks) {
    if (indeks >= 0 && indeks < gorevler.length) {
        gorevler[indeks].tamamlandi = true;
    }
}

string oncelikEtiketi(Oncelik o) {
    switch (o) {
        case Oncelik.Dusuk:  return "Düşük";
        case Oncelik.Orta:   return "Orta";
        case Oncelik.Yuksek: return "Yüksek";
    }
    return "";
}

void gorevleriYazdir() {
    print("--- Görevler ---");
    int tamamSayisi = 0;
    for (int i = 0; i < gorevler.length; i = i + 1) {
        string kutu = "[ ]";
        if (gorevler[i].tamamlandi) {
            kutu = "[x]";
            tamamSayisi = tamamSayisi + 1;
        }
        print(kutu + " " + gorevler[i].baslik +
              " (" + oncelikEtiketi(gorevler[i].oncelik) + ")");
    }
    print("Tamamlanan: " + (tamamSayisi as string) + " / " +
          (gorevler.length as string));
}

int main() {
    gorevEkle("Market alışverişi", Oncelik.Orta);
    gorevEkle("Faturaları öde",    Oncelik.Yuksek);
    gorevEkle("Annemi ara",        Oncelik.Dusuk);

    tamamlandiIsaretle(1);

    gorevleriYazdir();
    return 0;
}
```

Çalıştır:

```bash
saqut run gorevler.sqt
```

Çıktı:

```
--- Görevler ---
[ ] Market alışverişi (Orta)
[x] Faturaları öde (Yüksek)
[ ] Annemi ara (Düşük)
Tamamlanan: 1 / 3
```

## Bu programda kullanılanlar

| Kavram | Nerede |
|---|---|
| `enum` | Öncelik seviyeleri |
| `struct` | Görev verisi |
| Dizi | Görev listesi |
| Fonksiyon | `gorevEkle`, `tamamlandiIsaretle`, `oncelikEtiketi`, `gorevleriYazdir` |
| `for` döngüsü | Görevler üzerinde dönme |
| `if` / `else` | Onay kutusu ve sınır kontrolü |
| `switch` | Öncelik etiketi |
| `as` (dönüşüm) | `int`'i `string`'e çıktı için |
| String birleştirme | `print()` içinde `+` |
| `.length` | Dizi boyutu |
| `.append()` | Diziye ekleme |

## Kendi başına dene

- İndekse göre görev silen bir `gorevSil` fonksiyonu ekle
- Görevleri yüksek öncelikliler önce gelecek şekilde sırala
- Görev başlıklarını kullanıcıdan oku (şimdilik bir yer tutucuyla)
- `Gorev` struct'ına bir son tarih alanı ekle

Bu program önceki sayfalardaki özellikleri tek bir yerde birleştirir: `struct`
ve `enum` ile veri modelleme, bir dizide saklama, `for` döngüsüyle yineleme,
koşullar, bir `switch` ve biçimlendirilmiş çıktı. Yukarıdaki alıştırmalar onu
aynı tarzda genişletir.
