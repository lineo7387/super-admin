---
layout: home

hero:
  name: Super Admin
  text: 可扩展的 Vue admin 模板。
  tagline: 从 mock-backed 示例、可替换 API 适配器和运行时设计主题开始，先把高质量管理台搭起来，再接入真实业务服务。
  image:
    src: /super-admin-preview.jpeg
    alt: Super Admin 公开首页和产品预览
  actions:
    - theme: brand
      text: 创建 Starter
      link: /guide/getting-started
    - theme: alt
      text: 查看示例
      link: /guide/examples
    - theme: alt
      text: API 适配器
      link: /guide/api-adapters

features:
  - title: 前端优先
    details: 默认 starter 不要求后端、数据库、auth provider、AI provider 或生成式 API schema。
  - title: Mock-backed 起步
    details: 示例模块带有可替换 mock 数据，让团队在真实接口稳定前也能评估信息架构和交互。
  - title: 清晰适配边界
    details: 页面调用模块 query composable，query 调用 API adapter，adapter 负责归一化 mock 数据或你的 API。
---

<div class="sa-home">
  <section class="sa-proof-strip" aria-label="Super Admin 项目概览">
    <div>
      <strong>0.x</strong>
      <span>当前公开 npm package line</span>
    </div>
    <div>
      <strong>5</strong>
      <span>运行时 design profiles</span>
    </div>
    <div>
      <strong>0</strong>
      <span>默认必需后端服务</span>
    </div>
  </section>

  <section class="sa-home-section" aria-labelledby="preview-title">
    <div>
      <p class="sa-kicker">Public Preview</p>
      <h2 id="preview-title">一个真实的 admin 起点，而不是一页空白 scaffold。</h2>
      <p>
        Super Admin 面向正在评估开源 admin template 的团队：你可以先使用 starter 里的 shell、示例模块、UI primitives、runtime themes 和 mock 数据，等业务 API 稳定后再替换 adapter。
      </p>
      <pre class="sa-command"><code>npm create super-admin@latest my-admin</code></pre>
    </div>
    <figure class="sa-preview-frame">
      <img src="/super-admin-preview.jpeg" alt="Super Admin landing page preview with product UI composition" />
      <figcaption>真实 preview 资产，展示 Super Admin 的公开产品表达和 admin 视觉方向。</figcaption>
    </figure>
  </section>

  <section class="sa-flow" aria-label="Super Admin data access flow">
    <div class="sa-flow-head">
      <p>Frontend data path</p>
      <p>mock-backed today, user API tomorrow</p>
    </div>
    <div class="sa-flow-steps">
      <span>Page</span>
      <span>Query composable</span>
      <span>API adapter</span>
      <span>Mock data | User API</span>
    </div>
  </section>

  <section class="sa-path-heading" aria-labelledby="path-title">
    <p class="sa-kicker">Choose Your Path</p>
    <h2 id="path-title">从 npm starter 开始；按你的业务边界逐步替换。</h2>
    <p>
      公开文档优先服务普通使用者和评估者。源码仓库里的维护、发布和协作资料仍然可查，但不会成为生成项目的必需步骤。
    </p>
  </section>

  <section class="sa-path-grid" aria-label="Super Admin 使用路径">
    <article class="sa-path-card">
      <h3>创建自己的 admin app</h3>
      <p>使用 npm starter 生成一个可运行的 Vue admin 项目，然后定制模块、主题和页面。</p>
      <a href="guide/getting-started.md">快速开始</a>
    </article>
    <article class="sa-path-card">
      <h3>替换 mock 数据</h3>
      <p>当页面语义适合你的业务时，只需要在 adapter 层接入真实 API 并归一化响应。</p>
      <a href="guide/api-adapters.md">阅读 API 适配器</a>
    </article>
    <article class="sa-path-card">
      <h3>评估组件和主题</h3>
      <p>查看示例模块、workspace tabs、UI primitives 和运行时设计主题是否适合作为你的起点。</p>
      <a href="guide/examples.md">查看示例</a>
    </article>
  </section>
</div>
