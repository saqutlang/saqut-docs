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
| `--jit` | Programı VM yerine deneysel MIR JIT ile çalıştırır |
| `--dont-optimize` | Sabit katlama ve ölü kod elemeyi kapatır |
| `--gc-threshold=N` | Bayt cinsinden GC eşiği; `0` varsayılanı kullanır, negatif değer toplamayı kapatır |
| `--gc-stats` | Çıkışta GC istatistiklerini yazar |
| `--profile` | Aşama başına süreleri raporlar |
| `--verbose` | Aşama ilerlemesini yazar |
| `-- args` | `--` işaretinden sonrasını programa geçirir; `sys::args()` ile okunur |

Optimizasyon **varsayılan olarak açıktır**. `--dont-optimize` kapatır;
`--optimized` eski komutların çalışmaya devam etmesi için no-op olarak hâlâ
kabul edilir.

Varsayılan ve referans arka uç bytecode VM'dir. `--jit`, programı deneysel MIR
JIT ile çalıştırır; JIT'in VM ile aynı çıktıyı ve aynı çıkış kodunu üretmesi
zorunludur. Gömülü çalışma zamanlı AOT (`--output` ikilisi) hâlâ
planlanmaktadır.

```bash
saqut run program.sqt -- girdi.txt 42
```

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
saqut ir --cfg program.sqt
saqut ir --dont-optimize program.sqt
```

`--cfg`, düz talimat listesi yerine kontrol akış çizgesini yazar: her temel
blok, öncülleri, ardılları ve sonlandırıcısıyla birlikte. Dallanmaların ve
döngülerin nasıl yerleştiğini görmek için kullanılır.

`--dont-optimize`, IR'yi sabit katlama ve ölü kod elemeden önceki haliyle
gösterir; optimize edicinin tam olarak neyi değiştirdiğini görmenin yolu budur.

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
saqut run --gc-stats --profile program.sqt

# Çalıştırmadan önce kontrol et
saqut check program.sqt && saqut run program.sqt

# İki arka ucu aynı programda karşılaştır
saqut run program.sqt > vm.txt
saqut run --jit program.sqt > jit.txt
diff vm.txt jit.txt

# Optimizasyonun neyi değiştirdiğini gör
saqut ast program.sqt --json > optimize.json
saqut ast program.sqt --dont-optimize --json > ozgun.json
diff ozgun.json optimize.json
```
