# 前台页面冒烟

- Started: 2026-07-06T07:51:48.663Z
- Finished: 2026-07-06T07:51:58.833Z
- Result: PASS
- Counts: PASS 11 / WARN 0 / FAIL 0

| Status | Check | Details |
| --- | --- | --- |
| PASS | 服务可访问：http://127.0.0.1:8765/ | {"status":200} |
| PASS | Playwright 使用备用依赖路径加载 | {"dir":"../../../.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"} |
| PASS | 页面标题正确 | {"title":"大观园模拟"} |
| PASS | 游戏画布存在 | {} |
| PASS | 底部 HUD 存在 | {} |
| PASS | 底栏传令入口存在 | {"text":"传令X"} |
| PASS | 底栏起居入口存在 | {"text":"起居Q"} |
| PASS | 底栏人物入口存在 | {"text":"人物P"} |
| PASS | 底栏存档入口存在 | {"text":"存档V"} |
| PASS | 当前人物信息已渲染 | {"selectedName":"宝玉 😐"} |
| PASS | 页面无致命 JS pageerror | {"pageErrors":[]} |
