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
    date? parsed = parse("2026-05-01");
    if (parsed != null) {
        print(year(parsed));
        print(format(parsed, "%Y-%m-%d"));
        print(addDays(parsed, 1));
    }
    print(epoch);
    return 0;
}
```

`now()` sistem saatini okuduğu için `--allow sys` gerektirir. Diğer date
fonksiyonları saf hesap yapar ve capability istemez.
