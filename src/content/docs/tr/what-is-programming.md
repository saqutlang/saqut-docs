---
title: Programlama Nedir
description: Hiç kod yazmamış kişiler için programlamaya nazik bir giriş.
---

Daha önce hiç kod yazmadıysan bu sayfa tam sana göre. Programlamanın ne
olduğunu, "değişken" veya "döngü" gibi terimleri bildiğini varsaymadan,
en temelden anlatır.

## Program nedir

Program, bilgisayara verdiğin talimatlar listesidir. Bilgisayar bunları tek
tek, yukarıdan aşağıya, tam yazdığın gibi uygular. Tahmin etmez, sıkılmaz,
yorulmaz. Sadece çalıştırır.

Bir yemek tarifi gibi düşün. Tarif der ki: unu al, su ekle, karıştır, fırına
koy. Program der ki: şu sayıyı al, beş ekle, sonucu yaz. Aynı mantık, farklı
mutfak.

## Değişkenlere neden ihtiyaç duyarız

Yemek yaparken malzemeleri sonradan kullanmak için kaplara koyarsın. Programda
**değişken** o kaptır. Bir isim verir, içine değer koyarsın:

```c
int yas = 25;
string isim = "Ali";
```

Daha sonra bu değeri okuyabilir ya da değiştirebilirsin. Program senin için
hatırlar.

## Koşullara neden ihtiyaç duyarız

Bazı tarifler "hamur çok kuruysa su ekle" der. Bu bir **koşuldur**. Programlar
da aynısını yapar:

```c
if (puan > 50) {
    print("Geçtin!");
}
```

Süslü parantez `{ }` içindeki satır yalnızca `puan` 50'den büyükse çalışır.
Değilse program o kısmı atlar.

## Döngülere neden ihtiyaç duyarız

Bir tarif düşün: "hamuru 100 kere yoğur." Kimse bunu 100 ayrı satır olarak
yazmak istemez. **Döngü** der ki: "şunu yap, sonra tekrar yap, ta ki bir koşul
sağlanana kadar." En sık kullanılan döngü `for` döngüsüdür:

```c
for (int i = 0; i < 5; i = i + 1) {
    print(i);
}
```

Bu kod `0`, `1`, `2`, `3`, `4` yazar. Üç satır koddan beş satır çıktı. Döngü,
her adımı elle yazmak yerine tekrarlayan işi makinenin yapmasını sağlar.

## Fonksiyonlara neden ihtiyaç duyarız

Tarifin büyüdükçe aynı alt tarifi birden fazla yerde kullandığını fark
edersin: "temel sosu hazırla" üç ayrı yemekte geçer. Tekrar etmek yerine ona
bir isim verir, o isimle çağırırsın. Programlamada buna **fonksiyon** denir:

```c
int ikiKati(int x) {
    return x * 2;
}
```

Artık `ikiKati(5)` sana programın her yerinde `10` verir. Bir kere yaz, çok
kere kullan.

## Hepsini bir araya getirelim

Gerçek bir program bunların hepsini birleştirir:

```c
int primHesapla(int maas) {
    if (maas > 5000) {
        return maas / 10;
    }
    return 0;
}

int main() {
    print(primHesapla(6000));   // 600
    print(primHesapla(3000));   // 0
    return 0;
}
```

Bir değişken (`maas`), bir koşul (`if`), bir fonksiyon (`primHesapla`) ve bir
çıktı (`print`). Eksiksiz, çalışan bir program.

## Buradan nereye

Artık değişken, koşul, döngü ve fonksiyon kavramlarının ne işe yaradığını
zihninde oturttuğuna göre, bu bölümün devamı sana her birini saQut içinde
nasıl kullanacağını öğretir. [Değişkenlerle](/tr/variables/) başla.
