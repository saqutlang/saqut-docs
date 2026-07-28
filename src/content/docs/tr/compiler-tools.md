---
title: Derleyici Araçları, Token'lar, AST, Semboller ve IR
description: Bunlar nedir, neden varlar ve ne zaman kullanırsınız?
---

Çoğu derleyici bir **kara kutudur**: kaynak kodunu koyarsınız, bir program
alırsınız ve arada olanlar gizlidir. saQut farklıdır: o bir **cam kutudur**.
Derlemenin her aşaması, inceleyebileceğiniz ve başka araçlara
aktarabileceğiniz ayrı bir adımdır.

---

## İşlem Hattı Genel Görünümü

```
Kaynak Kodu
    │  saqut tokens
    ▼
TOKEN'LAR
    │  saqut ast
    ▼
AST (Soyut Sözdizimi Ağacı)
    │  saqut symbols
    ▼
SEMBOL TABLOSU
    │  saqut check
    ▼
TÜR EKLENMİŞ AST
    │  (isteğe bağlı optimizasyon)
    ▼
IR (Ara Gösterim)
    │  saqut ir
    ▼
BAYT KODU VM → çıktı
    │  saqut run
```

Her ok, ayrı ayrı çalıştırabileceğiniz bir CLI komutudur.

---

## 1. Token'lar (`saqut tokens`)

### Token nedir?

Kod yazdığınızda, derleyici önce kaynak dosyayı karakter karakter okur ve
bunları **token** adı verilen anlamlı parçalara gruplar. Bir token, bir
cümledeki kelime gibi, anlamlı en küçük birimdir.

Şu kod için:

```c
int x = 42;
```

Token'layıcı şunu üretir:

```
keyword "int"
identifier "x"
operator "="
number "42"
delimiter ";"
```

### Token'lar neden var?

Sonraki derleyici aşamaları ham metin üzerinde değil, yapılandırılmış parçalar
üzerinde çalışır. Token'layıcı (**lexer** olarak da adlandırılır) karakter
akışını etiketlenmiş parçalar listesine dönüştürür. Yorumlar ve boşluklar burada
atılır.

### `saqut tokens` komutunu ne zaman kullanırsınız?

- **Hata ayıklama:** Bir şey çözümlenmiyorsa, hangi token'ların üretildiğini
  kontrol edin
- **Araç geliştirme:** Token akışı üzerine bir sözdizimi vurgulayıcı veya kod
  biçimlendirici inşa edin, kaynak dosyaların sözcüksel olarak geçerli olup
  olmadığını doğrulayın

İşte bir insertion sort programının token akışı
(`examples/algorithm/03_insertion_sort.sqt`):

```bash
saqut tokens examples/algorithm/03_insertion_sort.sqt
```

```
Tokenler (134 adet):
  [keyword] "int"
  [identifier] "main"
  [delimiter] "("
  [delimiter] ")"
  [delimiter] "{"
  [keyword] "int"
  [delimiter] "["
  [delimiter] "]"
  [identifier] "arr"
  [operator] "="
  [delimiter] "["
  [number] "5"
  [delimiter] ","
  [number] "3"
  ...
```

---

## 2. AST (Soyut Sözdizimi Ağacı: `saqut ast`)

### AST nedir?

Token'lar düzdür: yapı göstermezler. **Çözümleyici** (parser) token listesini
alır ve **Soyut Sözdizimi Ağacı (AST)** adı verilen bir ağaç inşa eder. Bu
ağaç, programınızın dilbilgisel yapısını temsil eder.

`2 + 3 * 4` için:

```
      (+)
     /   \
    2     (*)
         /   \
        3     4
```

Ağaçtaki her **düğüm** anlamlı bir şeydir: bir fonksiyon tanımı, bir değişken
bildirimi, bir `if` deyimi, bir aritmetik ifade.

### AST neden var?

Düz token listesi iç içelik ve öncelik bilgisini kaybeder. Ağaç yapısı,
`*`'ın `+`'dan daha sıkı bağlandığını ve `if` gövdesinin koşula ait olduğunu
açıkça gösterir.

saQut bir **Pratt çözümleyici** kullanır; bu teknik, her seviye için ayrı
dilbilgisi kuralları yazmak yerine işleç önceliğini bir tablo üzerinden
yönetir. Bu, çözümleyiciyi daha küçük ve genişletmesi daha kolay hale getirir.

### `saqut ast` komutunu ne zaman kullanırsınız?

- **Hata ayıklama:** Bir program beklendiği gibi davranmıyorsa, AST'nin
  niyetinizle eşleşip eşleşmediğini kontrol edin
- **Araç geliştirme:** Dokümantasyon üretin, karmaşıklık metrikleri hesaplayın
  veya kod analiz araçları inşa edin

İşte bir insertion sort programının AST'si:

```bash
saqut ast examples/algorithm/03_insertion_sort.sqt --format=json
```

```
Program
  FunctionDecl (main : int)
    Block
      VariableDecl (arr : int[])
        ArrayLiteral [5 eleman]
     Literal {5} integer
     Literal {3} integer
     Literal {1} integer
     Literal {6} integer
     Literal {4} integer
      VariableDecl (n : int)
    Literal {5} integer
      ForStatement
        VariableDecl (i : int)
     Literal {1} integer
  ...
```

`--optimized` bayrağı, sabit katlama ve ölü kod temizliği **sonrası** AST'yi
gösterir; ikisini karşılaştırarak neyin değiştiğini görebilirsiniz.

---

## 3. Sembol Tablosu (`saqut symbols`)

### Sembol tablosu nedir?

Bir **sembol tablosu**, programınızdaki her ismin sözlüğüdür: fonksiyonlar,
değişkenler, struct'lar, parametreler. Her ismin nerede tanımlandığını, hangi
türe sahip olduğunu ve nerede kullanıldığını kaydeder.

```c
int x = 10;

int add(int a, int b) {
    return a + b;
}
```

Sembol tablosu şunları içerir:

| İsim | Türü | Tip | Kapsam |
|------|------|------|-------|
| `x` | Değişken | `int` | Global |
| `add` | Fonksiyon | `(int, int) -> int` | Global |
| `a` | Parametre | `int` | `add` fonksiyonu |
| `b` | Parametre | `int` | `add` fonksiyonu |

### Sembol tablosu neden var?

Kod isimlerle doludur. Sembol tablosu **iki geçişte** inşa edilir:

1. **Birinci geçiş:** Tüm programı tarar ve her ismi toplar
   (bu, **ileri referanslara** izin verir; bir fonksiyonu tanımlandığı yerden
   önce çağırabilirsiniz)
2. **İkinci geçiş:** Her isim kullanımını tanımına bağlar

Bu ayrım sayesinde `fibonacci()`'yi tanımlamadan önce çağırabilirsiniz:

```c
int main() {
    print(fibonacci(10));   // ileri referans, sorun yok
    return 0;
}

int fibonacci(int n) {
    // ...
}
```

### `saqut symbols` komutunu ne zaman kullanırsınız?

- **Hata ayıklama:** "Bildirilmemiş tanımlayıcı" hataları, tabloda ne olduğunu
  gördüğünüzde netleşir
- **Araç geliştirme:** Sembol tablosu, bir "Tanıma git" özelliği inşa etmek,
  tüm fonksiyonları listelemek veya bağımlılık grafikleri hesaplamak için
  yeterlidir

İşte bir insertion sort programının sembol tablosu:

```bash
saqut symbols examples/algorithm/03_insertion_sort.sqt
```

```
examples/algorithm/03_insertion_sort.sqt:2:1  fn()->int  main (function)
examples/algorithm/03_insertion_sort.sqt:3:5  int[]  arr
        refs  ...:7:19  ...:9:26  ...:10:13  ...:10:26  ...:13:9  ...:17:15
examples/algorithm/03_insertion_sort.sqt:4:5  int  n
        refs  ...:6:25  ...:16:25
examples/algorithm/03_insertion_sort.sqt:6:10  int  i
        refs  ...:6:21  ...:6:28  ...:6:32  ...:7:23  ...:8:17
examples/algorithm/03_insertion_sort.sqt:7:9  int  key
        refs  ...:9:35  ...:13:22
examples/algorithm/03_insertion_sort.sqt:8:9  int  j
        refs  ...:9:16  ...:9:30  ...:10:17  ...:10:30  ...:11:13 ...
examples/algorithm/03_insertion_sort.sqt:16:10  int  k
        refs  ...:16:21  ...:16:28  ...:16:32  ...:17:19
```

Kaynak kodunuza erişimi olmayan biri, yalnızca `saqut symbols` çıktısından
bir LSP (Dil Sunucusu Protokolü) gerçeklemesi yazabilir. saQut'un
karşılamak üzere tasarlandığı standart budur.

---

## 4. Tür Eklenmiş AST ve Optimizasyonlar

Anlamsal analizden sonra (`check` komutu türleri doğrular, hataları tespit
eder), AST tür bilgisiyle **zenginleştirilir**. Ardından **optimize edici**
isteğe bağlı olarak çalışabilir.

saQut'un optimize edicisi AST'nin bir **klonu** üzerinde çalışır; orijinal
korunur. Bir sabit nokta döngüsünde iki geçiş çalışır:

### Sabit Katlama

Derleme zamanında hesaplanabilen ifadeleri değiştirir:

```c
int x = 2 + 3 * 4;
// şuna dönüşür:
int x = 14;
```

### Ölü Kod Temizliği (DCE)

Hiç yürütülmeyen kodu kaldırır:

```c
int fn() {
    return 1;
    int x = 2;      // asla erişilmez, kaldırılır
}
```

Optimize edici ayrıca hiç çalışamayacak kod için uyarılar verir (W003 uyarısı).

```bash
saqut ast hello.sqt --optimized    # optimize edilmiş AST'yi gör
```

---

## 5. IR (Ara Gösterim: `saqut ir`)

### IR nedir?

**Ara Gösterim** (Intermediate Representation), programınızın daha düşük
seviyeli, komut tabanlı bir biçimidir; gerçek makine kodundan bir adım
ötededir. saQut, sanal yuvalara (register benzeri) sahip **3 adresli kod**
kullanır.

Şu kod için:

```c
int main() {
    int x = 2 + 3;
    print(x);
    return 0;
}
```

IR şuna benzer:

```
LOAD_CONST  s0 = 2
LOAD_CONST  s1 = 3
ADD         s2 = s0 + s1
STORE_LOCAL x = s2
LOAD_LOCAL  s3 = x
CALLHOST    print(s3)
LOAD_CONST  s4 = 0
RETURN      s4
```

Her komut tek bir şey yapar. Yuvalar (`s0`, `s1`, ...) geçici değerlerdir.
`LOAD_CONST` bir sabiti yuvaya koyar. `ADD` iki yuva alır, toplar ve sonucu
üçüncü bir yuvaya koyar. `CALLHOST` bir ana bilgisayar fonksiyonunu (`print`
gibi) çağırır.

### IR neden var?

AST analize uygundur ama doğrudan yürütmeye uygun değildir. IR, yüksek seviyeli
ağaç ile düşük seviyeli bayt kodu VM arasında köprü kurar:

- **AST** = kodun anlamı ne (ağaç)
- **IR** = nasıl yapılır (doğrusal komutlar)
- **Bayt Kodu VM** = yap (yorumlayıcı döngüsü)

IR'yi VM'den ayırmak, ön yüzü değiştirmeden yeni arka yüzler (MIR JIT
derleyicisi veya AOT paketleyici gibi) eklemeyi mümkün kılar.

### `saqut ir` komutunu ne zaman kullanırsınız?

- **Hata ayıklama:** Bir program çalışma zamanında çökerse, IR tam olarak
  VM'nin neyi yürüttüğünü gösterir
- **Performans:** Komutları sayın, gereksiz işlemleri tespit edin, bir
  fonksiyonun kaç yuva kullandığını görün

```bash
saqut ir hello.sqt
```

---

## 6. Bayt Kodu VM (`saqut run`)

**VM (Sanal Makine)** son aşamadır. IR'yi alır, fonksiyon giriş noktalarını
çözümler, çerçeveler ve yuvalar tahsis eder ve komutları bir döngüde yürütür.

İşte bir insertion sort algoritması ve çıktısı:

```c
// examples/algorithm/03_insertion_sort.sqt
int main() {
    int[] arr = [5, 3, 1, 6, 4];
    int n = 5;

    for (int i = 1; i < n; i = i + 1) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }

    for (int k = 0; k < n; k = k + 1) {
        print(arr[k]);
    }
    return 0;
}
```

```bash
saqut run examples/algorithm/03_insertion_sort.sqt
```

```
1
3
4
5
6
```

VM **referans arka yüzdür**: her zaman doğru çıktıyı üretmelidir. Gelecekteki
arka yüzler (MIR JIT, AOT), **farksal test** kullanılarak VM'ye karşı
doğrulanacaktır: aynı girdi için her iki arka yüz de aynı sonucu üretmelidir.

---

## Özet

| Komut | Gösterdiği | Neden var |
|---------|---------------|---------------|
| `saqut tokens` | Etiketlenmiş parçaların düz listesi (anahtar kelimeler, tanımlayıcılar, işleçler...) | Metni yapılandırılmış parçalara dönüştürmek; sözdizimi vurgulayıcıları inşa etmek |
| `saqut ast` | Kodun nasıl iç içe geçtiğini ve gruplandığını gösteren ağaç yapısı | Önceliği ve iç içeliği anlamak; kod analiz araçları inşa etmek |
| `saqut symbols` | Her ismin türü ve kapsamıyla birlikte sözlüğü | Kapsamlamayı anlamak; "tanıma git", otomatik tamamlama inşa etmek |
| `saqut check` | Tür hataları ve uyarılar | Çalıştırmadan önce hataları yakalamak |
| `saqut ir` | Düşük seviyeli 3 adresli komutlar | Yürütmede hata ayıklamak, işlem saymak, optimize etmek |
| `saqut run` | Program çıktısı | Programı çalıştırmak |

### Cam Kutu Felsefesi

> "Kaynak koduna erişimi olmayan biri, yalnızca `saqut symbols` çıktısından
> bir LSP yazabilir. saQut'un geçmek üzere tasarlandığı sınav budur."

Her aşama **makine tarafından okunabilir** (JSON), **borulanabilir**
(Unix dostu) ve **kararlıdır** (bir kamu arayüzü olarak tasarlanmıştır).
CLI'ye kilitli değilsiniz; `saqut ast --format=json` çıktısını tüketen
betikler yazabilir ve saQut'un işlem hattı üzerine kendi araçlarınızı inşa
edebilirsiniz.
