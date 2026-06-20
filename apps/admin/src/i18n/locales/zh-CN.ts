const zhCN = {
  shell: {
    account: {
      menu: '账户菜单',
      menuFor: '{name} 的账户菜单',
      settings: '设置',
      profileSettings: '个人信息与账户设置',
      shortcuts: '快捷方式',
      shortcutsDetail: '查看已绑定快捷键',
      signOut: '退出登录'
    },
    shortcuts: {
      title: '快捷方式',
      readOnly: '当前版本仅供查看，暂不支持自定义快捷键。',
      close: '关闭快捷方式',
      stageManager: '台前调度',
      controlCenter: '控制中心',
      aiAssistant: 'AI 助手',
      commandPalette: '搜索 / 命令面板',
      unbound: '未绑定'
    },
    assistant: {
      open: '打开 AI 助手',
      close: '关闭 AI 助手',
      title: 'AI 助手',
      hidden: '已隐藏',
      unavailable: '不可用',
      provider: 'AI 提供方',
      pageContext: '页面上下文',
      providerConnected: '{provider} 已连接。',
      providerUnavailableMessage: '未配置 AI 提供方。'
    },
    navigation: {
      primary: '主模板导航',
      fallback: '导航',
      templateDirectory: '模板目录',
      operatorShell: '操作工作台'
    },
    preferences: {
      open: '打开控制中心：{profile} / {mode}',
      title: '控制中心',
      live: '实时',
      workspaceConfiguration: '{profile} 工作区配置',
      immediateUpdate: '主题、布局、标签页和舞台管理器会立即生效。',
      close: '关闭控制中心',
      themeProfile: '主题方案',
      themeProfileDescription: '在已安装的设计方案之间切换。',
      displayMode: '显示模式',
      locale: '语言',
      localeDescription: '切换已迁移界面的显示语言。',
      layout: '布局',
      layoutDescription: '布局预设独立于工作区工具。',
      workspace: '工作区',
      workspaceDescription: '标签页和舞台管理器可以同时启用。',
      keepAlive: '保持缓存',
      workspaceTabs: '工作区标签页',
      tabsDescription: '持久化的横向路由标签页。',
      stageRail: '左侧台前调度',
      stageRailDescription: '桌面宽屏中挤压工作区的纯窗口缩略轨道。',
      fullscreenOverview: '全屏窗口总览',
      fullscreenOverviewDescription: '使用 Cmd/Ctrl + Shift + M 打开桌面端窗口总览。',
      openOverview: '打开窗口总览',
      desktopOnly: '桌面端',
      aiProvider: 'AI 提供方',
      providerUnavailable: '不可用',
      providerDescription: '提供方接口已类型化，但默认不接入任何提供方。',
      on: '开',
      off: '关',
      locales: {
        zhCN: {
          label: '中文',
          detail: '默认语言'
        },
        enUS: {
          label: 'English',
          detail: '可选语言'
        }
      },
      modes: {
        light: {
          label: '浅色',
          detail: '明亮的操作界面'
        },
        dark: {
          label: '深色',
          detail: '信号优先的控制室'
        },
        system: {
          label: '跟随系统',
          detail: '使用操作系统偏好'
        }
      }
    }
  },
  navigation: {
    modules: {
      examples: '示例',
      'ui-kit': 'UI 组件',
      charts: '图表',
      dashboard: '仪表盘',
      workbench: '工作台',
      users: '用户',
      access: '权限'
    },
    routes: {
      templateGuide: '模板指南',
      allUsers: '全部用户',
      pendingReview: '待审核',
      invites: '邀请',
      activity: '动态'
    },
    descriptions: {
      templateGuide: '前端优先模板边界说明，帮助你判断何时替换 adapter、何时重塑模块。',
      charts: '可选 ECharts 图表模板，展示如何让图表自动适配当前后台主题。',
      dashboard: '前端示例仪表盘，展示指标、信号和活动如何通过 API adapter 进入页面。',
      workbench: '面向队列和运营任务的前端示例工作台。',
      access: '前端权限元数据示例，不要求真实 auth backend。'
    }
  },
  charts: {
    eyebrow: '可选图表模板',
    title: '主题适配的 ECharts 案例',
    description: '这些案例展示 Super Admin chart recipe 如何跟随当前设计风格和亮暗模式，同时保留 ECharts 原生 option 的自由度。',
    status: '{profile} / {mode}',
    boundaryTitle: '可选依赖边界',
    boundaryDescription: '只有在安装时选择 ECharts，starter 才会安装 echarts、vue-echarts 并生成这组页面；不选择时项目保持轻量。',
    revenue: {
      title: '收入趋势',
      description: '折线和面积透明度来自当前主题的 chart recipe。'
    },
    risk: {
      title: '风险构成',
      description: '环图直接使用 recipe palette，用户可以继续覆盖原生 ECharts option。'
    },
    channel: {
      title: '渠道表现',
      description: '柱图圆角、网格线和 tooltip 均跟随设计风格切换。'
    }
  },
  examples: {
    templateGuide: {
      eyebrow: '模板基线',
      title: '前端示例模板',
      description: '这些 examples 是可复制的前端模块。页面流程合适时保留 screen 并替换 adapter；业务流程不同则一起重塑 module。',
      boundaryTitle: '默认 scaffold 边界',
      boundaryDescription: 'Backend、auth、database、AI provider、API contract 和 CLI generation 都保持为可选后续接入面。',
      signals: {
        frontendFirst: '前端优先',
        mockBacked: 'Mock 可运行',
        backendOptional: '后端可选'
      },
      sections: {
        sourceBoundaries: {
          title: '源码边界',
          summary: '默认 scaffold 保持数据接入可替换，同时让 examples 继续前端优先。',
          items: {
            mockData: {
              label: 'Mock API 数据',
              guidance: 'Starter 数据集放在这里，让 scaffold 不依赖后端、database、auth service 或 provider setup 即可运行。'
            },
            apiAdapters: {
              label: 'API adapters',
              guidance: '示例 screen 符合你的 workflow 时，替换 API adapter 为真实请求，并保持 page shape 稳定。'
            },
            moduleQueries: {
              label: 'Module queries',
              guidance: 'Pages 调用 query composables，query composables 调用 API adapters，因此 server/cache state 不进入 Pinia。'
            },
            moduleTypes: {
              label: 'Module types',
              guidance: '这些是前端示例 contracts，不是要求所有用户 backend 遵守的通用 API schemas。'
            }
          }
        },
        changePaths: {
          title: '改造路径',
          summary: '用户可以根据业务 screen 的变化幅度，选择轻量 adapter replacement 或完整 module reshape。',
          items: {
            adapterOnly: {
              label: '只替换 adapter',
              guidance: '当页面语义适合、只需要更换数据源时，替换 API adapter 并归一化 response。'
            },
            fullReshape: {
              label: '完整重塑 module',
              guidance: '当 workflow 不同时，一起重塑 page、components、types、queries 和 adapter。'
            }
          }
        }
      }
    },
    dashboard: {
      loadErrorTitle: '无法加载仪表盘概览',
      loadErrorDescription: '这个错误状态由 mock API adapter 生成。',
      emptyTitle: '没有仪表盘信号',
      emptyDescription: 'API adapter 返回了空的 mock overview。',
      title: '指挥台',
      description: '前端示例模块：screen 合适时保留它；业务不同则一起重塑 page、types、queries 和 API adapter。',
      status: {
        mockMode: 'Mock 模式'
      },
      activityTitle: '活动流'
    },
    workbench: {
      title: '调度工作台',
      description: '面向运营任务的桌面控制中心式前端示例。',
      refresh: '刷新',
      runBatch: '运行批次',
      loadErrorTitle: '无法加载工作台任务',
      loadErrorDescription: '当这个 screen 符合你的业务时，Workbench API adapter 可以接入真实任务 endpoint。',
      emptyTitle: '当前队列没有任务',
      emptyDescription: 'Workbench API adapter 返回了空的 mock job list。',
      nextCheckpoint: '下一检查点 {eta}'
    },
    access: {
      title: '权限矩阵',
      description: 'Demo 权限保持为前端 metadata，不要求真实 auth backend。',
      loadErrorTitle: '无法加载权限矩阵',
      loadErrorDescription: '这个错误状态由 Access API adapter 生成。',
      emptyTitle: '当前矩阵没有角色',
      emptyDescription: 'Access API adapter 返回了空的 mock role list。',
      integrationTitle: '接入说明',
      integrationDescription: '把这里当作可复制的权限示例。如果你的角色或 screen 不同，请一起重塑 page、types、permission checks 和 API adapter。'
    }
  },
  workspace: {
    breadcrumbRoot: '工作区',
    current: '当前',
    fallbackTitle: '工作区',
    pin: '固定',
    unpin: '取消固定',
    pinCurrent: '固定当前工作区',
    unpinCurrent: '取消固定当前工作区',
    refresh: '刷新',
    refreshCurrent: '刷新当前工作区',
    scrollTabsLeft: '向左滚动标签页',
    scrollTabsRight: '向右滚动标签页',
    closeTab: '关闭工作区标签页',
    stage: {
      title: '舞台管理器',
      openWorkspaces: '打开的工作区',
      close: '关闭舞台管理器',
      stages: '工作区舞台',
      previewUnavailable: '预览不可用',
      current: '当前',
      pinned: '已固定',
      pin: '固定舞台',
      unpin: '取消固定舞台',
      refresh: '刷新舞台',
      closeStage: '关闭舞台',
      expandGroup: '展开分组',
      collapseGroup: '收起分组',
      enterGroupWindows: '进入窗口层级',
      windows: '窗口',
      backToGroups: '返回分组'
    }
  },
  auth: {
    routes: {
      signIn: '登录',
      createAccount: '创建账户'
    },
    login: {
      eyebrow: '开源后台模板',
      title: '快速启动你的后台项目',
      description: 'Super Admin 提供可复用的 Vue 管理界面、主题方案和 API 适配边界，默认使用 Mock 数据即可运行。',
      heading: '登录',
      intro: '使用模板账户体验前端优先的后台工作区，再按你的业务替换页面、数据和认证流程。',
      failedTitle: '登录失败',
      email: '邮箱',
      password: '密码',
      submit: '登录',
      submitting: '登录中',
      unableToSignIn: '无法登录。',
      referenceEmail: '模板邮箱',
      referencePassword: '模板密码',
      onboardingQuestion: '想查看注册示例？',
      createAccount: '创建账户'
    },
    register: {
      eyebrow: '开源后台模板',
      title: '准备替换成你的业务流程',
      description: '注册页展示可复用的表单、验证和布局结构，你可以替换为邀请、组织、SSO 或自有账号体系。',
      heading: '创建账户',
      intro: '这是一个模板示例，默认不创建真实后端用户。',
      noticeTitle: '注册流程未连接',
      noticeDescription: '默认模板未连接真实注册服务。请把这个边界替换成你的组织入门流程。',
      name: '姓名',
      workEmail: '工作邮箱',
      workspace: '工作区',
      password: '密码',
      passwordHelp: '密码至少需要 8 个字符。',
      submit: '检查入门路径',
      signInQuestion: '已有账户？',
      signIn: '登录'
    },
    layout: {
      brand: 'Super Admin',
      summary: '前端优先、Mock 可运行、后端可选',
      projectIntro: '通用后台起点',
      metrics: {
        locale: '默认语言',
        localeValue: '中文',
        data: '数据模式',
        dataValue: 'Mock',
        backend: '后端接入',
        backendValue: '可选'
      }
    }
  },
  users: {
    all: {
      title: '全部用户',
      description: '由 mock 数据驱动的 CRUD 示例，展示模块自有页面、查询、API 适配器和类型边界。',
      search: '搜索用户',
      allStatuses: '全部状态',
      active: '活跃',
      review: '审核中',
      paused: '已暂停',
      normal: '正常',
      loading: '加载中',
      empty: '空状态',
      error: '错误',
      compact: '紧凑',
      comfortable: '舒适',
      newUser: '新增用户',
      columns: '列',
      saved: '已保存 {name}',
      emptyTitle: '没有匹配的用户',
      emptyDescription: '尝试其他搜索、筛选或预览场景。',
      errorTitle: '无法加载用户',
      errorDescription: '这个错误由 mock API 场景生成。',
      actions: '操作',
      retry: '重试',
      edit: '编辑 {name}',
      paginationRange: '{start}-{end} / 共 {total}',
      paginationPage: '第 {page} / {pageCount} 页',
      previous: '上一页',
      next: '下一页'
    },
    secondary: {
      pendingTitle: '待审核',
      pendingDescription: '使用相同表格组件的轻量三级路由。',
      invitesTitle: '邀请',
      invitesDescription: '用于验证规范化模块导航的轻量二级路由。',
      inviteAction: '邀请',
      expiresIn: '{time} 后过期',
      noPendingInvites: '没有待处理邀请',
      inviteEmptyDescription: '邀请状态稍后可以通过用户 API 适配器接入。',
      activityTitle: '动态',
      activityDescription: '用于嵌套导航预览的紧凑模块动态路由。',
      audit: '审计',
      events: {
        ownerPolicy: 'Mira Chen 更新了所有者策略',
        accessReview: 'Jon Bell 提交了访问审核',
        accountPaused: 'Kai Martin 账户已暂停',
        twelveMinutes: '12 分钟前',
        thirtySixMinutes: '36 分钟前',
        twoHours: '2 小时前'
      }
    },
    form: {
      createTitle: '新增用户',
      editTitle: '编辑 {name}',
      createDescription: '为模板创建一个 mock 用户资料。',
      editDescription: '更新这个 mock 用户资料。',
      selectRole: '选择角色',
      selectStatus: '选择状态',
      name: '姓名',
      email: '邮箱',
      role: '角色',
      status: '状态',
      region: '地区',
      regionHelp: '保持模块自有；你的后端可以提供可选地区。',
      notes: '备注',
      notesHelp: '可选的运营上下文。',
      notesPlaceholder: '添加审核备注或交接说明。'
    },
    roles: {
      owner: '所有者',
      operator: '操作员',
      auditor: '审计员',
      analyst: '分析师'
    },
    statuses: {
      active: '活跃',
      review: '审核中',
      paused: '已暂停'
    },
    columns: {
      name: '姓名',
      email: '邮箱',
      role: '角色',
      region: '地区',
      status: '状态'
    }
  },
  validation: {
    requiredLabel: '必填',
    optionalLabel: '可选',
    email: '请输入有效的邮箱地址。',
    nameRequired: '请输入姓名。',
    passwordRequired: '请输入密码。',
    workspaceRequired: '请输入工作区名称。',
    passwordMin: '密码至少需要 8 个字符。',
    roleRequired: '请选择角色。',
    statusRequired: '请选择状态。'
  },
  common: {
    primitives: {
      validationTitle: '请检查以下字段',
      cancel: '取消',
      save: '保存',
      saving: '保存中…',
      unsavedChanges: '有未保存的修改',
      noChanges: '暂无修改',
      clear: '清除',
      close: '关闭',
      closeDrawer: '关闭抽屉',
      previous: '上一页',
      next: '下一页',
      selectOption: '请选择',
      retry: '重试',
      open: '打开',
      bulkDescription: '批量操作仅作用于当前视图中选中的行。',
      bulkSelectionNone: '未选择任何行',
      bulkSelectionAll: '已选择全部 {count} 行',
      bulkSelectionSome: '已选择 {selected} / {total} 行'
    }
  },
  uiKit: {
    page: {
      foundations: { title: '基础', description: '可复用基础组件使用的主题 token、排版、圆角和状态语言。' },
      actions: { title: '操作', description: '按钮与命令控件，提供稳定尺寸、图标、禁用状态和方案感知的焦点环。' },
      inputs: { title: '输入', description: '继承主题 token 并暴露类型化 v-model 契约的表单与筛选控件。' },
      forms: { title: '表单', description: '用于标签、帮助文本、校验和常驻底栏操作的表单布局基础组件。' },
      tables: { title: '表格', description: '可组合的表格框架、工具栏、加载/空/错误状态、状态标签和分页控件。' },
      overlays: { title: '浮层', description: '用于聚焦创建/编辑任务的抽屉浮层，无需离开当前工作区路由。' },
      feedback: { title: '反馈', description: '用于后台页面和表格状态的可复用空状态、错误和状态组件。' }
    },
    foundations: {
      alertTitle: '基础组件使用语义化 token',
      alertDescription: '共享组件应通过 CSS 变量适配当前设计方案，而不是在业务页面里写方案分支。',
      metricCoverage: '方案覆盖',
      metricCoverageMeta: 'Crypto、Industrial、Cyberpunk',
      metricModes: '模式',
      metricModesMeta: '需要浅色与深色',
      metricLayouts: '布局',
      metricLayoutsMeta: '三栏、双栏、顶栏 QA',
      typeScale: '字号层级',
      displayHeading: '展示标题',
      sectionHeading: '区块标题',
      typeBody: '正文使用当前方案的前景 token，让每个基础组件在浅色、深色、Crypto 和 Industrial 模式下都能自适应。',
      statusTones: '状态色调',
      scrollArea: '滚动区域',
      scrollAreaDescription: '共享滚动容器隐藏原生轨道，并在内容之上绘制跟随 token 的滑块。',
      scrollItems: {
        routeAware: '路由感知的工作区界面',
        contextPanels: '上下文面板与抽屉',
        controlCenter: '控制中心设置',
        dataTables: '可横向溢出的数据表格',
        scrollbarTokens: '跟随主题的滚动条 token',
        overlayBars: '内容布局之外的浮层栏'
      }
    },
    actions: {
      alertTitle: '操作优先使用图标加简明文字',
      alertDescription: '紧凑工具使用纯图标按钮；结果需要明确时使用文字按钮。',
      buttonVariants: '按钮样式',
      create: '创建',
      export: '导出',
      refresh: '刷新',
      delete: '删除',
      sizes: '尺寸',
      small: '小',
      medium: '中',
      disabled: '禁用',
      persistentActions: '常驻表单操作',
      persistentActionsDescription: '底栏操作让抽屉和紧凑表单中的保存/取消位置保持稳定。',
      applyChanges: '应用修改',
      twoUnsaved: '2 项未保存'
    },
    inputs: {
      alertTitle: '输入控件使用类型化 v-model 契约',
      alertDescription: '文本、选择、开关和复选框基础组件让表单状态显式化，由模块决定校验与持久化。',
      textInputs: '文本输入',
      fieldName: '姓名',
      nameHelp: '默认文本输入',
      fieldNameEmail: '邮箱',
      emailError: '请输入有效的邮箱地址。',
      fieldNameSlug: '生成的 slug',
      slugHelp: '只读和禁用状态保持布局稳定，无需额外的自定义类。',
      fieldNameLocked: '已锁定的提供方',
      selectTextareaSwitch: '选择、文本域、开关',
      fieldRole: '角色',
      fieldNotes: '备注',
      switchEnable: '启用工作区通知',
      switchDisabled: '禁用开关',
      checkboxReviewed: '标记策略已审核',
      checkboxReviewedDescription: '复选框适用于确认操作和表格选择。',
      checkboxPartial: '部分选中的团队',
      checkboxPartialDescription: '不确定状态对应批量选择表格。',
      fieldApprovalMode: '审批模式',
      approvalModeHelp: '单选组使用与复选框相同的方案感知控件样式。',
      roles: { owner: '所有者', operator: '操作员', auditor: '审计员' },
      approval: {
        manual: '人工审核',
        manualDescription: '操作员在每个工作流生效前逐一审批。',
        scheduled: '定时窗口',
        scheduledDescription: '变更等待维护窗口后再发布。',
        locked: '策略锁定',
        lockedDescription: '禁用项保持布局稳定，同时展示不可用的选项。'
      }
    },
    forms: {
      alertTitle: '校验保持在模块内部',
      alertDescription: '共享基础组件负责渲染状态和布局；业务模块仍拥有字段规则、业务文案和提交行为。',
      errorOwner: '请输入所有者。',
      errorEmail: '请输入有效的通知邮箱。',
      errorSummary: '请输入摘要。',
      fieldOwner: '所有者',
      fieldOwnerError: '请输入所有者。',
      fieldStatus: '状态',
      statuses: { active: '活跃', review: '审核中', paused: '已暂停' },
      fieldEmail: '通知邮箱',
      fieldEmailError: '请输入用于工作流通知的有效邮箱。',
      fieldReference: '引用 ID',
      fieldReferenceHelp: '只读字段可以展示 API 托管或生成的值，而不变为可编辑。',
      fieldSummary: '摘要',
      fieldSummaryHelp: '使用此布局承载模块自有的表单文案和校验。',
      submit: '发布工作流',
      threeFieldsChanged: '3 项已修改'
    },
    tables: {
      frameTitle: '运营视图',
      frameDescription: '使用共享表格基础组件组合的紧凑数据表。',
      searchViews: '搜索视图',
      compact: '紧凑',
      comfortable: '舒适',
      sort: '排序',
      newView: '新建视图',
      assignOwner: '指派所有者',
      archive: '归档',
      selectAll: '选择所有行',
      selectRow: '选择 {name}',
      columns: { name: '名称', owner: '所有者', status: '状态', risk: '风险', updated: '更新时间', actions: '操作' },
      statusLabels: { ready: '就绪', review: '审核中', blocked: '已阻塞' },
      riskLabels: { low: '低', medium: '中', high: '高' },
      updatedLabels: { today: '今天', yesterday: '昨天', twoDays: '2 天前' },
      open: '打开',
      loadingTitle: '加载中',
      loadingDescription: '骨架行在查询解析期间保持表格结构。',
      emptyTitle: '没有匹配的视图',
      emptyDescription: '调整筛选或创建第一个运营视图。',
      errorTitle: '无法加载视图',
      errorDescription: 'API adapter 可在此处暴露重试操作。',
      retry: '重试',
      paginationRange: '{start}-{end} / 共 {total}',
      paginationPage: '第 {page} / {pageCount} 页',
      rows: {
        revenueReview: '收入复核',
        accessAudit: '访问审计',
        queueHealth: '队列健康',
        providerDrift: '提供方漂移'
      }
    },
    overlays: {
      alertTitle: '抽屉工作流保留页面上下文',
      alertDescription: '用于简短的创建/编辑任务，此时浮层背后的表格或仪表盘仍然重要。',
      drawerCarrier: '抽屉载体',
      drawerCarrierDescription: '在需要与背后的列表或仪表盘保持视觉关联的简短后台工作流中使用抽屉基础组件。',
      openDrawer: '打开抽屉',
      drawerTitle: '编辑工作区',
      drawerDescription: '使用共享表单基础组件组合的紧凑浮层。',
      errorWorkspaceName: '请输入工作区名称。',
      errorConfirmOwner: '保存前请确认工作区所有者。',
      fieldWorkspaceName: '工作区名称',
      checkboxOwnerReviewed: '所有者已审核',
      checkboxOwnerReviewedDescription: '确认状态仅属于此工作流；共享 UI 只负责渲染控件。',
      submit: '保存工作区'
    },
    feedback: {
      emptyState: '空状态',
      emptyTitle: '当前视图没有记录',
      emptyDescription: '此区域会适配当前主题，并可承载主要恢复操作。',
      createRecord: '创建记录',
      stateLanguage: '状态语言',
      statusDraft: '草稿',
      statusHealthy: '健康',
      statusReview: '审核中',
      statusBlocked: '已阻塞',
      alerts: '提示',
      alertProviderTitle: '提供方未配置',
      alertProviderDescription: '当可选集成在默认 scaffold 中被有意省略时使用此状态。',
      alertSavedTitle: '已保存修改',
      alertSavedDescription: '正向反馈应简短，并与已完成的操作关联。',
      alertReviewTitle: '待审核',
      alertReviewDescription: '警告反馈用于引起注意，但不阻塞当前页面。',
      alertFailedTitle: '操作失败',
      alertFailedDescription: '危险反馈应尽量给出下一步恢复操作。',
      retry: '重试',
      loadingAndValidation: '加载与校验',
      errorNameRequired: '请输入姓名。',
      errorEmailAt: '请输入有效的通知邮箱。'
    }
  }
} as const

export default zhCN
