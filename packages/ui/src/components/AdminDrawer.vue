<script setup lang="ts">
import { X } from '@lucide/vue'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import AdminButton from './AdminButton.vue'
import AdminScrollArea from './AdminScrollArea.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    closeLabel?: string
    overlayCloseLabel?: string
  }>(),
  {
    description: undefined,
    closeLabel: 'Close',
    overlayCloseLabel: 'Close drawer'
  }
)

const emit = defineEmits<{
  close: []
}>()

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close')
  }
}

function syncKeydownListener(open: boolean): void {
  if (open) {
    window.addEventListener('keydown', handleKeydown)
    return
  }
  window.removeEventListener('keydown', handleKeydown)
}

watch(() => props.open, syncKeydownListener)

onMounted(() => syncKeydownListener(props.open))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex justify-end">
      <button class="absolute inset-0 cursor-default bg-black/45" :aria-label="overlayCloseLabel" type="button" @click="emit('close')" />
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
          <AdminButton variant="ghost" size="icon" :title="closeLabel" @click="emit('close')">
            <X class="size-4" />
          </AdminButton>
        </header>
        <AdminScrollArea class="flex-1" view-class="p-4">
          <slot />
        </AdminScrollArea>
        <slot name="footer" />
      </section>
    </div>
  </Teleport>
</template>
