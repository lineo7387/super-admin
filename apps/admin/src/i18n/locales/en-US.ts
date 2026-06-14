const enUS = {
  shell: {
    account: {
      menu: 'Account menu',
      menuFor: '{name} account menu',
      settings: 'Settings',
      profileSettings: 'Profile and account settings',
      shortcuts: 'Shortcuts',
      shortcutsDetail: 'View assigned shortcuts',
      signOut: 'Sign out'
    },
    shortcuts: {
      title: 'Shortcuts',
      readOnly: 'This first version is read-only and does not support custom shortcuts.',
      close: 'Close shortcuts',
      stageManager: 'Stage Manager',
      controlCenter: 'Control Center',
      aiAssistant: 'AI Assistant',
      commandPalette: 'Search / Command Palette',
      unbound: 'Unbound'
    },
    assistant: {
      open: 'Open AI Assistant',
      close: 'Close AI Assistant',
      title: 'AI Assistant',
      hidden: 'Hidden',
      unavailable: 'Unavailable',
      provider: 'AI Provider',
      pageContext: 'Page context',
      providerConnected: '{provider} is connected.',
      providerUnavailableMessage: 'No AI provider is configured.'
    },
    navigation: {
      primary: 'Primary template navigation',
      fallback: 'Navigation',
      templateDirectory: 'Template directory',
      operatorShell: 'Operator command shell'
    },
    preferences: {
      open: 'Open Control Center: {profile} / {mode}',
      title: 'Control Center',
      live: 'Live',
      workspaceConfiguration: '{profile} workspace configuration',
      immediateUpdate: 'Theme, layout, tabs, and Stage Manager update immediately.',
      close: 'Close Control Center',
      themeProfile: 'Theme Profile',
      themeProfileDescription: 'Switch between installed design recipes.',
      displayMode: 'Display mode',
      locale: 'Language',
      localeDescription: 'Switch display language for migrated surfaces.',
      layout: 'Layout',
      layoutDescription: 'Layout presets stay independent from workspace tools.',
      workspace: 'Workspace',
      workspaceDescription: 'Tabs and Stage Manager can be enabled together.',
      keepAlive: 'Keep-alive',
      workspaceTabs: 'Workspace Tabs',
      tabsDescription: 'Persistent horizontal route tabs.',
      stageManagerShortcut: 'Stage Manager Shortcut',
      stageDescription: 'macOS-style overview layer for open workspaces.',
      stagePresentationMode: 'Stage Manager Display',
      stagePresentationDescription: 'Switch between grouped side dock and full-mask windows.',
      aiProvider: 'AI provider',
      providerUnavailable: 'Unavailable',
      providerDescription: 'Provider interfaces are typed, but no provider is attached by default.',
      on: 'On',
      off: 'Off',
      locales: {
        zhCN: {
          label: '中文',
          detail: 'Default locale'
        },
        enUS: {
          label: 'English',
          detail: 'Optional locale'
        }
      },
      modes: {
        light: {
          label: 'Light',
          detail: 'Bright operations surface'
        },
        dark: {
          label: 'Dark',
          detail: 'Signal-first control room'
        },
        system: {
          label: 'System',
          detail: 'Follow OS preference'
        }
      },
      stageModes: {
        sideDock: {
          label: 'Side Groups',
          detail: 'Show up to four windows or module groups on the left.'
        },
        allWindows: {
          label: 'All Windows',
          detail: 'Use a full mask and show every window without module grouping.'
        }
      }
    }
  },
  navigation: {
    modules: {
      examples: 'Examples',
      'ui-kit': 'UI Kit',
      dashboard: 'Dashboard',
      workbench: 'Workbench',
      users: 'Users',
      access: 'Access'
    },
    routes: {
      templateGuide: 'Template Guide',
      allUsers: 'All Users',
      pendingReview: 'Pending Review',
      invites: 'Invites',
      activity: 'Activity'
    },
    descriptions: {
      templateGuide: 'Frontend-first template boundary guide for adapter replacement and module reshaping.',
      dashboard: 'A frontend example dashboard showing how metrics, signals, and activity flow through API adapters.',
      workbench: 'A frontend example workbench for queues and operational jobs.',
      access: 'Frontend permission metadata example that does not require a real auth backend.'
    }
  },
  examples: {
    templateGuide: {
      eyebrow: 'Template baseline',
      title: 'Frontend Example Template',
      description: 'The examples are copyable frontend modules. Keep the screen when it fits, replace the adapter when only data changes, or reshape the full module when the business workflow is different.',
      boundaryTitle: 'Default scaffold boundary',
      boundaryDescription: 'Backend, auth, database, AI providers, API contracts, and CLI generation stay optional follow-up surfaces.',
      signals: {
        frontendFirst: 'Frontend-first',
        mockBacked: 'Mock-backed',
        backendOptional: 'Backend optional'
      },
      sections: {
        sourceBoundaries: {
          title: 'Source boundaries',
          summary: 'The default scaffold keeps data access replaceable while the examples stay frontend-first.',
          items: {
            mockData: {
              label: 'Mock API data',
              guidance: 'Keep starter datasets here so the scaffold runs without a backend, database, auth service, or provider setup.'
            },
            apiAdapters: {
              label: 'API adapters',
              guidance: 'When the example screen fits your workflow, replace the API adapter with a real request and keep the page shape stable.'
            },
            moduleQueries: {
              label: 'Module queries',
              guidance: 'Pages call query composables, and query composables call API adapters, so server/cache state stays out of Pinia.'
            },
            moduleTypes: {
              label: 'Module types',
              guidance: 'Treat these as frontend example contracts, not universal API schemas for every user backend.'
            }
          }
        },
        changePaths: {
          title: 'Change paths',
          summary: 'Users can choose a small adapter replacement or a full module reshape based on how much the business screen changes.',
          items: {
            adapterOnly: {
              label: 'Adapter-only replacement',
              guidance: 'Use this path when the page semantics fit and only the data source changes; replace the API adapter and normalize the response.'
            },
            fullReshape: {
              label: 'Full module reshape',
              guidance: 'Use this path when the workflow differs; reshape the page, components, types, queries, and adapter together.'
            }
          }
        }
      }
    },
    dashboard: {
      loadErrorTitle: 'Unable to load dashboard overview',
      loadErrorDescription: 'The API adapter produced this mock error state.',
      emptyTitle: 'No dashboard signals',
      emptyDescription: 'The API adapter returned an empty mock overview.',
      title: 'Command Surface',
      description: 'A frontend-only example module: keep this screen if it fits, or reshape the page, types, queries, and API adapter together.',
      status: {
        mockMode: 'Mock mode'
      },
      activityTitle: 'Activity Feed'
    },
    workbench: {
      title: 'Scheduler Console',
      description: 'A desktop-control-center style surface for operational jobs.',
      refresh: 'Refresh',
      runBatch: 'Run batch',
      loadErrorTitle: 'Unable to load workbench jobs',
      loadErrorDescription: 'The Workbench API adapter can point at a real job endpoint when this screen fits.',
      emptyTitle: 'No jobs in this queue',
      emptyDescription: 'The Workbench API adapter returned an empty mock job list.',
      nextCheckpoint: 'Next checkpoint {eta}'
    },
    access: {
      title: 'Permission Matrix',
      description: 'Demo permissions stay frontend metadata, not a required auth backend.',
      loadErrorTitle: 'Unable to load access matrix',
      loadErrorDescription: 'The Access API adapter produced this mock error state.',
      emptyTitle: 'No roles in this matrix',
      emptyDescription: 'The Access API adapter returned an empty mock role list.',
      integrationTitle: 'Integration note',
      integrationDescription: 'Use this as a copyable access example. If your roles or screens differ, reshape the page, types, permission checks, and API adapter together.'
    }
  },
  workspace: {
    breadcrumbRoot: 'Workspace',
    current: 'Current',
    fallbackTitle: 'Workspace',
    pin: 'Pin',
    unpin: 'Unpin',
    pinCurrent: 'Pin current workspace',
    unpinCurrent: 'Unpin current workspace',
    refresh: 'Refresh',
    refreshCurrent: 'Refresh current workspace',
    scrollTabsLeft: 'Scroll tabs left',
    scrollTabsRight: 'Scroll tabs right',
    closeTab: 'Close workspace tab',
    stage: {
      title: 'Stage Manager',
      openWorkspaces: 'Open workspaces',
      close: 'Close Stage Manager',
      stages: 'Workspace stages',
      previewUnavailable: 'Preview unavailable',
      current: 'Current',
      pinned: 'Pinned',
      pin: 'Pin stage',
      unpin: 'Unpin stage',
      refresh: 'Refresh stage',
      closeStage: 'Close stage',
      expandGroup: 'Expand group',
      collapseGroup: 'Collapse group',
      enterGroupWindows: 'Enter window level',
      windows: 'windows',
      backToGroups: 'Back to groups'
    }
  },
  auth: {
    routes: {
      signIn: 'Sign in',
      createAccount: 'Create account'
    },
    login: {
      eyebrow: 'Open-source admin template',
      title: 'Start your admin project quickly',
      description: 'Super Admin provides reusable Vue admin screens, design profiles, and API adapter boundaries. It runs with mock data by default.',
      heading: 'Sign in',
      intro: 'Use the template account to explore the frontend-first workspace, then replace pages, data, and auth flow for your business.',
      failedTitle: 'Sign-in failed',
      email: 'Email',
      password: 'Password',
      submit: 'Sign in',
      submitting: 'Signing in',
      unableToSignIn: 'Unable to sign in.',
      referenceEmail: 'Template email',
      referencePassword: 'Template password',
      onboardingQuestion: 'Want to inspect the registration example?',
      createAccount: 'Create account'
    },
    register: {
      eyebrow: 'Open-source admin template',
      title: 'Prepare your own onboarding flow',
      description: 'The registration page demonstrates reusable form, validation, and layout structure that can be replaced with invitations, organizations, SSO, or your own account system.',
      heading: 'Create account',
      intro: 'This is a template example. It does not create real backend users by default.',
      noticeTitle: 'Registration flow not connected',
      noticeDescription: 'The default template is not connected to a real registration service. Replace this boundary with your organization onboarding flow.',
      name: 'Name',
      workEmail: 'Work email',
      workspace: 'Workspace',
      password: 'Password',
      passwordHelp: 'Use at least 8 characters.',
      submit: 'Review onboarding path',
      signInQuestion: 'Already have an account?',
      signIn: 'Sign in'
    },
    layout: {
      brand: 'Super Admin',
      summary: 'Frontend-first, mock-ready, backend-optional',
      projectIntro: 'General admin starting point',
      metrics: {
        locale: 'Default locale',
        localeValue: 'Chinese',
        data: 'Data mode',
        dataValue: 'Mock',
        backend: 'Backend',
        backendValue: 'Optional'
      }
    }
  },
  users: {
    all: {
      title: 'All Users',
      description: 'Mock-backed CRUD example with module-owned page, query, API adapter, and type boundaries.',
      search: 'Search users',
      allStatuses: 'All statuses',
      active: 'Active',
      review: 'Review',
      paused: 'Paused',
      normal: 'Normal',
      loading: 'Loading',
      empty: 'Empty',
      error: 'Error',
      compact: 'Compact',
      comfortable: 'Comfortable',
      newUser: 'New user',
      columns: 'Columns',
      saved: 'Saved {name}',
      emptyTitle: 'No users match this view',
      emptyDescription: 'Try a different search, filter, or preview scenario.',
      errorTitle: 'Unable to load users',
      errorDescription: 'This error is generated by the mock API scenario.',
      actions: 'Actions',
      retry: 'Retry',
      edit: 'Edit {name}',
      paginationRange: '{start}-{end} of {total}',
      paginationPage: 'Page {page} / {pageCount}',
      previous: 'Previous',
      next: 'Next'
    },
    secondary: {
      pendingTitle: 'Pending Review',
      pendingDescription: 'A lightweight third-level route using the same table primitive.',
      invitesTitle: 'Invites',
      invitesDescription: 'Lightweight secondary route proving normalized module navigation.',
      inviteAction: 'Invite',
      expiresIn: 'Expires in {time}',
      noPendingInvites: 'No pending invites',
      inviteEmptyDescription: 'Invite state can be wired through the users API adapter later.',
      activityTitle: 'Activity',
      activityDescription: 'A compact module activity route for nested navigation previews.',
      audit: 'Audit',
      events: {
        ownerPolicy: 'Mira Chen updated owner policy',
        accessReview: 'Jon Bell submitted access review',
        accountPaused: 'Kai Martin account paused',
        twelveMinutes: '12 min ago',
        thirtySixMinutes: '36 min ago',
        twoHours: '2 hr ago'
      }
    },
    form: {
      createTitle: 'Create user',
      editTitle: 'Edit {name}',
      createDescription: 'Create a mock user profile for the template.',
      editDescription: 'Update this mock user profile.',
      selectRole: 'Select role',
      selectStatus: 'Select status',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      status: 'Status',
      region: 'Region',
      regionHelp: 'Keep this module-owned; your backend can provide the allowed regions.',
      notes: 'Notes',
      notesHelp: 'Optional operational context.',
      notesPlaceholder: 'Add review notes or handoff details.'
    },
    roles: {
      owner: 'Owner',
      operator: 'Operator',
      auditor: 'Auditor',
      analyst: 'Analyst'
    },
    statuses: {
      active: 'Active',
      review: 'Review',
      paused: 'Paused'
    },
    columns: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      region: 'Region',
      status: 'Status'
    }
  },
  validation: {
    requiredLabel: 'Required',
    optionalLabel: 'Optional',
    email: 'Enter a valid email address.',
    nameRequired: 'Name is required.',
    passwordRequired: 'Password is required.',
    workspaceRequired: 'Workspace name is required.',
    passwordMin: 'Use at least 8 characters.',
    roleRequired: 'Role is required.',
    statusRequired: 'Status is required.'
  }
} as const

export default enUS
