<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { RouterView } from 'vue-router'
import { useWorkspaceTabsStore } from './workspace-tabs.store'

const tabs = useWorkspaceTabsStore()

function routeViewKey(route: RouteLocationNormalizedLoaded): string {
  const baseKey = route.meta.keepAlive?.enabled
    ? route.meta.keepAlive.cacheKey ?? String(route.name ?? route.fullPath)
    : route.fullPath
  return `${baseKey}:${tabs.getRefreshKey(route.fullPath)}`
}
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive :max="8">
      <component
        :is="Component"
        v-if="route.meta.keepAlive?.enabled"
        :key="routeViewKey(route)"
      />
    </KeepAlive>
    <component :is="Component" v-if="!route.meta.keepAlive?.enabled" :key="routeViewKey(route)" />
  </RouterView>
</template>
