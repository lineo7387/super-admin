# 可选后端

默认 scaffold 是前端优先的。它应该无需后端、数据库、auth provider、AI provider 或 generated API schema 即可运行。

## 什么是可选的

可选/reference surfaces 包括：

- Hono-style reference API
- database 或 ORM examples
- auth provider examples
- AI provider integration
- formal API contract validation
- `create-super-admin` CLI scaffold generation

这些内容应围绕前端模板边界做验证或生成，不应该把默认 scaffold 重新定义成 full-stack framework。

## 当前推荐路径

真实项目里建议：

1. 从 admin app 开始。
2. 找到最接近你业务工作流的 example module。
3. 如果 screen 已经匹配，只替换 API adapter。
4. 如果 workflow 不同，请一起重塑 page、components、types、queries 和 adapter。
5. 不要把 backend-specific clients 放进 Vue pages。

## 维护者验证路径

可选 backend 和 CLI surfaces 是围绕同一条 frontend-first boundary 的验证工具：

```text
API contract validation
  -> optional Hono reference API
    -> theme-first CLI scaffold
      -> release acceptance QA
```

CLI 已经可作为可选 generated-project path。它不会让 optional backend 变成必需；backend-specific clients 也仍应放在 API adapters 后面，而不是 Vue pages 里。
