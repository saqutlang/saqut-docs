---
title: Capability & İzinler
description: --allow nasıl çalışır, üç capability kategorisi ve çalışma zamanı denetimi.
---

saQut açık bir capability politikası kullanır. `--allow` verilmezse şu anda
tanımlı üç capability'nin tamamı açıktır. `--allow` verilirse bu seçenek bir
whitelist olur ve yalnızca listelenen capability'ler açılır.

## Üç capability

| Capability | Bayrak | Açtıkları |
|---|---|---|
| Dosya sistemi | `--allow fs` | `readFile`, `writeFile`, `readDir`, `exists`, `remove` |
| Ağ | `--allow net` | HTTP istekleri, soketler (planlanan 0.9) |
| Sistem | `--allow sys` | `random`, `randomRange`, `env`, `args`, `sleep`, `date::now()` |

Birden fazla capability virgülle ayrılır:

```bash
saqut run --allow fs,net prog.sqt
saqut run --allow fs,net,sys prog.sqt
```

Eski `--allow-fs`, `--allow-net` ve `--allow-sys` biçimleri geçerli değildir.

## Denetim nasıl çalışır

Capability denetimi, korumalı fonksiyon çağrıldığı anda yapılır:

Capability isteyen bir fonksiyonu import etmek, capability o anda kapalı olsa
bile serbesttir. VM çağrıdan hemen önce aktif capability kümesini kontrol eder.
Capability yoksa çağrı `E_CAP_MISSING` ile başarısız olur. Böylece
`caps::drop("fs")` gibi dinamik değişiklikler sonraki çağrılarda etkili olur;
import işlemi tek başına reddedilmez.

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

Programın aktif capability'lerini çalışma zamanında sorgulayabilirsin. CLI
politikası ve çağrı öncesi çalışma zamanı denetimi sınırı uygular; bir modülü
import etmek tek başına capability vermez.
