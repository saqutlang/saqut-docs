---
title: Standart Kütüphane
description: saQut standart kütüphane modüllerine genel bakış, import modeli ve capability sistemi.
---

saQut'un standart kütüphanesi, programlarınıza dosya sistemi, ağ, sistem
bilgisi, matematik ve tarih erişimi sağlayan **import-kapılı modüllerden**
oluşur. Her zaman erişilebilir olan yerleşik fonksiyonların (`.upper()`,
`.append()`) aksine, standart kütüphane fonksiyonları açıkça import edilmelidir.

## Import nasıl çalışır

Her modül tırnaksız adıyla import edilir:

```c
import { readFile, writeFile } from fs;
import { sqrt, abs } from math;
```

Tırnaklı ad dosya yolunu, tırnaksız ad standart kütüphane modülünü belirtir:

```c
import { selamla } from "./yardimci.sqt";   // dosya
import { readFile } from fs;                // stdlib modülü
```

Birden fazla fonksiyonu tek ifadede import edebilir veya `*` ile hepsini
alabilirsin:

```c
import * from fs;              // tüm fs fonksiyonları
import { readFile } from fs;   // yalnızca biri
```

## Capability kapıları

Bazı modüller **çalışma zamanı izni** gerektirir. saQut varsayılan olarak tüm
dış erişimi reddeder. Komut satırından izin verirsin:

```bash
saqut run --allow fs prog.sqt
saqut run --allow fs,net,sys prog.sqt
```

| Capability | Neye izin verir |
|---|---|
| `fs` | Dosya sistemi erişimi (okuma, yazma, listeleme) |
| `net` | Ağ erişimi (HTTP, soket) |
| `sys` | Sistem çağrıları: güncel zaman, rastgele sayı, ortam değişkenleri, argümanlar |

Capability gerektiren fonksiyonlar bunu bildirir (`requires fs`). Import işlemi
tek başına reddedilmez; fonksiyon çağrıldığında çalışma zamanı aktif capability
kümesini kontrol eder. Capability yoksa çağrı `E_CAP_MISSING` ile başarısız olur.

Bir programın hangi capability'lere ihtiyaç duyduğunu çalıştırmadan
sorgulayabilirsin:

```bash
saqut ir --capabilities prog.sqt
```

## Modül dizini

| Modül | Import | Gerektirir | Durum |
|---|---|---|---|
| Dosya sistemi | `fs` | `--allow fs` | Kullanılabilir |
| Sistem | `sys` | `--allow sys` | Kullanılabilir |
| Matematik | `math` | yok | Kullanılabilir |
| Tarih | `date` | `--allow sys` (yalnızca `now()`) | Kullanılabilir |
| Ağ | `net` | `--allow net` | Planlandı (0.9) |

## Hiçbir yerden import edilmez

Yerleşik tip metotları (`.upper()`, `.append()`, `.toJson()`) standart
kütüphanenin parçası değildir. UFCS (Uniform Function Call Syntax) nokta
gösterimiyle çağrılır ve import gerektirmeden her zaman kullanılabilir.
Bkz. [Yerleşik Fonksiyonlar (UFCS)](/tr/builtin-functions/).
