import type { DesignProfile, DesignProfileId } from '@super-admin-org/core'
import { baseProfile } from '@super-admin-org/theme-base'
import { cyberpunkProfile } from '@super-admin-org/theme-cyberpunk'
import { cryptoProfile } from '@super-admin-org/theme-crypto'
import { industrialProfile } from '@super-admin-org/theme-industrial'
import { newsprintProfile } from '@super-admin-org/theme-newsprint'

export const builtInDesignProfiles = [baseProfile, cryptoProfile, industrialProfile, cyberpunkProfile, newsprintProfile] as const

export function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {
  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile
}
