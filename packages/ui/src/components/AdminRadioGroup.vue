<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  name: string
  options: Array<{
    value: string
    label: string
    description?: string
    disabled?: boolean
  }>
}>()
</script>

<template>
  <div class="grid gap-2" role="radiogroup">
    <label
      v-for="option in options"
      :key="option.value"
      class="relative flex min-w-0 items-start gap-3 rounded-[var(--radius-md)] border bg-[var(--surface-sunken)] p-3 text-sm text-[var(--foreground)] transition"
      :class="[
        model === option.value ? 'border-[var(--primary)] shadow-[var(--glow)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]',
        option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      ]"
    >
      <input
        v-model="model"
        class="peer sr-only"
        type="radio"
        :name="name"
        :value="option.value"
        :disabled="option.disabled"
      />
      <span
        class="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border transition peer-focus-visible:shadow-[var(--focus-ring)]"
        :class="model === option.value ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border-strong)] bg-[var(--surface)]'"
        aria-hidden="true"
      >
        <span v-if="model === option.value" class="size-1.5 rounded-full bg-[var(--primary-foreground)]" />
      </span>
      <span class="min-w-0">
        <span class="block font-medium">{{ option.label }}</span>
        <span v-if="option.description" class="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">{{ option.description }}</span>
      </span>
    </label>
  </div>
</template>
