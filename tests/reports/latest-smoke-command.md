# 传令面板冒烟

- Started: 2026-06-29T09:19:49.472Z
- Finished: 2026-06-29T09:19:53.831Z
- Result: PASS
- Counts: PASS 11 / WARN 1 / FAIL 0

| Status | Check | Details |
| --- | --- | --- |
| PASS | 服务可访问：http://127.0.0.1:8765/ | {"status":200} |
| PASS | Playwright 使用备用依赖路径加载 | {"dir":"../../../.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"} |
| PASS | 传令面板 overlay 已打开 | {} |
| PASS | 传令面板存在 | {} |
| PASS | 点名传令栏存在 | {"paneTitles":["点名传令","群体传令"]} |
| PASS | 群体传令栏存在 | {"paneTitles":["点名传令","群体传令"]} |
| PASS | 点名传令存在可选对象 | {"targetCount":3} |
| PASS | 候选卡展示关系/接受信号 | {"targetText":"袭人\n      当值·贴身丫鬟贴身丫鬟服从40信任42预计中职责内\n      任务1 \| 晴雯\n      房中丫鬟服从60信任34预计中职责内\n      空闲 \| 麝月\n      房中丫鬟服从60信任35预计中职责内\n      空闲"} |
| WARN | 当前角色没有可用群体传令项 | {"groupCount":0} |
| PASS | 当值令角标能打开传令面板 | {} |
| PASS | 当值令角标会预选人物 | {"hasCommandPanel":true,"checkedTargets":["xiren"],"activeNames":["袭人"]} |
| PASS | 页面无致命 JS pageerror | {"pageErrors":[]} |
