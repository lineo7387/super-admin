import type { DesignProfile, DesignProfileId } from '@super-admin/core'
import { baseProfile } from '@super-admin/theme-base'
import { cyberpunkProfile } from '@super-admin/theme-cyberpunk'
import { cryptoProfile } from '@super-admin/theme-crypto'
import { industrialProfile } from '@super-admin/theme-industrial'
import { newsprintProfile } from '@super-admin/theme-newsprint'

export const builtInDesignProfiles = [baseProfile, cryptoProfile, industrialProfile, cyberpunkProfile, newsprintProfile] as const

export function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {
  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile
}
