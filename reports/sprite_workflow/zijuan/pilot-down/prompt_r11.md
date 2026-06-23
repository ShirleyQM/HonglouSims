# Sprite Prompt Pack: zijuan · row 10 / r11

Preset: Pilot 1: down idle + down walk
Description: Down-facing idle frame plus 8 walking frames.

## Reference files

- Character portrait: `assets/lihui/紫鹃.png`
- Base frame row: sheet row `10` / file row `r11`
- Base frames:
  - `test sprites generation/female_base/sliced/sprite_r11_c01.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c02.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c03.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c04.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c05.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c06.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c07.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c08.png`
  - `test sprites generation/female_base/sliced/sprite_r11_c09.png`

## Style Bible

```json
{
  "charName": "Zijuan",
  "bodyRatio": "1:2.3",
  "hairSilhouette": "near-black hair, neat maid hairstyle, small delicate hair ornament, soft side locks",
  "mainColors": {
    "outerRobe": "pale blue-green",
    "innerSkirt": "light warm pink",
    "waistSash": "muted lavender gray",
    "hair": "near black"
  },
  "fixedDetails": [
    "pale blue-green hanfu outer robe",
    "light warm pink inner skirt visible below the robe",
    "muted lavender-gray waist sash",
    "small delicate hair ornament",
    "refined but simple servant styling"
  ],
  "forbidden": [
    "do not make the body toddler-like or super-deformed chibi",
    "do not change outfit colors between frames",
    "do not add weapons, fans, umbrellas, pets, scenery, text, or watermark"
  ],
  "portrait": "assets/lihui/紫鹃.png"
}
```

## Prompt

Use case: style-transfer
Asset type: RPG pixel character animation strip

Primary request:
Create a transparent-background pixel-art animation strip for Zijuan, using the provided nude/base sprite strip only as the exact pose, body silhouette, frame count, frame size, foot anchor, and motion reference. Dress the base sprite as the character from the portrait/style bible.

Input images:
Image 1: base sprite strip or ordered base frames listed above, exact pose and frame layout reference.
Image 2: character portrait/style reference.

Output format:
9 frames in one horizontal strip, each frame exactly 64x64 pixels, total size 576x64.
Transparent background.
Pixel-art game sprite, crisp edges, no antialias blur.

Character identity:
Use the Style Bible exactly. Keep hair silhouette, clothing colors, waist sash, and role identity stable across every frame.

Pose and motion constraints:
Preserve the pose, body silhouette, head position, limb position, and foot anchor of Image 1 in every frame.
Do not invent new poses.
Do not change animation timing.

Style constraints:
Not toddler-like, not super-deformed chibi.
Elegant ancient Chinese game sprite proportions, about 1:2.3 head-to-body ratio.
Readable at 48x48 in game.

Avoid:
No background, no scenery, no props unless present in the base pose, no text, no watermark.
Do not change outfit colors between frames.
Do not make each frame a different costume.
