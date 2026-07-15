---
title: Yerleşik Fonksiyonlar
description: saQut'un string, dizi ve struct tipleri için sunduğu yerleşik metotların tam referansı; her biri sıfırdan, çalıştırılabilir örneklerle anlatılıyor.
---

saQut, en sık kullandığınız tipler için bir dizi **yerleşik fonksiyon** ile
gelir: string'ler, diziler ve struct'lar. Bunları ne import edersiniz ne de
tanımlarsınız; her zaman kullanıma hazırdır. Bu sayfa, her birini temelden
başlayarak, çalıştırılabilir örneklerle açıklar.

Eğer daha önce hiç "metot" kullanmadıysanız bir sonraki bölümden başlayın.
Yalnızca imzalara bakmak isterseniz [hızlı referans tablolarına](#hızlı-referans) atlayın.

## Yerleşik bir fonksiyonu çağırmak

Yerleşik bir fonksiyonu **nokta çağrısı** sözdizimiyle çağırırsınız: değeri,
bir noktayı, metot adını ve varsa ek argümanları parantez içinde yazın:

```c
string name = "saqut";
print(name.upper());        // "SAQUT"
```

Bunu şöyle okuyun: *"`name`'i al, üzerine `upper` uygula."* Noktanın solundaki
değer, fonksiyonun üzerinde çalıştığı şeydir; parantez içindekiler ek
argümanlardır:

```c
string s = "hello world";
print(s.replace("world", "saQut"));   // s değer; "world" ve "saQut"
                                       // ise iki argüman
```

> **Nesne yönelimi değil.** Buradaki nokta yalnızca kullanışlı bir sözdizimidir.
> saQut'ta OOP anlamında sınıf, nesne veya tiplere bağlı metot yoktur.
> `name.upper()`, soldan sağa okunan sıradan bir fonksiyon çağrısının
> kısaltmasıdır.

Çoğu string yerleşiği yeni bir değer döndürdüğü için çağrıları
**zincirleyebilirsiniz**; her sonuç bir sonraki noktaya akar:

```c
string title = "Hello World Post";
print(title.lower().replace(" ", "-"));   // "hello-world-post"
```

---

## String fonksiyonları

saQut'ta string'ler **değişmezdir (immutable)**: bu fonksiyonların hiçbiri
orijinal string'i değiştirmez. Hepsi **yeni bir string** (veya sayı/bool)
döndürür. Sonucu saklamak isterseniz bir değişkene atayın.

```c
string s = "hello";
s.upper();          // "HELLO" hesaplanır ama ÇÖPE ATILIR, s değişmez
s = s.upper();      // İŞTE böyle saklanır, artık s "HELLO"
```

### `length()` (string ne kadar uzun?)

```c
print("hello".length());    // 5
print("".length());         // 0
```

String'deki **byte** sayısını sayar. Düz İngilizce/ASCII metin için bir byte =
bir karakter olduğundan beklediğiniz sonucu verir.

> **UTF-8 tuzağı.** saQut metni UTF-8 olarak saklar; ASCII olmayan karakterler
> birden fazla byte tutar. `length()` **görünen karakter sayısını değil**, byte
> sayısını döndürür:
>
> ```c
> print("café".length());   // 5, 4 değil; 'é' 2 byte
> ```
>
> Saf ASCII metin için bunu göz ardı edebilirsiniz. Uluslararası metinlerde
> `length()`, `substring()` ve `charAt()` fonksiyonlarının hep **byte**
> cinsinden çalıştığını unutmayın.

### `upper()` / `lower()` (büyük/küçük harf)

```c
print("Hello, World".upper());   // "HELLO, WORLD"
print("Hello, World".lower());   // "hello, world"
```

Bu ikisi **yalnızca ASCII harflerini** dönüştürür (`a`-`z` / `A`-`Z`). Aksanlı
ve Latin olmayan harfler olduğu gibi geçer:

```c
print("café".upper());   // "CAFé", 'é' BÜYÜTÜLMEZ
```

### `trim()` (çevredeki boşlukları temizle)

Boşluk, sekme ve satır sonu karakterlerini **her iki uçtan** siler (ortadakilere
dokunmaz):

```c
print("|" + "   hi   ".trim() + "|");   // "|hi|"
print("a b c".trim());                  // "a b c", içteki boşluklar kalır
```

Yaygın kullanım: kullanıcı girdisini karşılaştırmadan önce temizlemek.

```c
string input = "  yes  ";
if (input.trim() == "yes") {
    print("onaylandı");
}
```

### `replace(eski, yeni)` (metni değiştir, her yerde)

String fonksiyonlarının en kullanışlılarından biridir; bu yüzden tüm
detaylarıyla anlatıyoruz.

`replace`, string içinde `eski`'nin **her** geçtiği yeri bulur ve her birini
`yeni` ile değiştirip **yeni bir string** döndürür. Orijinal değişmez.

```c
string s = "the cat sat on the mat";
string r = s.replace("at", "og");
print(r);   // "the cog sog on the mog"
print(s);   // "the cat sat on the mat", orijinal aynı
```

Ne oldu adım adım: `replace("at", "og")` metni taradı ve `c-at`, `s-at`,
`m-at` içindeki `"at"`'leri bulup her birini `"og"` ile değiştirerek `cog`,
`sog`, `mog` yaptı. `the` kelimesinde `at` olmadığı için aynen kaldı.

**Tüm eşleşmeleri değiştirir, yalnızca ilkini değil.** Eğer yalnızca ilkini
değiştirmek isterseniz `replace` doğru araç değildir; her zaman tümünü değiştirir.

```c
print("a-a-a".replace("a", "X"));   // "X-X-X"  (üçü de)
```

**Yerine koyduğunuz metin daha kısa, daha uzun veya boş olabilir.** Boş bir
değiştirme metni, eşleşen kısmı *siler*:

```c
print("hello world".replace("l", ""));    // "heo word", bütün 'l'ler gitti
print("2024-01-15".replace("-", "/"));    // "2024/01/15"
print("a".replace("a", "bb"));            // "bb", 1 karakterden 2'ye büyüdü
```

**Eşleşmeler çakışmaz.** Bir eşleşme değiştirildikten sonra tarama, eklenen
metnin *sonundan* devam eder; yeni metin tekrar taranmaz:

```c
print("aaa".replace("aa", "b"));   // "ba", ilk "aa"→"b", bir "a" arttı
```

Pratik bir örnek: bir cümleyi URL dostu hale getirmek:

```c
string title = "Hello World Post";
string slug = title.lower().replace(" ", "-");
print(slug);   // "hello-world-post"
```

**Zincirlemeye** dikkat: `title.lower()` bir string döndürür ve biz hemen
sonucun üzerinde `.replace(...)` çağırırız. Her çağrı yeni bir string
döndürdüğü için soldan sağa sıralayabilirsiniz.

### `substring(baslangic, uzunluk)` (bir parça kes)

String'in **`baslangic` byte indisinden başlayarak**, `uzunluk` byte'ını
döndürür. İndisler **0**'dan başlar.

> **İkinci argümanı dikkatli okuyun.** Bu bir **uzunluktur (adet)**, *bitiş
> konumu değildir*. `substring(2, 3)` "2. indisten başla ve 3 karakter al"
> demektir; "2'den 3'e kadar" **değildir**.

```c
string s = "abcdef";       // indis:  a=0 b=1 c=2 d=3 e=4 f=5
print(s.substring(0, 2));  // "ab"   (0'dan başla, 2 al)
print(s.substring(2, 3));  // "cde"  (2'den başla, 3 al)
print(s.substring(1, 4));  // "bcde" (1'den başla, 4 al)
print(s.substring(0, 0));  // ""     (0 karakter al)
```

Kalan karakterden fazlasını isterseniz elinizde ne kaldıysa onu alırsınız
(hata vermez):

```c
print("abcdef".substring(4, 99));   // "ef"  (sadece 2 karakter kalmıştı)
```

`baslangic` değeri string'in sonunu aşarsa veya negatifse `try`/`catch` ile
yakalayabileceğiniz bir hata oluşur.

### `repeat(adet)` (N kopyayı uç uca ekle)

```c
print("ab".repeat(3));      // "ababab"
print("=".repeat(10));      // "==========", ayraçlar için birebir
print("x".repeat(0));       // ""          (sıfır kopya = boş string)
```

### `charAt(indis)` (bir konumdaki karakter)

`indis` byte konumundaki (0'dan başlar) **tek karakterlik bir string** döndürür.
saQut'ta ayrı bir "tek karakter" tipi yoktur, sonuç 1 uzunluklu bir string'tir.

```c
string s = "saqut";
print(s.charAt(0));    // "s"
print(s.charAt(4));    // "t"
```

Bir string üzerinde karakter karakter döngü (ASCII):

```c
string word = "hi!";
for (int i = 0; i < word.length(); i = i + 1) {
    print(word.charAt(i));
}
// s  →  h, i, !  (her biri ayrı satırda)
```

### `indexOf(parca)` (nerede geçiyor?)

`parca`'yı arar ve **ilk** geçtiği byte indisini döndürür. `parca`
bulunamazsa **`null`** döner; bu yüzden sonuç tipi `int?` (nullable)
olur. Sayıyı kullanmadan önce `null` kontrolü yapmalısınız.

```c
string s = "hello world";
int? at = s.indexOf("world");
if (at != null) {
    print(at);          // 6
}

int? missing = s.indexOf("xyz");
if (missing == null) {
    print("bulunamadı");
}
```

`null` dönmesi (C'deki `-1` geleneğinin aksine), "bulunamadı" durumunun
gerçek bir indis sanılarak sessizce geçiştirilmesini engeller; derleyici sizi
bu durumu ele almaya zorlar.

### `contains(parca)` (içinde var mı?)

`indexOf`'un evet/hayır versiyonu. `bool` döndürdüğü için `if` içinde temiz
okunur:

```c
string email = "user@example.com";
if (email.contains("@")) {
    print("e-posta gibi görünüyor");
}
```

### `startsWith(onek)` / `endsWith(sonek)`

String'in başını veya sonunu kontrol eder. İkisi de `bool` döndürür:

```c
string file = "report.pdf";
print(file.startsWith("report"));   // true
print(file.endsWith(".pdf"));       // true
print(file.endsWith(".txt"));       // false
```

### `split(ayrac)` (bir diziye böl)

String'i `ayrac`'ın geçtiği her yerden böler ve parçaların **`string[]`**
dizisini döndürür:

```c
string csv = "apple,banana,cherry";
string[] parts = csv.split(",");
print(parts.length());   // 3
print(parts[0]);         // "apple"
print(parts[2]);         // "cherry"
```

**Boş parçalar korunur.** İki ayraç yan yana gelirse arada boş string oluşur:

```c
string data = "a,b,,c";
string[] fields = data.split(",");
print(fields.length());        // 4
print("[" + fields[2] + "]");  // "[]", boş alan korundu
```

`split`, her bir parçayı işlemek için bir döngüyle doğal bir ikili oluşturur:

```c
string line = "10 20 30 40";
string[] nums = line.split(" ");
int total = 0;
for (int i = 0; i < nums.length(); i = i + 1) {
    int? n = nums[i] as int?;      // her parçayı çözümle
    if (n != null) { total = total + n; }
}
print(total);   // 100
```

---

## Dizi fonksiyonları

Diziler **referans tipidir**; bu fonksiyonların bir kısmı diziyi **yerinde
değiştirir** (aşağıda "değiştirir" diye işaretlenmiştir). Diziler
paylaşıldığı için, yerinde yapılan bir değişiklik aynı diziyi gösteren bütün
değişkenlerden görünür.

### `length()` (kaç eleman?)

```c
int[] a = [10, 20, 30];
print(a.length());   // 3
```

Döngünün üst sınırı olarak kullanın ki kodunuz her boyuta uyum sağlasın:

```c
for (int i = 0; i < a.length(); i = i + 1) {
    print(a[i]);
}
```

### `push(deger)` (sona ekle *(değiştirir)*)

`deger`'i dizinin sonuna ekler ve yerleştiği indisi döndürür:

```c
int[] a = [1, 2];
a.push(3);           // a artık [1, 2, 3]
int idx = a.push(4); // a artık [1, 2, 3, 4]
print(idx);          // 3, yeni elemanın indisi
```

### `pop()` (son elemanı çıkar *(değiştirir)*)

Son elemanı siler ve döndürür. Klasik yığın davranışı (son giren ilk çıkar):

```c
int[] a = [1, 2, 3];
int last = a.pop();  // last = 3, a artık [1, 2]
print(last);         // 3
print(a.length());   // 2
```

### `insert(indis, deger)` (ortaya ekle *(değiştirir)*)

`deger`'i, `indis` konumuna gelecek şekilde yerleştirir; sonraki bütün
elemanlar bir sağa kayar:

```c
int[] a = [10, 20, 30];
a.insert(1, 99);     // a artık [10, 99, 20, 30]
print(a[1]);         // 99
```

### `remove(indis)` (birini çıkar *(değiştirir)*)

`indis` konumundaki elemanı siler ve döndürür; boşluk kapanır:

```c
int[] a = [10, 20, 30];
int gone = a.remove(0);   // gone = 10, a artık [20, 30]
print(gone);              // 10
```

### `contains(deger)` (değer dizide var mı?)

`bool` döndürür:

```c
int[] a = [1, 2, 3];
print(a.contains(2));   // true
print(a.contains(9));   // false
```

### `indexOf(deger)` (değer nerede?)

İlk eşleşmenin indisini, yoksa **`null`** döndürür (tip `int?`, tıpkı string
versiyonu gibi):

```c
string[] names = ["ali", "veli", "deli"];
int? at = names.indexOf("veli");
if (at != null) { print(at); }   // 1
```

### `slice(bas, son)` (bir aralığı kopyala)

`bas` indisinden `son` indisine kadar olan elemanları (**`son` dahil değil**)
içeren **yeni bir dizi** döndürür. Orijinal değişmez.

> `string.substring` (bir *uzunluk* alır) ile farklıdır: `array.slice` bir
> **bitiş indisi** alır ve onu dışarıda bırakır; aralık `[bas, son)` şeklindedir.

```c
int[] a = [10, 20, 30, 40, 50];
int[] mid = a.slice(1, 3);   // indis 1 ve 2 → [20, 30]
print(mid.length());         // 2
print(mid[0]);               // 20
print(a.length());           // 5, orijinal aynı
```

### `concat(diger)` (iki diziyi birleştir)

Her ikisinin elemanlarını arka arkaya içeren **yeni bir dizi** döndürür:

```c
int[] a = [1, 2];
int[] b = [3, 4];
int[] both = a.concat(b);    // [1, 2, 3, 4]
print(both.length());        // 4
```

### `reverse()` (sırayı ters çevir *(değiştirir)*)

Diziyi **yerinde** ters çevirir ve aynı dizi referansını döndürür:

```c
int[] a = [1, 2, 3];
a.reverse();          // a artık [3, 2, 1]
print(a[0]);          // 3
```

Yerinde değiştirdiği için, aynı diziyi gösteren diğer değişkenlerin de
değişimi gördüğünü unutmayın:

```c
int[] a = [1, 2, 3];
int[] b = a;          // b ve a AYNI dizi
a.reverse();
print(b[0]);          // 3, b de değişti
```

### `clear()` (tamamen boşalt *(değiştirir)*)

Bütün elemanları siler, geriye boş dizi kalır:

```c
int[] a = [1, 2, 3];
a.clear();
print(a.length());   // 0
```

---

## Struct fonksiyonları

Her struct, hangi alanlara sahip olursa olsun, kendisini metne dönüştürmek
için iki fonksiyonla gelir. Hata ayıklarken ve başka programların okuyabileceği
çıktı üretirken işe yararlar.

### `toJson()` (makinece okunabilir JSON)

```c
struct Point { int x; int y; }

int main() {
    Point p;
    p.x = 10;
    p.y = 20;
    print(p.toJson());   // {"x":10,"y":20}
    return 0;
}
```

Başka bir araç veya program veriyi tüketecekse bunu kullanın.

### `dump()` (insan gözüyle okunabilir)

```c
Point p;
p.x = 10;
p.y = 20;
print(p.dump());   // alanların etiketli, okunaklı bir dökümü
```

Hatayı **siz** kovalarken çıktıyı okuyacaksanız bunu kullanın.

---

## Hızlı referans

### String metotları

| Metot | Döndürdüğü | Yaptığı |
|--------|---------|--------------|
| `s.length()` | `int` | Byte sayısı (ASCII için = karakter) |
| `s.upper()` | `string` | ASCII harfleri büyütür |
| `s.lower()` | `string` | ASCII harfleri küçültür |
| `s.trim()` | `string` | İki uçtaki boşlukları siler |
| `s.replace(eski, yeni)` | `string` | **Tüm** eşleşmeleri değiştirir |
| `s.substring(bas, uzunluk)` | `string` | `bas`'tan başlayıp `uzunluk` karakter alır |
| `s.repeat(adet)` | `string` | String'i `adet` kere tekrarlar |
| `s.charAt(indis)` | `string` | `indis` konumundaki tek karakter |
| `s.indexOf(parca)` | `int?` | İlk indis, yoksa `null` |
| `s.contains(parca)` | `bool` | `parca` içinde var mı? |
| `s.startsWith(onek)` | `bool` | `onek` ile mi başlıyor? |
| `s.endsWith(sonek)` | `bool` | `sonek` ile mi bitiyor? |
| `s.split(ayrac)` | `string[]` | `ayrac`'tan bölerek dizi yapar |

### Dizi metotları

| Metot | Döndürdüğü | Değiştirir? | Yaptığı |
|--------|---------|----------|--------------|
| `a.length()` | `int` | hayır | Eleman sayısı |
| `a.push(v)` | `int` | **evet** | Sona `v` ekler, indisini döndürür |
| `a.pop()` | `E` | **evet** | Son elemanı siler ve döndürür |
| `a.insert(i, v)` | `int` | **evet** | `i` konumuna `v` ekler |
| `a.remove(i)` | `E` | **evet** | `i` konumundakini siler ve döndürür |
| `a.slice(bas, son)` | `E[]` | hayır | `[bas, son)` aralığını kopyalar |
| `a.concat(b)` | `E[]` | hayır | `a` ve `b`'nin birleşimi |
| `a.reverse()` | `E[]` | **evet** | Yerinde ters çevirir |
| `a.contains(v)` | `bool` | hayır | `v` dizide var mı? |
| `a.indexOf(v)` | `int?` | hayır | İlk indis, yoksa `null` |
| `a.clear()` | `void` | **evet** | Bütün elemanları siler |

*(`E` dizinin eleman tipidir; `int[]` için `int`, `string[]` için `string` vb.)*

### Struct metotları

| Metot | Döndürdüğü | Yaptığı |
|--------|---------|--------------|
| `s.toJson()` | `string` | Makinece okunabilir JSON |
| `s.dump()` | `string` | İnsan gözüyle okunabilir döküm |

---

## `print()` konuk fonksiyonu

`print()` yukarıdaki metotlardan ayrı durur: bir tip üzerinde metot değil,
derleyicinin içinde C++ ile yazılmış ve saQut'un FFI katmanı üzerinden
programınıza sunulan bir **konuk fonksiyondur (host function)**. Herhangi bir
tipten tek bir değer alır ve onu yazdırır:

```c
print(42);          // 42
print(3.14);        // 3.14
print("text");      // text
print(true);        // 1   (bool 1 / 0 olarak yazdırılır)
```

`print`, saQut'un kendi dışına uzanmasının ilk ve en basit örneğidir. Daha
zengin standart kütüphane fonksiyonları (dosya, matematik vb.) aynı konuk
fonksiyon mekanizmasıyla gelecektir.

## Sırada ne var?

- [String'ler](/strings/) ve değer anlamsallıkları hakkında daha fazlası
- [Dizilerin](/arrays/) sıralı veriyi nasıl sakladığını ve paylaştığını öğrenin
- Programınızı [modüllerle](/modules/) birden çok dosyaya bölün
