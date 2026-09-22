---
title: utf8 (Metin Kodlama)
description: saQut'un utf8 modülüyle byte[] ile string arasında dönüşüm.
---

`utf8` modülü, saQut'un metni gösterdiği iki biçim arasında dönüşüm yapar:
karakter dizisi olan `string` ve bayt dizisi olan `byte[]`.

```c
import { encode, decode } from utf8;
```

Bu ayrım önemlidir, çünkü dosyalar, standart girdi ve ağdan gelen veri
bayttır. saQut onlar için bir kodlama varsaymaz.
[`fs::readFile`](/tr/stdlib-fs/) size `byte[]` verir; onu metne çevirmek
`decode` ile bilinçli olarak attığınız bir adımdır.

## `byte[] encode(string text)`

Metni UTF-8 baytlarına kodlar.

```c
import { encode } from utf8;

int main() {
    byte[] veri = encode("merhaba");
    print(veri.length());     // 7
    return 0;
}
```

## `string decode(byte[] data)`

UTF-8 baytlarını metne geri çözer.

```c
import { encode, decode } from utf8;

int main() {
    byte[] veri = encode("merhaba");
    print(decode(veri));      // merhaba
    return 0;
}
```

## Karakter bayt değildir

ASCII dışındaki metinlerde iki sayım birbirinden ayrılır. saQut bir `string`'i
Unicode kod noktası olarak sayar, `byte[]` ise bayt sayar:

```c
import { encode } from utf8;

int main() {
    string kelime = "çğüş";
    print(kelime.length());              // 4  karakter
    print(encode(kelime).length());      // 8  bayt
    return 0;
}
```

Bu dört karakterin her biri UTF-8'de iki bayt tutar. Bir emoji ya da CJK
karakteri daha fazlasını tutar. Bir `byte[]`'i rastgele bir konumdan kesmenin
karakteri ortadan bölebilmesinin, `string` üzerindeki `substring` metodunun ise
bölememesinin nedeni budur.

Metin demek istediğinizde `string`, dosya içeriği ya da hat verisi demek
istediğinizde `byte[]` ile çalışın. Dönüşümü sınırda, bir kez yapın.

## Gidiş dönüş

```c
import { readFile, writeFile } from fs;
import { encode, decode } from utf8;

int main() {
    writeFile("not.txt", encode("merhaba"));

    byte[] ham = readFile("not.txt");
    string metin = decode(ham);

    print(metin);        // merhaba
    return 0;
}
```

## Fonksiyonların tam listesi

| Fonksiyon | Döndürür | İşlevi |
|---|---|---|
| `encode(text)` | `byte[]` | Metinden UTF-8 baytlarına |
| `decode(data)` | `string` | UTF-8 baytlarından metne |

İkisi de saf hesaptır: aynı girdi her zaman aynı çıktıyı üretir.
