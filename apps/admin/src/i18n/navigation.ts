import type { ModuleManifest, ModuleNavItem } from '@super-admin-org/core'
import type { MessageTranslator } from './index'

const moduleNameKeys: Record<string, string> = {
  access: 'navigation.modules.access',
  dashboard: 'navigation.modules.dashboard',
  examples: 'navigation.modules.examples',
  'ui-kit': 'navigation.modules.ui-kit',
  users: 'navigation.modules.users',
  workbench: 'navigation.modules.workbench'
}

const navPathKeys: Record<string, string> = {
  '/examples': 'navigation.modules.examples',
  '/examples/access': 'navigation.modules.access',
  '/examples/dashboard': 'navigation.modules.dashboard',
  '/examples/template-guide': 'navigation.routes.templateGuide',
  '/examples/users': 'navigation.modules.users',
  '/examples/users/activity': 'navigation.routes.activity',
  '/examples/users/all': 'navigation.routes.allUsers',
  '/examples/users/invites': 'navigation.routes.invites',
  '/examples/users/pending-review': 'navigation.routes.pendingReview',
  '/examples/workbench': 'navigation.modules.workbench',
  '/ui-kit': 'navigation.modules.ui-kit'
}

const routeTitleKeys: Record<string, string> = {
  '/auth/login': 'auth.routes.signIn',
  '/auth/register': 'auth.routes.createAccount',
  '/examples/users/activity': 'navigation.routes.activity',
  '/examples/users/all': 'navigation.routes.allUsers',
  '/examples/users/invites': 'navigation.routes.invites',
  '/examples/users/pending-review': 'navigation.routes.pendingReview'
}

function translateKnownKey(t: MessageTranslator, key: string | undefined, fallback: string): string {
  return key ? t(key) : fallback
}

export function translateModuleName(t: MessageTranslator, module: ModuleManifest | undefined, fallback: string): string {
  return translateKnownKey(t, module ? moduleNameKeys[module.id] : undefined, module?.name ?? fallback)
}

export function translateNavItemLabel(t: MessageTranslator, item: ModuleNavItem): string {
  return translateKnownKey(t, navPathKeys[item.path], item.label)
}

export function translateRouteTitle(t: MessageTranslator, path: string, fallback: string): string {
  return translateKnownKey(t, routeTitleKeys[path], fallback)
}
