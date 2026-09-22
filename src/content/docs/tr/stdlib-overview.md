---
title: Standart Kütüphane
description: saQut standart kütüphane modüllerine genel bakış ve içe aktarmanın nasıl çalıştığı.
---

Standart kütüphane, dilin kendisinin tarif etmediği şeylere uzanan modüllerden
oluşur: dosyalar, saat, ortam değişkenleri, terminal. Her zaman kullanılabilir
olan yerleşik tip metotlarının (`.upper()`, `.push()`) aksine bu fonksiyonların
adıyla içe aktarılması gerekir.

## İçe aktarma nasıl çalışır

Her modül tırnaksız, adıyla içe aktarılır:

```c
import { readFile, writeFile } from fs;
import { sqrt, abs } from math;
```

Tırnaklı ad bir dosya yolu, tırnaksız ad bir standart kütüphane modülüdür:

```c
import { greet } from "./yardimcilar.sqt";   // başka bir dosya
import { readFile } from fs;                 // stdlib modülü
```

`as` ile içe aktarırken yeniden adlandırabilirsiniz; aynı adı dışa veren iki
modül çakıştığında çözüm budur:

```c
import { readFile as ayarOku } from fs;
```

Joker içe aktarma yoktur: kullandığınız her ad tek tek yazılmalıdır. `import *
from fs;` sözdizimi hatasıdır. Her içe aktarmanın adıyla yazılması, okuyanın
dosyanın en üstüne bakarak programın dışarıdan hangi fonksiyonlara
erişebildiğini görmesini sağlar.

## Modül dizini

| Modül | İçe aktarma | Kapsamı |
|---|---|---|
| Dosya sistemi | `fs` | Dosya ve dizin okuma, yazma, kopyalama, listeleme |
| Yol | `path` | Yol metinlerini birleştirme ve ayırma, diske erişmeden |
| UTF-8 | `utf8` | `byte[]` ile `string` arasında dönüşüm |
| Sistem | `sys` | Rastgele sayı, ortam değişkeni, argümanlar, bekleme |
| Süreç | `process` | Çıkış kodu, çalışma dizini, süreç kimliği |
| Standart girdi | `stdin` | Standart girdiden okuma |
| Standart çıktı | `stdout` | Standart çıktıya yazma |
| Standart hata | `stderr` | Standart hataya yazma |
| Matematik | `math` | Mutlak değer, min/maks, kök, üs, yuvarlama |
| Tarih | `date` | UTC zaman damgası, takvim alanları, biçimleme |
| İşletim sistemi | `os` | Platform adı, mimari, makine adı, çekirdek sayısı |
| Terminal | `terminal` | Çıktının gerçek bir terminale gidip gitmediği |
| Çekirdek | `core` | Derleyici sürümü |

Tablodaki her modül şu an kullanılabilir durumdadır. Ağ modülü yoktur: `net`
planlanmış ama yayınlanmamıştır, içe aktarmak hata verir.

## Belirlenimcilik

Bu fonksiyonların çoğu, verdiğiniz değerler üzerinde saf hesap yapar: aynı
girdi her koşuda aynı sonucu verir. Birkaçı ise programın dışındaki durumu
okur ve bunu vaat edemez:

| Fonksiyon | Neden değişir |
|---|---|
| `sys::random`, `sys::randomInt` | İşletim sistemi rastgeleliği |
| `sys::env`, `sys::args` | Programın nasıl başlatıldığına bağlı |
| `date::now` | Sistem saatini okur |
| `fs::*` | Dosya sistemi programın altından değişir |
| `stdin::*` | Neyin aktarıldığına bağlı |
| `os::*`, `terminal::isTTY` | Makineye ve çalıştırma biçimine bağlı |

Geri kalan her şey (bütün `math`, `path`, `utf8` ve `now()` dışındaki bütün
`date` fonksiyonları) yalnızca argümanlarından hesaplar.

## Standart kütüphaneye dahil olmayanlar

Yerleşik tip metotları (`.upper()`, `.push()`, `.length()`) içe aktarılmaz. Bir
değer üzerinde nokta ile çağrılır ve her zaman kullanılabilirler. Bkz.
[Yerleşik Fonksiyonlar (UFCS)](/tr/builtin-functions/).
