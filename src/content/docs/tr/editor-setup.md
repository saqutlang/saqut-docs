---
title: Editör Kurulumu
description: VS Code'u saQut için söz dizimi vurgulama, LSP ve DAP hata ayıklama ile kur.
---

saQut, söz dizimi vurgulama, kod tamamlama ve tümleşik hata ayıklayıcı sunan bir
VS Code eklentisiyle birlikte gelir. Bu sayfa kurulumu ve her özelliğin ne
yaptığını anlatır.

## Eklentiyi yükle

saQut eklentisi bir `.vsix` dosyası olarak dağıtılır. İki yoldan biriyle
yükleyebilirsin.

**İndirilen sürümden (çoğu kullanıcı).** `saqut-0.4.0.vsix` dosyasını
[GitHub Releases](https://github.com/saqutlang/saqut/releases) sayfasından
indir, sonra tam yolunu vererek yükle:

```bash
code --install-extension /indirilen/yol/saqut-0.4.0.vsix
```

Veya VS Code üzerinden: Eklentiler panelini aç (`Ctrl+Shift+X`), sağ üstteki
`...` menüsüne tıkla, **VSIX'ten Yükle...** seç ve indirdiğin dosyayı göster.

**Kaynak kopyasından.** Derleyici deposunu klonladıysan `.vsix` zaten
`editor/vscode/` içinde olur, depo kökünden yükleyebilirsin:

```bash
code --install-extension editor/vscode/saqut-0.4.0.vsix
```

Kurulumdan sonra `.sqt` dosyaları otomatik söz dizimi vurgulaması kazanır.

## Özellikler

### Söz dizimi vurgulama

Eklenti anahtar kelimeleri (`int`, `float`, `string`, `struct`, `enum`, `if`,
`for`, `return`), metin sabitlerini, yorumları ve tip belirteçlerini renklendirir.
TextMate gramer (`sqt.tmLanguage.json`) kullanır, bu yüzden TextMate gramer
destekleyen tüm editörlerde çalışır (VS Code, Sublime Text, eklentiyle
JetBrains).

### LSP (Language Server Protocol)

Eklenti, saQut'un yerleşik LSP sunucusuna bağlanarak şunları sağlar:

- **Tanıma git**: Herhangi bir fonksiyon veya değişken üzerinde `F12` ile
  bildirimine atla
- **Referansları bul**: `Shift+F12` ile bir sembolün tüm kullanımlarını,
  dosyalar arası dahil, bul
- **İpucu bilgisi**: Herhangi bir sembolün üzerine gelerek tipini gör
- **Sembolü yeniden adlandır**: `F2` ile bir fonksiyonu veya değişkeni tüm
  projede yeniden adlandır
- **Otomatik tamamlama**: Yazarken öneriler; string, dizi ve struct yerleşik
  metotları dahil
- **Söz dizimi hatası teşhisi**: Düzenlerken, kaydetmeden bile, kırmızı
  dalgalı alt çizgi ve hata mesajları

LSP sunucusu bir `.sqt` dosyası açtığında otomatik başlar. `saqut` komutunun
`PATH`'inde olması veya VS Code ayarlarından yolunu yapılandırman gerekir.

### DAP (Debug Adapter Protocol)

saQut şu özellikleri destekleyen bir hata ayıklayıcı içerir:

- **Kesme noktaları**: Satır numarasının yanına tıkla, kırmızı nokta konur;
  çalışma orada duraklar
- **Adımla / içine adımla / dışına adımla**: Programında satır satır ilerle
- **Değişken inceleme**: Hata ayıklama modunda değişkenlerin üzerine gelerek
  güncel değerlerini gör
- **Girişte dur**: İsteğe bağlı olarak programın ilk satırında duraklat

Hata ayıklamayı başlatmak için bir `.sqt` dosyası aç ve `F5`'e bas. VS Code
eklentiyle gelen başlatma yapılandırmasını kullanır:

```json
{
    "type": "sqt",
    "request": "launch",
    "name": "saQut Debug",
    "program": "${file}",
    "stopOnEntry": true
}
```

### Ek editör ayarları

Eklenti `.sqt` dosyalarına şu editör özelliklerini tanır:
- Otomatik kapanan parantez ve tırnak
- Yorum aç/kapat (`Ctrl+/`)
- Kesme noktası desteği (`F9` ile aç/kapat)

## Sorun giderme

**LSP başlamıyor**: `saqut` komutunun `PATH`'inde olduğundan emin ol.
Terminalden `saqut lsp` çalıştırarak hatasız başladığını doğrula.

**Hata ayıklayıcı bağlanmıyor**: Hata ayıklama adaptörü de `saqut`'un
`PATH`'inde olmasını gerektirir. Terminalden `saqut dap` komutunun
çalıştığını kontrol et.

**Söz dizimi vurgulaması yok**: Eklentinin yüklü ve etkin olduğunu doğrula.
Dosya `.sqt` ile bitmelidir.

Sorun devam ederse VS Code sürümün ve işletim sistemi bilgilerinle birlikte
[issue aç](https://github.com/saqutlang/saqut/issues).
