<script setup lang="ts">
import { ArrowRight, KeyRound } from '@lucide/vue'
import { computed, reactive, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AdminAlert, AdminButton, AdminField, AdminTextInput, AdminValidationSummary } from '@super-admin-org/ui'
import { loginReferenceSession } from '@/api/reference/auth-reference.api'
import { resolvePostLoginPath } from '@/router/auth-guard'
import { useAuthSessionStore } from '@/stores/auth-session.store'
import { createTemplateAuthSession, shouldUseReferenceAuth } from './auth-session'
import AuthLayout from './components/AuthLayout.vue'
import { validateLoginInput } from './auth.validation'
import type { AuthFieldErrors, LoginInput } from './auth.types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const session = useAuthSessionStore()
const form = reactive<LoginInput>({
  email: 'mira.owner@example.com',
  password: 'reference-admin'
})
const fieldErrors = shallowRef<AuthFieldErrors<keyof LoginInput>>({})
const submitError = shallowRef('')
const isSubmitting = shallowRef(false)

const validationMessages = computed(() => Object.values(fieldErrors.value).filter((message) => message !== undefined))
const apiBaseUrl = computed(() => import.meta.env.VITE_SUPER_ADMIN_API_BASE_URL?.trim() || 'http://localhost:8787')
const isReferenceAuth = computed(() => shouldUseReferenceAuth())

async function submitLogin(): Promise<void> {
  fieldErrors.value = validateLoginInput(form, t)
  submitError.value = ''

  if (Object.keys(fieldErrors.value).length > 0) {
    return
  }

  isSubmitting.value = true

  try {
    const nextSession = isReferenceAuth.value
      ? await loginReferenceSession(
          {
            email: form.email,
            password: form.password
          },
          {
            baseUrl: apiBaseUrl.value
          }
        )
      : createTemplateAuthSession()

    session.setReferenceSession(nextSession)
    await router.push(resolvePostLoginPath(route.query.redirect))
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : t('auth.login.unableToSignIn')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthLayout
    :eyebrow="t('auth.login.eyebrow')"
    :title="t('auth.login.title')"
    :description="t('auth.login.description')"
  >
    <div class="grid gap-5">
      <div>
        <div class="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--primary)] shadow-[var(--glow)]">
          <KeyRound class="size-5" />
        </div>
        <h2 class="mt-4 [font-family:var(--font-display)] text-3xl leading-tight">{{ t('auth.login.heading') }}</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {{ t('auth.login.intro') }}
        </p>
      </div>

      <AdminAlert
        v-if="submitError"
        tone="danger"
        :title="t('auth.login.failedTitle')"
        :description="submitError"
      />

      <AdminValidationSummary :title="t('common.primitives.validationTitle')" :errors="validationMessages" />

      <form class="grid gap-4" @submit.prevent="submitLogin">
        <AdminField :label="t('auth.login.email')" for="auth-email" required :required-label="t('validation.requiredLabel')" :error="fieldErrors.email">
          <AdminTextInput id="auth-email" v-model="form.email" type="email" :invalid="Boolean(fieldErrors.email)" autocomplete="email" />
        </AdminField>

        <AdminField :label="t('auth.login.password')" for="auth-password" required :required-label="t('validation.requiredLabel')" :error="fieldErrors.password">
          <AdminTextInput id="auth-password" v-model="form.password" type="password" :invalid="Boolean(fieldErrors.password)" autocomplete="current-password" />
        </AdminField>

        <AdminButton type="submit" variant="primary" :disabled="isSubmitting" class="w-full">
          <span>{{ isSubmitting ? t('auth.login.submitting') : t('auth.login.submit') }}</span>
          <ArrowRight class="size-4" />
        </AdminButton>
      </form>

      <div class="grid gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3 text-xs text-[var(--muted-foreground)]">
        <div class="flex items-center justify-between gap-3">
          <span>{{ t('auth.login.referenceEmail') }}</span>
          <span class="text-[var(--foreground)]">mira.owner@example.com</span>
        </div>
        <div class="flex items-center justify-between gap-3">
          <span>{{ t('auth.login.referencePassword') }}</span>
          <span class="text-[var(--foreground)]">reference-admin</span>
        </div>
      </div>

      <p class="text-center text-sm text-[var(--muted-foreground)]">
        {{ t('auth.login.onboardingQuestion') }}
        <RouterLink class="text-[var(--primary)] underline-offset-4 hover:underline" to="/auth/register">{{ t('auth.login.createAccount') }}</RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
