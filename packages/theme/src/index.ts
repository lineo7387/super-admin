export * from './apply-profile'
export * from './profiles/base'
export * from './profiles/cyberpunk'
export * from './profiles/crypto'
export * from './profiles/industrial'
export * from './profiles/newsprint'

import type { DesignProfile, DesignProfileId } from '@super-admin/core'
import { baseProfile } from './profiles/base'
import { cyberpunkProfile } from './profiles/cyberpunk'
import { cryptoProfile } from './profiles/crypto'
import { industrialProfile } from './profiles/industrial'
import { newsprintProfile } from './profiles/newsprint'

export const builtInDesignProfiles = [baseProfile, cryptoProfile, industrialProfile, cyberpunkProfile, newsprintProfile] as const

export function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {
  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile
}
