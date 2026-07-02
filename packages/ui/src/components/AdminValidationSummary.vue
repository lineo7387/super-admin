<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'
import { computed } from 'vue'

withDefaults(
  defineProps<{
    title?: string
    errors: string[]
  }>(),
  {
    title: 'Review the highlighted fields'
  }
)

const style = computed(() => ({
  borderColor: 'color-mix(in srgb, var(--danger) 45%, var(--border))',
  backgroundColor: 'color-mix(in srgb, var(--danger) 10%, var(--surface))'
}))
</script>

<template>
  <section v-if="errors.length > 0" class="rounded-[var(--radius-md)] border p-3 text-sm" :style="style" role="alert">
    <div class="flex items-start gap-2">
      <AlertTriangle class="mt-0.5 size-4 shrink-0 text-[var(--danger)]" aria-hidden="true" />
      <div>
        <h3 class="font-medium text-[var(--foreground)]">{{ title }}</h3>
        <ul class="mt-2 list-disc space-y-1 pl-4 text-[var(--muted-foreground)]">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
