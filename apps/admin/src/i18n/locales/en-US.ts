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
      description: 'Click "Rebind" to change a shortcut. Press Esc to cancel while rebinding.',
      close: 'Close shortcuts',
      stageManager: 'Stage Manager',
      controlCenter: 'Control Center',
      aiAssistant: 'AI Assistant',
      commandPalette: 'Search / Command Palette',
      rebind: 'Rebind',
      rebinding: 'Press a key combination… (Esc to cancel)',
      cancelRebind: 'Cancel',
      resetDefault: 'Reset to default',
      resetAll: 'Reset all to defaults',
      rebindConflict: 'Conflicts with "{name}". Choose a different combination.',
      rebindBrowserReserved: 'This combination is reserved by the browser. Choose a different one.',
      rebindModifierOnly: 'Press a full key combination (modifier-only is not allowed).'
    },
    commandPalette: {
      title: 'Command Palette',
      placeholder: 'Search pages or commands...',
      trigger: 'Search pages or commands',
      close: 'Close command palette',
      empty: 'No results found',
      groups: {
        navigation: 'Navigation',
        actions: 'Actions'
      },
      actions: {
        openControlCenter: 'Open Control Center',
        openAiAssistant: 'Open AI Assistant',
        openStageOverview: 'Open Stage Overview',
        setProfile: 'Set theme: {profile}',
        setColorMode: 'Set color mode: {mode}',
        setLocale: 'Set language: {locale}'
      },
      modes: {
        light: 'Light',
        dark: 'Dark',
        system: 'System'
      },
      locales: {
        zhCN: '简体中文',
        enUS: 'English'
      }
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
      stageRail: 'Left Stage Rail',
      stageRailDescription: 'A desktop-wide, window-only rail that compresses the workspace.',
      fullscreenOverview: 'Fullscreen Overview',
      fullscreenOverviewDescription: 'Open the desktop window overview with Cmd/Ctrl + Shift + M.',
      openOverview: 'Open overview',
      desktopOnly: 'Desktop',
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
      }
    }
  },
  navigation: {
    modules: {
      examples: 'Examples',
      'ui-kit': 'UI Kit',
      charts: 'Charts',
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
      charts: 'Optional ECharts template examples showing charts adapted to the active admin theme.',
      dashboard: 'A frontend example dashboard showing how metrics, signals, and activity flow through API adapters.',
      workbench: 'A frontend example workbench for queues and operational jobs.',
      access: 'Frontend permission metadata example that does not require a real auth backend.'
    }
  },
  charts: {
    eyebrow: 'Optional chart template',
    title: 'Theme-adapted ECharts examples',
    description:
      'These examples show how Super Admin chart recipes follow the active design profile and color mode while keeping raw ECharts options available.',
    status: '{profile} / {mode}',
    boundaryTitle: 'Optional dependency boundary',
    boundaryDescription: 'The starter installs echarts and vue-echarts only when ECharts is selected during setup. Without it, the project stays lightweight.',
    revenue: {
      title: 'Revenue trend',
      description: 'Line shape and area opacity come from the active chart recipe.'
    },
    risk: {
      title: 'Risk mix',
      description: 'The donut chart uses the recipe palette while leaving native ECharts options open for override.'
    },
    channel: {
      title: 'Channel performance',
      description: 'Bar radius, grid lines, and tooltip styling follow the selected design profile.'
    }
  },
  examples: {
    templateGuide: {
      eyebrow: 'Template baseline',
      title: 'Frontend Example Template',
      description:
        'The examples are copyable frontend modules. Keep the screen when it fits, replace the adapter when only data changes, or reshape the full module when the business workflow is different.',
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
      integrationDescription:
        'Use this as a copyable access example. If your roles or screens differ, reshape the page, types, permission checks, and API adapter together.'
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
      description:
        'The registration page demonstrates reusable form, validation, and layout structure that can be replaced with invitations, organizations, SSO, or your own account system.',
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
  },
  common: {
    primitives: {
      validationTitle: 'Review the highlighted fields',
      cancel: 'Cancel',
      save: 'Save',
      saving: 'Saving...',
      unsavedChanges: 'Unsaved changes',
      noChanges: 'No changes yet',
      clear: 'Clear',
      close: 'Close',
      closeDrawer: 'Close drawer',
      previous: 'Previous',
      next: 'Next',
      selectOption: 'Select an option',
      retry: 'Retry',
      open: 'Open',
      bulkDescription: 'Bulk actions apply only to the selected rows in this view.',
      bulkSelectionNone: 'No rows selected',
      bulkSelectionAll: 'All {count} rows selected',
      bulkSelectionSome: '{selected} of {total} rows selected'
    }
  },
  uiKit: {
    page: {
      foundations: { title: 'Foundations', description: 'Theme tokens, typography, radius, and status language used by the reusable primitives.' },
      actions: { title: 'Actions', description: 'Buttons and command controls with stable sizing, icons, disabled states, and profile-aware focus rings.' },
      inputs: { title: 'Inputs', description: 'Field controls that inherit theme tokens and expose typed v-model contracts for forms and filters.' },
      forms: { title: 'Forms', description: 'Form layout primitives for labels, help text, validation, and persistent footer actions.' },
      tables: { title: 'Tables', description: 'Composable table frame, toolbar, loading/empty/error states, status pills, and pagination controls.' },
      overlays: { title: 'Overlays', description: 'Drawer surfaces for focused create/edit tasks without leaving the current workspace route.' },
      feedback: { title: 'Feedback', description: 'Reusable empty, error, and status components for admin pages and table states.' }
    },
    foundations: {
      alertTitle: 'Primitives consume semantic tokens',
      alertDescription: 'Shared components should adapt to the active design profile through CSS variables, not profile-specific branches in feature pages.',
      metricCoverage: 'Profile coverage',
      metricCoverageMeta: 'Crypto, Industrial, Cyberpunk',
      metricModes: 'Modes',
      metricModesMeta: 'Light and dark required',
      metricLayouts: 'Layouts',
      metricLayoutsMeta: 'Tri, dual, top-header QA',
      typeScale: 'Type Scale',
      displayHeading: 'Display heading',
      sectionHeading: 'Section heading',
      typeBody: 'Body text uses the active profile foreground tokens so every primitive adapts across light, dark, Crypto, and Industrial modes.',
      statusTones: 'Status Tones',
      scrollArea: 'Scroll Area',
      scrollAreaDescription: 'Shared scroll containers hide native tracks and paint token-aware thumbs above the content.',
      scrollItems: {
        routeAware: 'Route-aware workspace surfaces',
        contextPanels: 'Context panels and drawers',
        controlCenter: 'Control Center settings',
        dataTables: 'Data tables with horizontal overflow',
        scrollbarTokens: 'Theme-aware scrollbar tokens',
        overlayBars: 'Overlay bars outside content layout'
      }
    },
    actions: {
      alertTitle: 'Actions prefer icons plus concise labels',
      alertDescription: 'Use icon-only buttons for compact tools and text labels for commands where the outcome needs to be explicit.',
      buttonVariants: 'Button Variants',
      create: 'Create',
      export: 'Export',
      refresh: 'Refresh',
      delete: 'Delete',
      sizes: 'Sizes',
      small: 'Small',
      medium: 'Medium',
      disabled: 'Disabled',
      persistentActions: 'Persistent Form Actions',
      persistentActionsDescription: 'Footer actions keep save/cancel placement stable in drawers and dense forms.',
      applyChanges: 'Apply changes',
      twoUnsaved: '2 unsaved updates'
    },
    inputs: {
      alertTitle: 'Inputs use typed v-model contracts',
      alertDescription: 'Text, select, switch, and checkbox primitives keep form state explicit while the module decides validation and persistence.',
      textInputs: 'Text Inputs',
      fieldName: 'Name',
      nameHelp: 'Default text input',
      fieldNameEmail: 'Email',
      emailError: 'Enter a valid email address.',
      fieldNameSlug: 'Generated slug',
      slugHelp: 'Readonly and disabled states preserve layout without custom one-off classes.',
      fieldNameLocked: 'Locked provider',
      selectTextareaSwitch: 'Select, Textarea, Switch',
      fieldRole: 'Role',
      fieldNotes: 'Notes',
      switchEnable: 'Enable workspace notices',
      switchDisabled: 'Disabled switch',
      checkboxReviewed: 'Mark policy reviewed',
      checkboxReviewedDescription: 'Checkboxes are useful for confirmations and table selection.',
      checkboxPartial: 'Partially selected team',
      checkboxPartialDescription: 'Indeterminate state mirrors bulk-selection tables.',
      fieldApprovalMode: 'Approval mode',
      approvalModeHelp: 'Radio groups use the same profile-aware control styling as checkbox selections.',
      roles: { owner: 'Owner', operator: 'Operator', auditor: 'Auditor' },
      approval: {
        manual: 'Manual review',
        manualDescription: 'Operators approve each workflow before it becomes active.',
        scheduled: 'Scheduled window',
        scheduledDescription: 'Changes wait for a maintenance window before publishing.',
        locked: 'Locked by policy',
        lockedDescription: 'Disabled options keep layout stable while showing unavailable choices.'
      }
    },
    forms: {
      alertTitle: 'Keep validation module-owned',
      alertDescription: 'Shared primitives render states and layout; feature modules still own field rules, business copy, and submit behavior.',
      errorOwner: 'Owner is required.',
      errorEmail: 'Enter a valid notification email address.',
      errorSummary: 'Summary is required.',
      fieldOwner: 'Owner',
      fieldOwnerError: 'Owner is required.',
      fieldStatus: 'Status',
      statuses: { active: 'Active', review: 'Review', paused: 'Paused' },
      fieldEmail: 'Notification email',
      fieldEmailError: 'Enter a valid email address for workflow notifications.',
      fieldReference: 'Reference ID',
      fieldReferenceHelp: 'Readonly fields can show API-managed or generated values without becoming editable.',
      fieldSummary: 'Summary',
      fieldSummaryHelp: 'Use this layout for module-owned form copy and validation.',
      submit: 'Publish workflow',
      threeFieldsChanged: '3 fields changed'
    },
    tables: {
      frameTitle: 'Operational Views',
      frameDescription: 'A compact data-table composition using the shared table primitives.',
      searchViews: 'Search views',
      compact: 'Compact',
      comfortable: 'Comfortable',
      sort: 'Sort',
      newView: 'New view',
      assignOwner: 'Assign owner',
      archive: 'Archive',
      selectAll: 'Select all rows',
      selectRow: 'Select {name}',
      columns: { name: 'Name', owner: 'Owner', status: 'Status', risk: 'Risk', updated: 'Updated', actions: 'Actions' },
      statusLabels: { ready: 'Ready', review: 'Review', blocked: 'Blocked' },
      riskLabels: { low: 'Low', medium: 'Medium', high: 'High' },
      updatedLabels: { today: 'Today', yesterday: 'Yesterday', twoDays: '2 days ago' },
      open: 'Open',
      loadingTitle: 'Loading',
      loadingDescription: 'Skeleton rows preserve table structure while a query resolves.',
      emptyTitle: 'No matching views',
      emptyDescription: 'Change filters or create the first operational view.',
      errorTitle: 'Unable to load views',
      errorDescription: 'The API adapter can surface retry actions here.',
      retry: 'Retry',
      paginationRange: '{start}-{end} of {total}',
      paginationPage: 'Page {page} / {pageCount}',
      rows: {
        revenueReview: 'Revenue Review',
        accessAudit: 'Access Audit',
        queueHealth: 'Queue Health',
        providerDrift: 'Provider Drift'
      }
    },
    overlays: {
      alertTitle: 'Drawer workflows keep page context visible',
      alertDescription: 'Use them for short create/edit tasks where the table or dashboard behind the overlay still matters.',
      drawerCarrier: 'Drawer Carrier',
      drawerCarrierDescription: 'Use the drawer primitive for short admin workflows that should stay visually attached to the list or dashboard behind it.',
      openDrawer: 'Open drawer',
      drawerTitle: 'Edit workspace',
      drawerDescription: 'A compact overlay composition using shared form primitives.',
      errorWorkspaceName: 'Workspace name is required.',
      errorConfirmOwner: 'Confirm the workspace owner before saving.',
      fieldWorkspaceName: 'Workspace name',
      checkboxOwnerReviewed: 'Owner reviewed',
      checkboxOwnerReviewedDescription: 'Confirmation state is local to this workflow; shared UI only renders the control.',
      submit: 'Save workspace'
    },
    feedback: {
      emptyState: 'Empty State',
      emptyTitle: 'No records in this view',
      emptyDescription: 'This surface adapts to the active theme and can host a primary recovery action.',
      createRecord: 'Create record',
      stateLanguage: 'State Language',
      statusDraft: 'Draft',
      statusHealthy: 'Healthy',
      statusReview: 'Review',
      statusBlocked: 'Blocked',
      alerts: 'Alerts',
      alertProviderTitle: 'Provider not configured',
      alertProviderDescription: 'Use this state when an optional integration is intentionally absent from the default scaffold.',
      alertSavedTitle: 'Changes saved',
      alertSavedDescription: 'Positive feedback should be short and tied to the completed action.',
      alertReviewTitle: 'Review pending',
      alertReviewDescription: 'Warning feedback calls attention without blocking the current page.',
      alertFailedTitle: 'Action failed',
      alertFailedDescription: 'Danger feedback should include the next recovery action when possible.',
      retry: 'Retry',
      loadingAndValidation: 'Loading and Validation',
      errorNameRequired: 'Name is required.',
      errorEmailAt: 'Enter a valid notification email address.'
    }
  }
} as const

export default enUS
