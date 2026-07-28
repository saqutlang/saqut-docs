---
title: date
description: Date type, now(), parsing, formatting, and arithmetic with saQut's date module.
---

The `date` module provides a `date` type for working with calendar dates and
timestamps. Only `now()` requires `--allow sys`; all other functions are pure
computation and need no capability.

## Import

```c
import { now, date, dateEpoch, parse, addDays, diffDays } from date;
```

## Functions

### now

Returns the current date and time. Requires `--allow sys`.

```c
import { now } from date;

int main() {
    date d = now();
    print(d);                // 2026-07-15T14:30:00Z
    return 0;
}
```

### Constructing a date

Create a date from year, month, and day. Months are 1-based.

```c
import { date } from date;

int main() {
    date d = date(2026, 7, 15);
    print(d);                // 2026-07-15T00:00:00Z
    return 0;
}
```

### dateEpoch

Create a date from epoch milliseconds.

```c
import { dateEpoch } from date;

int main() {
    date d = dateEpoch(1752580800000);
    print(d);
    return 0;
}
```

### parse

Parse a date string in ISO 8601 format.

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

Returns `date?` (nullable): `null` if the string is not a valid date.

### addDays / addMonths / addYears

Add time to a date and return a new one. The original is unchanged.

```c
import { date, addDays } from date;

int main() {
    date today = date(2026, 7, 15);
    date tomorrow = addDays(today, 1);
    print(tomorrow);         // 2026-07-16T00:00:00Z
    return 0;
}
```

### diffDays

Returns the number of days between two dates.

```c
import { date, diffDays } from date;

int main() {
    date start = date(2026, 7, 1);
    date end   = date(2026, 7, 15);
    print(diffDays(start, end));   // 14
    return 0;
}
```

Negative if the second date is earlier than the first.

### Accessors

Extract individual components from a date.

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
