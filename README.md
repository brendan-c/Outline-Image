# Usage

`npm install outline-image`

## Example
```
const outlineImage = require('outline-image')

outlineImage (
  imagePath,    // {string}
  outputPath,   // {string}
  outlineColor, // {array [red, blue, green, alpha]} (represented as numbers 0-255)
  trim = true   // {boolean}
)
```

### Note:
This package is very limited in it's functionality. In it's current form (0.0.x), it has the following limitations:

- Only draws outline on transparent pixels
  - Input images (`imagePath`) must be PNG format and contain transparency
- Only excepts RGBa color format (e.g. [255,255,255,255]) in array form for `outlineColor`
- Only draws 1px wide outline
- Adds full 1px transparent border prior to drawing outline to ensure full outline
- `trim` (optional, default = true) removes **all** excess transparent border after outline is drawn




