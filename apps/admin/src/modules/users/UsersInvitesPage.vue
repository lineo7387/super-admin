<script setup lang="ts">
import { MailPlus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { AdminButton, AdminCard, EmptyState } from '@super-admin/ui'

const { t } = useI18n()
const invites = [
  { email: 'finance.owner@example.com', role: 'Owner', expires: '2 days' },
  { email: 'ops.audit@example.com', role: 'Auditor', expires: '5 days' }
]
</script>

<template>
  <AdminCard>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="[font-family:var(--font-display)] text-2xl text-[var(--foreground)]">{{ t('users.secondary.invitesTitle') }}</h1>
        <p class="mt-1 text-sm text-[var(--muted-foreground)]">{{ t('users.secondary.invitesDescription') }}</p>
      </div>
      <AdminButton variant="primary" size="sm">
        <MailPlus class="size-4" />
        {{ t('users.secondary.inviteAction') }}
      </AdminButton>
    </div>
    <div class="mt-5 grid gap-3">
      <div
        v-for="invite in invites"
        :key="invite.email"
        class="grid gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] p-3 md:grid-cols-[1fr_auto_auto]"
      >
        <div class="font-medium text-[var(--foreground)]">{{ invite.email }}</div>
        <div class="text-sm text-[var(--muted-foreground)]">{{ invite.role }}</div>
        <div class="text-sm text-[var(--muted-foreground)]">{{ t('users.secondary.expiresIn', { time: invite.expires }) }}</div>
      </div>
    </div>
    <EmptyState
      v-if="invites.length === 0"
      :title="t('users.secondary.noPendingInvites')"
      :description="t('users.secondary.inviteEmptyDescription')"
      class="mt-5"
    />
  </AdminCard>
</template>
