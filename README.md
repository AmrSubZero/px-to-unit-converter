# PX To Unit Converter

Convert selected `px` values in CSS/SCSS files into responsive units instantly using keyboard shortcuts.

Supports:

- `rem`
- `em`
- `%`

The extension can also:

- Add conversion comments automatically
- Preserve indentation
- Convert multiple selections
- Convert entire files
- Auto format documents after conversion
- Work with both CSS and SCSS files
- Use configurable base sizes

---

# Features

## Convert Selected PX Value

Select a value like:

```css
1200px
```

Press:

```text
Ctrl + R
```

Result:

```css
/* 1200px = 75rem */
height: 75rem;
```

---

## Multiple Selection Support

Convert multiple selected values at once.

Example:

Before:

```css
.container {
    width: 1200px;
    padding: 32px;
}
```

After:

```css
.container {
    /* 1200px = 75rem */
    width: 75rem;

    /* 32px = 2rem */
    padding: 2rem;
}
```

---

## Convert Entire File

Shortcut:

```text
Ctrl + Shift + R
```

Converts all `px` values in the current file automatically.

---

## Supported Units

The extension supports conversion to:

- `rem`
- `em`
- `%`

Example:

```json
"pxToUnit.targetUnit": "em"
```

---

## Configurable Base Size

Default:

```text
16
```

Example:

```json
"pxToUnit.baseSize": 18
```

---

## Auto Formatting

Automatically formats the document after conversion.

---

## Preserve Indentation

Inserted comments maintain the correct indentation automatically.

---

# Requirements

No additional dependencies are required.

Compatible with:

- CSS
- SCSS
- VS Code latest versions

---

# Extension Settings

This extension contributes the following settings:

| Setting | Type | Default | Description |
|---|---|---|---|
| `pxToUnit.baseSize` | number | `16` | Base size used for conversion |
| `pxToUnit.targetUnit` | string | `rem` | Target unit (`rem`, `em`, `%`) |
| `pxToUnit.createComment` | boolean | `true` | Insert conversion comments |
| `pxToUnit.autoFormat` | boolean | `true` | Auto format after conversion |
| `pxToUnit.shortcutKey` | string | `ctrl+r` | Preferred keyboard shortcut |

---

# Keyboard Shortcuts

| Action | Shortcut |
|---|---|
| Convert selected px value | `Ctrl + R` |
| Convert entire file | `Ctrl + Shift + R` |

---

# Example

Before:

```css
.nav-container {
    margin: 0 auto;
    width: 100%;
    height: 1200px;
}
```

After:

```css
.nav-container {
    margin: 0 auto;
    width: 100%;

    /* 1200px = 75rem */
    height: 75rem;
}
```

---

# Installation

## Development Mode

1. Clone the repository
2. Run:

```bash
npm install
```

3. Open project in VS Code
4. Press:

```text
F5
```

A new Extension Development Host window will open.

---

# Known Issues

- Dynamic runtime shortcut rebinding is not currently supported by VS Code APIs.
- Conversion comments are inserted above affected lines only.

---

# Release Notes

## 1.0.0

Initial release.

Features included:

- PX to REM conversion
- Keyboard shortcut support
- Comment insertion
- Auto formatting
- Multiple selection support
- Entire file conversion
- SCSS support
- Configurable settings

---

# Recommended VS Code Settings

```json
{
    "editor.formatOnSave": true
}
```

---

# Contributing

Pull requests and feature suggestions are welcome.

---

# License

MIT License

---

# Useful Links

- [Visual Studio Code Extension API](https://code.visualstudio.com/api)
- [VS Code Publishing Extensions Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

---

Enjoy using PX To Unit Converter 🚀