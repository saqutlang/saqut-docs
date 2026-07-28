---
title: Editor Setup
description: Set up VS Code for saQut with syntax highlighting, LSP, and DAP debugging.
---

saQut ships with a VS Code extension that provides syntax highlighting, code
completion, and an integrated debugger. This page covers installing it and what
each feature does.

## Install the extension

The saQut extension is distributed as a `.vsix` file. Install it in one of two
ways.

**From a downloaded release (most users).** Download `saqut-0.4.0.vsix` from
[GitHub Releases](https://github.com/saqutlang/saqut/releases), then install it
by its full path:

```bash
code --install-extension /path/to/saqut-0.4.0.vsix
```

Or through VS Code: open the Extensions panel (`Ctrl+Shift+X`), click the `...`
menu (top right), select **Install from VSIX...**, and choose the file you
downloaded.

**From a source checkout.** If you cloned the compiler repository, the `.vsix`
already sits in `editor/vscode/`, so you can install it from the repo root:

```bash
code --install-extension editor/vscode/saqut-0.4.0.vsix
```

Once installed, `.sqt` files get automatic syntax highlighting.

## Features

### Syntax highlighting

The extension highlights keywords (`int`, `float`, `string`, `struct`, `enum`,
`if`, `for`, `return`), string literals, comments, and type annotations. It
uses a TextMate grammar (`sqt.tmLanguage.json`) so it works in any editor that
supports TextMate grammars (VS Code, Sublime Text, JetBrains with plugin).

### LSP (Language Server Protocol)

The extension connects to saQut's built-in LSP server for:

- **Go to definition**: `F12` on any function or variable to jump to its
  declaration
- **Find references**: `Shift+F12` to find all uses of a symbol, even across
  files
- **Hover information**: hover over any symbol to see its type
- **Rename symbol**: `F2` to rename a function or variable across the entire
  project
- **Auto-completion**: suggestions as you type, including built-in methods on
  strings, arrays, and structs
- **Syntax error diagnostics**: red squiggly underlines with error messages
  as you edit, even without saving

The LSP server starts automatically when you open a `.sqt` file. You need
`saqut` on your `PATH` or configure the path in VS Code settings.

### DAP (Debug Adapter Protocol)

saQut includes a debugger that supports:

- **Breakpoints**: click the gutter to set a red dot; execution pauses there
- **Step over / step in / step out**: walk through your program line by line
- **Variable inspection**: hover over variables in debug mode to see their
  current values
- **Stop on entry**: optionally pause at the first line of your program

To start debugging, open a `.sqt` file and press `F5`. VS Code uses the
launch configuration that comes with the extension:

```json
{
    "type": "sqt",
    "request": "launch",
    "name": "saQut Debug",
    "program": "${file}",
    "stopOnEntry": true
}
```

### Additional editor settings

The extension registers `.sqt` files with these editor features:
- Auto-closing brackets and quotes
- Comment toggling (`Ctrl+/`)
- Breakpoint support (`F9` to toggle)

## Troubleshooting

**LSP not starting**: Make sure `saqut` is on your `PATH`. Run `saqut lsp`
from a terminal to verify it starts without errors.

**Debugger not connecting**: The debug adapter requires `saqut` on `PATH` as
well. Check that `saqut dap` runs from the terminal.

**No syntax highlighting**: Verify the extension is installed and enabled.
The file must end with `.sqt`.

If issues persist, [open an issue](https://github.com/saqutlang/saqut/issues)
with your VS Code version and OS details.
