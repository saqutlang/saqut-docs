---
title: date (Tarih)
description: saQut'un date modülü ile tarih tipi, now(), ayrıştırma, biçimlendirme ve tarih aritmetiği.
---

`date` modülü takvim tarihleri ve zaman damgalarıyla çalışmak için bir `date`
tipi sunar. Yalnızca `now()` `--allow sys` gerektirir; diğer tüm fonksiyonlar
saf hesaplamadır ve capability istemez.

## Import

```c
import { now, date, dateEpoch, parse, addDays, diffDays } from date;
```

## Fonksiyonlar

### now

Güncel tarih ve saati döndürür. `--allow sys` gerektirir.

```c
import { now } from date;

int main() {
    date d = now();
    print(d);                // 2026-07-15T14:30:00Z
    return 0;
}
```

### Tarih oluşturma

Yıl, ay ve günden bir tarih oluşturur. Aylar 1 tabanlıdır.

```c
import { date } from date;

int main() {
    date d = date(2026, 7, 15);
    print(d);                // 2026-07-15T00:00:00Z
    return 0;
}
```

### dateEpoch

Epoch milisaniyesinden bir tarih oluşturur.

```c
import { dateEpoch } from date;

int main() {
    date d = dateEpoch(1752580800000);
    print(d);
    return 0;
}
```

### parse

ISO 8601 formatındaki bir tarih dizgisini ayrıştırır.

```c
import { parse } from date;

int main() {
    date? d = parse("2026-07-15");
    if (d != null) {
        print(d);            // 2026-07-15T00:00:00Z
    }
    return 0;
}
```

`date?` (nullable) döndürür: geçerli bir tarih değilse `null`.

### addDays / addMonths / addYears

Bir tarihe zaman ekler ve yeni bir tarih döndürür. Orijinal değişmez.

```c
import { date, addDays } from date;

int main() {
    date bugun = date(2026, 7, 15);
    date yarin = addDays(bugun, 1);
    print(yarin);            // 2026-07-16T00:00:00Z
    return 0;
}
```

### diffDays

İki tarih arasındaki gün farkını döndürür.

```c
import { date, diffDays } from date;

int main() {
    date baslangic = date(2026, 7, 1);
    date bitis     = date(2026, 7, 15);
    print(diffDays(baslangic, bitis));   // 14
    return 0;
}
```

İkinci tarih birinciden önceyse negatif değer döner.

### Erişimciler

Bir tarihten bileşenleri ayrı ayrı al.

```c
import { date } from date;

int main() {
    date d = date(2026, 7, 15);
    print(d.year);           // 2026
    print(d.month);          // 7
    print(d.day);            // 15
    return 0;
}
```
