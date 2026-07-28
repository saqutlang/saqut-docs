---
title: fs (Dosya Sistemi)
description: saQut'un fs modülü ile dosya okuma, yazma ve listeleme.
---

`fs` modülü programının dosya sistemiyle etkileşime girmesini sağlar. Tüm
fonksiyonlar çalışma zamanında `--allow fs` gerektirir.

## Import

```c
import { readFile, writeFile, readDir, exists, remove } from fs;
```

## Fonksiyonlar

### readFile

Bir dosyanın tüm içeriğini okur ve string olarak döndürür.

```c
import { readFile } from fs;

int main() {
    string icerik = readFile("veri.txt");
    print(icerik);
    return 0;
}
```

Dosya yoksa `readFile` yakalanabilir bir hata fırlatır. `try`/`catch` ile
sarabilir veya önce `exists` ile kontrol edebilirsin.

### writeFile

Bir string'i dosyaya yazar. Dosya yoksa oluşturur, varsa üzerine yazar.

```c
import { writeFile } from fs;

int main() {
    writeFile("cikti.txt", "Merhaba saQut!");
    return 0;
}
```

### readDir

Bir dizindeki giriş adlarını dizi olarak döndürür.

```c
import { readDir } from fs;

int main() {
    string[] girisler = readDir(".");
    for (int i = 0; i < girisler.length; i = i + 1) {
        print(girisler[i]);
    }
    return 0;
}
```

### exists

Verilen yolda bir dosya veya dizin varsa `true` döndürür.

```c
import { exists } from fs;

int main() {
    if (exists("ayar.txt")) {
        string a = readFile("ayar.txt");
        print(a);
    } else {
        print("ayar dosyası bulunamadı");
    }
    return 0;
}
```

### remove

Bir dosyayı siler. Yol yoksa veya bir dizinse hata fırlatır.

```c
import { remove } from fs;

int main() {
    remove("gecici.txt");
    return 0;
}
```

## fs erişimiyle çalıştırma

```bash
saqut run --allow fs program.sqt
```
