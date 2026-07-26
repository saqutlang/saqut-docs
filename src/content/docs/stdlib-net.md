---
title: net (Network)
description: HTTP requests and socket communication (planned for 0.9).
---

> **Status: Planned for 0.9.** The `net` module is not yet available in the
> current release. This page describes the planned API.

The `net` module will provide HTTP client functionality and basic socket
communication. It will require `--allow net` at runtime.

## Planned functions

### httpGet

Sends an HTTP GET request and returns the response body as a string.

```c
import { httpGet } from net;

int main() {
    string body = httpGet("https://example.com");
    print(body);
    return 0;
}
```

### httpPost

Sends an HTTP POST request with a body and returns the response.

```c
import { httpPost } from net;

int main() {
    string resp = httpPost("https://example.com/api", "{\"key\":\"value\"}");
    print(resp);
    return 0;
}
```

## Capability

All `net` functions require `--allow net`:

```bash
saqut run --allow net program.sqt
```

The `net` capability is separate from `fs` and `sys`. A program that only
reads files and makes HTTP requests would run with:

```bash
saqut run --allow fs,net program.sqt
```

## When will it be available

The `net` module is planned for version 0.9. Track progress on
[GitHub Issues](https://github.com/saqutlang/saqut/issues).
