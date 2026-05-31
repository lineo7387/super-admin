<script setup lang="ts">
import AdminButton from './AdminButton.vue'

withDefaults(
  defineProps<{
    dirty?: boolean
    submitting?: boolean
    statusText?: string
    cancelLabel?: string
    submitLabel?: string
    submittingLabel?: string
  }>(),
  {
    dirty: false,
    submitting: false,
    statusText: undefined,
    cancelLabel: 'Cancel',
    submitLabel: 'Save changes',
    submittingLabel: 'Saving...'
  }
)

const emit = defineEmits<{
  cancel: []
  submit: []
}>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface)] p-4">
    <p class="text-sm text-[var(--muted-foreground)]">{{ statusText ?? (dirty ? 'Unsaved changes' : 'No changes yet') }}</p>
    <div class="flex items-center gap-2">
      <AdminButton variant="ghost" @click="emit('cancel')">{{ cancelLabel }}</AdminButton>
      <AdminButton variant="primary" :disabled="submitting" @click="emit('submit')">
        {{ submitting ? submittingLabel : submitLabel }}
      </AdminButton>
    </div>
  </div>
</template>
