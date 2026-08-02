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

### `float random()`

`[0.0, 1.0)` aralığında rastgele bir `float` döndürür. `0.0` dönebilir,
ancak `1.0` dönmez. Bu fonksiyon parametre almaz.

```c
import { random } from sys;

int main() {
    float r = random();
    print(r);     // örn. 1634872934
    return 0;
}
```

Sonuç genel amaçlı bir CSPRNG'den gelir. Kriptografik rastgelelik için
planlanan `crypto` modülünü kullan.

### `int randomInt(int min, int max)`

`min` dahil ve `max` hariç olacak şekilde `[min, max)` aralığında rastgele bir
32-bit `int` döndürür. `min`, `max` değerinden küçük olmalıdır.

```c
import { randomRange } from sys;

int main() {
    int zar = randomRange(1, 7);   // 1 ile 6 arası
    print(zar);
    return 0;
}
```

### `string? env(string name)`

`name` ile belirtilen ortam değişkeninin değerini döndürür. Değişken yoksa
boş string yerine `null` döndürür.

```c
import { env } from sys;

int main() {
    string ev = env("HOME");
    print(ev);     // örn. "/home/saqut"
    return 0;
}
```

### `string[] args()`

Programa geçirilen komut satırı argümanlarını `string[]` olarak döndürür. Bu
fonksiyon parametre almaz.

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

### `void sleep(int millis)`

Programı `millis` milisaniye boyunca duraklatır. Parametre `int` türündedir;
ondalıklı saniye değeri kabul edilmez.

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
