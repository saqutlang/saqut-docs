---
title: saQut Nedir
description: saQut'un ne olduğunu, kimler için tasarlandığını ve seni hangi yoldan başlaman gerektiğini öğren.
---

saQut, **derleyicisi cam kutu gibi açık** bir programlama dilidir. Çoğu
derleyici kaynak kodu alır, çalıştırılabilir dosya verir; arada ne olduğunu
göstermez. saQut ise **aradaki her adımı** ayrı bir komutla önüne serer:
token'lar, AST (soyut söz dizimi ağacı), sembol tablosu, ara kod (IR).

Aynı çıktı iki kitleye hizmet eder: **kod yazmayı ilk kez öğrenen biri** ve
**bir derleyicinin içeride nasıl çalıştığını okuyan bir geliştirici**.

---

## saQut ne değildir

saQut genel amaçlı bir dil olarak C, Go veya Rust ile rekabet etmek için
tasarlanmadı ve büyük üretim sistemleri için tasarlanmadı. Amacı, bir programlama
dilinin kaynak koddan çalıştırmaya kadar geçtiği **her adımı görünür** kılmaktır.
Dil yüzeyi küçük ve sadedir; bu, tek bir kavramı öğrenirken akılda tutulması
gereken istisna sayısını düşük tutar.

---

## Kimler için

Bu site üç farklı yol sunar. Kendine en uygun olandan başla.

### 1. Programlamaya yeni başlıyorum

Hiç kod yazmadıysan veya başka bir dilde temel bilgin varsa, **Başlangıç**
bölümü tam sana göre. Adım adım ilerleyen bir sırayla:

- Değişkenler, veri tipleri, operatörler
- if/else, döngüler, fonksiyonlar
- Diziler, metinler, struct (yapılar)

Her konu küçük örneklerle anlatılır. Bir sonraki konuya geçmeden önce
gördüğün her şeyi `saqut run` ile hemen çalıştırabilirsin.

[Başlangıç yolunu takip et →](/tr/getting-started/)

### 2. Dili kullanarak program yazacağım

Programlama biliyorsun; saQut'un araçlarını ve kütüphanelerini öğrenmek
istiyorsun. Bu yol sana:

- Yerleşik fonksiyonlar (string, dizi, struct metodları)
- Modül sistemi (`import` / `export`)
- Hata yakalama (`try` / `catch` / `throw`)
- Derleyici araçları (`saqut ast`, `saqut tokens`, `saqut ir`)
- FFI (yabancı fonksiyon arayüzü): standart kütüphaneyi (`fs`, `sys`, `math`, `date`) programına açan küratörlü host-fonksiyon seam'i

konularında rehberlik eder. Ayrıca editörüne nasıl söz dizimi vurgulama
ekleyeceğini de anlatırız.

[Yerleşik fonksiyonlarla başla →](/tr/builtin-functions/)

### 3. Derleyicinin iç işleyişini merak ediyorum

Bu dil senin için bir araçtan çok, **incelemek istediğin bir sistem**. O
zaman doğrudan perde arkasına geç:

- Derleyici araçları: `tokens`, `ast`, `symbols`, `ir` komutlarının her biri
  ne üretir, nasıl yorumlanır
- Optimizasyon: sabit katlama, ölü kod eleme, IR seviyesinde neler değişir
- Çöp toplama (GC): mark-sweep algoritması, bellek modeli
- Sanal makine (VM): bytecode komut seti, deterministik çalışma
- MIR JIT ve gömülü AOT: ikinci çalıştırma yolu (MIR tabanlı). Deneysel bir JIT `--jit` ile hâlihazırda çalışıyor; gömülü AOT planlanmaktadır

Bu bölümler dilin kendisinden çok **derleyicinin nasıl çalıştığını** anlatır.

[Derleyici araçlarını incele →](/tr/compiler-tools/)

---

## Dilin kısa bir özeti

```c
// Basit bir fonksiyon
int kare(int x) {
    return x * x;
}

// Diziler ve donguler
int toplam(int[] sayilar) {
    int sonuc = 0;
    for (int i = 0; i < sayilar.length; i = i + 1) {
        sonuc = sonuc + sayilar[i];
    }
    return sonuc;
}

int main() {
    print(kare(5));              // 25
    print(toplam([1, 2, 3]));   // 6
    return 0;
}
```

- `int`, `float`, `bool`, `byte`, `string` temel tipler
- `struct` ile kendi veri yapılarını oluşturabilirsin
- Diziler (`int[]`) ve metinler (`string`) referans ile taşınır
- Pointer (`&`, `*`) yok; `T?` ile isteğe bağlı null yapabilirsin
- Sınıf (class), kalıtım, jenerik, otomatik tip çıkarımı yok
- `import` / `export` ile modüllere bölebilirsin

---

## Ne zaman saQut, ne zaman başka bir dil

| Durum | Tavsiye |
|---|---|
| Programlamayı yeni öğreniyorum, derleyici kavramlarını da anlamak istiyorum | saQut |
| Hızlıca bir betik yazıp işimi görmek istiyorum | Python, Node.js |
| Bir web sunucusu veya API yazacağım | Go, Rust, C# |
| Gömülü sistem veya işletim sistemi geliştireceğim | C, Rust |
| Bir derleyicinin içinde neler döndüğünü adım adım görmek istiyorum | saQut |
| Büyük ölçekli, ekip halinde geliştirilen bir proje | Git destekli herhangi bir ana dil |

saQut **öğrenmek, öğretmek ve derleyiciyi sorgulamak** için tasarlandı.
Üretim sistemleri için değil.

---

Hazırsan [Hızlı Başlangıç](/tr/getting-started/) ile devam et.
