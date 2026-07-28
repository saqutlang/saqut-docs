---
title: switch / case
description: Bir değeri çok sayıda durumla karşılaştırın; otomatik break, fall-through yok; int, float, bool, string ve enum desteklenir.
---

Bir değeri çok sayıda olası seçenekle karşılaştırmanız gerektiğinde `switch`,
uzun bir `if / else if` zincirinden daha temizdir.

## Temel Kullanım

```c
int x = 2;

switch (x) {
    case 1:
        print("one");
    case 2:
        print("two");
    case 3:
        print("three");
    default:
        print("something else");
}
// Çıktı: two
```

switch, eşleşen **tek** case'in ifadelerini çalıştırır ve çıkar. Yalnızca `two`
yazdırılır.

## Fall-through Yok (case'ler otomatik break yapar)

En önemli kural budur ve C ile Java'nın tersidir: **saQut'ta fall-through
yoktur.** Eşleşen case çalıştıktan sonra switch kendiliğinden sona erer.
Case'leri ayırmak için `break` yazmanız **gerekmez**.

```c
int x = 1;
switch (x) {
    case 1:
        print("one");     // çalışır
    case 2:
        print("two");     // çalışMAZ
    default:
        print("other");   // çalışMAZ
}
// Çıktı: one
```

C tarzı bir dilde bu `one two other` yazdırırdı. saQut'ta yalnızca `one`
yazdırılır. Her case kendi içinde bağımsızdır. Bunun karşılığında bir gövdeyi
değerler arasında paylaşmak örtük değil açıktır; bir sonraki bölüm bunu gösterir.

## Case Başına Birden Çok İfade (süslü parantez gerekmez)

Bir case, iki noktadan sonra doğrudan yazılan istediğiniz kadar ifade
içerebilir. Hepsi o case'e aittir:

```c
switch (x) {
    case 2:
        print("two");
        print("still two");   // aynı case, ikisi de çalışır
    default:
        print("other");
}
```

## Birden Çok Değer İçin Tek Gövde

Fall-through olmadığı için, bir gövdeyi paylaşmak üzere değerleri tek bir
case'de **virgülle ayırarak** listelersiniz:

```c
switch (x) {
    case 1, 2, 3:
        print("small");
    case 4, 5, 6:
        print("medium");
    default:
        print("large");
}
```

`case 1, 2, 3:` eğer `x` 1, 2 veya 3'ten herhangi biriyse çalışır. Bu, C'deki
"case'leri üst üste dizip fall-through yapma" numarasının bilinçli ve açık
alternatifidir.

## `default`

`default`, hiçbir case eşleşmediğinde çalışır. **İsteğe bağlıdır**; yazmazsanız
ve hiçbir şey eşleşmezse switch hiçbir şey yapmaz:

```c
switch (color) {
    case 0:
        print("red");
    case 1:
        print("green");
    default:
        print("unknown color");
}
```

## Desteklenen Türler

`switch` tam sayılardan daha fazlasıyla çalışır:

| Tür | Notlar |
|------|-------|
| `int` | Tam sayılar |
| `float` | İzin verilir; tam olarak temsil edilemeyen bir literal (örn. `case 0.1:`) uyarı üretir |
| `bool` | `true` / `false` |
| `string` | **İçeriğe** göre karşılaştırılır |
| `enum` | `Color.Red` gibi adlandırılmış sabitler |

```c
// String switch, içeriğe göre eşleşir
string cmd = "stop";
switch (cmd) {
    case "start":
        print("beginning");
    case "stop":
        print("halting");   // bu çalışır
    default:
        print("unknown command");
}

// Enum switch
enum Color { Red, Green, Blue }
Color c = Color.Green;
switch (c) {
    case Color.Red:   print(0);
    case Color.Green: print(1);   // bu çalışır
    case Color.Blue:  print(2);
}

// Float switch
float v = 1.5;
switch (v) {
    case 1.0: print(1);
    case 1.5: print(2);   // bu çalışır
    default:  print(0);
}
```

Case'ler switch değeriyle **aynı türde** olmalıdır: bir switch'te `case 1:` ile
`case "x":` aynı anda kullanılamaz. `struct` ve `array` değerleri switch
edilemez.

## `break` (bir case'ten erken çıkış)

Case'ler otomatik break yaptığı için `break`'e nadiren ihtiyaç duyarsınız.
Yine de bir case'in kalan ifadelerinden **önce** çıkmak için
kullanabilirsiniz; gövde içinde bir gard gibi:

```c
switch (x) {
    case 1:
        print("checking");
        if (someCondition) {
            break;              // switch'ten şimdi çık
        }
        print("passed the guard");
    default:
        print("other");
}
```

Aynı case içinde `break`'ten sonraki her şey erişilemezdir:

```c
case 1:
    print("a");
    break;
    print("asla çalışmaz");   // erişilemez
```

### Döngü içindeki switch'te `break`

Eğer bir `switch` bir döngü içindeyse, `break` döngüyü değil **switch**'i sona
erdirir; döngü devam eder:

```c
for (int i = 0; i < 3; i = i + 1) {
    switch (i) {
        case 1: break;          // yalnızca switch'ten çıkar
        default: print(i);
    }
    print("loop-end");          // her yinelemede hâlâ çalışır
}
// Çıktı: 0, loop-end, loop-end, 2, loop-end
```

## Nullable Türler Üzerinde Switch

Nullable bir değer üzerinde switch yapabilir ve `case null` ile doğrudan
`null` eşleştirmesi yapabilirsiniz:

```c
int? value = getValue();
switch (value) {
    case null:
        print("no value");
    case 1:
        print("one");
    default:
        print("other");
}
```

Bu, eksik durumu değer case'lerinin yanında tek bir ifadede dallandırmanızı
sağlar.

## `switch` vs `if / else if`

| `switch` şu durumlarda… | `if / else if` şu durumlarda… |
|--------------------------|--------------------------------|
| Bir değer çok sayıda sabit seçenekle karşılaştırılıyorsa | Koşullar aralık veya karmaşık boolean ifadeler içeriyorsa |
| Seçenekler ayrık ise (`1`, `"stop"`, `Color.Red`) | `<`, `>`, `&&`, `||` gerekiyorsa |
| Her case'in bağımsız olması isteniyorsa | Dallar fall-through tarzı mantık paylaşıyorsa |

## Sırada Ne Var?

- Koşullarla dallanma için [if / else](/if-else/)
- Kodu tekrarlamak için [for döngüleri](/loops/for-loop/)
- `null` durumunu güvenle ele almak için [veri türleri](/data-types/#nullable-types)
