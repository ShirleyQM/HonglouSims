#!/usr/bin/env python3
"""Remove connected light backgrounds from furniture images in place."""

from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "assets" / "furnitures"
DEFAULT_REPORT = ROOT / "reports" / "furniture_cutout_report.json"


def is_edge_background(pixel: tuple[int, int, int, int], threshold: int, spread: int) -> bool:
    r, g, b, a = pixel
    if a == 0:
        return True
    return min(r, g, b) >= threshold and max(r, g, b) - min(r, g, b) <= spread


def remove_connected_light_background(
    image: Image.Image,
    *,
    threshold: int = 226,
    spread: int = 38,
    feather_start: int = 244,
    feather_strength: int = 18,
) -> tuple[Image.Image, dict[str, int]]:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        idx = y * width + x
        if visited[idx] or not is_edge_background(pixels[x, y], threshold, spread):
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
    touched = 0
    transparent = 0
    softened = 0
    for y in range(height):
        row = y * width
        for x in range(width):
            if not visited[row + x]:
                continue
            touched += 1
            r, g, b, _ = out[x, y]
            whiteness = min(r, g, b)
            alpha = max(0, min(255, (feather_start - whiteness) * feather_strength))
            if alpha == 0:
                transparent += 1
            else:
                softened += 1
            out[x, y] = (r, g, b, alpha)

    return output, {
        "width": width,
        "height": height,
        "edgeBackgroundPixels": touched,
        "transparentPixels": transparent,
        "softenedPixels": softened,
    }


def process_image(path: Path, *, dry_run: bool = False) -> dict[str, object]:
    image = Image.open(path)
    before_alpha = image.convert("RGBA").getchannel("A").getextrema()
    output, stats = remove_connected_light_background(image)
    after_alpha = output.getchannel("A").getextrema()
    bbox = output.getchannel("A").getbbox()
    changed = output.tobytes() != image.convert("RGBA").tobytes()
    if changed and not dry_run:
        output.save(path)
    return {
        "path": path.relative_to(ROOT).as_posix(),
        "changed": changed,
        "beforeAlpha": before_alpha,
        "afterAlpha": after_alpha,
        "contentBBox": bbox,
        **stats,
    }


def iter_images(source: Path) -> list[Path]:
    suffixes = {".png", ".jpg", ".jpeg", ".webp"}
    return sorted(
        p for p in source.rglob("*")
        if p.is_file() and p.suffix.lower() in suffixes
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--report", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    source = args.source if args.source.is_absolute() else ROOT / args.source
    report = args.report if args.report.is_absolute() else ROOT / args.report
    images = iter_images(source)
    results = [process_image(path, dry_run=args.dry_run) for path in images]

    changed = sum(1 for row in results if row["changed"])
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(
        json.dumps({
            "source": source.relative_to(ROOT).as_posix(),
            "dryRun": args.dry_run,
            "total": len(results),
            "changed": changed,
            "results": results,
        }, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"[done] {changed}/{len(results)} furniture images processed")
    print(f"[report] {report.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
