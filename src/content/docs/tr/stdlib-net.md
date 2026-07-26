---
title: net (Ağ)
description: HTTP istekleri ve soket iletişimi (0.9 için planlandı).
---

> **Durum: 0.9 için planlandı.** `net` modülü henüz mevcut sürümde
> kullanılamaz. Bu sayfa planlanan API'yi açıklar.

`net` modülü HTTP istemci işlevselliği ve temel soket iletişimi sağlayacak.
Çalışma zamanında `--allow net` gerektirecek.

## Planlanan fonksiyonlar

### httpGet

Bir HTTP GET isteği gönderir ve yanıt gövdesini string olarak döndürür.

```c
import { httpGet } from net;

int main() {
    string govde = httpGet("https://example.com");
    print(govde);
    return 0;
}
```

### httpPost

Gövdeli bir HTTP POST isteği gönderir ve yanıtı döndürür.

```c
import { httpPost } from net;

int main() {
    string yanit = httpPost("https://example.com/api", "{\"anahtar\":\"deger\"}");
    print(yanit);
    return 0;
}
```

## Capability

Tüm `net` fonksiyonları `--allow net` gerektirir:

```bash
saqut run --allow net program.sqt
```

`net` capability'si `fs` ve `sys`'ten ayrıdır. Yalnızca dosya okuyan ve HTTP
isteği yapan bir program şöyle çalışır:

```bash
saqut run --allow fs,net program.sqt
```

## Ne zaman kullanılabilir olacak

`net` modülü 0.9 sürümü için planlanmıştır. Gelişmeleri
[GitHub Issues](https://github.com/saqutlang/saqut/issues) üzerinden takip
edebilirsin.
