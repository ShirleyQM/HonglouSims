#!/usr/bin/env python3
"""Build transparent, size-normalized full-body character portraits."""

from __future__ import annotations

import json
import re
from collections import deque
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "全身立绘"
OUTPUT_DIR = SOURCE_DIR / "processed"
MANIFEST_PATH = SOURCE_DIR / "manifest.json"
GAME_MANIFEST_PATH = ROOT / "assets" / "manifest.json"
REPORT_DIR = ROOT / "reports"
PREVIEW_PATH = REPORT_DIR / "full_body_portraits_preview.png"
REPORT_PATH = REPORT_DIR / "full_body_portraits_report.json"

IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp"}
SKIPPED_DIRS = ["其他"]
HARDCODED_REF_FILES = [
    ROOT / "memory-panel.html",
    ROOT / "jiafu-order.html",
]

NAME_TO_ID = {
    "宝玉": "baoyu",
    "贾宝玉": "baoyu",
    "黛玉": "daiyu",
    "林黛玉": "daiyu",
    "宝钗": "baochai",
    "薛宝钗": "baochai",
    "探春": "tanchun",
    "贾探春": "tanchun",
    "熙凤": "xifeng",
    "凤姐": "xifeng",
    "王熙凤": "xifeng",
    "紫鹃": "zijuan",
    "雪雁": "xueyan",
    "莺儿": "yinger",
    "湘云": "xiangyun",
    "史湘云": "xiangyun",
    "袭人": "xiren",
    "晴雯": "qingwen",
    "麝月": "sheyue",
    "李纨": "liwan",
    "迎春": "yingchun",
    "贾迎春": "yingchun",
    "元春": "yuanchun",
    "贾元春": "yuanchun",
    "秦可卿": "qinkeqing",
}

OUTPUTS = {
    "portrait": (512, 768, 92),
    "hud": (240, 360, 88),
}
FULL_BODY_OUTPUTS = {
    "fullBody": (512, 768, 92),
    "fullBodyHud": (240, 360, 88),
}
BUST_CROP_RATIOS = {
    "default": 0.54,
}
BUST_SOURCE_CROP_RATIOS = {
    "default": 0.96,
}
AVATAR_SIZE = (192, 192)
AVATAR_QUALITY = 90
AVATAR_CROP_OVERRIDES = {
    "daiyu": {"sideScale": 1.65, "yOffset": 0.045, "xOffset": 0.04},
    # 迎春是侧身全身像，默认头像裁切会过度贴脸；这里拉远并下移一点，保留肩颈和上身。
    "yingchun": {"sideScale": 1.38, "yOffset": 0.04},
}


def is_edge_background(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    if a == 0:
        return True
    lo = min(r, g, b)
    hi = max(r, g, b)
    avg = (r + g + b) / 3
    return lo >= 226 and hi - lo <= 42 and avg >= 232


def remove_connected_background(image: Image.Image) -> tuple[Image.Image, dict[str, int | float | tuple[int, int, int, int] | None]]:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        idx = y * width + x
        if visited[idx] or not is_edge_background(pixels[x, y]):
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
    removed = 0
    for y in range(height):
        row = y * width
        for x in range(width):
            if visited[row + x]:
                r, g, b, _ = out[x, y]
                out[x, y] = (r, g, b, 0)
                removed += 1

    return output, {
        "sourceWidth": width,
        "sourceHeight": height,
        "removedPixels": removed,
        "removedPercent": round(removed / (width * height) * 100, 2),
        "alphaBBox": output.getchannel("A").getbbox(),
    }


def character_id_for_source(path: Path) -> str | None:
    stem = path.stem.strip()
    normalized = stem
    while True:
        trimmed = re.sub(
            r"[\s_-]*(?:copy|副本|立绘|全身|半身|头像|高清|hd|highres|high-res|portrait|avatar|bust)\d*$",
            "",
            normalized,
            flags=re.I,
        )
        if trimmed == normalized:
            break
        normalized = trimmed
    if stem in NAME_TO_ID:
        return NAME_TO_ID[stem]
    if normalized in NAME_TO_ID:
        return NAME_TO_ID[normalized]
    if re.fullmatch(r"[a-z][a-z0-9_-]*", stem):
        return stem.replace("-", "_")
    return None


def source_kind_for_path(path: Path) -> str:
    stem = path.stem.lower()
    if "半身" in path.stem or "bust" in stem or "portrait" in stem:
        return "bust"
    if "全身" in path.stem or "fullbody" in stem or "full-body" in stem:
        return "fullBody"
    return "fullBody"


def source_quality_score(path: Path) -> int:
    score = 0
    if "高清" in path.stem or re.search(r"(?:^|[-_])(?:hd|highres|high-res)(?:$|[-_])", path.stem, re.I):
        score += 10**12
    try:
        with Image.open(path) as image:
            score += image.width * image.height
    except Exception:
        score += path.stat().st_size
    return score


def collect_character_sources() -> dict[str, dict[str, Path]]:
    sources: dict[str, dict[str, Path]] = {}
    for path in sorted(SOURCE_DIR.iterdir(), key=lambda p: p.name):
        if path.is_dir() or path.name.startswith(".") or path.suffix.lower() not in IMAGE_SUFFIXES:
            continue
        char_id = character_id_for_source(path)
        if not char_id:
            print(f"[skip] unknown character name: {path.name}")
            continue
        kind = source_kind_for_path(path)
        bucket = sources.setdefault(char_id, {})
        if kind in bucket:
            current = bucket[kind]
            if source_quality_score(path) > source_quality_score(current):
                print(f"[replace] {char_id}:{kind} {current.name} -> {path.name}")
                bucket[kind] = path
            else:
                print(f"[skip] duplicate {kind} source for {char_id}: {path.name}")
            continue
        bucket[kind] = path
    return sources


def fit_to_canvas(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if bbox:
        image = image.crop(bbox)

    target_w, target_h = size
    padding_x = max(6, round(target_w * 0.035))
    padding_top = max(4, round(target_h * 0.015))
    max_w = target_w - padding_x * 2
    max_h = target_h - padding_top
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


def crop_bust(
    image: Image.Image,
    char_id: str,
    ratios: dict[str, float] = BUST_CROP_RATIOS,
) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return image
    x0, y0, x1, y1 = bbox
    char_h = y1 - y0
    ratio = ratios.get(char_id, ratios["default"])
    bottom = min(y1, round(y0 + char_h * ratio))
    pad_x = max(8, round((x1 - x0) * 0.08))
    pad_top = max(4, round(char_h * 0.018))
    crop_box = (
        max(0, x0 - pad_x),
        max(0, y0 - pad_top),
        min(image.width, x1 + pad_x),
        bottom,
    )
    return image.crop(crop_box)


def bbox_for_band(image: Image.Image, top: int, bottom: int) -> tuple[int, int, int, int] | None:
    alpha = image.getchannel("A")
    band = alpha.crop((0, top, image.width, bottom))
    mask = band.point(lambda value: 255 if value > 24 else 0)
    bbox = mask.getbbox()
    if not bbox:
        return None
    return bbox[0], top + bbox[1], bbox[2], top + bbox[3]


def weighted_alpha_x(image: Image.Image, band_top: int, band_bottom: int) -> float | None:
    alpha = image.getchannel("A")
    width = image.width
    band_h = max(1, band_bottom - band_top)
    total = 0.0
    weighted = 0.0
    for y in range(band_top, band_bottom):
        vertical_weight = (1 - (y - band_top) / band_h) ** 1.7
        for x in range(width):
            value = alpha.getpixel((x, y))
            if value <= 24:
                continue
            weight = value * vertical_weight
            total += weight
            weighted += x * weight
    return weighted / total if total else None


def crop_avatar(char_id: str, image: Image.Image, size: tuple[int, int] = AVATAR_SIZE) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        return Image.new("RGBA", size, (0, 0, 0, 0))

    x0, y0, x1, y1 = bbox
    char_h = y1 - y0
    band_top = y0
    band_bottom = min(y1, y0 + round(char_h * 0.34))
    upper_bbox = bbox_for_band(image, band_top, band_bottom)
    focus_x = weighted_alpha_x(image, band_top, band_bottom)
    if focus_x is None:
        focus_x = (upper_bbox[0] + upper_bbox[2]) / 2 if upper_bbox else (x0 + x1) / 2

    upper_w = (upper_bbox[2] - upper_bbox[0]) if upper_bbox else (x1 - x0)
    side = max(round(char_h * 0.28), round(upper_w * 0.82))
    side = min(max(side, round(char_h * 0.24)), round(char_h * 0.38))
    override = AVATAR_CROP_OVERRIDES.get(char_id, {})
    side = max(1, round(side * float(override.get("sideScale", 1))))
    focus_x += char_h * float(override.get("xOffset", 0))

    crop_top = round(y0 - char_h * 0.025 + char_h * float(override.get("yOffset", 0)))
    crop_left = round(focus_x - side / 2)
    crop_right = crop_left + side
    crop_bottom = crop_top + side

    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    paste_x = max(0, -crop_left)
    paste_y = max(0, -crop_top)
    src_box = (
        max(0, crop_left),
        max(0, crop_top),
        min(image.width, crop_right),
        min(image.height, crop_bottom),
    )
    if src_box[2] > src_box[0] and src_box[3] > src_box[1]:
        canvas.alpha_composite(image.crop(src_box), (paste_x, paste_y))
    return canvas.resize(size, Image.Resampling.LANCZOS)


def checker(size: tuple[int, int], cell: int = 16) -> Image.Image:
    width, height = size
    image = Image.new("RGBA", size, (246, 244, 239, 255))
    draw = ImageDraw.Draw(image)
    colors = ((238, 232, 222, 255), (250, 248, 244, 255))
    for y in range(0, height, cell):
        for x in range(0, width, cell):
            color = colors[(x // cell + y // cell) % 2]
            draw.rectangle(
                [x, y, min(x + cell - 1, width - 1), min(y + cell - 1, height - 1)],
                fill=color,
            )
    return image


def build_preview(rows: list[dict]) -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    row_h = 220
    label_h = 28
    gap = 18
    source_w = 210
    avatar_w = 150
    portrait_w = 210
    full_w = 210
    sheet_w = gap * 5 + source_w + avatar_w + portrait_w + full_w
    sheet_h = gap + len(rows) * (row_h + label_h + gap)
    sheet = Image.new("RGB", (sheet_w, sheet_h), (246, 242, 235))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    for index, row in enumerate(rows):
        top = gap + index * (row_h + label_h + gap)
        draw.text((gap, top), f"{row['id']} / {row['source']}", fill=(74, 55, 42), font=font)
        y = top + label_h

        original = Image.open(row["fullBodySourcePath"] or row["bustSourcePath"]).convert("RGBA")
        original.thumbnail((source_w, row_h), Image.Resampling.LANCZOS)
        source_bg = Image.new("RGB", (source_w, row_h), (255, 255, 255))
        source_bg.paste(original.convert("RGB"), ((source_w - original.width) // 2, row_h - original.height))
        sheet.paste(source_bg, (gap, y))

        avatar = Image.open(row["outputs"]["avatar"]).convert("RGBA")
        avatar.thumbnail((avatar_w, avatar_w), Image.Resampling.LANCZOS)
        avatar_bg = checker((avatar_w, avatar_w), cell=12).convert("RGB")
        avatar_bg.paste(avatar, ((avatar_w - avatar.width) // 2, (avatar_w - avatar.height) // 2), avatar)
        sheet.paste(avatar_bg, (gap * 2 + source_w, y + 28))

        processed = Image.open(row["outputs"]["portrait"]).convert("RGBA")
        processed.thumbnail((portrait_w, row_h), Image.Resampling.LANCZOS)
        processed_bg = checker((portrait_w, row_h)).convert("RGB")
        processed_bg.paste(processed, ((portrait_w - processed.width) // 2, row_h - processed.height), processed)
        sheet.paste(processed_bg, (gap * 3 + source_w + avatar_w, y))

        full_body = Image.open(row["outputs"]["fullBody"]).convert("RGBA")
        full_body.thumbnail((full_w, row_h), Image.Resampling.LANCZOS)
        full_bg = checker((full_w, row_h)).convert("RGB")
        full_bg.paste(full_body, ((full_w - full_body.width) // 2, row_h - full_body.height), full_body)
        sheet.paste(full_bg, (gap * 4 + source_w + avatar_w + portrait_w, y))

    sheet.save(PREVIEW_PATH)


def update_hardcoded_references(portraits: dict[str, dict[str, str]]) -> list[str]:
    changed_files: list[str] = []
    for file_path in HARDCODED_REF_FILES:
        if not file_path.exists():
            continue
        text = file_path.read_text(encoding="utf-8")
        updated = text
        for char_id, paths in portraits.items():
            updated = updated.replace(
                f"assets/lihui/processed/{char_id}_portrait.webp",
                paths["portrait"],
            )
            updated = updated.replace(
                f"assets/lihui/processed/{char_id}_hud.webp",
                paths["hud"],
            )
        if updated != text:
            file_path.write_text(updated, encoding="utf-8")
            changed_files.append(file_path.relative_to(ROOT).as_posix())
    return changed_files


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    portraits: dict[str, dict[str, str]] = {}
    avatars: dict[str, dict[str, str]] = {}
    report_rows: list[dict] = []

    for char_id, source_set in collect_character_sources().items():
        full_source = source_set.get("fullBody")
        bust_source = source_set.get("bust")
        if not full_source and not bust_source:
            continue

        if full_source:
            full_transparent, full_metrics = remove_connected_background(Image.open(full_source))
        else:
            full_transparent, full_metrics = remove_connected_background(Image.open(bust_source))

        if bust_source:
            bust_transparent, bust_metrics = remove_connected_background(Image.open(bust_source))
            bust = crop_bust(bust_transparent, char_id, BUST_SOURCE_CROP_RATIOS)
        else:
            bust_transparent = None
            bust_metrics = None
            bust = crop_bust(full_transparent, char_id)

        paths: dict[str, str] = {}
        abs_outputs: dict[str, str] = {}

        avatar = crop_avatar(char_id, bust_transparent or bust, AVATAR_SIZE)
        avatar_path = OUTPUT_DIR / f"{char_id}_avatar.webp"
        avatar.save(avatar_path, "WEBP", quality=AVATAR_QUALITY, method=6, exact=True)
        avatar_rel = avatar_path.relative_to(ROOT).as_posix()
        paths["avatar"] = avatar_rel
        abs_outputs["avatar"] = str(avatar_path)
        avatars[char_id] = {"src": avatar_rel}
        print(f"[ok] {char_id}:avatar {AVATAR_SIZE[0]}x{AVATAR_SIZE[1]} -> {avatar_rel}")

        for variant, (width, height, quality) in OUTPUTS.items():
            output = fit_to_canvas(bust, (width, height))
            path = OUTPUT_DIR / f"{char_id}_{variant}.webp"
            output.save(path, "WEBP", quality=quality, method=6, exact=True)
            paths[variant] = path.relative_to(ROOT).as_posix()
            abs_outputs[variant] = str(path)
            print(f"[ok] {char_id}:{variant} {width}x{height} -> {paths[variant]}")
        for variant, (width, height, quality) in FULL_BODY_OUTPUTS.items():
            output = fit_to_canvas(full_transparent, (width, height))
            filename_variant = "fullbody" if variant == "fullBody" else "fullbody_hud"
            path = OUTPUT_DIR / f"{char_id}_{filename_variant}.webp"
            output.save(path, "WEBP", quality=quality, method=6, exact=True)
            paths[variant] = path.relative_to(ROOT).as_posix()
            abs_outputs[variant] = str(path)
            print(f"[ok] {char_id}:{variant} {width}x{height} -> {paths[variant]}")

        portraits[char_id] = {key: paths[key] for key in ("portrait", "hud", "fullBody", "fullBodyHud")}
        report_rows.append({
            "id": char_id,
            "source": " + ".join(p.name for p in [bust_source, full_source] if p),
            "sourceMode": "separateBustAndFullBody" if bust_source and full_source else ("bustOnly" if bust_source else "fullBodyOnly"),
            "bustSourcePath": str(bust_source) if bust_source else None,
            "fullBodySourcePath": str(full_source) if full_source else None,
            "outputs": abs_outputs,
            "bustMetrics": bust_metrics,
            "fullBodyMetrics": full_metrics,
        })

    MANIFEST_PATH.write_text(json.dumps({
        "version": 1,
        "generatedBy": "scripts/process_full_body_portraits.py",
        "sourceDir": "assets/全身立绘",
        "skippedDirs": SKIPPED_DIRS,
        "avatars": avatars,
        "portraits": portraits,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    game_manifest = json.loads(GAME_MANIFEST_PATH.read_text(encoding="utf-8"))
    game_manifest.setdefault("avatars", {})
    game_manifest.setdefault("portraits", {})
    for char_id, paths in avatars.items():
        game_manifest["avatars"][char_id] = paths
    for char_id, paths in portraits.items():
        game_manifest["portraits"][char_id] = paths
    GAME_MANIFEST_PATH.write_text(
        json.dumps(game_manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    changed_ref_files = update_hardcoded_references(portraits)

    REPORT_PATH.write_text(json.dumps({
        "sourceDir": "assets/全身立绘",
        "skippedDirs": SKIPPED_DIRS,
        "count": len(report_rows),
        "preview": PREVIEW_PATH.relative_to(ROOT).as_posix(),
        "updatedManifest": GAME_MANIFEST_PATH.relative_to(ROOT).as_posix(),
        "updatedReferenceFiles": changed_ref_files,
        "items": report_rows,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    build_preview(report_rows)
    print(f"[done] {len(report_rows)} characters")
    print(f"[refs] {', '.join(changed_ref_files) if changed_ref_files else 'no hardcoded refs changed'}")
    print(f"[preview] {PREVIEW_PATH.relative_to(ROOT)}")
    print(f"[report] {REPORT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
