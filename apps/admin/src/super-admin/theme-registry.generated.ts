import type { DesignProfile, DesignProfileId } from '@super-admin-org/core'
// @starter-theme-imports:start
import { baseProfile } from '@super-admin-org/theme-base'
import { cyberpunkProfile } from '@super-admin-org/theme-cyberpunk'
import { cryptoProfile } from '@super-admin-org/theme-crypto'
import { industrialProfile } from '@super-admin-org/theme-industrial'
import { newsprintProfile } from '@super-admin-org/theme-newsprint'
// @starter-theme-imports:end

// @starter-theme-profiles:start
export const builtInDesignProfiles = [baseProfile, cryptoProfile, industrialProfile, cyberpunkProfile, newsprintProfile] as const
// @starter-theme-profiles:end

export function getBuiltInDesignProfile(profileId: DesignProfileId): DesignProfile {
  // @starter-theme-fallback:start
  return builtInDesignProfiles.find((profile) => profile.id === profileId) ?? baseProfile
  // @starter-theme-fallback:end
}
