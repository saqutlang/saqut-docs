---
title: sys (Sistem)
description: saQut'un sys modülüyle rastgele sayılar, ortam değişkenleri, komut satırı argümanları ve bekleme.
---

`sys` modülü programın dışına uzanır: işletim sisteminin rastgelelik
kaynağına, ortam değişkenlerine, komut satırına ve saate. Sonucunu derleyicinin
önceden bilemeyeceği fonksiyonlar bunlardır; tek bir modülde toplanmalarının
nedeni de budur.

## İçe aktarma

```c
import { random, randomInt, env, args, sleep } from sys;
```

## `double random()`

`[0.0, 1.0)` aralığında sözde rastgele bir `double` döndürür. Sıfır gelebilir,
`1.0` gelemez. Parametre almaz.

```c
import { random } from sys;

int main() {
    double r = random();
    print(r);     // örneğin 0.8846772796
    return 0;
}
```

Baytlar C'nin `rand()` fonksiyonundan değil, işletim sisteminin CSPRNG'sinden
gelir. Bu diziyi öngörülemez kılar; ayrıca **aynı programın iki çalıştırması
farklı değerler üretir** demektir. Tekrarlanabilir bir koşu gerekiyorsa
`random()` çağırmayın.

## `int randomInt(int lo, int hi)`

`[lo, hi)` yarı açık aralığında rastgele bir `int`: `lo` gelebilir, `hi`
gelemez.

```c
import { randomInt } from sys;

int main() {
    int zar = randomInt(1, 7);   // 1 ile 6 arası
    print(zar);
    return 0;
}
```

Üst sınırın dışarıda kalması, `randomInt(0, dizi.length())` çağrısını her
zaman geçerli bir indeks yapan şeydir.

## `string? env(string name)`

Bir ortam değişkeninin değeri; tanımlı değilse `null`. Dönüş tipi `string?`
olduğu için kullanmadan önce null durumunun ele alınması gerekir.

```c
import { env } from sys;

int main() {
    string? home = env("HOME");
    if (home != null) {
        print(home);
    } else {
        print("HOME tanimli degil");
    }
    return 0;
}
```

## `string[] args()`

Programa verilen argümanlar, sırasıyla.

```c
import { args } from sys;

int main() {
    string[] a = args();
    int i = 0;
    while (i < a.length()) {
        print(a[i]);
        print("\n");
        i = i + 1;
    }
    return 0;
}
```

Programa gidecek argümanlar `--` işaretinden sonra yazılır; bu işaret onları
derleyicinin kendi bayraklarından ayırır:

```bash
saqut run prog.sqt -- merhaba dunya
```

```
a[0] = "merhaba"
a[1] = "dunya"
```

`a[0]` program adı değil, **ilk argümandır**. Dizi yalnızca `--` işaretinden
sonrasını tutar; argümansız çalıştırılan bir program boş dizi alır ve
`a.length()` `0` olur.

## `void sleep(int millis)`

Programı verilen milisaniye kadar bekletir. Parametre `int`'tir:
`sleep(1500)` bir buçuk saniye bekler, `sleep(1.5)` ise derleme hatası verir,
çünkü `int` beklenen yerde ondalık sabit kullanılamaz.

```c
import { sleep } from sys;

int main() {
    print("bekleniyor...\n");
    sleep(1500);
    print("bitti\n");
    return 0;
}
```

## Belirlenimcilik

`random()`, `randomInt()` ve `env()` programın dışındaki durumu okur; bu yüzden
aynı kaynak iki koşuda farklı çıktı verebilir. saQut standart kütüphanesindeki
geri kalan her şey, verdiğiniz değerler üzerinde saf hesap yapar. Bir programın
tekrarlanabilir olması gerekiyorsa ilk bakılacak yer bu modüldür.
