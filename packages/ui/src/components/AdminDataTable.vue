<script setup lang="ts">
import EmptyState from './EmptyState.vue'

const props = withDefaults(
  defineProps<{
    state?: 'idle' | 'loading' | 'empty' | 'error'
    columnCount: number
    density?: 'compact' | 'comfortable'
    emptyTitle?: string
    emptyDescription?: string
    errorTitle?: string
    errorDescription?: string
  }>(),
  {
    state: 'idle',
    density: 'comfortable',
    emptyTitle: 'No records found',
    emptyDescription: 'Adjust the filters or create a new record.',
    errorTitle: 'Unable to load records',
    errorDescription: 'Try again or check the mock service replacement point.'
  }
)
</script>

<template>
  <div class="overflow-auto">
    <table class="w-full min-w-[760px] border-collapse text-left text-sm">
      <thead class="bg-[var(--surface-raised)] text-xs uppercase text-[var(--muted-foreground)]">
        <slot name="head" />
      </thead>
      <tbody>
        <template v-if="props.state === 'loading'">
          <tr v-for="index in 5" :key="index" class="border-t border-[var(--border)]">
            <td :colspan="props.columnCount" class="px-3" :class="props.density === 'compact' ? 'py-2' : 'py-3'">
              <div class="h-4 w-full max-w-xl animate-pulse rounded-full bg-[var(--surface-raised)]" />
            </td>
          </tr>
        </template>
        <tr v-else-if="props.state === 'empty'">
          <td :colspan="props.columnCount" class="p-4">
            <EmptyState :title="props.emptyTitle" :description="props.emptyDescription" />
          </td>
        </tr>
        <tr v-else-if="props.state === 'error'">
          <td :colspan="props.columnCount" class="p-4">
            <EmptyState :title="props.errorTitle" :description="props.errorDescription">
              <slot name="error-action" />
            </EmptyState>
          </td>
        </tr>
        <slot v-else />
      </tbody>
    </table>
  </div>
</template>
