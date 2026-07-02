export type AiAvailability = { state: 'unavailable'; reason: string } | { state: 'ready'; providerName: string } | { state: 'error'; message: string }

export const defaultAiAvailability: AiAvailability = {
  state: 'unavailable',
  reason: 'No AI provider is configured.'
}
