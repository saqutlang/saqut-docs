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
| `--allow fs,net,sys` | Çalışma zamanı capability'lerini whitelist olarak verir; verilmezse tümü açıktır |
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
saqut bench program.sqt [--jit] --runs=<iterations>
```

JIT, zamanlama iterasyonlarından önce bir kez ısıtılır. Zamanlama tablosu
çalıştırma süresini derleme/ısıtma süresinden ayrı gösterir.

## Performansı adil karşılaştırma

Her dilde aynı algoritmayı, aynı girdiyi, aynı çıktı davranışını, aynı
optimizasyon seviyesini ve aynı tekrar sayısını kullan. En az iki sayı bildir:

- **derleme/ısınma süresi**: ilk ölçülen çalışmadan önce geçen süre;
- **kararlı çalışma süresi**: kurulumdan sonra tekrar edilen program gövdesinin süresi.

saQut için zamanlama tablosundaki `vm-execute` ve `jit-execute` değerlerini
kullan. saQut JIT ısınmasını, başka bir dilin önceden derlenmiş binary süresiyle
karşılaştırma. C++, Rust, Go veya Java karşılaştırmasında compiler ve bayrakları,
runtime sürümünü, makineyi, işletim sistemi sürümünü, girdi boyutunu ve GC veya
sınır kontrollerinin açık olup olmadığını yaz. Tek bir VM/JIT oranı yerel bir
ölçümdür; evrensel dil sıralaması değildir.

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
