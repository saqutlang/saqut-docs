---
title: Değişkenler
description: saQut'ta değişkenleri nasıl oluşturacağınızı, adlandıracağınızı ve kullanacağınızı öğrenin.
---

**Değişken (variable)**, bir değeri tutan adlandırılmış bir kutudur. İçine değer
koyabilir, daha sonra o değere bakabilir ya da yerine başka bir değer
koyabilirsiniz.

## Değişken Bildirimi

Bir değişken oluşturmak için önce **türü**, ardından **adını** yazın:

```c
int score;
```

Bu, `score` adında, tam sayı tutabilen bir değişken oluşturur. Başlangıç değeri
`0`'dır.

Başlangıç değerini `=` kullanarak hemen de verebilirsiniz:

```c
int score = 10;
float pi = 3.14;
bool isReady = true;
string name = "saQut";
```

Genel biçim şöyledir:

```
<tür> <ad> [= <başlangıç değeri>];
```

## Varsayılan Değerler

Bir başlangıç değeri vermezseniz, değişken sıfır dengi bir değerle başlar:

| Tür | Varsayılan Değer |
|------|------------------|
| `int` | `0` |
| `float` | `0.0` |
| `bool` | `false` |
| `string` | `""` (boş) |
| `byte` | `0` |
| Nullable türler (`int?`, `string?`) | `null` |
| `struct` | Tüm alanlar sıfır/varsayılan |
| `int[]` (dizi) | `null` (kullanılmadan önce atanmalıdır) |

## Yeni Bir Değer Atama

Bir değişkenin değerini değiştirmek için `=` kullanın:

```c
int x = 5;
x = 10;       // x artık 10
x = x + 3;    // x artık 13
```

## Adlandırma Kuralları

Değişken adları şunları içerebilir:

- Harfler (`a`–`z`, `A`–`Z`)
- Rakamlar (`0`–`9`)
- Alt çizgi (`_`)
- Dolar işareti (`$`)

Ad **rakamla başlayamaz**.

```c
int age;          // geçerli
int _counter;     // geçerli
int 2ndPlace;     // GEÇERSİZ, rakamla başlar
int total$;       // geçerli
```

Adlar **büyük/küçük harfe duyarlıdır**: `score` ile `Score` iki farklı
değişkendir.

## Kapsam (Scope)

Bir değişken yalnızca bildirildiği `{ }` bloğunun içinde yaşar.

```c
int main() {
    int a = 5;       // 'a' buradan itibaren var

    if (a > 0) {
        int b = 10;  // 'b' yalnızca bu if bloğunda var
        a = b;       // GEÇERLİ, 'a' burada görünür
    }

    // b = 20;       HATA, 'b' burada yok

    return 0;
}
```

## Yerel ve Global Değişkenler

Bir fonksiyonun (ya da bir bloğun) **içinde** bildirilen değişken **yereldir
(local)**: yalnızca orada yaşar ve fonksiyonun her çağrısı kendine ait yepyeni
bir kopya alır.

Dosyanın **en üst seviyesinde** (tüm fonksiyonların dışında) bildirilen
değişken ise **globaldir**. Program boyunca yaşar ve **herhangi** bir fonksiyon
onu okuyup yazabilir:

```c
int counter = 0;        // global, en üst seviyede bildirildi

void increment() {
    counter = counter + 1;   // global değişkeni okur ve yazar
}

int main() {
    increment();
    increment();
    print(counter);          // 2
    return 0;
}
```

- **Yereller** varsayılandır; onları tercih edin. Her fonksiyonun verisini
  kendi içinde tutar ve programı anlamayı kolaylaştırır.
- **Globaller** az miktarda paylaşılan durum için kullanışlıdır; ancak
  *herhangi* bir fonksiyon onları değiştirebileceğinden, aşırı kullanımı
  programın takibini zorlaştırır.

> Yerel/global değişkenler ve çağrı yığını (call stack) hakkında ayrıntılı bir
> sayfa planlanmaktadır. Şimdilik: yereller fonksiyon/blok içinde yaşar;
> globaller en üst seviyede bulunur ve paylaşılır.

## Sabitler?

saQut'ta henüz bir `const` anahtar sözcüğü yoktur. Teamül, bir değişken
oluşturup ona tekrar atama yapmamaktır; derleyici size güvenir.

## Sık Yapılan Hatalar

```c
int x = 5;
int x = 10;       // HATA, 'x' bu kapsamda zaten bildirildi
```

```c
int a;
int b = a + 5;    // GEÇERLİ, 'a' 0 olduğundan 'b' 5 olur
```

## Sırada Ne Var?

- saQut'taki tüm [veri türlerini](data-types/) görün
- Değerlerle çalışmak için [işleçleri](operators/) öğrenin
