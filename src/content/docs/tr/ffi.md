---
title: FFI (Yabancı Fonksiyon Arayüzü)
description: saQut'un FFI arayüzü ile C/C++ host fonksiyonlarını nasıl çağırdığı.
---

saQut tasarım gereği küçük bir dildir. Şimdiye kadar yazılmış her kütüphaneyi
yeniden yazmayı hedeflemez. Bunun yerine, C ve C++ koduna açılan tek ve
kontrollü bir kapı sunar: **FFI (Foreign Function Interface)**.

## FFI ne işe yarar

FFI, saQut içinden C veya C++ ile yazılmış fonksiyonları çağırmanı sağlar. Bu
**host fonksiyonlar** derleyicinin içinde özel bir dosyada bildirilir ve sayısal
kimlikle dağıtılır. Standart kütüphaneyi (`fs`, `math`, `sys`, `date`)
kullanmak için C kodu yazman gerekmez; bu senin için zaten yapılmıştır.

FFI'yı doğrudan şu durumlarda kullanırsın:
- saQut'a kendi host fonksiyonunu eklerken
- saQut'u daha büyük bir C++ uygulamasına betik motoru olarak gömerken

## Nasıl çalışır

Host fonksiyonlar derleyicinin gömülü `root.sqt` dosyasında `ffi` anahtar
kelimesiyle bildirilir:

```
ffi float sqrt(float x) : MATH_SQRT from math;
ffi string readFile(string path) : FS_READFILE from fs requires fs;
```

Her bildirim şunları belirtir: **imza** (tip denetimi için), **sembolik host
kimliği** (C++ `HostFnId` enum'una eşlenir), **modül** (import-kapısı için)
ve isteğe bağlı olarak **capability** ve kararlılık bayrağı.

Sen şunu yazdığında:

```c
import { sqrt } from math;

int main() {
    print(sqrt(81));   // 9.0
    return 0;
}
```

- Import kapısı `math`'i gömülü modüle çözer
- `sqrt` çağrısı IR'de `CALLHOST MATH_SQRT` komutuna dönüşür
- VM `HostFnId` enum'u üzerinden C++ fonksiyonuna O(1) dağıtım yapar
- Sonuç saQut değeri olarak geri itilir

String eşleştirme yok. Çalışma zamanı yansıması yok. Tek bir sayısal dağıtım.

## Capability ve FFI

VM dışına çıkan host fonksiyonlar (dosya I/O, ağ, sistem çağrıları)
`requires fs` (veya `net`, `sys`) bildirmek zorundadır. Derleyici ve çalışma
zamanı bunu denetler. `requires` olmayan bir host fonksiyonu saftır ve
`--allow` bayrağı gerektirmez.

## print() de bir FFI'dır

Hello World'den beri kullandığın `print()` fonksiyonu da bir host
fonksiyondur (`: PRINT from core`). Her zaman kullanılabilir olmasının nedeni,
import gerektirmeyen ve capability istemeyen `core` modülünde bildirilmiş
olmasıdır.

## Kendi host fonksiyonunu yazmak

Bu ileri seviye bir konudur. Kısaca: gömülü root'a `ffi` bildirimi ekle,
C++ gövdesini `host_functions.hpp` içinde gerçekle, yeni bir `HostFnId` ata
ve saQut'u yeniden derle. Adım adım talimatlar için [katkı
rehberine](https://github.com/saqutlang/saqut/blob/main/CONTRIBUTING.md) bak.

## FFI vs. standart kütüphane

| Ne | Mekanizma | Import gerekir | Capability gerekir |
|---|---|---|---|
| `s.upper()`, `dizi.append()` | UFCS yerleşik | Hayır | Hayır |
| `readFile()`, `sqrt()` | FFI (stdlib) | Evet | Fonksiyona bağlı |
| `print()` | FFI (core) | Hayır | Hayır |

Standart kütüphane, derleyiciyle birlikte gelen bir FFI bildirimleri
kümesidir. `import { readFile } from fs` yazarken FFI mekanizmasını görmezsin
çünkü bağlantılar zaten yapılmıştır. Ama ihtiyacın olursa genişletmen için
dikiş yeri oradadır.
