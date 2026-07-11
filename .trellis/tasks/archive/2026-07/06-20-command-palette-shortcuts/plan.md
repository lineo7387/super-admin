# Command Palette 收尾审计计划

## 目标

逐项验证既有 Command Palette 与快捷键实现是否满足 PRD；补齐审计中发现的缺口，并完成自动化、浏览器和生成脚手架验证。

## 执行步骤

1. 对照 PRD、frontend/shared spec 审查 registry、Pinia store、Command Palette、Shell 集成和 i18n。
2. 先补失败测试，再修复缺失的主题切换命令与空结果键盘导航边界。
3. 运行聚焦测试、全量质量门和 starter 生成验证。
4. 在真实浏览器中验证快捷键唤醒、搜索、键盘导航、命令执行和重绑交互。
5. 回填验收证据，更新任务状态并按 Trellis 流程关闭任务。

