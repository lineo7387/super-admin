<template>
  <section class="auth-recipe-panel">
    <slot />
  </section>
</template>

<style scoped>
.auth-recipe-panel {
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(150deg, color-mix(in srgb, var(--surface) 94%, transparent), color-mix(in srgb, var(--surface-raised) 84%, transparent)), var(--texture);
  box-shadow: var(--panel-shadow);
  padding: clamp(1.25rem, 3vw, 2rem);
}

@media (max-width: 768px) {
  .auth-recipe-panel {
    padding: 1rem;
  }
}
</style>
