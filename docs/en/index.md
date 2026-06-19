---
layout: home

hero:
  name: Super Admin
  text: Extensible Vue admin template.
  tagline: Start with mock-backed examples, replaceable API adapters, and runtime design profiles, then connect real business services when they are ready.
  image:
    src: /super-admin-preview.jpeg
    alt: Super Admin public homepage and product preview
  actions:
    - theme: brand
      text: Create a Starter
      link: /en/guide/getting-started
    - theme: alt
      text: View Examples
      link: /en/guide/examples
    - theme: alt
      text: API Adapters
      link: /en/guide/api-adapters

features:
  - title: Frontend-first
    details: The default starter does not require a backend, database, auth provider, AI provider, or generated API schema.
  - title: Mock-backed start
    details: Example modules include replaceable mock data, so teams can evaluate information architecture and interaction before real APIs settle.
  - title: Clean adapter boundary
    details: Pages call module query composables, queries call API adapters, and adapters normalize mock data or your API.
---

<div class="sa-home">
  <section class="sa-proof-strip" aria-label="Super Admin project overview">
    <div>
      <strong>0.x</strong>
      <span>active public npm package line</span>
    </div>
    <div>
      <strong>5</strong>
      <span>runtime design profiles</span>
    </div>
    <div>
      <strong>0</strong>
      <span>required backend services by default</span>
    </div>
  </section>

  <section class="sa-home-section" aria-labelledby="preview-title">
    <div>
      <p class="sa-kicker">Public Preview</p>
      <h2 id="preview-title">A real admin starting point, not an empty scaffold.</h2>
      <p>
        Super Admin is for teams evaluating an open-source admin template: start with the shell, example modules, UI primitives, runtime themes, and mock data, then replace the adapter when your business API is stable.
      </p>
      <pre class="sa-command"><code>npm create super-admin@latest my-admin</code></pre>
    </div>
    <figure class="sa-preview-frame">
      <img src="/super-admin-preview.jpeg" alt="Super Admin landing page preview with product UI composition" />
      <figcaption>Real preview asset showing Super Admin's public product story and admin visual direction.</figcaption>
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
    <h2 id="path-title">Start from the npm starter, then replace pieces along your business boundary.</h2>
    <p>
      The public docs prioritize ordinary users and evaluators. Repository maintenance, release, and collaboration material remains available, but it is not required in generated projects.
    </p>
  </section>

  <section class="sa-path-grid" aria-label="Super Admin usage paths">
    <article class="sa-path-card">
      <h3>Create your admin app</h3>
      <p>Generate a runnable Vue admin project from npm, then customize modules, themes, and pages.</p>
      <a href="guide/getting-started.md">Getting started</a>
    </article>
    <article class="sa-path-card">
      <h3>Replace mock data</h3>
      <p>When the screen semantics fit your workflow, connect your real API in the adapter layer and normalize the response.</p>
      <a href="guide/api-adapters.md">Read API adapters</a>
    </article>
    <article class="sa-path-card">
      <h3>Evaluate UI and themes</h3>
      <p>Review example modules, workspace tabs, UI primitives, and runtime design profiles as a practical foundation.</p>
      <a href="guide/examples.md">View examples</a>
    </article>
  </section>
</div>
