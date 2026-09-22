---
title: İşleçler
description: saQut'taki aritmetik, karşılaştırma, mantıksal, bitsel ve atama işleçleri.
---

saQut aşağıda listelenen işleçleri sağlar. Ayrıştırıcı **Pratt ayrıştırması
(Pratt parsing)** kullanır: her işlecin bir öncelik seviyesi ve bir birleşme
yönü vardır; böylece `-2 + -5` gibi bir ifade tek ve belirsizliksiz bir ağaca
ayrıştırılır.

## İşleç Öncelik Tablosu

Yüksek sayı = önce değerlendirilir.

| Seviye | Kategori | İşleçler | Birleşme |
|--------|----------|----------|----------|
| 18 | Üye erişimi / çağrı | `.` `[ ]` `( )` | Sol |
| 17 | Sonek | `++` `--` | Sol |
| 16 | Tekil önek | `++` `--` `+` `-` `!` `~` | Sağ |
| 15 | Üs alma | `**` | **Sağ** |
| 14 | Çarpma / Bölme / Modül | `*` `/` `%` | Sol |
| 13 | Toplama / Çıkarma | `+` `-` | Sol |
| 12 | Bitsel kaydırma | `<<` `>>` | Sol |
| 11 | İlişkisel | `<` `<=` `>` `>=` | Sol |
| 10 | Eşitlik | `==` `!=` | Sol |
| 9 | Bitsel VE | `&` | Sol |
| 8 | Bitsel XOR | `^` | Sol |
| 7 | Bitsel VEYA | `\|` | Sol |
| 6 | Mantıksal VE | `&&` | Sol |
| 5 | Mantıksal VEYA | `\|\|` | Sol |
| 2 | Atama | `=` `+=` `-=` `*=` vb. | **Sağ** |

> **Sağ-birleşmeli:** `a = b = 5` → `a = (b = 5)`
>
> **Üçlü işleç yok:** saQut'ta `?:` koşul operatörü yoktur. `?` yalnızca tip
> konumunda nullable işareti olarak görünür (`int?`, `Point?`), ifadelerde asla.
>
> **Virgül işleci yok:** `,` yalnızca argümanları, parametreleri ve dizi
> elemanlarını ayırır. Bir ifade işleci değildir; `(a, b)` sözdizimi hatasıdır.
>
> **Üs alma `**`:** sağ-birleşmelidir; `2 ** 3 ** 2` → `2 ** (3 ** 2)` = 512.
> `^` bir üs işleci **değildir**, bitsel XOR'dur (`2 ^ 3` = 1).
>
> **Sol-birleşmeli:** `10 - 4 - 3` → `(10 - 4) - 3` = 3

## Aritmetik İşleçler

```c
int sum = 10 + 5;       // 15
int diff = 10 - 5;      // 5
int product = 10 * 5;   // 50
int quotient = 10 / 5;  // 2
int remainder = 10 % 3; // 1

int neg = -10;          // tekil eksi
int pos = +10;          // tekil artı
```

### Üs Alma

`**` sol operandı sağ operandın kuvvetine yükseltir. **Sağ-birleşmelidir**:
`2 ** 3 ** 2` ifadesi `2 ** (3 ** 2)` yani 512'dir. Çarpmadan daha sıkı bağlar:
`2 * 3 ** 2` sonucu 18'dir.

```c
int kup = 2 ** 3;           // 8
int buyuk = 3 ** 5;         // 243

double taban = 2.0;
double kok = taban ** 0.5;   // 1.414213562
double yarim = taban ** -1.0; // 0.5 (ondalıkta negatif üs geçerlidir)
```

Tamsayılarda sonuç tamdır: `**` kayan noktadan geçmek yerine tekrarlı çarpma
yapar, bu yüzden büyük değerlerde hassasiyet kaybı olmaz ve taşma diğer tamsayı
aritmetiğiyle aynı şekilde sarar. **Tamsayıda negatif üs** çalışma zamanı
hatasıdır (`E_POWNEG`), çünkü gerçek sonuç kesirli olurdu. Kesirli sonuç
istiyorsanız `2.0 ** -1.0` yazın.

`decimal` tipi `**` işlecini desteklemez: ölçeği sabittir, dolayısıyla sonuç
genel durumda temsil edilemez. Önce dönüştürün: `deger as double ** us`.

`^` bir üs işleci değil, bitsel XOR'dur: `2 ^ 3` sonucu `8` değil `1`'dir.

### Artırma ve Azaltma

Hem **sonek** (`x++`) hem **önek** (`++x`) biçimleri vardır. Yan etkileri
aynıdır; ifadenin ürettiği değerde ayrışırlar. Sonek **değişiklikten önceki**,
önek **sonraki** değeri döndürür:

```c
int x = 5;
int y = x++;            // y = 5, x = 6   (eski değer)

int w = 5;
int v = ++w;            // v = 6, w = 6   (yeni değer)
```

`float`, `double`, `longint` ve `byte` dahil her sayısal tipte çalışır:

```c
float f = 1.5;  f++;    // 2.5
byte b = 255;   b++;    // 0 (8 bite sarar, diğer byte aritmetiği gibi)
```

Operand **yazılabilir bir konum** olmalıdır. Değişkenler, dizi elemanları ve
struct alanları bu koşulu sağlar:

```c
int[] a = [10, 20];
a[0]++;                 // a[0] = 11

Nokta p;
p.x++;                  // p.x = 1
```

Bunların dışındaki her şey derleme hatasıdır; `5++` ya da `f()++` sessizce göz
ardı edilmek yerine reddedilir. Nullable operand da reddedilir; önce null
denetimi yapın.

## Karşılaştırma İşleçleri

Tüm karşılaştırma işleçleri `bool` (`true` veya `false`) döndürür.

```c
int a = 5;
int b = 10;

bool eq  = a == b;      // false
bool neq = a != b;      // true
bool lt  = a <  b;      // true
bool lte = a <= b;      // true
bool gt  = a >  b;      // false
bool gte = a >= b;      // false
```

Karşılaştırmalar `int`, `float` ve `bool` (`int` olarak saklandığı için)
türlerinde çalışır. `string`, `==` ve `!=` işleçlerini (içerik karşılaştırması)
destekler ancak `<`, `>` gibi işleçleri desteklemez.

## Mantıksal İşleçler

```c
bool a = true;
bool b = false;

bool and = a && b;       // false
bool or  = a || b;       // true
bool not = !a;           // false
```

`&&` ve `||` işleçleri **kısa devre (short-circuit)** çalışır: sağ tarafı
yalnızca gerektiğinde değerlendirir.

```c
int x = 0;

// Sol taraf false olduğu için sağ taraf hiç çalışmaz
if (false && (x = 10)) { }
// x hâlâ 0

// Sol taraf true olduğu için sağ taraf hiç çalışmaz
if (true || (x = 20)) { }
// x hâlâ 0
```

## Bitsel İşleçler

`int` değerler üzerinde, bit bit çalışır.

```c
int a = 0b1100;         // 12
int b = 0b1010;         // 10

int and = a & b;        // 0b1000 = 8
int or  = a | b;        // 0b1110 = 14
int xor = a ^ b;        // 0b0110 = 6
int not = ~a;           // tüm bitleri ters çevirir

int left  = a << 2;     // 0b110000 = 48
int right = a >> 2;     // 0b0011 = 3
```

## Atama İşleçleri

Basit atama:

```c
int x = 5;
```

Bileşik atamalar bir işlemi atamayla birleştirir. **Sağ-birleşmelidir**:
`a += b += 5` → `a += (b += 5)`.

```c
int x = 10;

x += 5;     // x = 15
x -= 3;     // x = 12
x *= 2;     // x = 24
x /= 4;     // x = 6
x %= 4;     // x = 2
x &= 3;     // x = 2
x |= 8;     // x = 10
x ^= 5;     // x = 15
x <<= 1;    // x = 30
x >>= 1;    // x = 15
```

## Tür Dönüşüm İşleci (`as`)

`as` işleci uyumlu türler arasında dönüşüm yapar. Ara konumlu (infix) ve
sol-birleşmelidir.

```c
float pi = 3.14;
int n = pi as int;          // 3 (sıfıra doğru budar)

string s = 42 as string;    // "42"

int? maybe = "3.14" as int?;  // null (dönüşüm başarısız)
```

[Tür dönüşümü hakkında daha fazlası...](#tür-dönüşüm-i̇şleci-as)

## Sırada Ne Var?

- [if-else](/tr/if-else/) yapısının karşılaştırma işleçlerini nasıl kullandığını görün
- Tekrar için [döngüleri](/tr/loops/for-loop/) öğrenin
