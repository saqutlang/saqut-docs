---
title: Capability & İzinler
description: --allow bayrakları nasıl çalışır, üç capability kategorisi ve A+B denetim modeli.
---

saQut programları **varsayılan olarak reddet** prensibiyle bir korumalı alanda
çalıştırır. Programın dosya sistemine, ağa veya sistem çağrılarına erişimi
yoktur; sen açıkça izin vermedikçe olmaz. Bu sayfa gerçek programlar yazan
pratisyenler için izin modelini açıklar.

## Üç capability

| Capability | Bayrak | Açtıkları |
|---|---|---|
| Dosya sistemi | `--allow fs` | `readFile`, `writeFile`, `readDir`, `exists`, `remove` |
| Ağ | `--allow net` | HTTP istekleri, soketler (planlanan 0.9) |
| Sistem | `--allow sys` | `random`, `randomRange`, `env`, `args`, `sleep`, `date::now()` |

Birden fazla capability virgülle ayrılır:

```bash
saqut run --allow fs,net prog.sqt
saqut run --allow fs --allow sys prog.sqt   // tekrarlanan bayrak da çalışır
```

## Denetim nasıl çalışır

saQut **iki katmanlı bir model** (A+B) kullanır:

**A Katmani: derleme zamani.** Capability gerektiren bir fonksiyonu import
ettiğinde (örn. `readFile` `fs` ister), derleyici eşleşen `--allow` bayrağının
verilip verilmediğini kontrol eder. Verilmediyse program hiç çalışmadan
derleme hatası alırsın.

**B Katmani: calisma zamani guvencesi.** A katmanı geçse bile, VM her
capability-kapılı çağrıdan önce tekrar kontrol eder. Bu, `caps::drop()` ile
program ortasında capability kaldırma gibi uç durumları yakalar. Çağrı
engellenirse program yakalanabilir bir `E_CAP_MISSING` hatası fırlatır.

## Capability sorgulama

Bir programın hangi capability'lere ihtiyaç duyduğunu çalıştırmadan
derleyiciye sorabilirsin:

```bash
saqut ir --capabilities prog.sqt
```

Çıktı:

```
fs, sys
```

Bu, import edilen tüm fonksiyonları tarar ve bildirdikleri her capability'yi
raporlar.

## caps modülü

`caps` modülü programının kendi izinlerini çalışma zamanında denetlemesini ve
yönetmesini sağlar:

```c
import { has, drop } from caps;

if (caps::has("fs")) {
    string veri = readFile("gizli.txt");
    caps::drop("fs");     // programın geri kalanı için fs'ten vazgeç
}
```

- `caps::has(ad)` capability şu anda aktifse `true` döndürür
- `caps::drop(ad)` kalıcı olarak kaldırır; geri alma yolu yoktur

Bu, en az yetki prensibini uygulamanı sağlar: bir capability'yi yalnızca
ihtiyacın olduğu sürece tutarsın.

## Pratisyenler için neden önemli

- Derleme betiğin kaynak dosyaları okuyup çıktı yazabilir ama soket acamaz;
  `--allow fs` yeterlidir
- HTTP istemci programin aga ihtiyac duyar ama dosya sistemine dokunmamalidir;
  yalnizca `--allow net` ver
- Ortam değişkeni ve komut satırı argümanı okuyan bir araç yalnızca
  `--allow sys` ister

Her program tam olarak neye ihtiyacı olduğunu beyan eder. Derleyici ve
çalışma zamanı bunu denetler. Gizli yetki yoktur.
