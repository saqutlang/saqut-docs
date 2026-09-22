---
title: os / terminal (Ortam)
description: Platform, mimari, makine adı, çekirdek sayısı ve çıktının terminale gidip gitmediği.
---

Bu iki modül, programın üzerinde çalıştığı makineyle ilgili soruları yanıtlar.
Yalnızca okurlar; buradaki hiçbir şey sistemi değiştirmez.

```c
import { osName, osArch, osHostname, osUser, osCpuCount } from os;
import { isTTY } from terminal;
```

## os

| Fonksiyon | Döndürür | Örnek |
|---|---|---|
| `osName()` | `string` | `linux`, `windows` |
| `osArch()` | `string` | `x86_64` |
| `osHostname()` | `string` | Makinenin ağ adı |
| `osUser()` | `string?` | Geçerli kullanıcı, belirlenemezse `null` |
| `osCpuCount()` | `int` | Mantıksal işlemci sayısı |

```c
import { osName, osArch, osCpuCount } from os;

int main() {
    print(osName());        // linux
    print("\n");
    print(osArch());        // x86_64
    print("\n");
    print(osCpuCount());    // 8
    print("\n");
    return 0;
}
```

`osUser()` dönüş tipi `string?`'dır, çünkü geçerli kullanıcı her zaman
belirlenemez; kullanmadan önce `null` denetimi yapın.

Bunlar tanı amaçlı değerlerdir. Bir ortamı raporlamak ya da bir işin boyutunu
belirlemek için kullanın; bir özelliğin var olup olmadığına karar vermek için
değil: bir dosyanın var olup olmadığını sormak, bunu platform adından çıkarmaya
çalışmaktan daha çok şey söyler.

## terminal

### `bool isTTY()`

Standart çıktının gerçek bir terminale bağlı olup olmadığı. Çıktı bir dosyaya
yönlendirildiğinde ya da başka bir programa borulandığında `false` olur.

```c
import { isTTY } from terminal;

int main() {
    if (isTTY()) {
        print("=== Rapor ===\n");   // okuyan bir insan var
    } else {
        print("rapor\n");           // ayrıştıran bir program var
    }
    return 0;
}
```

Çıktının süslenip süslenmeyeceğine karar veren denetim budur. Derleyici kendi
çıktısı için aynı kararı verir: `saqut ir` terminalde renkli, yönlendirildiğinde
düz metin basar; böylece borulanan çıktı temiz kalır.

Bir ANSI renk kodu basmak için kaçış baytını kendiniz kurmanız gerekir, çünkü
metin sabitleri yalnızca `\n`, `\t`, `\r`, `\b`, `\\` ve `\"` kaçışlarını
destekler. `\x1b` ya da `\u001b` yoktur:

```c
import { decode } from utf8;

string kacis() {
    byte[] esc = [27 as byte];      // ESC, onluk 27
    return decode(esc);
}
```

## Tekrarlanabilirlik

Bu sayfadaki her fonksiyon ortamla ilgili bir şey bildirir; bu yüzden aynı
program başka bir makinede ya da çıktısı yönlendirildiğinde farklı değerler
basar. Sonucu her yerde birebir aynı olması gereken kodun dışında tutun.
