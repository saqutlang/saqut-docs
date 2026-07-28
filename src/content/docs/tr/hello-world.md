---
title: Merhaba Dünya
description: İlk saQut programınızı yazın ve çalıştırın.
---

Bu sayfa ilk saQut programınızı yazmanızı, çalıştırmanızı ve anlamanızı
sağlar. Derleyiciyi henüz kurmadıysanız önce [Hızlı Başlangıç](/tr/getting-started/)
rehberini takip edin.

## Yazın

`hello.sqt` adında bir dosya oluşturun:

```c
int main() {
    print("Merhaba dünya!");
    return 0;
}
```

Bu dört satır programın tamamıdır.

## Her satır ne yapıyor

```c
int main() {
```

`main` bir fonksiyondur. Her saQut programında bir tane bulunması zorunludur;
program buradan çalışmaya başlar. `int` dönüş tipidir; `main` işletim
sistemine bir tamsayı döndürür.

```c
    print("Merhaba dünya!");
```

`print()` terminale metin yazar. Argümanı olan `"Merhaba dünya!"` bir **metin
sabitidir**; çift tırnak arasındaki karakter dizisi. Her ifade `;` ile sonlanır.

```c
    return 0;
```

`main`'den `0` döndürmek "her şey yolunda gitti" anlamına gelir. `{ }`
işaretleri ifadeleri bir blok halinde gruplandırır.

## Çalıştırın

```bash
saqut run hello.sqt
```

Kaynak koddan derlediyseniz komut `./build/saqut run hello.sqt` olacaktır.

Çıktı:

```
Merhaba dünya!
```

## Birkaç değişiklik deneyin

`print()` içindeki metni değiştirip tekrar çalıştırın:

```c
int main() {
    print("saQut'tan merhaba!");
    return 0;
}
```

İkinci bir `print()` ekleyin:

```c
int main() {
    print("Birinci satır");
    print("İkinci satır");
    return 0;
}
```

Her `print()` kendi satırına yazar.

## Sıradaki adım

Artık bir programı çalıştırabildiğinize göre, veriyi saklamayı ve adlandırmayı
[değişkenler](/tr/variables/) sayfasında öğrenin. Programın genel yapısını
(fonksiyonlar, bloklar, giriş noktası) daha ayrıntılı öğrenmek isterseniz
[Hızlı Başlangıç](/tr/getting-started/#program-yapisi) rehberine bakabilirsiniz.
