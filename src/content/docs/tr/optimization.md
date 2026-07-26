---
title: Optimizasyon
description: saQut'un optimize edicisinin yaptıkları ve bilinçli olarak yapmadıkları. Sabit katlama, ölü kod temizliği ve her ikisini de nasıl inceleyeceğiniz.
---

Programınız tür denetiminden geçtikten sonra, saQut kodu daha basit ama eşdeğer
bir biçime dönüştüren bir **optimize edici** çalıştırabilir. Bu sayfa tam olarak
ne yaptığını, nelere dokunmadığını ve çalışmasını nasıl izleyeceğinizi açıklar.

Tasarımın tamamını iki ilke şekillendirir:

1. **Optimize edici asla davranışı değiştirmez.** Optimize edilmiş bir program,
   optimize edilmemiş olanla aynı çıktıyı üretir: optimizasyon bir yeniden
   yazımdır, yeniden yorumlama değildir.
2. **Bir *klon* üzerinde çalışır.** Orijinal AST'niz korunur; optimize edici
   bir kopyayı dönüştürür. Bu yüzden "önce" ve "sonra" hallerini isteyip
   aralarındaki farkı görebilirsiniz.

---

## Optimizasyonu görmek

Her aşama incelenebilir ve optimizasyon da bir istisna değildir. Ağacı önce
ve sonra haliyle karşılaştırın:

```bash
saqut ast myfile.sqt               # orijinal AST
saqut ast myfile.sqt --optimized   # optimizasyon sonrası AST
```

Optimize edicinin hesapladığı düğümler etiketlenir, böylece değişiklik
gizlenmek yerine görünür olur:

```
VariableDecl (y : int)
  Literal {14} integer [folded]      ←  2 + 3 * 4 idi
```

---

## Ne yapar

### 1. Sabit katlama

Bir ifade derleme zamanında hesaplanabiliyorsa, optimize edici onu **bir kere**
hesaplar ve tüm ifadeyi sonuçla değiştirir. Programınız böylece tarif yerine
cevabı taşır.

```c
int x = 2 + 3 * 4;     // katlanır:  int x = 14;
```

Katlama, öncelik ve birleşme kurallarına uyar; dolayısıyla her zaman programın
zaten hesaplayacağı değeri üretir. Şunlara uygulanır:

- **Tamsayı aritmetiği**: `2 + 3 * 4` → `14`
- **Boolean / mantıksal ifadeler**: `true && false` → `false`
- **Sabitlerin karşılaştırılması**: `5 > 3` → `true`

Katlanan alt ifadeler daha fazla katlamanın önünü açabileceğinden, optimize
edici bir **sabit nokta döngüsünde** çalışır: tam bir geçiş hiçbir şeyi
değiştirene kadar katlamaya devam eder; tur sayısında bir güvenlik üst sınırı
vardır. Böylece `(2 + 2) * (3 + 3)` gibi iç içe bir sabit yalnızca bir seviye
değil, sonuna kadar `24`'e çöker.

### 2. Ölü kod temizliği (DCE)

Hiç çalışamayacak kod kaldırılır. Klasik durum, `return`, `break`, `continue`
veya `throw` **sonrasındaki** her şeydir:

```c
int f() {
    return 1;
    int x = 2;         // kaldırılır, asla erişilmez
}
```

DCE erişilemez kod bulduğunda, bir şeyin atıldığını bilmeniz için ayrıca bir
**`W003` uyarısı** yayar (genellikle bu bir hatadır):

```
warning [W003]: bu koda asla erişilmez (return/break/continue sonrası)
```

`W003`, optimize edici çalıştığında görünür, örn. `saqut ast myfile.sqt --optimized`.

### İlgili derleme zamanı kontrolleri

Sabitler üzerinde akıl yürütürken, derleyici program hiç çalışmadan önce bir
sabit **sıfıra bölme** hakkında da uyarı verebilir. Bu,
[`W002`](/tr/compiler-errors/#uyarılar-w001w006) uyarısıdır.

---

## Ne yapmaz

Sınırlar, dönüşümler kadar önemlidir. saQut'un optimize edicisi **bilinçli
olarak muhafazakardır**. Hedef, olası her döngüyü çıkarmak değil, belirlilik
garantisiyle öngörülebilir hızdır. Optimize edicinin neye dokunmadığını bilmek,
onun neyi yeniden yazmasını beklememeniz gerektiğini söyler.

### Float ifadeler katlanmaz

Tamsayı sabitleri katlanır; **kayan noktalı sabitler katlanmaz**:

```c
int   a = 2   + 3   * 4;    // → 14   (katlandı)
float b = 2.0 + 3.0 * 4.0;  // ifade olarak kalır, çalışma zamanında hesaplanır
```

Kayan noktalı sonuçlar yuvarlama ve değerlendirme sırasına bağlı olarak
değişebilir; bu yüzden onları derleme zamanında katlamak, VM'nin
hesaplayacağından ince bir farkla farklı bir değer üretme riski taşır. saQut
float matematiğini, bir uyumsuzluk riskine girmektense, çalışan programda
görebileceğiniz yerde tutar.

### Değişkenler ifadeler arası katlanmaz

Katlama yalnızca bir ifadenin kendi sabitlerine bakar. Bir değişkenin değerini
önceki satırdan **takip etmez**:

```c
int a = 5;
int b = a + 1;    // 6'ya katlanmaz; 'a' bir değişkendir, sabit değil
```

Sabit *yayılımı*, kopya yayılımı veya ortak alt ifade elemesi yoktur.

### Agresif dönüşümler yoktur

Bilinçli olarak yok: döngü açma, fonksiyon içleme (inline), güç azaltma,
vektörleştirme ve kayan noktalı sonuçları veya gözlemlenebilir davranışı
değiştirebilecek yeniden sıralamalar. Bunlar tam olarak optimize edilmiş bir
programın naif olandan farklı davranmasına yol açan dönüşümlerdir ve özdeş
davranmak esastır.

---

## Neden bu kadar muhafazakar?

saQut'un referans arka yüzü **belirleyici bir bayt kodu VM**'dir: aynı girdi
her zaman aynı çıktıyı üretmelidir ve gelecekteki arka yüzler (bir MIR JIT,
gömülü çalışma zamanlı bir AOT derlemesi) VM'ye karşı **farksal test** ile
doğrulanır: her arka yüz her programda aynı sonuca varmalıdır. Agresif,
float'ları yeniden sıralayan optimizasyon bu garantinin doğal düşmanıdır.
Optimize ediciyi küçük ve davranış koruyucu tutarak, her arka yüz uyum içinde
kalır ve her aşama incelenebilir olmayı sürdürür.

Ham işlem hızı istiyorsanız, bu iş IR üzerinde çalışan gelecekteki JIT/AOT
arka yüzlerine aittir; kaynak kodunuzu artık tanıyamayacağınız bir şeye
dönüştüren bir ön yüze değil.

## Sırada Ne Var?

- Optimize edilmiş ağacın nasıl komutlara dönüştüğünü [derleyici araçlarında](/tr/compiler-tools/#5-ir-ara-gösterim--saqut-ir) görün
- Optimize edicinin hangi uyarıları ürettiğini [derleyici hatalarında](/tr/compiler-errors/) öğrenin
- Çalışma zamanı belleğini [çöp toplamada](/tr/garbage-collection/) anlayın
