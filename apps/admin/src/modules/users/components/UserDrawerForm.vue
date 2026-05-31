<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { AdminDrawer, AdminField, AdminFormFooter, AdminSelect, AdminTextInput, AdminTextarea } from '@super-admin/ui'
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

const title = computed(() => (props.user ? `Edit ${props.user.name}` : 'Create user'))
const description = computed(() => (props.user ? 'Update this mock user profile.' : 'Create a mock user profile for the template.'))
const isDirty = computed(() => JSON.stringify(form) !== JSON.stringify(initial))

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
  const nextErrors = validateUserInput(form)
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
  <AdminDrawer :open="open" :title="title" :description="description" @close="emit('close')">
    <form class="grid gap-4" @submit.prevent="submit">
      <AdminField label="Name" for="user-name" :error="errors.name">
        <AdminTextInput id="user-name" v-model="form.name" placeholder="Mira Chen" :invalid="Boolean(errors.name)" />
      </AdminField>
      <AdminField label="Email" for="user-email" :error="errors.email">
        <AdminTextInput id="user-email" v-model="form.email" type="email" placeholder="mira@example.com" :invalid="Boolean(errors.email)" />
      </AdminField>
      <div class="grid gap-4 sm:grid-cols-2">
        <AdminField label="Role" for="user-role" :error="errors.role">
          <AdminSelect id="user-role" v-model="form.role" :invalid="Boolean(errors.role)">
            <option value="">Select role</option>
            <option value="Owner">Owner</option>
            <option value="Operator">Operator</option>
            <option value="Auditor">Auditor</option>
            <option value="Analyst">Analyst</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="Status" for="user-status" :error="errors.status">
          <AdminSelect id="user-status" v-model="form.status" :invalid="Boolean(errors.status)">
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="review">Review</option>
            <option value="paused">Paused</option>
          </AdminSelect>
        </AdminField>
      </div>
      <AdminField label="Region" for="user-region" help="Keep this module-owned; your backend can provide the allowed regions.">
        <AdminTextInput id="user-region" v-model="form.region" placeholder="Singapore" />
      </AdminField>
      <AdminField label="Notes" for="user-notes" help="Optional operational context.">
        <AdminTextarea id="user-notes" v-model="form.notes" placeholder="Add review notes or handoff details." />
      </AdminField>
    </form>
    <template #footer>
      <AdminFormFooter :dirty="isDirty" @cancel="emit('close')" @submit="submit" />
    </template>
  </AdminDrawer>
</template>
