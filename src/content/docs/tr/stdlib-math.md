---
title: math (Matematik)
description: saQut math fonksiyonlarının türleri, parametreleri ve hesaplama davranışları.
---

`math` modülü capability gerektirmeyen saf matematik hesapları sağlar.
Fonksiyonlarda overload yoktur; tam sayı ve kayan nokta sürümleri farklı isimler
kullanır. İmzalardaki parametre adları, kod içinde bu değerin neyi temsil
ettiğini gösterir.

## Fonksiyonlar

### `int abs(int value)`

Verilen 32-bit tam sayının mutlak değerini döndürür. Negatif bir değeri pozitif
karşılığına çevirir; pozitif değerleri ve sıfırı değiştirmez.

### `double absf(double value)`

Verilen 64-bit reel sayının mutlak değerini döndürür. `abs` fonksiyonundan farkı,
sonucun `double` olmasıdır.

### `int min(int left, int right)` / `int max(int left, int right)`

İki `int` değeri karşılaştırır. `min` küçük olanı, `max` büyük olanı döndürür.

### `double minf(double left, double right)` / `double maxf(double left, double right)`

İki `double` değeri karşılaştırır. `minf` küçük olanı, `maxf` büyük olanı
döndürür. İsimdeki `f` tarihsel bir addır; parametre ve dönüş türü `double`dır.

### `double sqrt(double value)`

Verilen negatif olmayan reel sayının karekökünü hesaplayıp `double` olarak
döndürür. Örneğin `sqrt(25.0)` sonucu `5.0`dır. Negatif değerlerde hata
fırlatmak yerine kayan nokta kurallarına uygun `NaN` sonucu oluşabilir.

### `double pow(double base, double exponent)`

`base` değerinin `exponent` kuvvetini hesaplar. Örneğin `pow(3.0, 4.0)` sonucu
`81.0`dır. Her iki parametre de `double`, sonuç da `double`dır.

### `double floor(double value)`

Reel sayıyı kendisinden büyük olmayan en yakın tam sayı değerine yuvarlar.
`floor(3.9)` sonucu `3.0`dır.

### `double ceil(double value)`

Reel sayıyı kendisinden küçük olmayan en yakın tam sayı değerine yuvarlar.
`ceil(3.1)` sonucu `4.0`dır.

### `double round(double value)`

Reel sayıyı en yakın tam sayı değerine yuvarlar ve sonucu `double` olarak
döndürür. `round(3.5)` sonucu `4.0`dır.

### `double PI()` / `double E()`

Sırasıyla pi ve Euler sabitlerini `double` olarak döndürür. Bunlar sabit değişken
değil, parametresiz fonksiyonlardır; `PI` değil `PI()` yazılır.

```c
import { sqrt, abs, absf, max, PI } from math;

int main() {
    int bigger = max(10, 20);
    double radius = 5.0;
    double area = PI() * radius * radius;
    print(sqrt(25.0));
    print(abs(-42));
    print(absf(-3.14));
    print(bigger);
    print(area);
    return 0;
}
```
