<script setup lang="ts">
import { ArrowRight, KeyRound } from 'lucide-vue-next'
import { computed, reactive, shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AdminAlert, AdminButton, AdminField, AdminTextInput, AdminValidationSummary } from '@super-admin/ui'
import { loginReferenceSession } from '@/api/reference/auth-reference.api'
import { resolvePostLoginPath } from '@/router/auth-guard'
import { useAuthSessionStore } from '@/stores/auth-session.store'
import { createTemplateAuthSession, shouldUseReferenceAuth } from './auth-session'
import AuthLayout from './components/AuthLayout.vue'
import { validateLoginInput } from './auth.validation'
import type { AuthFieldErrors, LoginInput } from './auth.types'

const router = useRouter()
const route = useRoute()
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
  fieldErrors.value = validateLoginInput(form)
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
    submitError.value = error instanceof Error ? error.message : 'Unable to sign in.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthLayout
    eyebrow="Reference Auth"
    title="Enter the control surface"
    description="A profile-aware sign-in portal for validating the optional Hono backend without making auth mandatory for UI-only adopters."
  >
    <div class="grid gap-5">
      <div>
        <div class="inline-flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--primary)] shadow-[var(--glow)]">
          <KeyRound class="size-5" />
        </div>
        <h2 class="mt-4 [font-family:var(--font-display)] text-3xl leading-tight">Sign in</h2>
        <p class="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          Use the template account to enter the frontend-first workspace, or enable the optional reference API to validate backend-backed sessions.
        </p>
      </div>

      <AdminAlert
        v-if="submitError"
        tone="danger"
        title="Sign-in failed"
        :description="submitError"
      />

      <AdminValidationSummary :errors="validationMessages" />

      <form class="grid gap-4" @submit.prevent="submitLogin">
        <AdminField label="Email" for="auth-email" required :error="fieldErrors.email">
          <AdminTextInput id="auth-email" v-model="form.email" type="email" :invalid="Boolean(fieldErrors.email)" autocomplete="email" />
        </AdminField>

        <AdminField label="Password" for="auth-password" required :error="fieldErrors.password">
          <AdminTextInput id="auth-password" v-model="form.password" type="password" :invalid="Boolean(fieldErrors.password)" autocomplete="current-password" />
        </AdminField>

        <AdminButton type="submit" variant="primary" :disabled="isSubmitting" class="w-full">
          <span>{{ isSubmitting ? 'Signing in' : 'Sign in' }}</span>
          <ArrowRight class="size-4" />
        </AdminButton>
      </form>

      <div class="grid gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-sunken)] p-3 text-xs text-[var(--muted-foreground)]">
        <div class="flex items-center justify-between gap-3">
          <span>Reference email</span>
          <span class="text-[var(--foreground)]">mira.owner@example.com</span>
        </div>
        <div class="flex items-center justify-between gap-3">
          <span>Reference password</span>
          <span class="text-[var(--foreground)]">reference-admin</span>
        </div>
      </div>

      <p class="text-center text-sm text-[var(--muted-foreground)]">
        Need an onboarding example?
        <RouterLink class="text-[var(--primary)] underline-offset-4 hover:underline" to="/auth/register">Create account</RouterLink>
      </p>
    </div>
  </AuthLayout>
</template>
