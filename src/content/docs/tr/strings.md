---
title: String'ler (Metinler)
description: Değişmez UTF-8 string'ler ile saQut'ta metinlerle çalışma.
---

Bir **string**, UTF-8 karakterlerinden oluşan bir dizidir. saQut'ta string'ler
**değişmez değer tipleridir**: birleştirme gibi işlemler, orijinali
değiştirmeden yeni bir string oluşturur.

## String Sabitleri (Literal)

String'ler çift tırnak ile yazılır:

```c
string s = "Hello, saQut!";
string empty = "";
string escaped = "Satır 1\nSatır 2";
```

String'ler içinde desteklenen kaçış dizileri:

| Kaçış | Anlamı |
|-------|--------|
| `\\` | Ters eğik çizgi |
| `\"` | Çift tırnak |
| `\n` | Yeni satır |
| `\t` | Sekme |
| `\r` | Satır başı |
| `\b` | Geri silme |

## Birleştirme (`+`)

String'leri birleştirmek için `+` kullanın. Bu **yeni** bir string oluşturur:

```c
string a = "Hello";
string b = "World";
string c = a + " " + b;     // "Hello World"
```

String'ler değişmez olduğu için `a` ve `b` değişmez.

Bir döngüde string oluşturmak:

```c
string result = "";
for (int i = 0; i < 10; i = i + 1) {
    result = result + "x";
}
print(result);              // "xxxxxxxxxx"
```

## Eşitlik (`==`)

String `==` **içeriği** karşılaştırır, kimliği değil:

```c
string a = "hello";
string b = "hello";
string c = "world";

print(a == b);              // true (aynı içerik)
print(a == c);              // false (farklı içerik)
```

Bu, Java'da `==` operatörünün referans kimliğini kontrol ettiği yaygın
tuzağı önler. String `!=` de beklendiği gibi çalışır.

String sıralama operatörleri (`<`, `>`, `<=`, `>=`) kullanılamaz.

```c
// if (a < b) { }          HATA
```

## String'e ve String'den Dönüştürme

`as` operatörünü kullanın:

```c
string s = 42 as string;          // "42"
string t = 3.14 as string;        // "3.14"

// String'den güvenli dönüşüm, nullable hedef kullanın
string input = "42";
int? n = input as int?;           // 42
if (n != null) { print(n); }

string bad = "hello";
int? m = bad as int?;             // null, bir sayı değil
```

## Yerleşik String Metotları

String'ler, nokta sözdizimi ile kullanılan eksiksiz bir yerleşik metot
setiyle gelir:

```c
string s = "  Hello, World!  ";

int len = s.length();             // 17
string upper = s.upper();         // "  HELLO, WORLD!  "
string lower = s.lower();         // "  hello, world!  "
string trimmed = s.trim();        // "Hello, World!"
```

### Tam Metot Referansı

| Metot | Dönüş | Açıklama |
|-------|-------|----------|
| `s.length()` | `int` | Karakter sayısı |
| `s.upper()` | `string` | Tümü büyük harf |
| `s.lower()` | `string` | Tümü küçük harf |
| `s.trim()` | `string` | Baştaki ve sondaki boşlukları temizle |
| `s.substring(start, length)` | `string` | `start`'tan başlayarak `length` karakter |
| `s.replace(old, new)` | `string` | Tüm eşleşmeleri değiştir |
| `s.repeat(count)` | `string` | String'i N kez tekrarla |
| `s.charAt(index)` | `string` | Belirtilen konumdaki karakter (1 karakterlik string olarak) |
| `s.split(separator)` | `string[]` | Ayraç ile diziye böl |
| `s.indexOf(substring)` | `int?` | İlk indis (bulunamazsa `null` döner) |
| `s.contains(substring)` | `bool` | Alt string'in var olup olmadığını kontrol et |
| `s.startsWith(prefix)` | `bool` | String'in bu önekle başlayıp başlamadığını kontrol et |
| `s.endsWith(suffix)` | `bool` | String'in bu sonekle bitip bitmediğini kontrol et |

> Yukarıdaki her metodun, uç durumlar dahil sıfırdan anlatımı için
> [Yerleşik Fonksiyonlar](/builtin-functions/#string-functions) sayfasına
> bakın.

### Örnekler

```c
string s = "Hello, saQut!";

// Uzunluk
print(s.length());                // 13

// Harf dönüşümü
string shout = s.upper();         // "HELLO, SAQUT!"
string whisper = s.lower();       // "hello, saqut!"

// Değiştirme
string greet = "hello world";
string replaced = greet.replace("world", "Alice");
print(replaced);                  // "hello Alice"

// Bölme
string data = "apple,banana,cherry";
string[] parts = data.split(",");
print(parts[0]);                  // "apple"
print(parts[1]);                  // "banana"
print(parts[2]);                  // "cherry"

// Kontrol ve bulma
string email = "user@example.com";
if (email.contains("@")) {
    print("geçerli email");
}

string name = "saQut";
if (name.startsWith("sa")) {
    print("evet");                // "evet"
}
```

## Önemli Notlar

- String'ler **değişmezdir**: bir kez oluşturulduktan sonra değiştirilemezler
- `string` bir değer tipi gibi davranır: `==` içeriği karşılaştırır
- Dahili olarak string'ler kısa olduklarında satır içinde (inline), uzun
  olduklarında heap'te saklanır
- UTF-8 kodlaması: ASCII olmayan bir karakter 1–4 byte uzunluğunda olabilir.
  Mevcut yerleşikler (`length()`, `substring()`, `charAt()`, `indexOf()`)
  **byte** bazında çalışır; bu yüzden ASCII metin için bir indis = bir
  karakterdir, ancak aksanlı veya Latin olmayan metinlerde tek bir karakter
  birden fazla byte konumunu kaplayabilir. Kod noktası/grapheme farkında
  yardımcılar eklenene kadar bunu aklınızda bulundurun

## Sonra Ne Var?

- Verileri [struct'lar](/structs/) ile gruplandırın
- [try/catch/throw](/error-handling/) ile hataları yönetin
