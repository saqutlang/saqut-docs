---
title: CLI Referansı
description: 'saQut komut satırı arayüzünün tam referansı: çalıştırma, derleme, hata ayıklama ve teşhis bayrakları.'
---

Bu sayfa bir pratisyenin ihtiyaç duyduğu tüm `saqut` alt komutlarını ve
bayraklarını kapsar. Derleyiciyi kurmak için [Hızlı Başlangıç](/tr/getting-started/)
sayfasına bak.

## Alt komutlar

### run

Bir programı derler ve çalıştırır.

```bash
saqut run program.sqt
```

| Bayrak | Amacı |
|---|---|
| `--allow fs,net,sys` | Çalışma zamanı capability'lerini verir |
| `--jit` | Programı VM yerine deneysel MIR JIT ile çalıştırır |
| `--optimized` | Sabit katlama ve ölü kod eleme uygular |
| `--gc-threshold N` | N tahsis sonrası GC'yi tetikler |
| `--gc-stats` | Çalışma sonrası GC istatistiklerini yazar |
| `--profile` | Aşama başına profil çıkarır (tokenleme, ayrıştırma, IR üretimi, çalıştırma) ve her aşamanın iş miktarını gösterir |

Varsayılan ve referans arka uç bytecode VM'dir. `--jit` bayrağı programı
deneysel MIR JIT ile çalıştırır; bu şu anda yalnızca tam sayı ve float skaler
koddan oluşan programları işler. Başka bir şey kullanan program kısmen
çalışmak yerine açık bir hatayla durur. Gömülü çalışma zamanlı AOT (`--output`
ikilisi) hâlâ planlanmaktadır.

### tokens

Token akışını JSON olarak yazar.

```bash
saqut tokens program.sqt
```

Her token; tür, metin, satır, sütun ve byte ofseti içerir. Söz dizimi
vurgulayıcı veya özel araç yazmak için kullanışlıdır.

### ast

Soyut söz dizimi ağacını JSON olarak yazar.

```bash
saqut ast program.sqt
saqut ast program.sqt --optimized
```

`--optimized` bayrağı, sabit katlama ve ölü kod eleme sonrası ağacı yazar.
Orijinal AST korunur; optimizasyon bir klon üzerinde çalışır.

### symbols

Sembol tablosunu JSON olarak yazar.

```bash
saqut symbols program.sqt
```

Tüm fonksiyonları, değişkenleri, struct'ları, enum'ları ve tiplerini gösterir.
Kapsam bilgisi içerir.

### ir

Ara kodu (üç adresli kod) yazar.

```bash
saqut ir program.sqt
saqut ir --capabilities program.sqt
```

`--capabilities` bayrağı IR'yi tarar ve programın hangi capability'lere
(`fs`, `net`, `sys`) ihtiyaç duyduğunu çalıştırmadan raporlar.

### check

Yalnızca anlamsal analiz yapar; hata ve uyarıları JSON olarak bildirir.

```bash
saqut check program.sqt
```

Çıkış kodu 0 hatasız demektir. Sıfır olmayan değer hata bulunduğunu belirtir.
Uyarılar çıkış kodunu etkilemez.

### exec

Tek bir ifadeyi veya deyimi etkileşimli olarak çalıştırır.

```bash
saqut exec "3 + 4 * 2"
```

Sonucu doğrudan yazar. Dosya oluşturmadan hızlı denemeler için kullanışlıdır.

### bench

Bir programın çalışma süresini ölçer.

```bash
saqut bench program.sqt
```

Programı birden çok kez çalıştırır ve zamanlama istatistiklerini yazar.

### lsp / dap

Dil Sunucusunu veya Hata Ayıklama Adaptörünü başlatır. Bunlar VS Code eklentisi
tarafından kullanılır, doğrudan çalıştırılmaz:

```bash
saqut lsp
saqut dap
```

## Sık kullanılan desenler

```bash
# Tam içgözlemle çalıştır
saqut run --allow fs --gc-stats --profile program.sqt

# Çalıştırmadan önce kontrol et
saqut check program.sqt && saqut run program.sqt

# Programın neye ihtiyacı var gör
saqut ir --capabilities program.sqt

# Optimize edilmiş AST'yi gör
saqut ast program.sqt --optimized
```
