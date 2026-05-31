<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { cn } from '../lib/cn'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'icon'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    disabled: false,
    type: 'button'
  }
)

const classes = computed(() =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border font-medium outline-none transition',
    'focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-45',
    props.size === 'sm' && 'h-8 rounded-[var(--radius-sm)] px-3 text-xs',
    props.size === 'md' && 'h-9 rounded-[var(--radius-md)] px-4 text-sm',
    props.size === 'icon' && 'size-9 rounded-[var(--radius-md)] p-0',
    props.variant === 'primary' &&
      'border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--glow)]',
    props.variant === 'secondary' &&
      'border-[var(--border)] bg-[var(--surface-raised)] text-[var(--foreground)] hover:border-[var(--border-strong)]',
    props.variant === 'ghost' &&
      'border-transparent bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]',
    props.variant === 'danger' &&
      'bg-transparent hover:bg-[var(--surface-raised)]'
  )
)

const style = computed<CSSProperties | undefined>(() =>
  props.variant === 'danger'
    ? {
        borderColor: 'var(--danger)',
        color: 'var(--danger)'
      }
    : undefined
)
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="classes" :style="style">
    <slot />
  </button>
</template>
