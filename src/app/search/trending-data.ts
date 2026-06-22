export interface TrendingRepo {
  owner: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  starsToday: number;
  contributors: string[];
}

export const TRENDING_REPOS: TrendingRepo[] = [
  {
    owner: 'palmier-io',
    name: 'palmier-pro',
    description: 'macOS video editor built for AI',
    language: 'Swift',
    languageColor: '#F05138',
    stars: 6263,
    forks: 452,
    starsToday: 1834,
    contributors: [],
  },
  {
    owner: 'calesthi',
    name: 'OpenMontage',
    description:
      "World's first open-source, agentic video production system. 12 pipelines, 52 tools, 500+ agent skills. Turn your AI coding assistant into a full video production studio.",
    language: 'Python',
    languageColor: '#3572A5',
    stars: 10047,
    forks: 1389,
    starsToday: 987,
    contributors: [],
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
    contributors: [],
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
    contributors: [],
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
    contributors: [],
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
    contributors: [],
  },
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
    contributors: [],
  },
  {
    owner: 'DeusData',
    name: 'codebase-memory-mcp',
    description:
      'High-performance code intelligence MCP server. Indexes codebases into a persistent knowledge graph - average repo in milliseconds. 158 languages, sub-ms queries, 99% fewer tokens. Single static binary, zero dependencies.',
    language: 'C',
    languageColor: '#555555',
    stars: 10846,
    forks: 814,
    starsToday: 1032,
    contributors: [],
  },
  {
    owner: 'mukul975',
    name: 'Anthropic-Cybersecurity-Skills',
    description:
      '754 structured cybersecurity skills for AI agents. Mapped to 5 frameworks: MITRE ATT&CK, NIST CSF 2.0, MITRE ATLAS, D3FEND & NIST AI RMF. agentskills.io standard. Works with Claude Code, GitHub Copilot, Codex CLI, Cursor, Gemini CLI & 20+ platforms. 26 security domains. Apache 2.0',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 18053,
    forks: 2158,
    starsToday: 361,
    contributors: [],
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
    contributors: [],
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
    contributors: [],
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
    contributors: [],
  },
];
