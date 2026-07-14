---
title: Hızlı Başlangıç
description: saQut'u kurun ve ilk programınızı çalıştırın.
---

saQut'a hoş geldiniz. Bu rehber, derleyiciyi edinmeyi, ilk programınızı yazmayı
ve bir saQut projesinin temel yapısını kavramayı adım adım anlatır.

## saQut'u Edinin

import { LinkCard, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <LinkCard
    title="Kaynak koddan derleyin"
    description="C++17, CMake ≥ 3.16, Ninja. Adım adım derleme talimatları README'de."
    href="https://github.com/saqutlang/saqut#readme"
  />
  <LinkCard
    title="Hazır sürümü indirin"
    description="Linux x86-64 için önceden derlenmiş ikili dosya. En son sürümü GitHub Releases'ten alın."
    href="https://github.com/saqutlang/saqut/releases"
  />
</CardGrid>

### Kaynak koddan derleme (terminal)

saQut **C++17**, **CMake ≥ 3.16** ve **Ninja** gerektirir.

```bash
git clone https://github.com/saqutlang/saqut
cd saqut
cmake -B build -G Ninja
cmake --build build
```

Derlenen ikili dosya `build/saqut` altında oluşur. Linux (x86-64) üzerinde test
edilmiştir. macOS ve Windows denenmemiştir ancak platforma özgü kod
kullanılmadığı için çalışmaları beklenir.

Çalıştığını doğrulayın:

```bash
./build/saqut --help
```

Kullanılabilir komutların bir listesini görmelisiniz.

## İlk Programınız

`hello.sqt` adında bir dosya oluşturun:

```c
int main() {
    print("Hello, world!");
    return 0;
}
```

Çalıştırın:

```bash
./build/saqut run hello.sqt
```

Çıktı:

```
Hello, world!
```

Az önce ilk saQut programınızı derleyip çalıştırdınız.

## Program Yapısı

Bir saQut programı, **fonksiyon tanımları** ve **global değişken
bildirimlerinden** oluşan bir listedir. Zorunlu bir `class` ya da hazır kalıp
kod (boilerplate) yoktur; yürütme `main` adlı fonksiyondan başlar.

```c
// Önce fonksiyon tanımları gelir
int greet(string name) {
    print("Hello");
    print(name);
    return 0;
}

// Ardından giriş noktası
int main() {
    greet("saQut");
    return 0;
}
```

Her ifade `;` ile sonlanır. Bloklar `{ }` ile sarılır.

## `print()` Fonksiyonu

`print()` yerleşik bir **konak (host) fonksiyondur**: saQut koduyla değil,
bizzat derleyicinin içinde C++ ile gerçeklenmiştir. Herhangi bir türde tek bir
argüman alır ve onu terminale yazar:

```c
print(42);           // tamsayı
print(3.14);         // ondalıklı sayı
print("text");       // metin
print(true);         // mantıksal, "1" ya da "0" çıktısı verir
```

## Sırada Ne Var?

- Veriyi saklamayı ve adlandırmayı öğrenmek için [değişkenler](variables/) sayfasına bakın
- Hangi değer türlerinin bulunduğunu keşfetmek için [veri türlerini](data-types/) inceleyin
- İfadelerle denemeler yapmak için etkileşimli `saqut exec` komutunu deneyin
