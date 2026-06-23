# 紫鹃 Pilot Down 测试结果

时间：2026-06-18

## 输入

- 裸模参考：`test sprites generation/female copy.png`
- 单帧参考：`sprite_r11_c01.png`、`sprite_r11_c05.png`
- 角色立绘：`assets/lihui/紫鹃.png`
- Prompt：`reports/sprite_workflow/zijuan/pilot-down/prompt_r11.md`

## 输出

- 预览图：`reports/sprite_workflow/zijuan/pilot-down/generated/zijuan_down_walk_preview.png`
- 实际尺寸：`1881 x 836`
- 颜色模式：RGB

追加测试：

- 严格单行模板：`reports/sprite_workflow/zijuan/pilot-down/refs/base_r11_c01-c09.png`
- 严格行生成图：`reports/sprite_workflow/zijuan/pilot-down/generated/zijuan_down_walk_strict_row_v1.png`
- 实际尺寸：`1881 x 836`
- 颜色模式：RGB

## 结论

这次内置生图适合生成“风格母版”，但不适合直接生成严格可入库的 `576 x 64` spritesheet。

优点：

- 紫鹃的青蓝外衫、粉色里裙、紫灰腰带和黑发发饰稳定。
- 比现有 Q 版裸模更修长，整体方向可取。
- 8 帧之间人物一致性还不错。

问题：

- 输出尺寸不受控，未按 `9 x 64` 严格成图。
- 背景是棋盘格视觉背景，不是真透明 alpha。
- 帧间间距和主体尺寸过大，不能直接切进当前运行时。
- 姿势参考不够严格，已经不是完全继承裸模 r11。

追加测试观察：

- 使用单独裁出的 `r11 c01-c09` 后，模型更明确地生成了 9 个正面/向下行走帧。
- 帧间人物身份、发型、发饰、青蓝外衫、淡粉内搭、紫灰腰带比上一版更稳定。
- 手脚动作比上一版更接近“正面走路循环”。
- 但工具仍没有遵守 `576 x 64` 画布和 `64 x 64` 单帧约束，输出依然是大图。
- 背景仍是棋盘格视觉背景，不是真 alpha。

## 下一步

推荐把这张图作为紫鹃 sprite style bible 的视觉参考，而不是直接作为 spritesheet。

后续真正入库应改为：

1. 先生成/确认单帧风格母版。
2. 用本地脚本或专用像素工作流把母版约束到 `64 x 64`。
3. 按裸模逐帧套装，生成严格尺寸。
4. 检查 alpha、脚底锚点、主体高度、主色漂移。
