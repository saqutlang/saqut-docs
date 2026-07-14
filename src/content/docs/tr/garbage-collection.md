---
title: Çöp Toplama
description: saQut'un basit, belirleyici bir işaretle-süpür toplayıcı ile belleği nasıl geri kazandığı. Ne zaman çalışır, ne hayatta kalır, ne serbest bırakılır ve nasıl izlenir.
---

Programınız çalışırken veri oluşturur: string'ler, diziler ve struct'lar. Bu
verilere artık ihtiyaç kalmadığında belleği bir şeyin serbest bırakması
gerekir. saQut bunu bir **çöp toplayıcı (GC)** ile otomatik olarak yapar;
böylece asla `free` veya `delete` yazmazsınız. Bu sayfa, sade bir dille,
toplayıcının *ne zaman* çalıştığını ve *neyin hayatta kaldığını* açıklar.

## Önce: her şey çöp toplamaya tabi değildir

GC yalnızca **yığın nesneleriyle** (referans türleri) ilgilenir:

| GC tarafından yönetilir | Yönetilmez (düz değerler) |
|-------------------|----------------------------|
| `string` | `int` |
| `struct` | `float` |
| `array` (`int[]`, `Point[]`, …) | `bool` |
| | `byte` |

İlkeller (`int`, `float`, `bool`, `byte`) **değer** türleridir. Doğrudan bir
değişkenin yuvasında yaşar, atandıklarında kopyalanır ve yuva ortadan
kalktığında kendiliğinden yok olurlar. Toplanacak bir şey yoktur. (Değer-referans
ayrımı için [veri türlerine](/data-types/) bakın.) Dolayısıyla "çöp"ten
bahsettiğimizde, her zaman erişilemez *referans* nesnelerini kastederiz.

---

## Ne hayatta kalır: erişilebilirlik, sayım değil

Kritik sorunun, *"tüm değişkenlerim silinir mi, yoksa referansı olanlar kalır
mı?"* sorusunun kesin bir cevabı vardır: **bir nesne hâlâ erişilebilirse
hayatta kalır, değilse serbest bırakılır.**

saQut bir **işaretle-süpür** (mark-sweep) toplayıcı kullanır; bu iki aşamada
çalışır:

1. **İşaretle.** Programın şu anda hâlâ dokunabileceği canlı değişkenler olan
   **köklerden** başla ve her referansı takip et. Bir kökten
   erişebildiğin her şey *canlı* olarak işaretlenir.
2. **Süpür.** Yığını tara ve işaretlenmemiş her nesneyi serbest bırak.
   Erişilebilir hiçbir şey atlanmaz; erişilemez her şey geri kazanılır.

Kökler şunlardır:

- Hâlâ kapsamda olan **global (modül) değişkenleri**
- Her aktif fonksiyon çağrısındaki **yerel değişkenler** (mevcut çağrı yığını)
- O anda **fırlatılmakta** olan bir değer (uçuş halindeki bir hata)

Yani kural tam da umduğunuz gibidir:

> Eğer canlı bir değişken veya canlı bir değişkenden başlayan bir nesne
> zinciri bir nesneye erişebiliyorsa, o nesne **kalır**. Hiçbir şey
> erişemiyorsa, **serbest bırakılır**.

### Örnekle açıklama

```c
int[] keep = [1, 2, 3];

for (int i = 0; i < 100000; i = i + 1) {
    int[] temp = [i, i, i];   // her yinelemede yeni bir dizi
}

print(keep.length());          // 3
```

`keep`, tüm program boyunca canlı bir değişken tarafından referanslanır;
dolayısıyla bir köktür ve **asla toplanmaz**. Buna karşılık her `temp` dizisi,
bir sonraki yineleme başladığı anda erişilemez hale gelir: artık hiçbir
değişken eski diziyi göstermez, bu yüzden toplayıcı onu geri kazanır. Bu
kodu GC istatistikleriyle çalıştırmak, on binlerce `temp` dizisinin
serbest bırakıldığını, `keep`'in ise tüm süre boyunca canlı kaldığını
gösterir.

### Döngüler de toplanır

Hayatta kalma, bir nesneyi kaç şeyin gösterdiğine değil, **köklerden
erişilebilirliğe** dayandığı için, saQut **döngüsel** yapıları da doğru
şekilde serbest bırakır. Birbirini gösteren ama hiçbir kökten erişilemeyen
iki struct hâlâ çöptür ve işaretle-süpür onları toplar. (Bu, naif bir
referans sayımı toplayıcısının düştüğü tuzaktır ve saQut'un bilinçli olarak
referans sayımı kullanmama nedenidir.)

```c
struct Node { Node other; }

void makeGarbage() {
    Node a;
    Node b;
    a.other = b;
    b.other = a;      // a ⇄ b birbirini gösterir
}                     // bu fonksiyon döndükten sonra hiçbir şey a veya b'ye erişemez;
                      // döngü erişilemezdir ve toplanACAKTIR
```

---

## Ne zaman çalışır?

Toplayıcı **eşik tabanlıdır**. Programınız nesne tahsis ettikçe, saQut ne
kadar canlı veri olduğunu takip eder. Tahsis bir eşiği aştığında, bir
sonraki **güvenli nokta** (safepoint) bir toplamayı tetikler.

- **Güvenli noktalar komut sınırlarındadır.** Toplayıcı asla bir işlemin
  ortasında çalışmaz; yalnızca VM komutları arasında, her nesnenin tutarlı,
  tam olarak oluşmuş durumda olduğu anlarda çalışır. (Bir komutun ortasında
  inşa edilmekte olan bir nesne asla çöp sanılmaz.)
- **Dünyayı durdurur (stop-the-world).** Bir toplama sırasında program kısa
  bir süre duraklar; işaretle-süpür tamamlanana kadar çalışır, sonra yürütme
  devam eder. Eşzamanlı veya artımlı toplama yoktur.
- **Eşik uyarlanır.** Bir toplamadan sonra, bir sonraki eşik ne kadar verinin
  hayatta kaldığına bağlı olarak ayarlanır (kabaca *canlı × 2*). Büyük bir
  çalışma kümesine sahip bir program daha seyrek toplar; kısa ömürlü nesneleri
  hızla tüketen bir program daha sık toplar.

Bu, toplamanın *zamanlamasını* bir gerçekleme detayı yapar, ancak *sonucu*
tamamen belirleyicidir: aynı program aynı nesneleri serbest bırakır; bu
özellik, saQut'un incelenebilir, tekrarlanabilir tasarımı için önemlidir.

---

## GC'yi izlemek ve ayarlamak

İki CLI bayrağı, toplayıcıyı gözlemlemenize ve kontrol etmenize olanak tanır:

### `--gc-stats` (ne olduğunu raporla)

```bash
saqut run --gc-stats myfile.sqt
```

```
gc: runs=97 freed=99134 live=867
```

- **`runs`**: kaç toplama gerçekleşti
- **`freed`**: geri kazanılan toplam nesne sayısı
- **`live`**: sonunda hâlâ canlı olan nesneler

### `--gc-threshold=N` (ne kadar hevesle toplayacağını değiştir)

```bash
saqut run --gc-threshold=1000 --gc-stats myfile.sqt
```

**Daha düşük** bir eşik daha sık toplar: bellek daha az yer kaplar ama GC
daha sık çalışır. **Daha yüksek** bir eşik tam tersini yapar. Yukarıdaki
örnekte, eşiği düşürmek `runs=97 … live=867` çıktısını `runs=100 … live=201`
haline getirir: daha sık süpürme, her an çok daha az bellek tutulması.

Bu bir ayar düğmesi ve bir inceleme yardımcısıdır; doğruluk için asla
ihtiyacınız olmaz, ama toplayıcının davranışını doğrudan görmenizi sağlar.

---

## Tasarım notları

- **Bilinçli olarak basit.** Kopyalama, sıkıştırma, nesiller, eşzamanlılık
  yok. GC, tarihsel olarak performans sorunlarının yaygın bir kaynağıdır; bu
  yüzden saQut toplayıcıyı küçük ve öngörülebilir tutarak bu riski azaltır.
- **Erişilebilirlik sayıma üstün gelir.** İşaretle-süpür, referans sayımının
  sızdıracağı döngüleri toplar; saQut'un model olarak `shared_ptr` tarzı
  sayıma dayanmama nedeni budur.
- **Belirleyici sonuç.** Zamanlama eşikle değişebilir, ama *hangi* nesnelerin
  serbest bırakıldığı değişmez.

## Sırada Ne Var?

- Değer-referans ayrımını [veri türlerinde](/data-types/) gözden geçirin
- Referansların nasıl paylaşıldığını [struct'larda](/structs/#reference-semantics) ve [dizilerde](/arrays/#reference-semantics) görün
- Yürüten VM'yi [derleyici araçlarında](/tr/compiler-tools/#6-bayt-kodu-vm-saqut-run) keşfedin
