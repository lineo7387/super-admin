<script setup lang="ts">
import { X } from 'lucide-vue-next'
import AdminButton from './AdminButton.vue'

withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
  }>(),
  {
    description: undefined
  }
)

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex justify-end">
      <button class="absolute inset-0 cursor-default bg-black/45" aria-label="Close drawer" type="button" @click="emit('close')" />
      <section
        class="relative flex h-full w-full max-w-xl flex-col border-l border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <header class="flex items-start justify-between gap-3 border-b border-[var(--border)] p-4">
          <div>
            <h2 class="[font-family:var(--font-display)] text-xl">{{ title }}</h2>
            <p v-if="description" class="mt-1 text-sm text-[var(--muted-foreground)]">{{ description }}</p>
          </div>
          <AdminButton variant="ghost" size="icon" title="Close" @click="emit('close')">
            <X class="size-4" />
          </AdminButton>
        </header>
        <div class="min-h-0 flex-1 overflow-auto p-4">
          <slot />
        </div>
        <slot name="footer" />
      </section>
    </div>
  </Teleport>
</template>
