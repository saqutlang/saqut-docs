---
title: process (Süreç Kontrolü)
description: saQut'un process modülüyle çıkış kodu, çalışma dizini ve süreç kimliği.
---

`process` modülü programın kendi çalışmasıyla ilgilidir: nasıl sonlandığı,
nerede çalıştığı ve hangi süreç olduğu.

```c
import { exit, cwd, pid, chdir } from process;
```

## `void exit(int code)`

Programı verilen çıkış koduyla hemen sonlandırır. `0` başarı demektir; başka
her değer, programı başlatan tarafa başarısızlık bildirir.

```c
import { exit } from process;
import { existsFile } from fs;

int main() {
    if (!existsFile("ayar.txt")) {
        print("ayar.txt bulunamadi\n");
        exit(1);
    }

    print("calisiyor\n");
    return 0;
}
```

`exit` geri dönmez; fonksiyonda ondan sonrası çalışmaz. Olağan durumda
`main`'den değer döndürmek de aynı işi görür. `exit`, `main`'den daha derin bir
yerden durmanız ve başarısızlık değerini her çağıran üzerinden yukarı taşımak
istemediğiniz durumlar içindir.

## `string cwd()`

Geçerli çalışma dizini, mutlak yol olarak. Program bu dizinden başlatılmıştır
ve `fs` çağrılarındaki göreli yollar buna göre çözülür.

```c
import { cwd } from process;

int main() {
    print(cwd());     // örneğin /home/saqut/proje
    return 0;
}
```

## `void chdir(string path)`

Çalışma dizinini değiştirir. Sonrasında kullanılan her göreli yol yeni konuma
göre çözülür.

```c
import { cwd, chdir } from process;

int main() {
    chdir("/tmp");
    print(cwd());     // /tmp
    return 0;
}
```

Bu, programın geri kalanının bağlı olduğu bir durumu değiştirir; göreli yol
kullanan her `fs` çağrısı dahil. Birden fazla iş yapan bir programda, yer
değiştiren bir çalışma dizini yerine mutlak yolları izlemek daha kolaydır.

## `int pid()`

Bu koşuya ait işletim sistemi süreç kimliği. Bir kayıt satırı ya da eşzamanlı
koşular arasında farklı olması gereken bir kilit dosyası adı için kullanışlıdır.

## Fonksiyonların tam listesi

| Fonksiyon | Döndürür | İşlevi |
|---|---|---|
| `exit(code)` | `void` | Programı çıkış koduyla sonlandırır |
| `cwd()` | `string` | Geçerli çalışma dizini |
| `chdir(path)` | `void` | Çalışma dizinini değiştirir |
| `pid()` | `int` | Bu sürecin kimliği |

`cwd()` ve `pid()` programın dışındaki durumu okur; sonuçları koşular ya da
makineler arasında tekrarlanabilir değildir.
