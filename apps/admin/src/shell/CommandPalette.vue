<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminScrollArea } from '@super-admin-org/ui'
import { useCommandPaletteItems, filterCommandItems, type CommandPaletteItem } from './use-command-palette-items'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { items } = useCommandPaletteItems()

const query = ref('')
const selectedIndex = ref(0)
const inputElement = ref<HTMLInputElement | null>(null)

const filtered = computed<CommandPaletteItem[]>(() => filterCommandItems(items.value, query.value))

type SectionEntry = { item: CommandPaletteItem; index: number }
type Section = { heading: string; entries: SectionEntry[] }

const sections = computed<Section[]>(() => {
  const navigation: SectionEntry[] = []
  const actions: SectionEntry[] = []

  filtered.value.forEach((item, index) => {
    if (item.group === 'navigation') {
      navigation.push({ item, index })
    } else {
      actions.push({ item, index })
    }
  })

  const result: Section[] = []
  if (navigation.length > 0) {
    result.push({ heading: t('shell.commandPalette.groups.navigation'), entries: navigation })
  }
  if (actions.length > 0) {
    result.push({ heading: t('shell.commandPalette.groups.actions'), entries: actions })
  }

  return result
})

function clampSelected(): void {
  const max = filtered.value.length - 1
  if (selectedIndex.value > max) {
    selectedIndex.value = Math.max(0, max)
  }
}

function reset(): void {
  query.value = ''
  selectedIndex.value = 0
}

function close(): void {
  emit('close')
}

function perform(item: CommandPaletteItem): void {
  item.perform()
  close()
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % filtered.value.length
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + filtered.value.length) % filtered.value.length
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    const item = filtered.value[selectedIndex.value]
    if (item) {
      perform(item)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      reset()
      nextTick(() => inputElement.value?.focus())
    }
  }
)

watch(filtered, clampSelected)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]">
      <button
        class="absolute inset-0 cursor-default bg-black/45 backdrop-blur-sm"
        :aria-label="t('shell.commandPalette.close')"
        type="button"
        @click="close"
      />
      <section
        class="relative flex w-full max-w-xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="t('shell.commandPalette.title')"
      >
        <header class="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <Search class="size-4 shrink-0 text-[var(--muted-foreground)]" />
          <input
            ref="inputElement"
            v-model="query"
            type="text"
            class="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            :placeholder="t('shell.commandPalette.placeholder')"
            @keydown="handleKeydown"
          />
          <button
            class="grid size-6 shrink-0 place-items-center rounded-[var(--radius-sm)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--foreground)]"
            :title="t('shell.commandPalette.close')"
            type="button"
            @click="close"
          >
            <X class="size-4" />
          </button>
        </header>

        <div v-if="filtered.length === 0" class="px-4 py-10 text-center text-sm text-[var(--muted-foreground)]">
          {{ t('shell.commandPalette.empty') }}
        </div>

        <AdminScrollArea v-else class="max-h-[50vh]" view-class="py-2">
          <template v-for="section in sections" :key="section.heading">
            <h3 class="px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              {{ section.heading }}
            </h3>
            <ul role="listbox" :aria-label="section.heading">
              <li v-for="entry in section.entries" :key="entry.item.id">
                <button
                  class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors"
                  :class="entry.index === selectedIndex
                    ? 'bg-[var(--surface-sunken)] text-[var(--foreground)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--surface-sunken)]'"
                  type="button"
                  role="option"
                  :aria-selected="entry.index === selectedIndex"
                  @click="perform(entry.item)"
                  @mouseenter="selectedIndex = entry.index"
                >
                  <span class="min-w-0 flex-1 truncate">{{ entry.item.label }}</span>
                  <span v-if="entry.item.hint" class="shrink-0 text-xs text-[var(--muted-foreground)]">
                    {{ entry.item.hint }}
                  </span>
                </button>
              </li>
            </ul>
          </template>
        </AdminScrollArea>
      </section>
    </div>
  </Teleport>
</template>
