import type { Component } from 'vue'

export type VueComponentContractCandidate = Component &
  (new () => {
    $props: object
    $slots: object
  })

type RequiredKeys<Value extends object> = {
  [Key in keyof Value]-?: Record<never, never> extends Pick<Value, Key> ? never : Key
}[keyof Value]

type HasNoUnsupportedRequiredKeys<Actual extends object, Provided extends object> =
  Exclude<RequiredKeys<Actual>, keyof Provided> extends never ? unknown : never

export type ExactRequiredComponentContract<
  ComponentType extends VueComponentContractCandidate,
  ProvidedProps extends object,
  ProvidedSlots extends object
> = HasNoUnsupportedRequiredKeys<InstanceType<ComponentType>['$props'], ProvidedProps> &
  HasNoUnsupportedRequiredKeys<InstanceType<ComponentType>['$slots'], ProvidedSlots>
