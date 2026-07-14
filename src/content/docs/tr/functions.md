---
title: Fonksiyonlar
description: Fonksiyon tanımlama, çağırma ve değer döndürme.
---

Bir **fonksiyon**, tekrar kullanılabilir bir kod bloğudur. Bir isim verir,
isteğe bağlı olarak veri aktarır ve isteğe bağlı olarak veri alırsınız.

## Fonksiyon Tanımlama

```c
dönüşTipi fonksiyonAdı(parametreTipi parametreAdı, ...) {
    // gövde
    return değer;
}
```

```c
int add(int a, int b) {
    return a + b;
}
```

- **Dönüş tipi** (`int`, `float`, `bool`, `string`, `void`, vb.) zorunludur
  ve en başta gelir
- Ardından **isim** gelir
- **Parametreler** parantez içinde, her biri bir tip ve bir isimle yazılır
- **Gövde** `{ }` içinde yer alır
- `return` çağırana bir değer gönderir

## `void` Fonksiyonlar

Bir fonksiyon hiçbir şey döndürmüyorsa `void` kullanın:

```c
void greet(string name) {
    print("Hello");
    print(name);
    // return gerekmez
}
```

## Bir Fonksiyonu Çağırma

```c
int main() {
    int result = add(3, 4);
    print(result);          // 7

    greet("saQut");         // "Hello" "saQut"
    return 0;
}
```

## Parametreler Yerel Kopyalardır

İlkel tipler (`int`, `float`, `bool`, `byte`) için fonksiyon, değerin bir
**kopyasını** alır. Fonksiyon içinde değiştirmek çağıranı etkilemez:

```c
void change(int x) {
    x = 100;            // sadece yerel kopyayı değiştirir
}

int main() {
    int a = 5;
    change(a);
    print(a);           // 5, değişmedi
    return 0;
}
```

Bileşik tipler (`struct`, `dizi`, `string`) için fonksiyon bir **referans**
alır: içeriği değiştirmek çağıranın verisini etkiler.

## Birden Fazla Parametre

Parametreleri virgülle ayırın:

```c
int multiply(int a, int b, int c) {
    return a * b * c;
}

int main() {
    print(multiply(2, 3, 4));   // 24
    return 0;
}
```

## Erken `return`

Fonksiyonun herhangi bir yerinden dönebilirsiniz:

```c
int divide(int a, int b) {
    if (b == 0) {
        return 0;               // erken dönüş, koruma koşulu
    }
    return a / b;
}
```

## Özyineleme (Recursion)

Bir fonksiyon kendini çağırabilir:

```c
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    print(factorial(5));        // 120
    return 0;
}
```

### Hanoi Kuleleri

```c
void hanoi(int n, int from, int to, int aux) {
    if (n == 0) { return; }
    hanoi(n - 1, from, aux, to);
    print(from);
    print(to);
    hanoi(n - 1, aux, to, from);
}

int main() {
    hanoi(3, 1, 3, 2);
    return 0;
}
```

## `main()` Fonksiyonu

Her program `main()` ile başlar. Mutlaka bulunmalı ve `int` döndürmelidir:

```c
int main() {
    // kodunuz
    return 0;
}
```

`0` döndürmek genellikle başarılı anlamına gelir. Sıfırdan farklı değerler
bir hata olduğunu belirtir.

## Bileşik Tipleri Referansla Aktarmak

Yukarıdaki "yerel kopya" kuralı **ilkel tipler** için geçerlidir. Bileşik
tipler (`struct`, `dizi`, `string`) **referans ile** aktarılır: fonksiyon
aynı alt veriyi alır, dolayısıyla yaptığı değişiklikler çağıran tarafından
görülür:

```c
void fill(int[] a) {
    a[0] = 99;          // çağıranın dizisini değiştirir
}

int main() {
    int[] x = [1, 2, 3];
    fill(x);
    print(x[0]);        // 99, değişiklik kalıcı oldu
    return 0;
}
```

Aynı durum struct'lar için de geçerlidir: bir alanı değiştiren fonksiyon,
çağıranın struct'ını da değiştirir. (Bkz. [referans anlamsallığı](/structs/#referans-anlamsalligi).)
Bu verimlidir (kopyalama yoktur) ancak bir fonksiyonun kendisine
aktarılanı *değiştirebileceği* anlamına gelir. Bunu istemiyorsanız,
fonksiyon parametresine yazmaktan kaçınmalıdır.

## Bileşik Tipleri Döndürmek

Bir **struct** döndürmek tam olarak beklediğiniz gibi çalışır: çağıran,
dönen değere bir referans alır:

```c
struct Point { int x; int y; }

Point origin() {
    Point p;
    p.x = 0;
    p.y = 0;
    return p;
}
```

> **Kısıtlama: dizi dönüş tipleri desteklenmez.** Şu anda
> `int[] makeList() { ... }` yazamazsınız: dizi dönüş tipi ayrıştırılamaz.
> Geçici çözüm, diziyi bir struct içine sarıp onu döndürmektir:
>
> ```c
> struct IntList { int[] items; }
>
> IntList range() {
>     IntList r;
>     r.items = [1, 2, 3];
>     return r;
> }
> ```
>
> Alternatif olarak, diziyi bir referans parametresi olarak alıp yerinde
> doldurabilirsiniz (yukarıdaki `fill` örneğine bakın).

## Bilinmesi Gereken Kısıtlamalar

- **Aşırı yükleme (overloading) yok.** Bir fonksiyon adı tek bir fonksiyona
  işaret eder; aynı isimle farklı parametrelere sahip iki fonksiyon
  tanımlayamazsınız.
- **Varsayılan parametre değeri yok.** Her parametre açıkça belirtilmelidir;
  argüman sayısı eşleşmelidir (aksi halde [`E008`](/compiler-errors/#e008--function-call-argument-mismatch)
  alırsınız).
- **İç içe fonksiyon yok.** Fonksiyonlar en üst düzeyde tanımlanır, asla
  başka bir fonksiyonun gövdesi içinde tanımlanamaz (bu [`E011`](/compiler-errors/#e011--declaration-inside-a-function-body)
  hatasıdır).
- **Derin özyineleme çağrı yığınını kullanır.** Her çağrı bir çerçeve ekler;
  aşırı derin özyineleme yığını tüketebilir, bu yüzden çok büyük girdiler
  için yinelemeli (iterative) bir sürümü tercih edin.

## Sık Yapılan Hatalar

### Yanlış argüman sayısı

```c
int add(int a, int b) { return a + b; }

int main() {
    add(1, 2, 3);       // HATA, 3 argüman, fonksiyon 2 bekliyor
    return 0;
}
```

### Yanlış dönüş tipi

```c
int getValue() {
    return 1.5;         // HATA, float döndürüyor, int olarak tanımlandı
}
```

### Eksik fonksiyon tanımı

```c
int main() {
    foo();              // HATA, 'foo' tanımlı değil
    return 0;
}
```

(Ancak ileri referanslar çalışır: iki geçişli sembol toplayıcı sayesinde
fonksiyon aynı dosyada daha sonra tanımlanmışsa sorun olmaz.)

## Sonra Ne Var?

- İlgili verileri [struct](/structs/) ile gruplandırın
- Dizileri saklamak için [dizileri](/arrays/) kullanın
