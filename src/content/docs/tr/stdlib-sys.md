---
title: sys (Sistem)
description: Rastgele sayı, ortam değişkenleri, komut satırı argümanları ve bekleme; saQut'un sys modülü.
---

`sys` modülü sistem seviyesindeki özelliklere erişim sağlar. Tüm fonksiyonlar
çalışma zamanında `--allow sys` gerektirir.

## Import

```c
import { random, randomRange, env, args, sleep } from sys;
```

## Fonksiyonlar

### random

Rastgele pozitif bir tamsayı döndürür.

```c
import { random } from sys;

int main() {
    int r = random();
    print(r);     // örn. 1634872934
    return 0;
}
```

Sonuç genel amaçlı bir CSPRNG'den gelir. Kriptografik rastgelelik için
planlanan `crypto` modülünü kullan.

### randomRange

`min` (dahil) ile `max` (hariç) arasında rastgele bir tamsayı döndürür.

```c
import { randomRange } from sys;

int main() {
    int zar = randomRange(1, 7);   // 1 ile 6 arası
    print(zar);
    return 0;
}
```

### env

Bir ortam değişkeninin değerini döndürür; tanımlı değilse boş string.

```c
import { env } from sys;

int main() {
    string ev = env("HOME");
    print(ev);     // örn. "/home/saqut"
    return 0;
}
```

### args

Programa geçirilen komut satırı argümanlarını string dizisi olarak döndürür.

```c
import { args } from sys;

int main() {
    string[] a = args();
    for (int i = 0; i < a.length; i = i + 1) {
        print(a[i]);
    }
    return 0;
}
```

İlk eleman (`a[0]`) program adıdır; sonraki elemanlar argümanlardır.

```bash
saqut run --allow sys prog.sqt merhaba dunya
# a[0] = "prog.sqt"
# a[1] = "merhaba"
# a[2] = "dunya"
```

### sleep

Programı verilen saniye kadar bekletir (ondalıklı değer desteklenir).

```c
import { sleep } from sys;

int main() {
    print("bekleniyor...");
    sleep(1.5);
    print("tamam");
    return 0;
}
```

## sys erişimiyle çalıştırma

```bash
saqut run --allow sys program.sqt
```
