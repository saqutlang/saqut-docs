---
title: date
description: Date values and the exact signatures of saQut's date functions.
---

`date` is an immutable UTC timestamp represented internally as a signed 64-bit
integer containing epoch milliseconds. Calendar components use `int`.

## Import

```c
import { now, fromEpochMillis, toEpochMillis, addDays, year } from date;
```

## Exact signatures

| Function | Signature |
|---|---|
| `now` | `date now()` |
| `fromEpochMillis` | `date fromEpochMillis(longint milliseconds)` |
| `toEpochMillis` | `longint toEpochMillis(date value)` |
| `addDays` | `date addDays(date d, int n)` |
| `addHours` | `date addHours(date d, int n)` |
| `addMinutes` | `date addMinutes(date d, int n)` |
| `addSeconds` | `date addSeconds(date d, int n)` |
| `year` | `int year(date d)` |
| `month` | `int month(date d)` |
| `day` | `int day(date d)` |
| `hour` | `int hour(date d)` |
| `minute` | `int minute(date d)` |
| `second` | `int second(date d)` |
| `diffMillis` | `longint diffMillis(date left, date right)` |
| `parse` | `date? parse(string iso8601)` |
| `format` | `string format(date d, string pattern)` |

Every function except `now()` is a pure calculation on the value you pass in.
`now()` is the only one that reads the system clock, which makes it the only
one whose result changes between two otherwise identical runs.

`date(2026, 5, 1)` is not a constructor in the current standard library.
Use `fromEpochMillis(...)` or `parse(...)` instead. The year/month/day values
in an ISO string are parsed by `parse`; they are not separate integer
arguments to a `date` constructor.

```c
import { fromEpochMillis, parse, format } from date;

int main() {
    date epoch = fromEpochMillis(0);
    date? parsed = parse("2026-05-01T14:30:00Z");
    if (parsed != null) {
        print(format(parsed, "yyyy-MM-dd"));
    }
    print(epoch);
    return 0;
}
```

## parse

`parse` accepts one shape only: a full ISO-8601 UTC timestamp, exactly 20
characters, ending in `Z`.

```c
parse("2026-05-01T14:30:00Z")   // a date
parse("2026-05-01")             // null, no time part
parse("2026-05-01T14:30:00")    // null, no trailing Z
```

Anything else returns `null` instead of raising an error, so the result is
`date?` and has to pass a null check before you can use it. A date that does
not exist on the calendar, such as month 13, also returns `null`.

## format

`format` replaces these tokens and copies every other character through
unchanged. Note that month is uppercase `MM` and minute is lowercase `mm`.

| Token | Meaning | Example |
|---|---|---|
| `yyyy` | Year, 4 digits | `2026` |
| `MM` | Month, 01 to 12 | `05` |
| `dd` | Day, 01 to 31 | `01` |
| `HH` | Hour, 00 to 23 | `14` |
| `mm` | Minute, 00 to 59 | `30` |
| `ss` | Second, 00 to 59 | `00` |

```c
format(d, "yyyy-MM-dd")            // 2026-05-01
format(d, "dd.MM.yyyy HH:mm")      // 01.05.2026 14:30
format(d, "yyyy-MM-ddTHH:mm:ssZ")  // 2026-05-01T14:30:00Z
```

There are no tokens for month names, weekdays, or 12-hour time. A pattern
containing an unknown token keeps that text as written: `format(d, "YYYY")`
returns the literal `YYYY`, because the year token is lowercase.
