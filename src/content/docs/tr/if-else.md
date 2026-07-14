---
title: if / else
description: Koşullu dallanma ile kodunuzda kararlar verin.
---

Koşullu ifadeler, programınızın karar vermesini sağlar. Bir koşulun `true`
veya `false` olmasına bağlı olarak farklı kod çalışır.

## Temel `if`

```c
int x = 5;

if (x > 0) {
    print("positive");
}
```

Parantez içindeki koşul **truthy** (sıfırdan farklı herhangi bir değer) ise
blok çalışır. **Falsy** (sıfır) ise blok atlanır.

saQut, C tarzı truthiness kullanır: `0` `false`, diğer her şey `true` kabul
edilir.

## `if` / `else`

```c
int x = -3;

if (x > 0) {
    print("positive");
} else {
    print("not positive");
}
```

## `if` / `else if` / `else`

Birden çok koşulu zincirleyin:

```c
int score = 75;

if (score >= 90) {
    print("A");
} else if (score >= 70) {
    print("B");
} else if (score >= 50) {
    print("C");
} else {
    print("F");
}
```

## İç İçe `if`

`if` ifadelerini başka `if` ifadelerinin içine yerleştirebilirsiniz:

```c
int x = 10;
int y = 5;

if (x > 0) {
    if (y > 0) {
        print("both positive");
    }
}
```

## Süslü Parantezsiz Kullanım

Blok tek bir ifade içeriyorsa süslü parantezleri yazmayabilirsiniz:

```c
if (x > 0)
    print("positive");
else
    print("not positive");
```

Dikkatli olun; süslü parantezleri kaldırmak kafa karıştırıcı koda yol
açabilir. Emin değilseniz `{ }` kullanın.

## Sık Kullanılan Kalıplar

### Gard cümlesi (erken çıkış)

```c
int divide(int a, int b) {
    if (b == 0) {
        return 0;      // gard, erken çık
    }
    return a / b;
}
```

### Nullable türler için null kontrolü

```c
int? value = getMaybeValue();

if (value != null) {
    // Bu blok içinde 'value' artık null değildir
    print(value);
}
```

## Bir Koşulu Ne Doğru Yapar?

Koşul bir değer üretmelidir. Sıfırdan farklı her değer truthy'dir:

```c
if (1)    { print("çalışır"); }     // sıfırdan farklı → truthy
if (0)    { print("çalışmaz"); }    // sıfır → falsy
if (42)   { print("çalışır"); }     // sıfırdan farklı → truthy
if (-1)   { print("çalışır"); }     // sıfırdan farklı → truthy
```

Karşılaştırma operatörleri (`==`, `!=`, `<`, `>`, `<=`, `>=`) veya mantıksal
operatörler (`&&`, `||`, `!`) içeren koşullar her zaman `true` (1) veya
`false` (0) döndürür.

## Koşulları Birleştirme

Koşulları `&&` (ve), `||` (veya) ve `!` (değil) ile birleştirin:

```c
int age = 25;
bool hasTicket = true;

if (age >= 18 && hasTicket) {
    print("welcome");
}

if (age < 13 || age > 65) {
    print("discounted");
}
```

`&&` ve `||` **kısa devre** yapar: cevap belli olur olmaz dururlar. `&&` ile
sol taraf `false` ise sağ taraf hiç değerlendirilmez; `||` ile sol taraf
`true` ise sağ taraf atlanır. Bu sayede bir kontrolü, onu güvenli kılan test
ile koruyabilirsiniz:

```c
// 'b != 0' kontrolü bölmeyi korur, soldan sağa değerlendirilir
if (b != 0 && a / b > 2) {
    print("ratio is large");
}
```

Tam öncelik kuralları için [operatörler](/operators/#logical-operators)
sayfasına bakın.

## İleri Seviye: Nullable Türleri Daraltma

Bir [nullable](/data-types/#nullable-types) değer (`int?`, `string?`, …)
doğrudan kullanılamaz: derleyici `null` olabileceği için reddeder:

```c
int? x = getValue();
print(x + 1);        // HATA (E003), 'x' null olabilir
```

Bir `if (x != null)` kontrolü türü **daraltır**: blok içinde derleyici `x`'in
null olmadığını bilir ve onu düz bir `int` olarak kullanmanıza izin verir:

```c
int? x = getValue();

if (x != null) {
    print(x + 1);    // TAMAM, bu blok içinde null olmayan int'e daraltıldı
}
```

Daraltma **`&&` üzerinden** de çalışır: solda null kontrolünü yaptıktan sonra
sağ taraf değeri zaten null değilmiş gibi görür:

```c
int? x = getValue();

if (x != null && x > 5) {   // 'x > 5'e izin verilir: x burada null değil
    print("big");
}
```

Nullable bir değeri kullanmanın tek yolu budur: **`x!`** zorla-unwrap yoktur,
**`?.`** operatörü yoktur. Kontrol kodda görünürdür ve güvenlik sıfır çalışma
zamanı maliyetiyle derleme zamanında kanıtlanır. (Bkz.
[veri türlerinde null güvenliği](/data-types/#nullable-types).)

## Ternary Alternatifi

"İki değerden birini seç" gibi basit durumlarda, [ternary
operatörü](/operators/#ternary-operator) `?:`, tam bir `if` yerine kompakt bir
ifadedir:

```c
int x = 5;

// if / else
string label;
if (x > 0) { label = "positive"; } else { label = "non-positive"; }

// aynısı ternary ile
string label2 = x > 0 ? "positive" : "non-positive";
```

İfade çalıştırmak için `if` kullanın; yalnızca bir değer seçmek için `?:`
kullanın.

## Sırada Ne Var?

- Bir değeri çok sayıda seçenekle karşılaştırmak için [switch](/switch/)
- Kodu tekrarlamak için [for döngüleri](/loops/for-loop/)
- Truthiness ve tür dönüşümlerini [veri türleri](/data-types/) sayfasından öğrenin
