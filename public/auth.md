# Agent Authentication

saQut is an open-source project and does not require authentication for
any of its public resources.

## Public endpoints

All documentation, source code, and releases are publicly accessible:

- **Documentation:** https://saqut.com/
- **Source code:** https://github.com/saqutlang/saqut
- **Releases:** https://github.com/saqutlang/saqut/releases

## Agent access

AI agents and automated tools are welcome to access all public resources
without authentication. If you need to interact with the saQut compiler
programmatically, use the CLI directly:

```bash
saqut tokens  file.sqt   # token stream (JSON)
saqut ast     file.sqt   # abstract syntax tree (JSON)
saqut symbols file.sqt   # symbol table (JSON)
saqut ir      file.sqt   # 3-address IR
saqut run     file.sqt   # compile & execute
```

## Contact

For questions about programmatic access, open an issue on GitHub:
https://github.com/saqutlang/saqut/issues
