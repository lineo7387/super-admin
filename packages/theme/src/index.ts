export * from './apply-profile'
export * from './profiles/crypto'
export * from './profiles/industrial'

import type { DesignProfile, DesignProfileId } from '@super-admin/core'
import { cryptoProfile } from './profiles/crypto'
import { industrialProfile } from './profiles/industrial'

export const builtInDesignProfiles = [cryptoProfile, industrialProfile] as const

export function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {
  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? cryptoProfile
}
