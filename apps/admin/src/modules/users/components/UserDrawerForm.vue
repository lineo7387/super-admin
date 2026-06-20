<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AdminDrawer, AdminField, AdminFormFooter, AdminSelect, AdminTextInput, AdminTextarea } from '@super-admin-org/ui'
import type { UserFormErrors, UserFormInput, UserRecord } from '../users.types'
import { validateUserInput } from '../users.validation'

const props = withDefaults(
  defineProps<{
    open: boolean
    user?: UserRecord
  }>(),
  {
    user: undefined
  }
)

const emit = defineEmits<{
  close: []
  saved: [input: UserFormInput]
}>()
const { t } = useI18n()

const form = reactive<UserFormInput>({
  name: '',
  email: '',
  role: '',
  status: '',
  region: '',
  notes: ''
})
const errors = reactive<UserFormErrors>({})
const initial = reactive<UserFormInput>({
  name: '',
  email: '',
  role: '',
  status: '',
  region: '',
  notes: ''
})

const title = computed(() => (props.user ? t('users.form.editTitle', { name: props.user.name }) : t('users.form.createTitle')))
const description = computed(() => (props.user ? t('users.form.editDescription') : t('users.form.createDescription')))
const isDirty = computed(() => JSON.stringify(form) !== JSON.stringify(initial))

const roleOptions = computed(() => [
  { value: '', label: t('users.form.selectRole') },
  { value: 'Owner', label: t('users.roles.owner') },
  { value: 'Operator', label: t('users.roles.operator') },
  { value: 'Auditor', label: t('users.roles.auditor') },
  { value: 'Analyst', label: t('users.roles.analyst') }
])

const statusOptions = computed(() => [
  { value: '', label: t('users.form.selectStatus') },
  { value: 'active', label: t('users.statuses.active') },
  { value: 'review', label: t('users.statuses.review') },
  { value: 'paused', label: t('users.statuses.paused') }
])

function toInput(user?: UserRecord): UserFormInput {
  return {
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: user?.role ?? '',
    status: user?.status ?? '',
    region: user?.region ?? '',
    notes: user?.notes ?? ''
  }
}

function assignInput(target: UserFormInput, input: UserFormInput): void {
  target.name = input.name
  target.email = input.email
  target.role = input.role
  target.status = input.status
  target.region = input.region
  target.notes = input.notes
}

function assignErrors(nextErrors: UserFormErrors): void {
  for (const key of Object.keys(errors) as Array<keyof UserFormErrors>) {
    delete errors[key]
  }
  for (const key of Object.keys(nextErrors) as Array<keyof UserFormErrors>) {
    errors[key] = nextErrors[key]
  }
}

function resetForm(): void {
  const nextInput = toInput(props.user)
  assignInput(form, nextInput)
  assignInput(initial, nextInput)
  assignErrors({})
}

function submit(): void {
  const nextErrors = validateUserInput(form, t)
  assignErrors(nextErrors)
  if (Object.keys(nextErrors).length > 0) {
    return
  }
  assignInput(initial, { ...form })
  emit('saved', { ...form })
}

watch(
  () => [props.open, props.user] as const,
  () => {
    if (props.open) {
      resetForm()
    }
  },
  { immediate: true }
)
</script>

<template>
  <AdminDrawer
    :open="open"
    :title="title"
    :description="description"
    :close-label="t('common.primitives.close')"
    :overlay-close-label="t('common.primitives.closeDrawer')"
    @close="emit('close')"
  >
    <form class="grid gap-4" @submit.prevent="submit">
      <AdminField :label="t('users.form.name')" for="user-name" :error="errors.name">
        <AdminTextInput id="user-name" v-model="form.name" placeholder="Mira Chen" :invalid="Boolean(errors.name)" />
      </AdminField>
      <AdminField :label="t('users.form.email')" for="user-email" :error="errors.email">
        <AdminTextInput id="user-email" v-model="form.email" type="email" placeholder="mira@example.com" :invalid="Boolean(errors.email)" />
      </AdminField>
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminField :label="t('users.form.role')" for="user-role" :error="errors.role">
          <AdminSelect id="user-role" v-model="form.role" :invalid="Boolean(errors.role)" :options="roleOptions" />
        </AdminField>
        <AdminField :label="t('users.form.status')" for="user-status" :error="errors.status">
          <AdminSelect id="user-status" v-model="form.status" :invalid="Boolean(errors.status)" :options="statusOptions" />
        </AdminField>
      </div>
      <AdminField :label="t('users.form.region')" for="user-region" :help="t('users.form.regionHelp')">
        <AdminTextInput id="user-region" v-model="form.region" placeholder="Singapore" />
      </AdminField>
      <AdminField :label="t('users.form.notes')" for="user-notes" :help="t('users.form.notesHelp')">
        <AdminTextarea id="user-notes" v-model="form.notes" :placeholder="t('users.form.notesPlaceholder')" />
      </AdminField>
    </form>
    <template #footer>
      <AdminFormFooter
        :dirty="isDirty"
        :cancel-label="t('common.primitives.cancel')"
        :submit-label="t('common.primitives.save')"
        :submitting-label="t('common.primitives.saving')"
        :dirty-label="t('common.primitives.unsavedChanges')"
        :clean-label="t('common.primitives.noChanges')"
        @cancel="emit('close')"
        @submit="submit"
      />
    </template>
  </AdminDrawer>
</template>
