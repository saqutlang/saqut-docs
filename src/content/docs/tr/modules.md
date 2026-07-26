---
title: Modüller (import / export)
description: Programınızı import ve export ile birden çok dosyaya bölün; iki dosyalı bir programdan baklava bağımlılıklarına ve döngü tespitine kadar.
---

Program büyüdükçe kodu birden çok dosyaya bölmek her dosyayı odaklı tutar.
saQut, kodu birden çok `.sqt` dosyasına bölmenizi ve dosyalar arasında
paylaşmanızı sağlayan iki anahtar kelime sunar: **`export`** (bir şeyi diğer
dosyaların kullanımına açar) ve **`import`** (başka bir dosyadan bir şeyi içeri
çeker).

Bu sayfa iki dosyalı bir programla başlar ve çok dosyalı bağımlılık çizgelerine,
yol çözümleme kurallarına ve derleyicinin dairesel içe aktarmaları nasıl ele
aldığına kadar uzanır.

## Minimal iki dosyalı program

```c
// math.sqt
export int square(int n) {
    return n * n;
}
```

```c
// main.sqt
import {square} from "math.sqt";

int main() {
    print(square(5));   // 25
    return 0;
}
```

`main()` fonksiyonunu içeren dosyayı çalıştırın:

```bash
saqut run main.sqt
```

Derleyici, `import` ifadesinden `math.sqt`'i çözer, derler ve `square`'i bağlar.
Komut satırında `math.sqt`'i belirtmezsiniz; bağımlılığın adlandırıldığı tek yer
`import` ifadesidir.

Bu sayfanın geri kalanı detayları doldurur.

---

## Dışa aktarma: bir şeyleri herkese açmak

Varsayılan olarak, bir dosyada yazdığınız her şey o dosyaya **özel**dir. Hiçbir
şey dışarı sızmaz. Başka bir dosyanın bir fonksiyonu, struct'ı veya enum'ı
kullanmasına izin vermek için tanımının önüne `export` koyun:

```c
// shapes.sqt

export struct Circle {      // dışa aktarıldı, diğer dosyalar kullanabilir
    float radius;
}

export float area(Circle c) {   // dışa aktarıldı
    return 3.14159 * c.radius * c.radius;
}

float helper(float x) {     // dışa aktarılmadı, shapes.sqt'e özel
    return x * 2.0;
}
```

Burada `Circle` ve `area`, onları import eden her dosyadan görünür. `helper`
dış dünyaya görünmez, ancak `area` onu dahili olarak çağırabilir; çünkü özel
semboller *kendi dosyaları içinde* tamamen kullanılabilirdir.

### Neler dışa aktarılabilir

| Aktarılabilir | Aktarılamaz (şimdilik) |
|---------------|------------------------|
| `export` fonksiyonlar | Global değişkenler |
| `export struct` | |
| `export enum` | |

```c
export int add(int a, int b) { return a + b; }   // tamam

export struct Vec { int x; int y; }              // tamam

export enum State { Idle, Running, Done }         // tamam

export int counter = 0;   // HATA, global değişkenler dışa aktarılamaz
```

Paylaşımlı durum gerekiyorsa, dışa aktarılan bir global yerine dışa aktarılan
fonksiyonlar üzerinden sunun.

---

## İçe aktarma: bir şeyleri içeri çekmek

Bir `import` ifadesi, istediğiniz sembolleri ve geldikleri dosyayı adlandırır:

```c
import {area, Circle} from "shapes.sqt";
```

- `{ }` içindeki isimler dışa aktarılan isimlerle **tam olarak** aynı olmalıdır.
- Birden çok ismi virgülle ayırın.
- Tırnak içindeki yol bir **dosya yoludur** (yollar hakkında aşağıya bakın).

Import ifadeleri dosyanın **en üstüne**, fonksiyonlarınızdan önce yazılır.

### Kullandığınızı import etmelisiniz

saQut, ismini import etmediğiniz sürece başka bir modülün sembollerine erişim
vermez. Bu bilinçli bir tercihtir: her bağımlılık açıkça yazılır.

```c
// shapes.sqt 'area'yı dışa aktarıyor ama siz import etmeyi unuttuysanız:
int main() {
    Circle c;
    print(area(c));   // HATA, 'area' başka bir modülden geliyor
                      //         ve açıkça import edilmesi gerek
    return 0;
}
```

Diğer dosyanın dışa aktarmadığı bir ismi import etmek de hatadır:

```c
import {helper} from "shapes.sqt";
// HATA, 'helper' shapes.sqt'te tanımlı ama dışa aktarılmamış
```

Bu iki kural (*yayınlamak için export*, *tüketmek için import*) erişim
kontrol modelinin tamamıdır. `public`/`private` anahtar kelimesi yoktur;
`export` **"public" demektir**, yokluğu ise **"private"**.

---

## Dosya yolları nasıl çözümlenir

`import`'taki yol, terminalinizin çalışma dizinine göre değil, **`import`
ifadesini içeren dosyaya göre** çözümlenir.

```
project/
├── main.sqt          import {square} from "math/util.sqt";
└── math/
    └── util.sqt       import {PI} from "constants.sqt";   ← math/ içinde arar
    └── constants.sqt
```

- `main.sqt`, `"math/util.sqt"`'i import eder → `math/util.sqt` konumunda bulunur.
- `math/util.sqt` içinde `"constants.sqt"` import edildiğinde, **`util.sqt` ile
  aynı klasörde** aranır → `math/constants.sqt`.

Bu sayede birbiriyle ilişkili modüllerden oluşan bir klasörün tamamını taşısanız
bile iç import'ları çalışmaya devam eder.

---

## Gerçekçi bir çok dosyalı örnek

```c
// geometry.sqt, saf veri + matematik, main() yok
export struct Point {
    int x;
    int y;
}

export int manhattan(Point a, Point b) {
    int dx = a.x - b.x;
    int dy = a.y - b.y;
    if (dx < 0) { dx = -dx; }
    if (dy < 0) { dy = -dy; }
    return dx + dy;
}
```

```c
// main.sqt, giriş noktası
import {Point, manhattan} from "geometry.sqt";

int main() {
    Point origin;
    origin.x = 0;
    origin.y = 0;

    Point target;
    target.x = 3;
    target.y = 4;

    print(manhattan(origin, target));   // 7
    return 0;
}
```

`main()`'i tanımlayan modül çalıştırdığınız modüldür. `geometry.sqt` gibi
modüller kütüphanedir: `main()` içermeleri gerekmez.

---

## Baklava bağımlılıkları

İki modül de aynı üçüncü modülü import ederse ne olur?

```
       main.sqt
       /       \
  left.sqt   right.sqt
       \       /
      base.sqt        ← HEM left hem right tarafından import ediliyor
```

Bu şekle **baklava (diamond)** denir. Derleyici her modülü **tam olarak bir
kez** yükler ve yeniden kullanır; bu yüzden iki modül ona bağımlı olsa da
`base.sqt` tek bir kez derlenir:

```c
// base.sqt
export int base() { return 10; }
```

```c
// left.sqt
import {base} from "base.sqt";
export int fromLeft() { return base() + 1; }
```

```c
// right.sqt
import {base} from "base.sqt";
export int fromRight() { return base() + 2; }
```

```c
// main.sqt
import {fromLeft} from "left.sqt";
import {fromRight} from "right.sqt";

int main() {
    print(fromLeft() + fromRight());   // 23  → (10+1) + (10+2)
    return 0;
}
```

---

## Dairesel import'lar reddedilir

Bir **döngü**, baklavadan farklıdır. Eğer A modülü B'yi, B de A'yı (doğrudan
veya zincirleme) import ederse, onları yüklemek için geçerli bir sıra yoktur:
her biri diğerinin zaten var olmasına ihtiyaç duyar. saQut bunu tespit eder
ve sonsuza dek döngüye girmek yerine net bir hatayla durur:

```c
// a.sqt
import {helper} from "b.sqt";
export int foo() { return 1; }
```

```c
// b.sqt
import {foo} from "a.sqt";     // ← döngüyü kapatır
export int helper() { return 2; }
```

```
error [E_MODULE_CYCLE]: dairesel modül bağımlılığı tespit edildi:
    a.sqt -> b.sqt -> a.sqt
```

Bir dosyanın **kendini** import etmesi en küçük döngüdür ve aynı şekilde
yakalanır:

```c
// self.sqt
import {x} from "self.sqt";    // E_MODULE_CYCLE: self.sqt -> self.sqt
```

### Döngüyü kırmak

Döngüler neredeyse her zaman iki modülün birlikte çok fazla şey yaptığı
anlamına gelir. Çözüm, ortak parçayı **her ikisinin de** bağımlı olduğu
üçüncü bir modüle çekerek döngüyü baklavaya dönüştürmektir:

```
Önce (döngü):   a ⇄ b
Sonra (baklava): a → ortak ← b
```

A ve B'nin her ikisinin de ihtiyaç duyduğu fonksiyonları `ortak.sqt`'e taşıyın,
hem A hem B `ortak.sqt`'ten import etsin ve A↔B import'larını kaldırın.

---

## Modül hatalarına toplu bakış

| Hata | Anlamı | Çözümü |
|-------|---------|-----|
| `E_IMPORT_NOT_EXPORTED` | Diğer dosyanın `export` etmediği bir ismi import ettiniz | `export` ekleyin veya dışa aktarılan bir ismi import edin |
| `E_SYMBOL_NOT_IMPORTED` | Başka bir modülün sembolünü import etmeden kullandınız | `import {...}` listesine ekleyin |
| `E_MODULE_CYCLE` | İki modül birbirini import ediyor (doğrudan veya zincirleme) | Ortak kodu üçüncü bir modüle çıkarın |

---

## Tasarım notları

- **Örtülü değil, açık.** Wildcard `import *` yoktur ve her yerde geçerli global
  bir isim alanı yoktur. Dosyalar arası her isim, bir `import` ifadesinde bir
  kez yazılır.
- **Tek görünürlük kontrolü `export`'tur.** Export'lu = herkese açık, geri kalan
  her şey = dosyasına özel.
- **Bir kez yüklenir.** Her modül, kaç modül ona bağımlı olursa olsun tek bir
  kez derlenir (baklava örneğine bakın).
- **Belirlenimci.** Import çözümlemesi ve döngü tespiti, derleyicinin
  incelenebilir işlem zincirinin bir parçasıdır: aynı dosya kümesi her zaman
  aynı modül çizgesini üretir.

## Sırada ne var?

- Mantığı [fonksiyonlarla](/functions/) yeniden kullanın
- Veriyi [struct'larla](/structs/) bir araya getirin
- Derleyici zincirini [derleyici araçlarıyla](/compiler-tools/) keşfedin
