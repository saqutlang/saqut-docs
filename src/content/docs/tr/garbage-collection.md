---
title: Bellek Yönetimi (Çöp Toplama)
description: saQut'un basit, belirleyici bir işaretle-süpür toplayıcı ile belleği nasıl geri kazandığı. Ne zaman çalışır, ne hayatta kalır, ne silinir ve nasıl izlenir.
---

Programınız çalışırken veri oluşturur: string'ler, diziler ve struct'lar. Bu
verilere artık ihtiyaç kalmadığında belleği bir şeyin serbest bırakması
gerekir. saQut bunu bir **çöp toplayıcı (GC)** ile otomatik olarak yapar;
böylece asla `free` veya `delete` yazmazsınız.

## Önce: her şey çöp toplamaya tabi değildir

GC yalnızca **yığın nesneleriyle** (referans türleri) ilgilenir:

| GC tarafından yönetilir | Yönetilmez (düz değerler) |
|-------------------|----------------------------|
| `string` | `int` |
| `struct` | `float` |
| `array` (`int[]`, `Point[]`, ...) | `bool` |
| | `byte` |

İlkeller (`int`, `float`, `bool`, `byte`) **değer** türleridir. Doğrudan bir
değişkenin yuvasında yaşar, atandıklarında kopyalanır ve yuva ortadan
kalktığında kendiliğinden yok olurlar. (Değer-referans ayrımı için
[veri türlerine](/data-types/) bakın.)

---

## Ne hayatta kalır: erişilebilirlik, sayım değil

Bir nesne, canlı bir değişkenden hâlâ erişilebiliyorsa hayatta kalır; hiçbir
şey erişemiyorsa silinir. saQut bir **işaretle-süpür** (mark-sweep) toplayıcı
kullanır; iki aşamada çalışır:

1. **İşaretle.** Programın şu anda hâlâ dokunabileceği canlı değişkenler olan
   **köklerden** başla ve her referansı takip et. Erişebildiğin her şey canlı
   olarak işaretlenir.
2. **Süpür.** Yığını tara ve işaretlenmemiş her nesneyi serbest bırak.

Kökler şunlardır:

- Hâlâ kapsamda olan **global (modül) değişkenleri**
- Her aktif fonksiyon çağrısındaki **yerel değişkenler** (çağrı yığını)
- O anda **fırlatılmakta** olan bir değer (uçuş halindeki bir hata)

> Eğer canlı bir değişken veya canlı bir değişkenden başlayan bir nesne
> zinciri bir nesneye erişebiliyorsa, o nesne kalır. Hiçbir şey erişemiyorsa
> silinir.

### Örnekle açıklama

```c
int[] keep = [1, 2, 3];

for (int i = 0; i < 100000; i = i + 1) {
    int[] temp = [i, i, i];   // her yinelemede yeni bir dizi
}

print(keep.length());          // 3
```

`keep` tüm program boyunca canlı bir değişken tarafından referanslanır ve
**asla toplanmaz**. Her `temp` dizisi ise bir sonraki yineleme başladığı anda
erişilemez hale gelir ve toplayıcı onu geri kazanır.

### Döngüler de silinir

Hayatta kalma, bir nesneyi kaç şeyin gösterdiğine değil köklerden
erişilebilirliğe dayandığı için, saQut **döngüsel** yapıları da doğru
şekilde siler.

```c
struct Node { Node other; }

void makeGarbage() {
    Node a;
    Node b;
    a.other = b;
    b.other = a;      // a ve b birbirini gösterir
}                     // fonksiyon döndükten sonra hiçbir şey a veya b'ye erişemez;
                      // döngü erişilemezdir ve silinecektir
```

---

## Ne zaman çalışır?

Toplayıcı **eşik tabanlıdır**. Tahsis bir eşiği aştığında, bir sonraki
**güvenli nokta** (safepoint) bir toplamayı tetikler.

- **Güvenli noktalar komut sınırlarındadır.** Toplayıcı asla bir işlemin
  ortasında çalışmaz; yalnızca VM komutları arasında, her nesnenin tutarlı
  durumda olduğu anlarda çalışır.
- **Dünyayı durdurur (stop-the-world).** Bir toplama sırasında program kısa
  süre duraklar; işaretle-süpür tamamlanır, sonra yürütme devam eder.
- **Eşik uyarlanır.** Bir toplamadan sonraki eşik, ne kadar verinin hayatta
  kaldığına bağlı olarak ayarlanır (kabaca canlı çarpı 2).

Toplamanın zamanlaması bir gerçekleme detayıdır, ama sonucu belirleyicidir:
aynı program her seferinde aynı nesneleri siler.

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

- `runs`: kaç toplama gerçekleşti
- `freed`: geri kazanılan toplam nesne sayısı
- `live`: sonunda hâlâ canlı olan nesneler

### `--gc-threshold=N` (ne kadar hevesle toplayacağını değiştir)

```bash
saqut run --gc-threshold=1000 --gc-stats myfile.sqt
```

Daha düşük bir eşik daha sık toplar; bellek daha az yer kaplar. Daha yüksek
bir eşik tam tersini yapar. Bu bir ayar düğmesi ve inceleme yardımcısıdır;
doğruluk için asla ihtiyacınız olmaz.

---

## Tasarım notları

- **Bilinçli olarak basit.** Kopyalama, sıkıştırma, nesiller, eşzamanlılık
  yok. Toplayıcı küçük ve öngörülebilirdir.
- **Erişilebilirlik sayıma üstün gelir.** İşaretle-süpür, referans sayımının
  sızdıracağı döngüleri siler.
- **Belirleyici sonuç.** Zamanlama eşikle değişebilir, ama hangi nesnelerin
  silindiği değişmez.

## Sırada ne var?

- Değer-referans ayrımını [veri türlerinde](/data-types/) gözden geçirin
- Referansların nasıl paylaşıldığını [struct'larda](/structs/#reference-semantics) ve [dizilerde](/arrays/#reference-semantics) görün
- Yürüten VM'yi [derleyici araçlarında](/tr/compiler-tools/) keşfedin
