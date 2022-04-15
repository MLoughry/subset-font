[Github issue](https://github.com/papandreou/subset-font/issues/15)

Even with the fix in e9a4e306c07381e00a6bae1c947c3b67ab942ba3, `harfbuzz` does not correctly handle character codes greater than 0xFFFF.

Cracking open [`subsetfont.ttf`](./subsetFont.ttf) in a hex editor, and referencing the [TFF file specification](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6.html), we can see that only the 0xffff codepoint in the string `'\u{1074d}\u{ffff}'` is correctly added to the subset.

- `cmap` table begins at 0x0158.

    raw contents:
    ```
    00 00 00 02 00 00 00 04 
    00 00 00 14 00 03 00 0A 
    00 00 00 14 00 0C 00 00 
    00 00 00 1C 00 00 00 00 
    00 00 00 01 00 00 FF FF 
    00 00 FF FF 00 00 00 01 
    ```

- `cmap` index:
    - version: `00 00`
    - numberSubtables: `00 02`
- subtable 1 index:
    - platformId: `00 00` (Unicode)
    - platformSpecificId: `00 04` (Unicode 2.0 or later semantics (non-BMP characters allowed))
    - offset: `00 00 00 14`
- subtable 2 index:
    - platformId: `00 03` (Microsoft)
    - platformSpecificId: `00 00` (Symbol)
    - offset: `00 00 00 14`
- subtable header:
     - format: `00 0C` ('cmap' format 12–Segmented coverage)
     - reserved: `00 00`
     - length: `00 00 00 1C`
     - langauge: `00 00 00 00`
     - nGroups: `00 00 00 01`
     - Group 1:
        - startChrCode: `00 00 FF FF`
        - endChrCode: `00 00 FF FF`
        - startGlyphCode: `00 00 00 01`

As you can see from the breakdown, only the `0xFFFF` codepoint is included. In this branch, I've added a `console.log` to loop over the input `text` to demonstrate that harfbuzz is being correctly invoked with the intended codepoints.

(The base font is sourced from https://github.com/microsoft/fluentui-system-icons/tree/master/fonts)