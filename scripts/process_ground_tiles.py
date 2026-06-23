#!/usr/bin/env python3
"""Crop the 10 ground tiles from the source contact sheet.

The source image is a presentation sheet with five grass tiles and five stone
tiles. Each tile is shown as a 256x256 square with decorative/white edges, so
we crop the inner area and resize back to 256x256 for seamless-ish game use.
"""

from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "rooms" / "草地和地砖.png"
OUT_DIR = ROOT / "assets" / "tiles"

TILE_SIZE = 256
INNER_MARGIN = 32

# Top-left positions of the ten 256x256 tiles in the contact sheet.
SPECS = [
    ("ground_grass_01.png", (21, 96), 32, 0.96, 1.04),
    ("ground_grass_02.png", (286, 96), 32, 0.98, 1.03),
    ("ground_grass_03.png", (552, 96), 32, 0.98, 1.04),
    ("ground_grass_04.png", (818, 96), 64, 1.00, 1.03),
    ("ground_grass_05.png", (1083, 96), 32, 0.96, 1.02),
    ("ground_stone_01.png", (21, 620), 32, 0.96, 1.02),
    ("ground_stone_02.png", (286, 620), 32, 0.96, 1.02),
    ("ground_stone_03.png", (552, 620), 32, 0.96, 1.02),
    ("ground_stone_04.png", (818, 620), 32, 0.94, 1.01),
    ("ground_stone_05.png", (1083, 620), 32, 0.98, 1.04),
]


def crop_inner(img, x, y, margin):
    box = (
        x + margin,
        y + margin,
        x + TILE_SIZE - margin,
        y + TILE_SIZE - margin,
    )
    return img.crop(box).resize((TILE_SIZE, TILE_SIZE), Image.Resampling.LANCZOS)


def normalize(img, brightness, contrast):
    img = ImageOps.autocontrast(img, cutoff=1)
    img = ImageEnhance.Brightness(img).enhance(brightness)
    img = ImageEnhance.Contrast(img).enhance(contrast)
    return img


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    src = Image.open(SOURCE).convert("RGB")
    for filename, (x, y), margin, brightness, contrast in SPECS:
        tile = crop_inner(src, x, y, margin)
        tile = normalize(tile, brightness, contrast)
        out = OUT_DIR / filename
        tile.save(out, optimize=True)
        print(f"wrote {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
