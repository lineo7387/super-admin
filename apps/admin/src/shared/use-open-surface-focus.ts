import { nextTick, watch, type WatchSource } from 'vue'

type FocusTarget = {
  readonly value: HTMLElement | null
}

export function useOpenSurfaceFocus(open: WatchSource<boolean>, surface: FocusTarget): void {
  watch(
    open,
    async (isOpen) => {
      if (!isOpen) {
        return
      }

      await nextTick()
      surface.value?.focus()
    },
    { flush: 'post', immediate: true }
  )
}
