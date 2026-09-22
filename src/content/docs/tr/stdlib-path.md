---
title: path (Yollar)
description: saQut'un path modülüyle dosya yolu metinlerini diske dokunmadan birleştirme ve ayırma.
---

`path` modülü yol metinleri üzerinde metin olarak çalışır. Buradaki hiçbir şey
bir dosya açmaz ya da işletim sistemine o yolun var olup olmadığını sormaz:
`dirname("/a/b/c.txt")` o dizin gerçekten var olsa da olmasa da `/a/b` yanıtını
verir. Diske dokunan her şey için [`fs`](/tr/stdlib-fs/) kullanılır.

Bunlar saf metin işlemleri olduğu için her koşuda ve her makinede aynı yanıtı
verirler.

```c
import { join, basename, extension } from path;
```

## `string join(string[] parts)`

Yol parçalarını platform ayıracıyla, her çiftin arasına tam olarak bir tane
koyarak birleştirir.

```c
import { join } from path;

int main() {
    string[] parts = ["usr", "local", "bin"];
    print(join(parts));      // usr/local/bin
    return 0;
}
```

`join` değişken sayıda argüman yerine dizi alır, çünkü saQut'ta değişken
argümanlı fonksiyon yoktur. Parça sayısı sabit değilse önce diziyi kurun.

## `string normalize(string path)`

`.` ve `..` parçalarını metin düzeyinde çözer, tekrarlanan ayıraçları
sadeleştirir.

```c
normalize("/usr/local/../bin/./tool")   // /usr/bin/tool
```

Bu, dosya sistemine karşı çözümleme değil, metin üzerinde hesaptır. Bir `..`,
kendinden önceki parçayla birlikte silinir; o parça başka bir yere götürecek
bir sembolik bağ olsa bile.

## `string dirname(string path)` / `string basename(string path)`

Yolu dizin kısmı ile son bileşenine ayırır.

```c
dirname("/home/saqut/rapor.txt")    // /home/saqut
basename("/home/saqut/rapor.txt")   // rapor.txt
```

## `string extension(string path)`

Son uzantı, **nokta dahil**.

```c
extension("/home/saqut/rapor.txt")   // .txt
```

## `bool isAbsolute(string path)`

Yolun geçerli dizinden değil kökten başlayıp başlamadığı.

```c
isAbsolute("/usr/bin")   // true
isAbsolute("usr/bin")    // false
```

## `string separator()`

Platform yol ayıracı: Linux'ta `/`, Windows'ta `\`. Mümkün olan yerde `join`
kullanın; `separator()` yalnızca yolu kendiniz biçimlediğinizde gerekir.

## Çalışan örnek

Bir kaynak dosya adından, yanına konacak bir çıktı dosyası adı üretmek:

```c
import { dirname, basename, extension, join } from path;

string ciktiAdi(string kaynak) {
    string dizin = dirname(kaynak);
    string ad = basename(kaynak);
    string uzanti = extension(kaynak);

    // Dosya adından uzantıyı çıkar.
    string govde = ad.substring(0, ad.length() - uzanti.length());

    string[] parcalar = [dizin, govde + ".out"];
    return join(parcalar);
}

int main() {
    print(ciktiAdi("/home/saqut/src/main.sqt"));   // /home/saqut/src/main.out
    return 0;
}
```

## Fonksiyonların tam listesi

| Fonksiyon | Döndürür | İşlevi |
|---|---|---|
| `join(parts)` | `string` | Parçaları ayıraçla birleştirir |
| `normalize(path)` | `string` | `.` ve `..` parçalarını metin düzeyinde çözer |
| `dirname(path)` | `string` | Dizin kısmı |
| `basename(path)` | `string` | Son bileşen |
| `extension(path)` | `string` | Uzantı, nokta dahil |
| `isAbsolute(path)` | `bool` | Kökten mi başlıyor |
| `separator()` | `string` | Platform ayıracı |

`absolute()` ya da `relative()` yoktur. İkisi de geçerli çalışma dizinini
okumak zorunda kalırdı; bu da onları dış duruma bağımlı kılardı, oysa bu
modülün geri kalanı öyle değildir. Mutlak yol gerektiğinde `process::cwd()` ile
`join` birlikte kullanılır.
