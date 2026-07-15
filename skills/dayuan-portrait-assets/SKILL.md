---
name: dayuan-portrait-assets
description: Project-specific workflow for 大观园 character portrait assets. Use when Codex needs to process, import, replace, register, QA, or troubleshoot人物立绘/全身立绘/头像/HUD立绘 for this game, especially images placed under assets/全身立绘, white-background removal, WebP conversion, manifest updates, avatar crop tuning, preview reports, and ensuring the UI uses the new character art.
---

# Dayuan Portrait Assets

## Workflow

Use the project pipeline instead of hand-editing generated images.

1. Work from the game repo root, normally `/Users/bytedance/Desktop/myCursor/game`.
2. Put incoming character art in `assets/全身立绘/` at the top level. Leave `assets/全身立绘/其他/` untouched unless the user explicitly asks to process it.
3. Match filenames to known character names, such as `晴雯.png`, `紫鹃.png`, `袭人.png`, `迎春.png`, `雪雁.png`, `麝月.png`. If a new name does not map to a character id, patch `NAME_TO_ID` in `scripts/process_full_body_portraits.py` before running.
   - Filenames may also start with a known character name plus a variant note, for example `黛玉紫色2改手.png`.
   - If both a clearer bust and a complete full-body source exist, name them with `半身` and `全身`, for example `黛玉半身.png` and `黛玉全身.png`.
   - The `半身` source drives `avatar`/`hud`/`portrait`; the `全身` source drives `fullBody`/`fullBodyHud`.
   - If a dedicated headshot exists, name it with `头像`, for example `麝月头像.png`; it drives only `avatar` and keeps the character's existing `portrait`/`hud`/`fullBody` sources.
   - If duplicate full-body sources exist, names containing `改手`, `最终`, or `定稿` are preferred over `高清`, `hd`, or `highres`; larger pixel area wins after those markers.
4. Run the one-command pipeline:

```bash
scripts/replace_portraits.sh
```

If the current directory may not be the repo root, use this skill's helper:

```bash
skills/dayuan-portrait-assets/scripts/run_project_portrait_pipeline.sh /Users/bytedance/Desktop/myCursor/game
```

## What The Pipeline Does

The project script `scripts/process_full_body_portraits.py`:

- removes connected white/paper backgrounds from source images;
- supports separate bust and full-body source images for the same character;
- supports dedicated `头像` source images for avatar-only replacement;
- supports character-name-prefixed variant files and source-specific white-background thresholds for tricky white garments;
- normalizes semi-body `portrait`/`hud` crops to end slightly below the waist;
- creates transparent WebP assets:
  - `*_avatar.webp` at `192x192`;
  - `*_hud.webp` at `240x360` for main-game semi-body HUD art;
  - `*_portrait.webp` at `512x768` for semi-body character panels;
  - `*_fullbody.webp` at `512x768` for full-body viewing and admin character config;
  - `*_fullbody_hud.webp` at `240x360` as a small full-body derivative;
- writes outputs to `assets/全身立绘/processed/`;
- updates `assets/全身立绘/manifest.json`;
- updates `assets/manifest.json` `avatars` and `portraits`;
- updates hardcoded fallback paths in `memory-panel.html` and `jiafu-order.html`;
- writes `reports/full_body_portraits_report.json`;
- writes the QA contact sheet `reports/full_body_portraits_preview.png`.

## Quality Check

Always inspect `reports/full_body_portraits_preview.png` with `view_image` after running.

Check:

- white background is gone;
- feet, hair, sleeves, fans, and long hems are not cut off in `portrait`;
- when `半身` and `全身` sources are both present, `portrait`/`hud` should use the clearer bust while `fullBody` should use the complete full-body source;
- when a `头像` source is present, `avatar` should use that headshot while the other portrait variants remain unchanged;
- `portrait`/`hud` are useful semi-body crops ending around slightly below the waist, while `fullBody` remains complete head-to-foot art;
- `avatar` shows face plus enough shoulder/upper body, not only a large head;
- no obvious white fringe remains around hair or clothes;
- character identity still reads at small size;
- `其他/` files were skipped unless requested.

If an avatar crop is too tight, add or adjust an entry in `AVATAR_CROP_OVERRIDES` in `scripts/process_full_body_portraits.py`, then rerun `scripts/replace_portraits.sh`. Prefer source-of-truth crop parameters over manually editing generated WebP files.

## Verification

Run focused checks after changes:

```bash
bash -n scripts/replace_portraits.sh
python3 -m py_compile scripts/process_full_body_portraits.py
python3 -m json.tool assets/manifest.json >/tmp/assets-manifest.valid
python3 -m json.tool assets/全身立绘/manifest.json >/tmp/full-body-manifest.valid
python3 -m json.tool reports/full_body_portraits_report.json >/tmp/full-body-report.valid
```

If system `python3` lacks Pillow, use the bundled Python path from `codex_app.load_workspace_dependencies`, or just run `scripts/replace_portraits.sh`, which searches for a Python with Pillow.

For browser/path confidence, optionally start a local server and request each generated WebP from `assets/manifest.json`, especially because paths contain Chinese characters. Expect HTTP `200` and `image/webp`.

## Reporting

In the final response, mention:

- which characters were processed;
- where generated assets live;
- whether manifest/fallback references were updated;
- preview image path;
- validation performed;
- any visual caveats, such as a deliberate crop override.

Do not commit, delete originals, or process `assets/全身立绘/其他/` unless the user asks.
