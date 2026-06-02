<script setup lang="ts">
import { Building2, Send } from 'lucide-vue-next'
import { computed, reactive, shallowRef } from 'vue'
import { AdminAlert, AdminButton, AdminField, AdminTextInput, AdminValidationSummary } from '@super-admin/ui'
import AuthLayout from './components/AuthLayout.vue'
import { validateRegisterInput } from './auth.validation'
import type { AuthFieldErrors, RegisterInput } from './auth.types'

const form = reactive<RegisterInput>({
  email: '',
  name: '',
  organization: '',
  password: ''
})
const fieldErrors = shallowRef<AuthFieldErrors<keyof RegisterInput>>({})
const notice = shallowRef('')

const validationMessages = computed(() => Object.values(fieldErrors.value).filter((message) => message !== undefined))

function submitRegister(): void {
  fieldErrors.value = validateRegisterInput(form)
  notice.value = ''

  if (Object.keys(fieldErrors.value).length > 0) {
    return
  }

  notice.value = 'Reference backend registration is not configured yet. Replace this adapter boundary with your organization onboarding flow.'
}
</script>

<template>
  <AuthLayout
    eyebrow="Template Onboarding"
    title="Shape your access path"
    description="A complete registration surface for open-source adopters to replace with their own invitation, organization, or SSO onboarding flow."
  >
    <div class="grid gap-5">
      <div>
        <div class="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--primary)] shadow-[var(--glow)]">
          <Building2 class="size-5" />
        </div>
        <h2 class="mt-4 [font-family:var(--font-display)] text-3xl leading-tight">Create account</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          This page is a high-fidelity template example. It does not create backend users yet.
        </p>
      </div>

      <AdminAlert
        v-if="notice"
        tone="warning"
        title="Registration adapter not configured"
        :description="notice"
      />

      <AdminValidationSummary :errors="validationMessages" />

      <form class="grid gap-4" @submit.prevent="submitRegister">
        <AdminField label="Name" for="register-name" required :error="fieldErrors.name">
          <AdminTextInput id="register-name" v-model="form.name" autocomplete="name" :invalid="Boolean(fieldErrors.name)" />
        </AdminField>

        <AdminField label="Work email" for="register-email" required :error="fieldErrors.email">
          <AdminTextInput id="register-email" v-model="form.email" type="email" autocomplete="email" :invalid="Boolean(fieldErrors.email)" />
        </AdminField>

        <AdminField label="Workspace" for="register-organization" required :error="fieldErrors.organization">
          <AdminTextInput id="register-organization" v-model="form.organization" :invalid="Boolean(fieldErrors.organization)" />
        </AdminField>

        <AdminField label="Password" for="register-password" required :error="fieldErrors.password" help="Use at least 8 characters.">
          <AdminTextInput id="register-password" v-model="form.password" type="password" autocomplete="new-password" :invalid="Boolean(fieldErrors.password)" />
        </AdminField>

        <AdminButton type="submit" variant="primary" class="w-full">
          <span>Review onboarding path</span>
          <Send class="size-4" />
        </AdminButton>
      </form>

      <p class="text-center text-sm text-[var(--muted-foreground)]">
        Already have reference access?
        <RouterLink class="text-[var(--primary)] underline-offset-4 hover:underline" to="/auth/login">Sign in</RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
