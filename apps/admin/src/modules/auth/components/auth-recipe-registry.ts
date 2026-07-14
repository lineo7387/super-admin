import type { Component } from 'vue'
import type { DesignProfileId } from '@super-admin-org/core'
import type { ExactRequiredComponentContract, VueComponentContractCandidate } from '@/shared/vue-component-contract'
import type { AuthRecipeProps } from './recipes/auth-recipe'

export type AuthRecipeSlots = {
  default(): unknown
}

export type AuthRecipeComponentInstance = {
  $props: Readonly<AuthRecipeProps>
  $slots: Readonly<AuthRecipeSlots>
}

export type AuthRecipeComponent = Component & (new () => AuthRecipeComponentInstance)

export type AuthRecipeRegistration = {
  component: AuthRecipeComponent
  profileId: DesignProfileId
}

type AuthRecipeRegistrationInput<ComponentType extends VueComponentContractCandidate = VueComponentContractCandidate> = {
  component: ComponentType
  profileId: DesignProfileId
}

type ExactAuthRecipeRegistration<Input extends AuthRecipeRegistrationInput> = Input & {
  component: Input['component'] &
    AuthRecipeComponent &
    ExactRequiredComponentContract<NoInfer<Input['component']>, AuthRecipeComponentInstance['$props'], AuthRecipeComponentInstance['$slots']>
}

type ExactAuthRecipeRegistrations<Inputs extends readonly AuthRecipeRegistrationInput[]> = {
  [Index in keyof Inputs]: ExactAuthRecipeRegistration<Inputs[Index]>
}

type AuthRecipeRegistry<Inputs extends readonly AuthRecipeRegistrationInput[]> = {
  -readonly [Index in keyof Inputs]: AuthRecipeRegistration
}

export function createAuthRecipeRegistry<const Inputs extends readonly AuthRecipeRegistrationInput[]>(
  registrations: Inputs & ExactAuthRecipeRegistrations<NoInfer<Inputs>>
): AuthRecipeRegistry<Inputs> {
  const profileIds = new Set<DesignProfileId>()

  for (const registration of registrations) {
    if (profileIds.has(registration.profileId)) {
      throw new Error(`Duplicate auth recipe profile id "${registration.profileId}"`)
    }

    profileIds.add(registration.profileId)
  }

  return [...registrations] as unknown as AuthRecipeRegistry<Inputs>
}

export function resolveAuthRecipeRegistration(
  profileId: DesignProfileId,
  registry: readonly AuthRecipeRegistration[],
  fallback: AuthRecipeRegistration
): AuthRecipeRegistration {
  return registry.find((registration) => registration.profileId === profileId) ?? fallback
}
