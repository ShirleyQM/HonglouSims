#!/usr/bin/env python3
"""Sprite generation workflow helpers.

This script intentionally does not call an image model. It prepares strict
prompt packs and lightweight checks around the existing 64x64 base sprite
template so generated assets stay compatible with the game runtime.
"""

from __future__ import annotations

import argparse
import json
import os
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BASE_DIR = ROOT / "test sprites generation" / "female_base" / "sliced"
REPORT_DIR = ROOT / "reports" / "sprite_workflow"

PRESETS = {
    "pilot-down": {
        "label": "Pilot 1: down idle + down walk",
        "rows": [10],
        "cols": list(range(0, 9)),
        "description": "Down-facing idle frame plus 8 walking frames.",
    },
    "walk-4dir": {
        "label": "Pilot 2: four-direction idle + walk",
        "rows": [8, 9, 10, 11],
        "cols": list(range(0, 9)),
        "description": "Up/left/down/right idle frame plus 8 walking frames.",
    },
    "use-hands-4dir": {
        "label": "Use hands, four directions",
        "rows": [0, 1, 2, 3],
        "cols": list(range(0, 6)),
        "description": "Hand-use frames for eating, reading, instrument, wardrobe.",
    },
    "use-wipe-4dir": {
        "label": "Wipe/use tool, four directions",
        "rows": [12, 13, 14, 15],
        "cols": list(range(0, 6)),
        "description": "Wiping/sweeping/washing/gardening frames.",
    },
}

DEFAULT_STYLE = {
    "zijuan": {
        "charName": "Zijuan",
        "bodyRatio": "1:2.3",
        "hairSilhouette": "near-black hair, neat maid hairstyle, small delicate hair ornament, soft side locks",
        "mainColors": {
            "outerRobe": "pale blue-green",
            "innerSkirt": "light warm pink",
            "waistSash": "muted lavender gray",
            "hair": "near black",
        },
        "fixedDetails": [
            "pale blue-green hanfu outer robe",
            "light warm pink inner skirt visible below the robe",
            "muted lavender-gray waist sash",
            "small delicate hair ornament",
            "refined but simple servant styling",
        ],
        "forbidden": [
            "do not make the body toddler-like or super-deformed chibi",
            "do not change outfit colors between frames",
            "do not add weapons, fans, umbrellas, pets, scenery, text, or watermark",
        ],
    }
}


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as f:
        sig = f.read(8)
        if sig != b"\x89PNG\r\n\x1a\n":
            raise ValueError(f"not a PNG file: {path}")
        length = struct.unpack(">I", f.read(4))[0]
        chunk = f.read(4)
        if chunk != b"IHDR" or length < 8:
            raise ValueError(f"invalid PNG header: {path}")
        width, height = struct.unpack(">II", f.read(8))
        return width, height


def load_base_meta(base_dir: Path = BASE_DIR) -> dict:
    meta_path = base_dir / "meta.json"
    with meta_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def available_frames(base_dir: Path = BASE_DIR) -> dict[int, list[int]]:
    rows: dict[int, list[int]] = {}
    for p in base_dir.glob("sprite_r*_c*.png"):
        stem = p.stem
        try:
            r = int(stem.split("_")[1][1:]) - 1
            c = int(stem.split("_")[2][1:]) - 1
        except Exception:
            continue
        rows.setdefault(r, []).append(c)
    return {r: sorted(cols) for r, cols in sorted(rows.items())}


def frame_path(row0: int, col0: int, base_dir: Path = BASE_DIR) -> Path:
    return base_dir / f"sprite_r{row0 + 1:02d}_c{col0 + 1:02d}.png"


def inspect(args: argparse.Namespace) -> None:
    meta = load_base_meta()
    rows = available_frames()
    print("Base sprite template")
    print(f"- source: {meta.get('source')}")
    print(f"- sheet: {meta.get('sheet_w')}x{meta.get('sheet_h')}")
    print(f"- cell: {meta.get('cell_w')}x{meta.get('cell_h')}")
    print(f"- frame count: {meta.get('count')}")
    print("")
    print("Rows")
    for row, cols in rows.items():
        print(f"- sheet row {row:02d} / file r{row + 1:02d}: cols {cols[0] + 1:02d}-{cols[-1] + 1:02d} ({len(cols)} frames)")
    print("")
    if args.png:
        for raw in args.png:
            path = (ROOT / raw).resolve() if not os.path.isabs(raw) else Path(raw)
            w, h = png_size(path)
            ok = (w, h) == (meta.get("cell_w"), meta.get("cell_h")) or (w, h) == (meta.get("sheet_w"), meta.get("sheet_h"))
            print(f"{path}: {w}x{h} {'OK' if ok else 'CHECK'}")


def style_bible_for(char: str, portrait: str | None) -> dict:
    style = json.loads(json.dumps(DEFAULT_STYLE.get(char, {
        "charName": char,
        "bodyRatio": "1:2.3",
        "hairSilhouette": "keep the portrait hairstyle as a stable sprite silhouette",
        "mainColors": {},
        "fixedDetails": ["preserve the portrait's main hairstyle, outfit colors, and role identity"],
        "forbidden": [
            "do not make the body toddler-like or super-deformed chibi",
            "do not change outfit colors between frames",
            "do not add scenery, text, or watermark",
        ],
    })))
    if portrait:
        style["portrait"] = portrait
    return style


def render_prompt(char: str, portrait: str, preset: dict, row: int, cols: list[int], style: dict) -> str:
    frame_count = len(cols)
    total_w = frame_count * 64
    base_frames = [str(frame_path(row, c).relative_to(ROOT)) for c in cols]
    style_json = json.dumps(style, ensure_ascii=False, indent=2)
    return f"""# Sprite Prompt Pack: {char} · row {row} / r{row + 1:02d}

Preset: {preset['label']}
Description: {preset['description']}

## Reference files

- Character portrait: `{portrait}`
- Base frame row: sheet row `{row}` / file row `r{row + 1:02d}`
- Base frames:
{chr(10).join(f'  - `{p}`' for p in base_frames)}

## Style Bible

```json
{style_json}
```

## Prompt

Use case: style-transfer
Asset type: RPG pixel character animation strip

Primary request:
Create a transparent-background pixel-art animation strip for {style.get('charName', char)}, using the provided nude/base sprite strip only as the exact pose, body silhouette, frame count, frame size, foot anchor, and motion reference. Dress the base sprite as the character from the portrait/style bible.

Input images:
Image 1: base sprite strip or ordered base frames listed above, exact pose and frame layout reference.
Image 2: character portrait/style reference.

Output format:
{frame_count} frames in one horizontal strip, each frame exactly 64x64 pixels, total size {total_w}x64.
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
Elegant ancient Chinese game sprite proportions, about {style.get('bodyRatio', '1:2.3')} head-to-body ratio.
Readable at 48x48 in game.

Avoid:
No background, no scenery, no props unless present in the base pose, no text, no watermark.
Do not change outfit colors between frames.
Do not make each frame a different costume.
"""


def plan(args: argparse.Namespace) -> None:
    preset = PRESETS[args.preset]
    out_dir = Path(args.out_dir) if args.out_dir else REPORT_DIR / args.char / args.preset
    if not out_dir.is_absolute():
        out_dir = ROOT / out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    style = style_bible_for(args.char, args.portrait)
    (out_dir / "style-bible.json").write_text(
        json.dumps(style, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    manifest = {
        "char": args.char,
        "portrait": args.portrait,
        "preset": args.preset,
        "rows": [],
    }
    for row in preset["rows"]:
        cols = [c for c in preset["cols"] if frame_path(row, c).exists()]
        prompt = render_prompt(args.char, args.portrait, preset, row, cols, style)
        prompt_path = out_dir / f"prompt_r{row + 1:02d}.md"
        prompt_path.write_text(prompt, encoding="utf-8")
        manifest["rows"].append({
            "sheetRow": row,
            "fileRow": row + 1,
            "cols": cols,
            "frameFiles": [str(frame_path(row, c).relative_to(ROOT)) for c in cols],
            "prompt": str(prompt_path.relative_to(ROOT)),
        })

    (out_dir / "plan.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote sprite workflow plan: {out_dir.relative_to(ROOT)}")
    print(f"- style: {(out_dir / 'style-bible.json').relative_to(ROOT)}")
    print(f"- plan: {(out_dir / 'plan.json').relative_to(ROOT)}")
    for row in manifest["rows"]:
        print(f"- prompt: {row['prompt']}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare and inspect AI sprite generation workflow assets.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_inspect = sub.add_parser("inspect", help="Inspect base template and optional PNG dimensions.")
    p_inspect.add_argument("png", nargs="*", help="PNG files to inspect.")
    p_inspect.set_defaults(func=inspect)

    p_plan = sub.add_parser("plan", help="Generate a strict prompt pack for a character and animation preset.")
    p_plan.add_argument("--char", required=True, help="Character id, e.g. zijuan.")
    p_plan.add_argument("--portrait", required=True, help="Portrait/style reference path.")
    p_plan.add_argument("--preset", choices=sorted(PRESETS), default="pilot-down")
    p_plan.add_argument("--out-dir", default="", help="Output directory. Defaults to reports/sprite_workflow/<char>/<preset>.")
    p_plan.set_defaults(func=plan)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
