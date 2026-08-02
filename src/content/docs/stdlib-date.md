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

| Function | Signature | Capability |
|---|---|---|
| `now` | `date now()` | `sys` |
| `fromEpochMillis` | `date fromEpochMillis(longint milliseconds)` | none |
| `toEpochMillis` | `longint toEpochMillis(date value)` | none |
| `addDays` | `date addDays(date d, int n)` | none |
| `addHours` | `date addHours(date d, int n)` | none |
| `addMinutes` | `date addMinutes(date d, int n)` | none |
| `addSeconds` | `date addSeconds(date d, int n)` | none |
| `year` | `int year(date d)` | none |
| `month` | `int month(date d)` | none |
| `day` | `int day(date d)` | none |
| `hour` | `int hour(date d)` | none |
| `minute` | `int minute(date d)` | none |
| `second` | `int second(date d)` | none |
| `diffMillis` | `longint diffMillis(date left, date right)` | none |
| `parse` | `date? parse(string iso8601)` | none |
| `format` | `string format(date d, string pattern)` | none |

`date(2026, 5, 1)` is not a constructor in the current standard library.
Use `fromEpochMillis(...)` or `parse(...)` instead. The year/month/day values
in an ISO string are parsed by `parse`; they are not separate integer
arguments to a `date` constructor.

```c
import { fromEpochMillis, parse, format } from date;

int main() {
    date epoch = fromEpochMillis(0);
    date? parsed = parse("2026-05-01");
    if (parsed != null) {
        print(format(parsed, "%Y-%m-%d"));
    }
    print(epoch);
    return 0;
}
```

Only `now()` reads the system clock and therefore requires `--allow sys`.
Invalid input to `parse` returns `null` rather than throwing an error.
