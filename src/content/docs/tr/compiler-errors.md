---
title: Derleyici Hataları ve Uyarıları
description: saQut'un üretebileceği her tanı; neyin tetiklediği, anlamı ve nasıl düzeltileceği. "Tanımsız değişken"den döngüsel modüllere kadar.
---

saQut programınızı kabul edemediğinde, yalnızca "hata" demekle kalmaz: size bir
**kod** (ör. `E002`), bir mesaj, kaynak konumu ve genellikle bir ipucu verir.
Bu sayfa bir katalogdur: her tanı, neyin tetiklediği ve nasıl düzeltileceği.

Tanılar iki aileye ayrılır:

- **Hatalar** (`E…`) derlemeyi durdurur, program çalışmaz.
- **Uyarılar** (`W…`) hiçbir şeyi durdurmaz, program yine de çalışır, ancak
  derleyici şüpheli bir şey işaretlemektedir.

Tanıları programı çalıştırmadan görebilirsiniz:

```bash
saqut check myfile.sqt        # tür denetimi yap ve raporla; çalıştırma
```

---

## Bir tanı nasıl okunur

```
myfile.sqt:3:5: error [E002]: 'a' bu kapsamda zaten tanımlı
    hint: 'a' ilk olarak myfile.sqt:2:5 konumunda tanımlandı, farklı bir isim seçin
```

| Kısım | Anlamı |
|------|---------|
| `myfile.sqt:3:5` | Dosya, satır 3, sütun 5 |
| `error` | Önem derecesi (hata veya uyarı) |
| `[E002]` | Tanı kodu |
| `'a' zaten tanımlı…` | Neyin yanlış gittiği |
| `hint:` | Düzeltmek için somut bir öneri |

Kod kararlıdır: arayabilirsiniz ve gelecekteki araçlar (`saqut explain E002`)
üzerinde genişleyebilecektir.

---

## Anlamsal hatalar (E001-E011)

Bunlar çözümlemeden (parsing) sonra, derleyici isimleri, türleri ve yapıyı
kontrol ederken yakalanır.

### E001 (Tanımsız değişken/isim)

Hiç bildirilmemiş (veya yanlış yazılmış) bir isim kullandınız. saQut yakın
yazım hataları için bir düzeltme bile önerebilir.

```c
int main() {
    print(cout);      // E001, 'cout' tanımlı değil
    return 0;
}
```

**Düzeltme:** önce bildirin veya yazımı düzeltin. (Not: dosyada *daha sonra*
tanımlanan bir fonksiyonu çağırmak sorun değildir (bkz. [fonksiyonlar](/functions/)),
çünkü isimler ilk geçişte toplanır.)

### E002 (Aynı kapsamda mükerrer tanım)

Aynı blokta aynı ismi iki kez bildirdiniz.

```c
int main() {
    int a = 1;
    int a = 2;        // E002, 'a' bu kapsamda zaten tanımlı
    return 0;
}
```

**Düzeltme:** farklı bir isim seçin veya değeri *değiştirmek* istediyseniz
ikinci bir bildirim yerine `=` (atama) kullanın:

```c
int a = 1;
a = 2;                // sorun yok, yeniden atama, yeniden bildirim değil
```

### E003 (Tür uyuşmazlığı)

Farklı bir türün gerektiği yerde bir değer kullandınız ve saQut gizli
dönüşümler eklemez.

```c
int y = 1.5;          // E003, int bağlamında float sabiti
string s = 42;        // E003, int bir string değildir
```

**Düzeltme:** uygun bir sabit kullanın veya [`as`](/operators/#type-cast-operator-as)
ile açıkça dönüştürün:

```c
int y = 1.5 as int;   // sorun yok, açık dönüşüm (1'e budar)
string s = 42 as string;   // "42"
```

### E004 (Döngü veya switch dışında `break` / `continue`)

```c
int main() {
    break;            // E004, çıkılacak bir şey yok
    return 0;
}
```

**Düzeltme:** `break`/`continue` yalnızca `for`, `while`, `do-while` veya
(`break` için) `switch` içinde kullanın.

### E005 (Fonksiyon dışında `return`)

`return` yalnızca bir fonksiyon gövdesi içinde anlamlıdır.

### E006 (Bir yolun dönüşü yok / boş dönüş)

`void` olmayan bir fonksiyon **her** yolda bir değer döndürmelidir ve bir
değer beklendiğinde yalın `return;` kullanılamaz.

```c
int getValue() {
    int x = 5;        // E006, dönüş yapmadan sona eriyor
}

int other() {
    return;           // E006, boş dönüş, ama 'int' gerekiyor
}
```

**Düzeltme:** her yolun bildirilen türden bir `return <değer>;` ile bittiğinden
emin olun.

> *Yanlış tür* döndürmek (ör. `int` fonksiyonundan `return 1.5;`) bir tür
> uyuşmazlığıdır ve [`E003`](#e003--tür-uyuşmazlığı) hatasını verir; E006
> özellikle **eksik** veya **değersiz** bir dönüşle ilgilidir.

### E007 (Tanımsız tür)

Var olmayan bir tür adı kullandınız (genellikle bir yazım hatası veya
tanımlamayı unuttuğunuz bir struct).

```c
Persn p;              // E007, 'Persn' diye bir tür yok
```

### E008 (Fonksiyon çağrısı argüman uyuşmazlığı)

Yanlış sayıda argüman veya yanlış türde bir argüman.

```c
int add(int a, int b) { return a + b; }

int main() {
    add(1, 2, 3);     // E008, 2 argüman bekliyor, 3 verildi
    return 0;
}
```

### E009 (Dizi boyutu sabit değil / geçersiz)

Bir dizinin bildirilen boyutu geçerli bir sabit değil.

### E010 (Özyineli / döngüsel struct tanımı *(şu anda üretilmiyor)*)

Kendisini **değer olarak** içerecek ve sonsuz alan gerektirecek bir struct
için ayrılmıştır. Struct alanları bugün **referans türü** olduğundan (bkz.
[veri türleri](/data-types/#compound-types-reference-types)), kendine
referans veren bir struct yasaldır ve E010'u tetiklemez: bağlı listeleri
ve ağaçları tam olarak böyle kurarsınız:

```c
struct Node {
    int  value;
    Node next;        // sorun yok, 'next' bir referans, gömülü kopya değil
}
```

E010 katalogda tutulur ve yalnızca değer olarak struct gömme eklenirse
yeniden etkinleştirilecektir.

### E011 (Fonksiyon gövdesi içinde bildirim)

Struct'lar ve fonksiyonlar en üst düzeyde bildirilmelidir, başka bir
fonksiyonun içinde iç içe olamaz.

```c
int main() {
    struct Point { int x; int y; }   // E011, struct'ları en üst düzeyde bildirin
    return 0;
}
```

**Düzeltme:** `struct`/fonksiyon tanımını dosyanın en üstüne taşıyın.

---

## Sözdizimi hataları (E901-E904)

Bunlar **çözümleyiciden** (parser) gelir; kod geçerli saQut dilbilgisine
uymaz. Çözümleyici bir hatayla karşılaştığında, hatayı bildirir ve sonra
toparlanmaya çalışır (bilinen bir sınıra atlar), böylece ilkinde durmak
yerine tek bir çalıştırmada *daha fazla* sorun bulmaya devam edebilir.

| Kod | Anlamı | Tipik sebep |
|------|---------|---------------|
| `E901` | Beklenmeyen token | Başıboş bir sembol, eksik `;`, dengesiz `)` |
| `E902` | `as`'ten sonra bir tür adı beklendi | `x as ` ve sonrası boş |
| `E903` | Bir üye adı beklendi | `p.` ve noktadan sonra alan yok |
| `E904` | Bir değişken adı beklendi | İsimsiz bir tür |

---

## Uyarılar (W001-W006)

Uyarılar derlemeyi asla durdurmaz. Yasal olan ama muhtemelen kastettiğiniz
şey olmayan kodu işaret ederler.

| Kod | Anlamı | Notlar |
|------|---------|-------|
| `W001` | Kullanılmayan değişken | Bildirilmiş ama hiç okunmamış |
| `W002` | Sabit ifadede sıfıra bölme | ör. derleyicinin görebildiği `10 / 0` |
| `W003` | Erişilemez (ölü) kod | `return`/`break`/`continue`/`throw` sonrası deyimler |
| `W004` | Örtük sayısal genişletme | Daha dar bir sayının, daha geniş bir sayının sığacağı yerde sessizce kullanılması |
| `W006` | Kullanımdan kaldırılmış yerleşik çağrı sözdizimi | Eski metod çağrı biçimi; noktalı çağrıyı kullanın |

`W003`, optimize edicinin ölü kod geçişi tarafından üretilir; dolayısıyla
optimizasyon çalıştığında görürsünüz (örneğin `saqut ast myfile.sqt --optimized`):

```c
int f() {
    return 1;
    int x = 2;        // W003, bu koda asla erişilmez
}
```

---

## Çalışma zamanı hataları (yakalanabilir)

Yukarıdaki hatalar program **çalışmadan önce** bulunur. İkinci bir grup
program çalışırken oluşur, ancak bunlar çökme değildir:
[`try` / `catch`](/tr/error-handling/) ile yakalanabilirler. Her biri
inceleyebileceğiniz bir `code` taşır.

| Kod | Anlamı |
|------|---------|
| `E_OOB` | Dizi indeksi sınır dışı |
| `E_DIVZERO` | Çalışma zamanında sıfıra bölme |
| `E_CAST` | Null olamaz bir türe başarısız `as` dönüşümü |
| `E_TYPE` | Çalışma zamanında tespit edilen tür hatası (FFI emniyet supabı) |
| `E_BUILTIN` | Geçersiz bir argümanla çağrılan yerleşik fonksiyon |
| `E_DECIMAL_DIVZERO` | Ondalık sıfıra bölme |
| `E_DECIMAL_OVERFLOW` | Ondalık değer aralık dışı |

```c
try {
    int[] a = [1, 2, 3];
    print(a[99]);         // E_OOB fırlatır
} catch (Error e) {
    print(e.code);        // hangi hata olduğunu incele
}
```

---

## Modül hataları

Dosyalar arası `import` / `export` çözümlenirken ortaya çıkar (bkz.
[modüller](/modules/)):

| Kod | Anlamı |
|------|---------|
| `E_MODULE_NOT_FOUND` | İçe aktarılan dosya yolu mevcut değil |
| `E_MODULE_PARSE` | İçe aktarılan dosyada sözdizimi hatası var |
| `E_MODULE_CYCLE` | İki modül birbirini içe aktarıyor (bir döngü) |
| `E_IMPORT_NOT_EXPORTED` | Diğer dosyanın `export` etmediği bir ismi içe aktardınız |
| `E_IMPORT_UNKNOWN` | İçe aktarılan isim o dosyada hiç yok |
| `E_SYMBOL_NOT_IMPORTED` | Başka bir modülün sembolünü içe aktarmadan kullandınız |

---

## Tüm tanıları bir kerede görmek

Çözümleyici bir sözdizimi hatasından sonra toparlandığı ve denetleyici anlamsal
hatalardan sonra devam ettiği için, tek bir `saqut check` çalıştırması yalnızca
ilki değil, **bulabildiği kadar çok sorunu** raporlar:

```
myfile.sqt:3:5: error [E002]: 'a' bu kapsamda zaten tanımlı
myfile.sqt:7:9: error [E001]: 'total' tanımlı değil
myfile.sqt:9:1: warning [W001]: kullanılmayan değişken 'tmp'
,   2 hata(lar), 1 uyarı(lar)
```

## Sırada Ne Var?

- Çalışma zamanı hatalarını [try / catch / throw](/tr/error-handling/) ile yönetin
- Türleri ve dönüşümleri [veri türlerinde](/data-types/) anlayın
- İşlem hattını [derleyici araçlarıyla](/tr/compiler-tools/) inceleyin
