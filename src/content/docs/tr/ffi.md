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
ffi double sqrt(double x) : MATH_SQRT from math;
ffi byte[] readFile(string path, int? seek, int? size) : FS_READ_FILE from fs;
```

Her bildirim üç şeyi belirtir: **imza** (tip denetleyicinin kullandığı tipler),
**sembolik host kimliği** (C++ tarafındaki gerçeklemeye eşlenir) ve **modül**
(adı kapsama hangi import'un getirdiği).

Bu bildirimler derleyicinin C++ kaynağının içinde gizli değildir.
`src/internal/ffi.sqt` dosyasında dururlar; bu gerçek bir saQut dosyasıdır ve
derleme sırasında binary'ye gömülür. Yani editörde sözdizimi vurgulamasıyla
açılır, dil sunucusu da görür. Derleyicinin sağladığı bütün host
fonksiyonlarını tam imzalarıyla görmenin yetkili yolu o dosyayı okumaktır.

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

## Capability kapısı yok

Önceki sürümlerde host fonksiyonları bir capability sisteminin arkasındaydı:
bildirim `requires fs` yan tümcesi taşır, programı çalıştırmak da eşleşen bir
`--allow` bayrağı gerektirirdi. Bu sistem 0.9.4'te kaldırıldı (ADR-043). Host
çağrıları varsayılan olarak açıktır, `requires` yan tümcesi yoktur ve `--allow`
diye bir bayrak bulunmaz.

Host fonksiyonunu hâlâ kapı arkasında tutan şey import'tur: içe aktarmadığınız
bir ad kapsamda değildir, dolayısıyla bir dosyanın erişebileceği dış
fonksiyonlar kümesi o dosyanın en üstünde görünür.

## print() de bir FFI'dır

Hello World'den beri kullandığın `print()` fonksiyonu da bir host
fonksiyondur. Her zaman kullanılabilir olmasının nedeni, import gerektirmeyen
`core` modülüne ait olmasıdır.

## Kendi host fonksiyonunu yazmak

Bu ileri seviye bir konudur. Kısaca: gömülü root'a `ffi` bildirimi ekle,
C++ gövdesini `host_functions.hpp` içinde gerçekle, yeni bir `HostFnId` ata
ve saQut'u yeniden derle. Adım adım talimatlar için [katkı
rehberine](https://github.com/saqutlang/saqut/blob/main/CONTRIBUTING.md) bak.

## FFI vs. standart kütüphane

| Ne | Mekanizma | Import gerekir |
|---|---|---|
| `s.upper()`, `dizi.push()` | UFCS yerleşik | Hayır |
| `readFile()`, `sqrt()` | FFI (stdlib) | Evet |
| `print()` | FFI (core) | Hayır |

Standart kütüphane, derleyiciyle birlikte gelen bir FFI bildirimleri
kümesidir. `import { readFile } from fs` yazarken FFI mekanizmasını görmezsin
çünkü bağlantılar zaten yapılmıştır. Ama ihtiyacın olursa genişletmen için
dikiş yeri oradadır.
