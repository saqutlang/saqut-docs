---
title: stdin / stdout / stderr
description: saQut'ta standart girdiyi okuma, standart çıktı ve standart hataya yazma.
---

Üç küçük modül, programı başlatıldığı akışlara bağlar: böylece program bir
borudan girdi alabilir ve çıktısını tanı mesajlarından ayırabilir.

```c
import { readLine, readAll, readBytes } from stdin;
import { write, writeBytes } from stdout;
```

Hem `stdout` hem `stderr`, `write` ve `writeBytes` adlarını dışa verir. Aynı
adı tek dosyada ikisinden birden içe aktarmak çakışmadır; birini `as` ile
yeniden adlandırın:

```c
import { write } from stdout;
import { write as hataYaz } from stderr;
```

## Okuma

### `string? readLine()`

Bir satır okur, satır sonu karakteri olmadan. Girdi bittiğinde `null` döner;
döngünün duracağını böyle anlar.

Dönüş tipi `string?`'dır ve `while` koşulundaki null denetimi döngü gövdesinde
tipi daraltmaz. Okumayı döngünün içinde yapın ve null gelince çıkın:

```c
import { readLine } from stdin;
import { write } from stdout;

int main() {
    while (true) {
        string? satir = readLine();
        if (satir == null) {
            break;
        }
        write("> ");
        write(satir);
        write("\n");
    }
    return 0;
}
```

```bash
printf "bir\niki\n" | saqut run yankila.sqt
```

```
> bir
> iki
```

### `string readAll()`

Standart girdinin tamamını tek bir metin olarak okur. Küçük girdiler için
elverişlidir; girdinin tamamını bir anda bellekte tuttuğunu unutmayın.

### `byte[] readBytes()`

Standart girdinin tamamını ham bayt olarak okur; metin olmayan ikili veri
için. Sonradan metin gibi ele almaya karar verirseniz
[`utf8::decode`](/tr/stdlib-utf8/) kullanın.

## Yazma

### `void write(string text)`

Metni akışa yazar, sona satır sonu eklemeden. `print()` fonksiyonunun aksine
hiçbir şey eklemez: satır sonu istiyorsanız `"\n"` karakterini kendiniz
yazarsınız.

### `void writeBytes(byte[] data)`

Ham bayt yazar; metin olmayan çıktı için.

## Hangi akış kullanılmalı

Standart çıktı programın sonucunu, standart hata ise koşuyla ilgili mesajları
taşır. Bu ayrım, çağıranın birini yönlendirip diğerini görmeye devam etmesini
sağlar:

```bash
saqut run rapor.sqt > sonuc.txt     # sonuç dosyaya, hatalar ekranda kalır
```

```c
import { write } from stdout;
import { write as hataYaz } from stderr;

int main() {
    hataYaz("girdi okunuyor...\n");   // ilerleme, sonucun parçası değil
    write("42\n");                    // sonuç
    return 0;
}
```

İlerleme mesajını standart çıktıya göndermek, onu veriyle karışmış biçimde
`sonuc.txt` dosyasına koyardı.

## Fonksiyonların tam listesi

| Modül | Fonksiyon | Döndürür | İşlevi |
|---|---|---|---|
| `stdin` | `readLine()` | `string?` | Bir satır, girdi bittiyse `null` |
| `stdin` | `readAll()` | `string` | Girdinin tamamı, metin olarak |
| `stdin` | `readBytes()` | `byte[]` | Girdinin tamamı, ham bayt olarak |
| `stdout` | `write(text)` | `void` | Metin yazar, satır sonu eklemez |
| `stdout` | `writeBytes(data)` | `void` | Ham bayt yazar |
| `stderr` | `write(text)` | `void` | Standart hataya metin yazar |
| `stderr` | `writeBytes(data)` | `void` | Standart hataya ham bayt yazar |

Standart girdiden okumak, boruya ne verildiğine bağlıdır; bu yüzden girdi okuyan
bir program tek başına tekrarlanabilir değildir, aynı girdi dosyasıyla çalışan
aynı program ise tekrarlanabilirdir.
