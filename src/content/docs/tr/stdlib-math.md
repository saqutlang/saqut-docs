---
title: math (Matematik)
description: saQut'un math modülünde sabitler, trigonometrik fonksiyonlar ve sayı araçları.
---

`math` modülü matematiksel sabitler ve fonksiyonlar sağlar. Hiçbir capability
gerektirmez; tamamen saf hesaplamadir.

## Import

```c
import { E, PI, sqrt, abs, min, max, floor, ceil, round, pow, sin, cos } from math;
```

## Sabitler

| Sabit | Değer |
|---|---|
| `E` | 2.7182818284 |
| `PI` | 3.1415926535 |

```c
import { PI } from math;

int main() {
    print(PI);                    // 3.141593
    float alan = PI * 5 * 5;     // daire alanı, yarıçap 5
    print(alan);
    return 0;
}
```

## Fonksiyonlar

### sqrt

Karekök.

```c
import { sqrt } from math;

int main() {
    print(sqrt(25));    // 5.0
    return 0;
}
```

### abs

Mutlak değer. `int` ve `float` ile çalışır.

```c
import { abs } from math;

int main() {
    print(abs(-42));       // 42
    print(abs(-3.14));     // 3.14
    return 0;
}
```

### min / max

İki sayıdan küçük veya büyük olanı döndürür.

```c
import { min, max } from math;

int main() {
    print(min(10, 20));    // 10
    print(max(3.5, 2.1));  // 3.5
    return 0;
}
```

### floor / ceil / round

Float değeri en yakın tam sayıya yuvarlar.

```c
import { floor, ceil, round } from math;

int main() {
    print(floor(3.9));    // 3
    print(ceil(3.1));     // 4
    print(round(3.5));    // 4
    return 0;
}
```

### pow

`taban` üzeri `us` hesaplar. İki argüman da `float`'tır.

```c
import { pow } from math;

int main() {
    print(pow(3, 4));     // 81.0
    return 0;
}
```

### sin / cos

Sinüs ve kosinüs. Girdi radyan cinsindendir.

```c
import { sin, cos, PI } from math;

int main() {
    print(sin(PI / 2));   // ~1.0
    print(cos(PI));        // ~-1.0
    return 0;
}
```
