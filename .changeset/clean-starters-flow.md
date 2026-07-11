---
'create-super-admin': patch
---

将生成器重构为以 `apps/admin` 为唯一源码的共享派生管线，移除 app 文件整页模板镜像，并增加 source-root、构建模板和打包 CLI 的等价性验证。
