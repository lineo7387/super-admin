<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { EmptyState } from '@super-admin-org/ui'

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto grid min-h-[50vh] w-full max-w-3xl place-items-center p-4">
    <EmptyState :title="t('workspace.empty.title')" :description="t('workspace.empty.description')" />
  </section>
</template>
