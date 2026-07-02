<script setup lang="ts">
import { ChevronDown, Check } from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, shallowRef, useAttrs, useTemplateRef, watch } from 'vue'
import { cn } from '../lib/cn'

defineOptions({
  inheritAttrs: false
})

export type AdminSelectOption = {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

const model = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    id?: string
    name?: string
    invalid?: boolean
    fluid?: boolean
    disabled?: boolean
    placeholder?: string
    options: AdminSelectOption[]
  }>(),
  {
    id: undefined,
    name: undefined,
    invalid: false,
    fluid: true,
    disabled: false,
    placeholder: 'Select an option'
  }
)

const emit = defineEmits<{
  change: [value: string]
}>()

const attrs = useAttrs()
const isOpen = shallowRef(false)
const highlightedValue = shallowRef<string>('')
const overlayStyle = shallowRef<Record<string, string>>({})
const trigger = useTemplateRef<HTMLElement>('trigger')
const listbox = useTemplateRef<HTMLElement>('listbox')

const rootClasses = computed(() =>
  cn('relative inline-flex h-9 min-w-0 items-center', props.fluid ? 'w-full' : '', attrs.class as string | string[] | Record<string, boolean | undefined>)
)

const buttonAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const selectedOption = computed(() => props.options.find((option) => option.value === model.value))
const enabledOptions = computed(() => props.options.filter((option) => !option.disabled))
const listboxId = computed(() => (props.id ? `${props.id}-listbox` : undefined))
const activeOption = computed(() => props.options.find((option) => option.value === highlightedValue.value) ?? selectedOption.value)

function updateOverlayPosition(): void {
  const element = trigger.value
  if (!element) {
    return
  }

  const rect = element.getBoundingClientRect()
  overlayStyle.value = {
    left: `${rect.left}px`,
    top: `${rect.bottom + 6}px`,
    width: `${rect.width}px`
  }
}

function openMenu(): void {
  if (props.disabled || enabledOptions.value.length === 0) {
    return
  }

  highlightedValue.value = selectedOption.value && !selectedOption.value.disabled ? selectedOption.value.value : (enabledOptions.value[0]?.value ?? '')
  isOpen.value = true
  void nextTick(updateOverlayPosition)
}

function closeMenu(): void {
  isOpen.value = false
}

function toggleMenu(): void {
  if (isOpen.value) {
    closeMenu()
    return
  }
  openMenu()
}

function selectOption(option: AdminSelectOption): void {
  if (option.disabled) {
    return
  }
  model.value = option.value
  emit('change', option.value)
  closeMenu()
}

function moveHighlight(direction: 1 | -1): void {
  const options = enabledOptions.value
  if (options.length === 0) {
    return
  }

  const currentIndex = Math.max(
    0,
    options.findIndex((option) => option.value === highlightedValue.value)
  )
  const nextIndex = (currentIndex + direction + options.length) % options.length
  highlightedValue.value = options[nextIndex]?.value ?? options[0]?.value ?? ''
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!isOpen.value) {
      openMenu()
      return
    }
    moveHighlight(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) {
      openMenu()
      return
    }
    moveHighlight(-1)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!isOpen.value) {
      openMenu()
      return
    }
    if (activeOption.value) {
      selectOption(activeOption.value)
    }
    return
  }

  if (event.key === 'Escape') {
    closeMenu()
  }
}

function handleOutsidePointer(event: PointerEvent): void {
  const target = event.target
  if (!(target instanceof Node)) {
    closeMenu()
    return
  }

  if (trigger.value?.contains(target) || listbox.value?.contains(target)) {
    return
  }

  closeMenu()
}

function bindWindowListeners(open: boolean): void {
  if (open) {
    window.addEventListener('pointerdown', handleOutsidePointer)
    window.addEventListener('resize', updateOverlayPosition)
    window.addEventListener('scroll', updateOverlayPosition, true)
    return
  }

  window.removeEventListener('pointerdown', handleOutsidePointer)
  window.removeEventListener('resize', updateOverlayPosition)
  window.removeEventListener('scroll', updateOverlayPosition, true)
}

watch(isOpen, bindWindowListeners)

onBeforeUnmount(() => {
  bindWindowListeners(false)
})
</script>

<template>
  <span :class="rootClasses">
    <button
      :id="id"
      ref="trigger"
      type="button"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-invalid="invalid"
      :disabled="disabled"
      class="inline-flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-[var(--radius-md)] border bg-[var(--surface-sunken)] px-3 text-left text-sm text-[var(--foreground)] outline-none transition focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50"
      :class="invalid ? 'border-[var(--danger)]' : isOpen ? 'border-[var(--primary)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'"
      v-bind="buttonAttrs"
      @click.stop="toggleMenu"
      @keydown="handleKeydown"
    >
      <span class="min-w-0 truncate" :class="selectedOption ? '' : 'text-[var(--muted-foreground)]'">
        {{ selectedOption?.label ?? placeholder }}
      </span>
      <span
        class="grid size-5 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]"
      >
        <ChevronDown class="size-3.5 transition" :class="isOpen ? 'rotate-180' : ''" aria-hidden="true" />
      </span>
    </button>
    <input v-if="name" type="hidden" :name="name" :value="model" />
  </span>

  <Teleport to="body">
    <div
      v-if="isOpen"
      :id="listboxId"
      ref="listbox"
      class="fixed z-50 max-h-64 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--surface)] p-1 text-sm text-[var(--foreground)] shadow-[var(--panel-shadow)]"
      :style="overlayStyle"
      role="listbox"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="option"
        :aria-selected="model === option.value"
        :disabled="option.disabled"
        class="flex w-full min-w-0 items-start justify-between gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-left outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
        :class="[
          option.value === highlightedValue ? 'bg-[var(--surface-raised)]' : '',
          model === option.value ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]',
          !option.disabled ? 'hover:bg-[var(--surface-raised)] focus-visible:shadow-[var(--focus-ring)]' : ''
        ]"
        @mouseenter="highlightedValue = option.value"
        @click="selectOption(option)"
      >
        <span class="min-w-0">
          <span class="block truncate font-medium">{{ option.label }}</span>
          <span v-if="option.description" class="mt-0.5 block text-xs leading-5 text-[var(--muted-foreground)]">{{ option.description }}</span>
        </span>
        <Check v-if="model === option.value" class="mt-0.5 size-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
      </button>
    </div>
  </Teleport>
</template>
