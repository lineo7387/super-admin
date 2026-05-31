<script setup lang="ts">
import { Check, Minus } from 'lucide-vue-next'
import { onMounted, useTemplateRef, watch } from 'vue'

const model = defineModel<boolean>({ required: true })

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    description?: string
    ariaLabel?: string
    indeterminate?: boolean
    disabled?: boolean
  }>(),
  {
    id: undefined,
    label: undefined,
    description: undefined,
    ariaLabel: undefined,
    indeterminate: false,
    disabled: false
  }
)

const input = useTemplateRef<HTMLInputElement>('input')

function syncIndeterminate(): void {
  if (input.value) {
    input.value.indeterminate = props.indeterminate
  }
}

onMounted(syncIndeterminate)

watch(() => props.indeterminate, syncIndeterminate)
</script>

<template>
  <label class="inline-flex min-w-0 items-start gap-2 text-sm text-[var(--foreground)]" :class="disabled ? 'opacity-50' : ''">
    <input
      ref="input"
      v-model="model"
      :id="id"
      type="checkbox"
      :disabled="disabled"
      :aria-checked="indeterminate ? 'mixed' : model"
      :aria-label="ariaLabel"
      class="peer sr-only"
    />
    <span
      class="mt-0.5 grid size-4 shrink-0 place-items-center rounded-[var(--radius-xs)] border text-[var(--primary-foreground)] transition peer-focus-visible:shadow-[var(--focus-ring)]"
      :class="model || indeterminate ? 'border-[var(--primary)] bg-[var(--primary)] shadow-[var(--glow)]' : 'border-[var(--border-strong)] bg-[var(--surface-sunken)]'"
      aria-hidden="true"
    >
      <Minus v-if="indeterminate" class="size-3" />
      <Check v-else-if="model" class="size-3" />
    </span>
    <span v-if="label || description" class="min-w-0">
      <span v-if="label" class="block font-medium">{{ label }}</span>
      <span v-if="description" class="block text-xs leading-5 text-[var(--muted-foreground)]">{{ description }}</span>
    </span>
  </label>
</template>
