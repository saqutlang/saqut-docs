---
title: fs (Dosya Sistemi)
description: saQut'un fs modülüyle dosya ve dizin okuma, yazma, kopyalama ve listeleme.
---

`fs` modülü dosya ve dizinleri okur, yazar. Her fonksiyon adıyla içe aktarılır:

```c
import { readFile, writeFile, existsFile } from fs;
```

Dosya içeriği `string` değil `byte[]`'dir. saQut sizin yerinize bir metin
kodlaması varsaymaz: dosya bir bayt dizisidir, onu nasıl yorumlayacağınıza siz
karar verirsiniz. Dönüştürmek için [`utf8`](/tr/stdlib-utf8/) modülü kullanılır.

```c
import { readFile, writeFile } from fs;
import { encode, decode } from utf8;

int main() {
    writeFile("not.txt", encode("merhaba"));
    byte[] ham = readFile("not.txt");
    print(decode(ham));
    return 0;
}
```

Dosya tanıtıcısı (handle) yoktur. Her çağrı dosyayı açar, işini yapar ve
kapatır. Böylece her işlem tek ve gözlemlenebilir bir adım olur; bir programın
dosya etkinliğini kaydedip yeniden oynatmayı mümkün kılan da budur.

## Okuma

### `byte[] readFile(string path, int? seek, int? size)`

Dosyayı okur ve baytlarını döndürür. `seek` ile `size` isteğe bağlıdır:
hiçbirini vermezseniz dosyanın tamamı, ikisini birden verirseniz yalnız
belirttiğiniz aralık okunur.

```c
import { readFile } from fs;
import { decode } from utf8;

int main() {
    byte[] tumu = readFile("veri.txt");          // dosyanın tamamı
    byte[] parca = readFile("veri.txt", 3, 4);   // 3. bayttan itibaren 4 bayt
    print(decode(parca));
    return 0;
}
```

Dosya yoksa `readFile` yakalanabilir bir hata fırlatır. Ya önce `existsFile`
ile denetleyin ya da çağrıyı `try` / `catch` içine alın.

### `longint fileSize(string path)`

Bayt cinsinden boyut. Bir dosya `int`'in tutabileceğinden büyük olabildiği için
dönüş tipi `longint`'tir.

### `bool existsFile(string path)`

O yolda bir şey varsa `true`; dosya da olabilir dizin de.

### `bool isFile(string path)` / `bool isDirectory(string path)`

İkisini ayırır. `existsFile` her ikisine de `true` dediği için, fark önemliyse
bunları kullanın.

### `bool isEmpty(string path)`

Sıfır baytlık bir dosya ya da hiç girdisi olmayan bir dizin için `true`.

## Yazma

### `void writeFile(string path, byte[] data)`

Baytları yazar; dosya yoksa oluşturur, varsa içeriğini değiştirir.

### `void appendFile(string path, byte[] data)`

Baytları sona ekler, mevcut içeriğe dokunmaz.

```c
import { writeFile, appendFile } from fs;
import { encode } from utf8;

int main() {
    writeFile("kayit.txt", encode("ilk satir\n"));
    appendFile("kayit.txt", encode("ikinci satir\n"));
    return 0;
}
```

### `void createFile(string path)`

Boş bir dosya oluşturur.

### `void copyFile(string src, string dst)`

Dosyayı yeni bir yola kopyalar.

### `void renameFile(string from, string to)`

Dosyayı yeniden adlandırır; hedef başka bir dizindeyse taşıma işlevi de görür.

### `void removeFile(string path)`

Dosyayı siler. Yol yoksa ya da bir dizinse hata fırlatır; dizinler için
`removeDirectory` kullanılır.

## Dizinler

### `string[] list(string path)`

Tek bir dizindeki girdi adları, sıralı. Tam yol değil yalnızca ad döner ve alt
dizinlere inmez.

```c
import { list } from fs;

int main() {
    string[] girdiler = list(".");
    int i = 0;
    while (i < girdiler.length()) {
        print(girdiler[i]);
        print("\n");
        i = i + 1;
    }
    return 0;
}
```

### `string[] walk(string path)`

Bir dizinin altındaki her girdiyi, özyinelemeli olarak, tam yol biçiminde
verir. `list` "bu dizinde ne var" sorusunu yanıtlarken `walk` "bu ağacın
altında ne var" sorusunu yanıtlar.

### `void createDirectory(string path)` / `void removeDirectory(string path)`

Dizin oluşturur ya da siler.

### `longint modifiedTime(string path)`

Son değişiklik zamanı, milisaniye cinsinden Unix zaman damgası. `date` değerine
çevirmek için `date::fromEpochMillis()` fonksiyonuna verin.

```c
import { modifiedTime } from fs;
import { fromEpochMillis, format } from date;

int main() {
    date degisti = fromEpochMillis(modifiedTime("rapor.txt"));
    print(format(degisti, "yyyy-MM-dd"));
    return 0;
}
```

## Hatalar

Dosya işlemleri, programınızın önceden eleyemeyeceği nedenlerle başarısız olur:
denetimle okuma arasında dosya silinir, izin yoktur, disk dolar. Bunlar programı
sonlandırmak yerine yakalanabilir hata fırlatır.

```c
import { readFile } from fs;
import { decode } from utf8;

int main() {
    try {
        byte[] veri = readFile("belki-yok.txt");
        print(decode(veri));
    } catch (Error e) {
        print("dosya okunamadi");
    }
    return 0;
}
```

Önce `existsFile` ile denetlemek aradaki boşluğu daraltır ama kapatmaz: dosya
iki çağrı arasında hâlâ silinebilir. Başarısız olmaması gereken kodda denetime
güvenmek yerine hatayı ele alın.

## Fonksiyonların tam listesi

| Fonksiyon | Döndürür | İşlevi |
|---|---|---|
| `readFile(path, seek, size)` | `byte[]` | Dosyanın tamamını ya da bir aralığını okur |
| `writeFile(path, data)` | `void` | Yazar, mevcut içeriği değiştirir |
| `appendFile(path, data)` | `void` | Sona ekler |
| `createFile(path)` | `void` | Boş dosya oluşturur |
| `copyFile(src, dst)` | `void` | Kopyalar |
| `renameFile(from, to)` | `void` | Yeniden adlandırır ya da taşır |
| `removeFile(path)` | `void` | Dosyayı siler |
| `existsFile(path)` | `bool` | Yol var mı |
| `isFile(path)` | `bool` | Dosya mı |
| `isDirectory(path)` | `bool` | Dizin mi |
| `isEmpty(path)` | `bool` | Boş dosya ya da boş dizin |
| `fileSize(path)` | `longint` | Bayt cinsinden boyut |
| `modifiedTime(path)` | `longint` | Değişiklik zamanı, epoch ms |
| `list(path)` | `string[]` | Tek dizindeki girdi adları |
| `walk(path)` | `string[]` | Tam yollar, özyinelemeli |
| `createDirectory(path)` | `void` | Dizin oluşturur |
| `removeDirectory(path)` | `void` | Dizin siler |

## Ayrıca bakın

- [`path`](/tr/stdlib-path/) diske dokunmadan yol metinlerini birleştirir ve ayırır.
- [`utf8`](/tr/stdlib-utf8/) `byte[]` ile `string` arasında dönüştürür.
