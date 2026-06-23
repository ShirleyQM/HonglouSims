#!/usr/bin/env python3
"""Build transparent, size-normalized character portraits for the game HUD."""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "lihui"
OUTPUT_DIR = SOURCE_DIR / "processed"
MANIFEST_PATH = SOURCE_DIR / "manifest.json"
GAME_MANIFEST_PATH = ROOT / "assets" / "manifest.json"

CHAR_FILES = {
    "daiyu": "daiyu_lihui.png",
    "baochai": "薛宝钗.png",
    "tanchun": "贾探春.png",
    "xifeng": "王熙凤.png",
    "zijuan": "紫鹃.png",
    "xueyan": "雪雁.png",
    "yinger": "莺儿.png",
    "xiangyun": "史湘云.png",
    "xiren": "袭人.png",
    "qingwen": "晴雯.png",
    "sheyue": "麝月.png",
    "liwan": "李纨.png",
    "yingchun": "贾迎春.png",
    "yuanchun": "贾元春.png",
    "qinkeqing": "秦可卿.jpeg",
}

OUTPUTS = {
    "portrait": (512, 768, 90),
    "hud": (240, 360, 86),
}


def is_edge_white(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    return a == 0 or (min(r, g, b) >= 226 and max(r, g, b) - min(r, g, b) <= 34)


def remove_connected_white(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        idx = y * width + x
        if visited[idx] or not is_edge_white(pixels[x, y]):
            return
        visited[idx] = 1
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    output = rgba.copy()
    out = output.load()
    for y in range(height):
        row = y * width
        for x in range(width):
            if visited[row + x]:
                r, g, b, _ = out[x, y]
                whiteness = min(r, g, b)
                alpha = max(0, min(255, (244 - whiteness) * 18))
                out[x, y] = (r, g, b, alpha)
    return output


def fit_to_canvas(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        image = image.crop(bbox)

    target_w, target_h = size
    padding = max(4, round(target_w * 0.025))
    max_w = target_w - padding * 2
    max_h = target_h - padding
    scale = min(max_w / image.width, max_h / image.height)
    resized = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    x = (target_w - resized.width) // 2
    y = target_h - resized.height
    canvas.alpha_composite(resized, (x, y))
    return canvas


def build_portrait(char_id: str, source_name: str) -> dict[str, str] | None:
    source = SOURCE_DIR / source_name
    if not source.exists():
        print(f"[skip] {char_id}: missing {source_name}")
        return None

    image = Image.open(source)
    if image.mode != "RGBA" or image.getchannel("A").getextrema() == (255, 255):
        image = remove_connected_white(image)
    else:
        image = image.convert("RGBA")

    paths: dict[str, str] = {}
    for variant, (width, height, quality) in OUTPUTS.items():
        output = fit_to_canvas(image, (width, height))
        path = OUTPUT_DIR / f"{char_id}_{variant}.webp"
        output.save(path, "WEBP", quality=quality, method=6, exact=True)
        paths[variant] = path.relative_to(ROOT).as_posix()
        print(f"[ok] {char_id}:{variant} {width}x{height} -> {path.name}")
    return paths


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    portraits = {}
    for char_id, filename in CHAR_FILES.items():
        built = build_portrait(char_id, filename)
        if built:
            portraits[char_id] = built

    manifest = {
        "version": 1,
        "generatedBy": "scripts/process_portraits.py",
        "portraits": portraits,
    }
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    game_manifest = json.loads(GAME_MANIFEST_PATH.read_text(encoding="utf-8"))
    game_manifest["portraits"] = portraits
    GAME_MANIFEST_PATH.write_text(
        json.dumps(game_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[done] {len(portraits)} portraits -> {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
