---
title: date (Tarih)
description: saQut date fonksiyonlarının türleri, parametreleri ve tarih hesapları.
---

`date`, UTC zamanını epoch milisaniyesi olarak taşıyan bir değerdir. Takvim
parçaları (`year`, `month`, `day`) `int` türündedir. `date` değeri doğrudan
değiştirilmez; hesaplama fonksiyonları yeni bir `date` döndürür.

## Fonksiyonlar

| Fonksiyon | İmza | Açıklama |
|---|---|---|
| `now` | `date now()` | Sistem saatindeki güncel zamanı döndürür; `sys` ister. |
| `fromEpochMillis` | `date fromEpochMillis(longint milliseconds)` | Epoch milisaniyesinden `date` üretir. |
| `toEpochMillis` | `longint toEpochMillis(date value)` | `date` değerini epoch milisaniyesine çevirir. |
| `addDays` | `date addDays(date value, int amount)` | Tarihe gün ekleyip yeni tarih döndürür. |
| `addHours` | `date addHours(date value, int amount)` | Tarihe saat ekler. |
| `addMinutes` | `date addMinutes(date value, int amount)` | Tarihe dakika ekler. |
| `addSeconds` | `date addSeconds(date value, int amount)` | Tarihe saniye ekler. |
| `year` | `int year(date value)` | Yıl bölümünü döndürür. |
| `month` | `int month(date value)` | Ay bölümünü 1–12 aralığında döndürür. |
| `day` | `int day(date value)` | Ayın gününü döndürür. |
| `hour` | `int hour(date value)` | Saat bölümünü döndürür. |
| `minute` | `int minute(date value)` | Dakika bölümünü döndürür. |
| `second` | `int second(date value)` | Saniye bölümünü döndürür. |
| `diffMillis` | `longint diffMillis(date left, date right)` | İki tarih arasındaki milisaniye farkını döndürür. |
| `parse` | `date? parse(string iso8601)` | ISO tarih metnini ayrıştırır; geçersizse `null` döndürür. |
| `format` | `string format(date value, string pattern)` | Tarihi verilen biçim metnine göre yazıya çevirir. |

`date(2026, 5, 1)` mevcut standart kütüphanede bir constructor değildir. Tarih
oluşturmak için `parse` veya epoch değeri için `fromEpochMillis` kullanılır.

```c
import { fromEpochMillis, parse, format, year, addDays } from date;

int main() {
    date epoch = fromEpochMillis(0);
    date? parsed = parse("2026-05-01T14:30:00Z");
    if (parsed != null) {
        print(year(parsed));
        print(format(parsed, "yyyy-MM-dd"));
        print(format(addDays(parsed, 1), "yyyy-MM-dd"));
    }
    print(epoch);
    return 0;
}
```

`now()` dışındaki bütün fonksiyonlar, verdiğiniz değer üzerinde saf hesap
yapar. Sistem saatini yalnızca `now()` okur; bu yüzden aynı programın iki
çalıştırmasında sonucu değişebilen tek fonksiyon odur.

## parse

`parse` tek bir biçim kabul eder: tam ISO-8601 UTC damgası, tam 20 karakter,
sonu `Z` ile biten.

```c
parse("2026-05-01T14:30:00Z")   // date döner
parse("2026-05-01")             // null, saat bölümü yok
parse("2026-05-01T14:30:00")    // null, sonunda Z yok
```

Bunun dışındaki her girdi hata fırlatmak yerine `null` döner; dönüş tipi
`date?` olduğu için kullanmadan önce null denetiminden geçmek zorundadır.
Takvimde var olmayan bir tarih (örneğin 13. ay) da `null` döner.

## format

`format` aşağıdaki simgeleri değiştirir, geri kalan her karakteri olduğu gibi
kopyalar. Dikkat: ay büyük harf `MM`, dakika küçük harf `mm`.

| Simge | Anlamı | Örnek |
|---|---|---|
| `yyyy` | Yıl, 4 hane | `2026` |
| `MM` | Ay, 01-12 | `05` |
| `dd` | Gün, 01-31 | `01` |
| `HH` | Saat, 00-23 | `14` |
| `mm` | Dakika, 00-59 | `30` |
| `ss` | Saniye, 00-59 | `00` |

```c
format(d, "yyyy-MM-dd")            // 2026-05-01
format(d, "dd.MM.yyyy HH:mm")      // 01.05.2026 14:30
format(d, "yyyy-MM-ddTHH:mm:ssZ")  // 2026-05-01T14:30:00Z
```

Ay adı, gün adı ya da 12 saatlik biçim için simge yoktur. Tanınmayan bir simge
metinde olduğu gibi kalır: `format(d, "YYYY")` sonucu harfi harfine `YYYY`
olur, çünkü yıl simgesi küçük harflidir.
