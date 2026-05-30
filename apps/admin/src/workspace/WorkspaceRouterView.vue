<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive :max="8">
      <component
        :is="Component"
        v-if="route.meta.keepAlive?.enabled"
        :key="route.meta.keepAlive.cacheKey ?? route.name ?? route.fullPath"
      />
    </KeepAlive>
    <component :is="Component" v-if="!route.meta.keepAlive?.enabled" :key="route.fullPath" />
  </RouterView>
</template>
