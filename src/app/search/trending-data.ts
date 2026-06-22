export interface TrendingRepo {
  owner: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  starsToday: number;
}

export interface TrendingDeveloper {
  rank: number;
  displayName: string;
  username: string;
  popularRepo: {
    name: string;
    description: string;
  };
}

export const TRENDING_REPOS: TrendingRepo[] = [
  {
    owner: 'bytedance',
    name: 'deer-flow',
    description:
      'An open-source long-horizon SuperAgent harness that researches, codes, and creates. With the help of sandboxes, memories, tools, skill, subagents and message gateway, it handles different levels of tasks that could take minutes to hours.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 72892,
    forks: 9863,
    starsToday: 442,
  },
  {
    owner: 'koala73',
    name: 'worldmonitor',
    description:
      'Real-time global intelligence dashboard. AI-powered news aggregation, geopolitical monitoring, and infrastructure tracking in a unified situational awareness interface',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 58401,
    forks: 9229,
    starsToday: 163,
  },
  {
    owner: 'penpot',
    name: 'penpot',
    description: 'Penpot: The open-source design tool for design and code collaboration',
    language: 'Clojure',
    languageColor: '#5881D8',
    stars: 52546,
    forks: 3362,
    starsToday: 1135,
  },
  {
    owner: 'ZhuLinsen',
    name: 'daily_stock_analysis',
    description:
      'LLM-powered multi-market stock analysis system with multi-source market data, real-time news, decision dashboard, automated notifications, and cost-free scheduled runs.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 45252,
    forks: 41729,
    starsToday: 568,
  },
  {
    owner: 'microsoft',
    name: 'semantic-kernel',
    description:
      'Integrate cutting-edge LLM technology quickly and easily into your apps with Semantic Kernel',
    language: 'C#',
    languageColor: '#178600',
    stars: 23400,
    forks: 3600,
    starsToday: 312,
  },
  {
    owner: 'anthropics',
    name: 'claude-code',
    description:
      'An agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 18200,
    forks: 890,
    starsToday: 520,
  },
  {
    owner: 'tursodatabase',
    name: 'turso',
    description: 'Turso is an in-process SQL database, compatible with SQLite.',
    language: 'Rust',
    languageColor: '#DEA584',
    stars: 21025,
    forks: 1074,
    starsToday: 548,
  },
  {
    owner: 'openai',
    name: 'codex',
    description:
      'Lightweight coding agent that runs in your terminal',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 25800,
    forks: 1900,
    starsToday: 890,
  },
  {
    owner: 'mukul975',
    name: 'Anthropic-Cybersecurity-Skills',
    description:
      '754 structured cybersecurity skills for AI agents. Mapped to 5 frameworks: MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, D3FEND & NIST AI RMF.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 18053,
    forks: 2158,
    starsToday: 361,
  },
  {
    owner: 'DeusData',
    name: 'codebase-memory-mcp',
    description:
      'High-performance code intelligence MCP server. Indexes codebases into a persistent knowledge graph - average repo in milliseconds. 158 languages, sub-ms queries, 99% fewer tokens.',
    language: 'C',
    languageColor: '#555555',
    stars: 10846,
    forks: 814,
    starsToday: 1032,
  },
  {
    owner: 'smicallef',
    name: 'spiderfoot',
    description: 'SpiderFoot automates OSINT for threat intelligence and mapping your attack surface.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 18912,
    forks: 3117,
    starsToday: 294,
  },
  {
    owner: 'topoteretes',
    name: 'cognee',
    description:
      'Cognee is the open-source AI memory platform for agents. Give your AI agents persistent long-term memory across sessions with a self-hosted knowledge graph engine.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 18856,
    forks: 1985,
    starsToday: 347,
  },
  {
    owner: 'palmier-io',
    name: 'palmier-pro',
    description: 'macOS video editor built for AI',
    language: 'Swift',
    languageColor: '#F05138',
    stars: 6263,
    forks: 452,
    starsToday: 1834,
  },
  {
    owner: 'calesthi',
    name: 'OpenMontage',
    description:
      "World's first open-source, agentic video production system. 12 pipelines, 52 tools, 500+ agent skills.",
    language: 'Python',
    languageColor: '#3572A5',
    stars: 10047,
    forks: 1389,
    starsToday: 987,
  },
  {
    owner: 'mikumifa',
    name: 'biliTickerBuy',
    description: 'b站会员购购票辅助工具',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 3780,
    forks: 469,
    starsToday: 67,
  },
  {
    owner: 'oven-sh',
    name: 'bun',
    description: 'Incredibly fast JavaScript runtime, bundler, test runner, and package manager — all in one.',
    language: 'Zig',
    languageColor: '#ec915c',
    stars: 76500,
    forks: 2800,
    starsToday: 145,
  },
  {
    owner: 'vercel',
    name: 'next.js',
    description: 'The React Framework for the Web.',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 132000,
    forks: 28500,
    starsToday: 210,
  },
  {
    owner: 'denoland',
    name: 'deno',
    description: 'A modern runtime for JavaScript and TypeScript.',
    language: 'Rust',
    languageColor: '#DEA584',
    stars: 101000,
    forks: 5600,
    starsToday: 178,
  },
  {
    owner: 'langchain-ai',
    name: 'langchain',
    description: 'Build context-aware reasoning applications. LangChain framework for building LLM-powered apps.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 105000,
    forks: 16900,
    starsToday: 390,
  },
  {
    owner: 'supabase',
    name: 'supabase',
    description: 'The open source Firebase alternative. Instant APIs, Auth, Realtime, Storage, and Vector Embeddings.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 77800,
    forks: 7300,
    starsToday: 256,
  },
];

export const TRENDING_DEVELOPERS: TrendingDeveloper[] = [
  {
    rank: 1,
    displayName: 'Cole Murray',
    username: 'ColeMurray',
    popularRepo: {
      name: 'background-agents',
      description: 'An open-source background agents coding system',
    },
  },
  {
    rank: 2,
    displayName: 'rUv',
    username: 'ruvnet',
    popularRepo: {
      name: 'RuView',
      description: 'RuView turns commodity WiFi signals into real-time spatial intelligence, vital sign monitoring, and presence detection — all without a camera',
    },
  },
  {
    rank: 3,
    displayName: 'Elie Habib',
    username: 'koala73',
    popularRepo: {
      name: 'worldmonitor',
      description: 'Real-time global intelligence dashboard. AI-powered news aggregation, geopolitical monitoring, and infrastructure tracking in a unified s...',
    },
  },
  {
    rank: 4,
    displayName: 'mumu',
    username: 'ZhuLinsen',
    popularRepo: {
      name: 'daily_stock_analysis',
      description: 'LLM 驱动的多市场股票智能分析系统：多源行情、实时新闻、决策看板与自动推送，支持零成本定时运行。',
    },
  },
  {
    rank: 5,
    displayName: 'Daniel Kraus',
    username: 'dakra',
    popularRepo: {
      name: 'ghostel',
      description: 'Terminal emulator powered by libghostty',
    },
  },
  {
    rank: 6,
    displayName: 'Q00',
    username: 'Q00',
    popularRepo: {
      name: 'ouroboros',
      description: 'Agent OS: Stop prompting. Start specifying.',
    },
  },
  {
    rank: 7,
    displayName: 'Eric Buehler',
    username: 'EricLBuehler',
    popularRepo: {
      name: 'mistral.rs',
      description: 'Fast, flexible LLM inference',
    },
  },
  {
    rank: 8,
    displayName: 'Nik Shevchenko',
    username: 'kodjima33',
    popularRepo: {
      name: 'omi',
      description: 'Open-source AI wearable that records conversations, transcribes them, and extracts insights',
    },
  },
  {
    rank: 9,
    displayName: 'Jarrod Watts',
    username: 'jarrodwatts',
    popularRepo: {
      name: 'claude-hud',
      description: 'A Claude Code plugin that shows what\'s happening - context usage, active tools, running agents, and todo progress',
    },
  },
  {
    rank: 10,
    displayName: 'Clement Tsang',
    username: 'ClementTsang',
    popularRepo: {
      name: 'bottom',
      description: 'Yet another cross-platform graphical process/system monitor.',
    },
  },
  {
    rank: 11,
    displayName: 'Mahesh Sanikommu',
    username: 'MaheshtheDev',
    popularRepo: {
      name: 'supermemory',
      description: 'Supermemory: Your AI memory. Search and remember everything across all your apps.',
    },
  },
  {
    rank: 12,
    displayName: 'Marketcalls',
    username: 'marketcalls',
    popularRepo: {
      name: 'openalgo',
      description: 'Open Source Algo Trading Platform for Everyone',
    },
  },
  {
    rank: 13,
    displayName: 'Raulen Chai',
    username: 'raulenchai',
    popularRepo: {
      name: 'Rapid-MLX',
      description: 'The fastest local AI engine for Apple Silicon. 4.2x faster than Ollama, 0.08s cached TTFT, 100% tool calling, 17 tool parsers, prompt cac...',
    },
  },
  {
    rank: 14,
    displayName: 'xiaolai',
    username: 'xiaolai',
    popularRepo: {
      name: 'too-late',
      description: '《迟到》— 笑来的一部中篇小说（十六年整 生不见人 死不见尸）',
    },
  },
  {
    rank: 15,
    displayName: 'Swyx',
    username: 'swyxio',
    popularRepo: {
      name: 'ai-engineering',
      description: 'A lightweight, fast introduction to AI Engineering for experienced software engineers',
    },
  },
  {
    rank: 16,
    displayName: 'Simon Willison',
    username: 'simonw',
    popularRepo: {
      name: 'datasette',
      'description': 'An open source multi-tool for exploring and publishing data',
    },
  },
  {
    rank: 17,
    displayName: 'Theo Browne',
    username: 't3dotgg',
    popularRepo: {
      name: 'ping',
      description: 'Dead simple uptime monitoring. Get notified when your website goes down via Discord, Slack, or email.',
    },
  },
  {
    rank: 18,
    displayName: 'Fireship',
    username: 'fireship-io',
    popularRepo: {
      name: 'bun-hono-turso-demo',
      description: 'Ultrafast fullstack demo with Bun, Hono, and Turso',
    },
  },
  {
    rank: 19,
    displayName: 'Takeshi Iwana',
    username: 'miyakogi',
    popularRepo: {
      name: 'devtool',
      description: 'Open Source AI Coding Agent - runs locally, uses your preferred LLM',
    },
  },
  {
    rank: 20,
    displayName: 'Anil Dash',
    username: 'anildash',
    popularRepo: {
      name: 'social-web-arch',
      description: 'A framework for building social web applications with ActivityPub and AT Protocol support',
    },
  },
];
