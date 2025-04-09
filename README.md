# Vextension

**Vextension** is a Visual Studio Code extension that helps you find `print` statements in Python files that are staged for commit. It enables you to quickly jump to the line where a `print` statement is located, making it easier to clean up your code before committing.

## Features

- Search for `print` statements in all staged Python files.
- Jump directly to the line where the `print` statement is found.
- Highlight all `print` statements in the file for easy identification.

## Requirements

- **VS Code**: This extension requires Visual Studio Code to be installed.
- **Git**: You need to have Git installed and a repository set up in order to detect staged files.
- **Python files**: This extension only works with Python files (`.py`).

## Known Issues

- No known issues at this time.
- If you experience any problems, please report them via GitHub Issues.

## Release Notes

### 0.0.1

- Initial release of **Vextension**.
- Basic functionality to search for `print` statements in staged Python files.

## Usage

1. **Install the Extension**:
   - Go to the Extensions view in Visual Studio Code (`Ctrl+Shift+X` or `Cmd+Shift+X`).
   - Search for "Vextension" and click "Install".

2. **Use the Extension**:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) to open the Command Palette.
   - Search for the command `checkprints`.
   - The extension will search for any `print` statements in your staged Python files and show them in a QuickPick.
   - Select a file and line to jump directly to that location in the file.
   - All `print` statements in the file will be highlighted.

---

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

---

**Enjoy using Vextension!**
