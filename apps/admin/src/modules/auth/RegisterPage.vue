<script setup lang="ts">
import { Building2, Send } from '@lucide/vue'
import { computed, reactive, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminButton, AdminField, AdminTextInput, AdminValidationSummary } from '@super-admin-org/ui'
import AuthLayout from './components/AuthLayout.vue'
import { validateRegisterInput } from './auth.validation'
import type { AuthFieldErrors, RegisterInput } from './auth.types'

const form = reactive<RegisterInput>({
  email: '',
  name: '',
  organization: '',
  password: ''
})
const { t } = useI18n()
const fieldErrors = shallowRef<AuthFieldErrors<keyof RegisterInput>>({})
const notice = shallowRef('')

const validationMessages = computed(() => Object.values(fieldErrors.value).filter((message) => message !== undefined))

function submitRegister(): void {
  fieldErrors.value = validateRegisterInput(form, t)
  notice.value = ''

  if (Object.keys(fieldErrors.value).length > 0) {
    return
  }

  notice.value = t('auth.register.noticeDescription')
}
</script>

<template>
  <AuthLayout
    :eyebrow="t('auth.register.eyebrow')"
    :title="t('auth.register.title')"
    :description="t('auth.register.description')"
  >
    <div class="grid gap-5">
      <div>
        <div class="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--primary)] shadow-[var(--glow)]">
          <Building2 class="size-5" />
        </div>
        <h2 class="mt-4 [font-family:var(--font-display)] text-3xl leading-tight">{{ t('auth.register.heading') }}</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {{ t('auth.register.intro') }}
        </p>
      </div>

      <AdminAlert
        v-if="notice"
        tone="warning"
        :title="t('auth.register.noticeTitle')"
        :description="notice"
      />

      <AdminValidationSummary :errors="validationMessages" />

      <form class="grid gap-4" @submit.prevent="submitRegister">
        <AdminField :label="t('auth.register.name')" for="register-name" required :required-label="t('validation.requiredLabel')" :error="fieldErrors.name">
          <AdminTextInput id="register-name" v-model="form.name" autocomplete="name" :invalid="Boolean(fieldErrors.name)" />
        </AdminField>

        <AdminField :label="t('auth.register.workEmail')" for="register-email" required :required-label="t('validation.requiredLabel')" :error="fieldErrors.email">
          <AdminTextInput id="register-email" v-model="form.email" type="email" autocomplete="email" :invalid="Boolean(fieldErrors.email)" />
        </AdminField>

        <AdminField :label="t('auth.register.workspace')" for="register-organization" required :required-label="t('validation.requiredLabel')" :error="fieldErrors.organization">
          <AdminTextInput id="register-organization" v-model="form.organization" :invalid="Boolean(fieldErrors.organization)" />
        </AdminField>

        <AdminField :label="t('auth.register.password')" for="register-password" required :required-label="t('validation.requiredLabel')" :error="fieldErrors.password" :help="t('auth.register.passwordHelp')">
          <AdminTextInput id="register-password" v-model="form.password" type="password" autocomplete="new-password" :invalid="Boolean(fieldErrors.password)" />
        </AdminField>

        <AdminButton type="submit" variant="primary" class="w-full">
          <span>{{ t('auth.register.submit') }}</span>
          <Send class="size-4" />
        </AdminButton>
      </form>

      <p class="text-center text-sm text-[var(--muted-foreground)]">
        {{ t('auth.register.signInQuestion') }}
        <RouterLink class="text-[var(--primary)] underline-offset-4 hover:underline" to="/auth/login">{{ t('auth.register.signIn') }}</RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
