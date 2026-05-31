<template>
  <div class="flex w-full flex-wrap items-center justify-between gap-3">
    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
      <slot name="filters" />
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
