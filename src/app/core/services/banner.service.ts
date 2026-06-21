import { Injectable } from '@angular/core';
import rough from 'roughjs';

interface BannerOptions {
  width: number;
  height: number;
  category: string;
  seed: string;
  tags: string[];
}

const CATEGORY_COLORS: Record<string, { stroke: string; fill: string }> = {
  ai: { stroke: '#8b5cf6', fill: '#8b5cf620' },
  tech: { stroke: '#3b82f6', fill: '#3b82f620' },
  startup: { stroke: '#f59e0b', fill: '#f59e0b20' },
  security: { stroke: '#ef4444', fill: '#ef444420' },
  science: { stroke: '#10b981', fill: '#10b98120' },
  gadgets: { stroke: '#06b6d4', fill: '#06b6d420' },
};

const CATEGORY_DEFAULTS: Record<string, string> = {
  ai: 'neural-network',
  tech: 'code-editor',
  startup: 'growth-chart',
  security: 'shield-lock',
  science: 'space',
  gadgets: 'smartphone',
};

const KEYWORD_MAP: Record<string, string[]> = {
  'neural-network': ['neural', 'rede neural', 'deep learning', 'brain', 'neuralink', 'cerebral', 'camada', 'layer'],
  'chatbot': ['chatbot', 'assistente', 'conversa', 'nlp', 'llm', 'linguagem', 'mensagem', 'dialogo'],
  'computer-vision': ['visão', 'imagem', 'reconhecimento', 'face', 'câmera', 'detect', 'visual', 'objeto'],
  'robotics': ['robô', 'braço mecânico', 'automação', 'robótica', 'humanoid', 'engrenagem', 'motor'],
  'data-pipeline': ['dados', 'pipeline', 'fluxo', 'processamento', 'analytics', 'big data', 'etl', 'stream'],
  'ai-brain': ['inteligência', 'cognitiv', 'raciocínio', 'aprendizado', 'machine learning', 'ml', 'treinamento'],
  'code-editor': ['código', 'programação', 'framework', 'desenvolvimento', 'software', 'linguagem', 'compilador', 'ide'],
  'cloud': ['cloud', 'nuvem', 'servidor', 'aws', 'azure', 'hosting', 'infraestrutura', 'saas'],
  'mobile-app': ['mobile', 'app', 'smartphone', 'android', 'ios', 'aplicativo', 'tablet', 'play store'],
  'api-microservices': ['api', 'microservices', 'rest', 'endpoint', 'integração', 'grpc', 'graphql', 'webhook'],
  'database': ['banco de dados', 'sql', 'nosql', 'mysql', 'postgresql', 'mongodb', 'tabela', 'query'],
  'devops': ['devops', 'ci/cd', 'deploy', 'pipeline', 'docker', 'kubernetes', 'container', 'infra'],
  'rocket-launch': ['lançamento', 'startup', 'fundação', 'produto', 'mvp', 'beta', 'estréia', 'debut'],
  'growth-chart': ['crescimento', 'receita', 'investimento', 'funding', 'série', 'valuation', 'round', 'serie'],
  'team-network': ['equipe', 'time', 'colaboração', 'cultura', 'hiring', 'co-fundador', 'parceiro', 'equipe'],
  'competition': ['competição', 'mercado', 'concorrência', 'rivalidade', 'disputa', 'liderança', 'market share'],
  'money-coins': ['dinheiro', 'moeda', 'finanças', 'criptomoeda', 'bitcoin', 'investimento', 'token', 'blockchain'],
  'shield-lock': ['proteção', 'firewall', 'defesa', 'antivírus', 'segurança', 'vpn', 'firewall', 'defesa cibernética'],
  'encryption': ['criptografia', 'encriptação', 'dados', 'senha', 'blockchain', 'hash', 'chave', 'cifra'],
  'cyber-attack': ['ataque', 'vulnerabilidade', 'exploit', 'malware', 'phishing', 'ransomware', 'breach', 'invasão'],
  'authentication': ['autenticação', 'biometria', 'login', 'identidade', 'verificação', 'sso', 'mfa', '2fa'],
  'privacy': ['privacidade', 'dados pessoais', 'gdpr', 'consentimento', 'lgpd', 'anonimato', 'proteção de dados'],
  'space': ['espaço', 'planeta', 'órbita', 'estrela', 'galáxia', 'nasa', 'foguete', 'lua', 'marte'],
  'dna-helix': ['dna', 'genética', 'biotecnologia', 'genoma', 'célula', 'biologia', 'gene', 'sequenciamento'],
  'quantum': ['quântico', 'qubit', 'superposição', 'computação quântica', 'ibm', 'quantum', 'entrelaçamento'],
  'molecule': ['molécula', 'átomo', 'química', 'física', 'material', 'nanotecnologia', 'cristal', 'elemento'],
  'climate-tech': ['clima', 'sustentabilidade', 'energia', 'verde', 'carbono', 'renovável', 'fotovoltaica', 'eólica'],
  'smartphone': ['smartphone', 'celular', 'iphone', 'android', 'galaxy', 'pixel', 'celular', 'tela'],
  'wearable': ['relógio', 'wearable', 'fitbit', 'apple watch', 'pulseira', 'smartwatch', 'monitoramento'],
  'audio': ['fone', 'áudio', 'som', 'música', 'headphone', 'airpods', 'caixa de som', 'altfalante'],
  'smart-home': ['casa inteligente', 'iot', 'google home', 'alexa', 'assistente', 'automação residencial', 'smart'],
  'drone': ['drone', 'voo', 'aéreo', 'câmera aérea', 'gps', 'fpv', 'quadricóptero', 'veículo aéreo'],
};

type DrawFn = (
  rc: ReturnType<typeof rough.svg>,
  svg: SVGSVGElement,
  w: number,
  h: number,
  colors: { stroke: string; fill: string },
  rand: () => number,
) => void;

@Injectable({ providedIn: 'root' })
export class BannerService {
  generate(svgElement: SVGSVGElement, options: BannerOptions): void {
    const { width, height, category, seed, tags } = options;
    const colors: { stroke: string; fill: string } = CATEGORY_COLORS[category] ?? {
      stroke: '#3b82f6',
      fill: '#3b82f620',
    };
    const rc = rough.svg(svgElement);
    const rand = this.createRng(seed);
    const illustration = this.selectIllustration(category, seed, tags);

    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', String(width));
    bg.setAttribute('height', String(height));
    bg.setAttribute('fill', '#171717');
    svgElement.appendChild(bg);

    const draw = this.drawMethods[illustration] ?? this.drawMethods[CATEGORY_DEFAULTS[category]!];
    if (draw) {
      draw(rc, svgElement, width, height, colors, rand);
    }
  }

  private selectIllustration(category: string, title: string, tags: string[]): string {
    const text = `${title} ${tags.join(' ')}`.toLowerCase();
    const candidates = Object.entries(KEYWORD_MAP)
      .filter(([, keywords]) => {
        const categoryPrefix = category === 'ai' ? ['neural-network', 'chatbot', 'computer-vision', 'robotics', 'data-pipeline', 'ai-brain']
          : category === 'tech' ? ['code-editor', 'cloud', 'mobile-app', 'api-microservices', 'database', 'devops']
          : category === 'startup' ? ['rocket-launch', 'growth-chart', 'team-network', 'competition', 'money-coins']
          : category === 'security' ? ['shield-lock', 'encryption', 'cyber-attack', 'authentication', 'privacy']
          : category === 'science' ? ['space', 'dna-helix', 'quantum', 'molecule', 'climate-tech']
          : ['smartphone', 'wearable', 'audio', 'smart-home', 'drone'];
        return categoryPrefix.includes(Object.keys(KEYWORD_MAP).find((k) => KEYWORD_MAP[k] === keywords) ?? '');
      });

    let bestType = CATEGORY_DEFAULTS[category] ?? 'code-editor';
    let bestScore = 0;

    for (const [type, keywords] of candidates) {
      let score = 0;
      for (const kw of keywords) {
        if (text.includes(kw)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestType = type;
      }
    }

    return bestType;
  }

  private createRng(seed: string): () => number {
    let h = this.hashString(seed);
    return () => {
      h |= 0;
      h = (h + 0x6d2b79f5) | 0;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
    }
    return hash;
  }

  private readonly drawMethods: Record<string, DrawFn> = {
    'neural-network': (rc, svg, w, h, colors, rand) => this.drawNeuralNetwork(rc, svg, w, h, colors, rand),
    'chatbot': (rc, svg, w, h, colors, rand) => this.drawChatbot(rc, svg, w, h, colors, rand),
    'computer-vision': (rc, svg, w, h, colors, rand) => this.drawComputerVision(rc, svg, w, h, colors, rand),
    'robotics': (rc, svg, w, h, colors, rand) => this.drawRobotics(rc, svg, w, h, colors, rand),
    'data-pipeline': (rc, svg, w, h, colors, rand) => this.drawDataPipeline(rc, svg, w, h, colors, rand),
    'ai-brain': (rc, svg, w, h, colors, rand) => this.drawAiBrain(rc, svg, w, h, colors, rand),
    'code-editor': (rc, svg, w, h, colors, rand) => this.drawCodeEditor(rc, svg, w, h, colors, rand),
    'cloud': (rc, svg, w, h, colors, rand) => this.drawCloud(rc, svg, w, h, colors, rand),
    'mobile-app': (rc, svg, w, h, colors, rand) => this.drawMobileApp(rc, svg, w, h, colors, rand),
    'api-microservices': (rc, svg, w, h, colors, rand) => this.drawApiMicroservices(rc, svg, w, h, colors, rand),
    'database': (rc, svg, w, h, colors, rand) => this.drawDatabase(rc, svg, w, h, colors, rand),
    'devops': (rc, svg, w, h, colors, rand) => this.drawDevops(rc, svg, w, h, colors, rand),
    'rocket-launch': (rc, svg, w, h, colors, rand) => this.drawRocketLaunch(rc, svg, w, h, colors, rand),
    'growth-chart': (rc, svg, w, h, colors, rand) => this.drawGrowthChart(rc, svg, w, h, colors, rand),
    'team-network': (rc, svg, w, h, colors, rand) => this.drawTeamNetwork(rc, svg, w, h, colors, rand),
    'competition': (rc, svg, w, h, colors, rand) => this.drawCompetition(rc, svg, w, h, colors, rand),
    'money-coins': (rc, svg, w, h, colors, rand) => this.drawMoneyCoins(rc, svg, w, h, colors, rand),
    'shield-lock': (rc, svg, w, h, colors, rand) => this.drawShieldLock(rc, svg, w, h, colors, rand),
    'encryption': (rc, svg, w, h, colors, rand) => this.drawEncryption(rc, svg, w, h, colors, rand),
    'cyber-attack': (rc, svg, w, h, colors, rand) => this.drawCyberAttack(rc, svg, w, h, colors, rand),
    'authentication': (rc, svg, w, h, colors, rand) => this.drawAuthentication(rc, svg, w, h, colors, rand),
    'privacy': (rc, svg, w, h, colors, rand) => this.drawPrivacy(rc, svg, w, h, colors, rand),
    'space': (rc, svg, w, h, colors, rand) => this.drawSpace(rc, svg, w, h, colors, rand),
    'dna-helix': (rc, svg, w, h, colors, rand) => this.drawDnaHelix(rc, svg, w, h, colors, rand),
    'quantum': (rc, svg, w, h, colors, rand) => this.drawQuantum(rc, svg, w, h, colors, rand),
    'molecule': (rc, svg, w, h, colors, rand) => this.drawMolecule(rc, svg, w, h, colors, rand),
    'climate-tech': (rc, svg, w, h, colors, rand) => this.drawClimateTech(rc, svg, w, h, colors, rand),
    'smartphone': (rc, svg, w, h, colors, rand) => this.drawSmartphone(rc, svg, w, h, colors, rand),
    'wearable': (rc, svg, w, h, colors, rand) => this.drawWearable(rc, svg, w, h, colors, rand),
    'audio': (rc, svg, w, h, colors, rand) => this.drawAudio(rc, svg, w, h, colors, rand),
    'smart-home': (rc, svg, w, h, colors, rand) => this.drawSmartHome(rc, svg, w, h, colors, rand),
    'drone': (rc, svg, w, h, colors, rand) => this.drawDrone(rc, svg, w, h, colors, rand),
  };

  // ── AI ILLUSTRATIONS ──────────────────────────────────────────

  private drawNeuralNetwork(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const layerCount = 3 + Math.floor(rand() * 3);
    const layers: number[] = [];
    for (let i = 0; i < layerCount; i++) layers.push(2 + Math.floor(rand() * 5));
    const layerGap = w / (layers.length + 1);
    const nodePositions: { x: number; y: number }[][] = [];
    for (let l = 0; l < layers.length; l++) {
      const count = layers[l]!;
      const nodes: { x: number; y: number }[] = [];
      const nodeGap = h / (count + 1);
      for (let n = 0; n < count; n++) {
        nodes.push({ x: layerGap * (l + 1) + (rand() - 0.5) * 10, y: nodeGap * (n + 1) + (rand() - 0.5) * 8 });
      }
      nodePositions.push(nodes);
    }
    for (let l = 0; l < nodePositions.length - 1; l++) {
      const cur = nodePositions[l]!;
      const nxt = nodePositions[l + 1]!;
      for (const from of cur) {
        for (const to of nxt) {
          if (rand() > 0.3) svg.appendChild(rc.line(from.x, from.y, to.x, to.y, { stroke: colors.stroke + '4d', strokeWidth: 1, roughness: 1.5 }));
        }
      }
    }
    for (const layer of nodePositions) {
      for (const node of layer) {
        svg.appendChild(rc.circle(node.x, node.y, 12 + rand() * 14, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1 + rand() * 0.8 }));
      }
    }
  }

  private drawChatbot(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const bubbles = [
      { x: w * 0.15, y: h * 0.25, bw: w * 0.4, bh: h * 0.2, fromLeft: true },
      { x: w * 0.45, y: h * 0.5, bw: w * 0.35, bh: h * 0.18, fromLeft: false },
      { x: w * 0.2, y: h * 0.72, bw: w * 0.45, bh: h * 0.15, fromLeft: true },
    ];
    for (const b of bubbles) {
      svg.appendChild(rc.rectangle(b.x, b.y, b.bw, b.bh, {
        fill: b.fromLeft ? colors.fill : '#1f1f1f',
        fillStyle: 'solid',
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.5,
      }));
      const lineCount = 2 + Math.floor(rand() * 3);
      for (let i = 0; i < lineCount; i++) {
        const ly = b.y + 10 + i * (b.bh / (lineCount + 1));
        svg.appendChild(rc.line(b.x + 12, ly, b.x + b.bw * (0.4 + rand() * 0.4), ly, { stroke: colors.stroke + '66', strokeWidth: 1.5, roughness: 1.5 }));
      }
    }
    for (let i = 0; i < 3; i++) {
      svg.appendChild(rc.circle(w * 0.85 + rand() * 15, h * 0.2 + i * h * 0.25, 8 + rand() * 6, { stroke: colors.stroke + '50', strokeWidth: 1, roughness: 1 }));
    }
  }

  private drawComputerVision(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const eyeX = w * 0.5;
    const eyeY = h * 0.45;
    const eyeW = w * 0.3;
    const eyeH = h * 0.25;
    svg.appendChild(rc.path(`M${eyeX - eyeW / 2},${eyeY} Q${eyeX},${eyeY - eyeH} ${eyeX + eyeW / 2},${eyeY} Q${eyeX},${eyeY + eyeH} ${eyeX - eyeW / 2},${eyeY} Z`, {
      fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5,
    }));
    svg.appendChild(rc.circle(eyeX, eyeY, eyeH * 0.6, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.circle(eyeX, eyeY, eyeH * 0.25, { fill: colors.stroke, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 0.8 }));
    const boxCount = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < boxCount; i++) {
      const bx = rand() * (w - 60);
      const by = rand() * (h - 40);
      svg.appendChild(rc.rectangle(bx, by, 40 + rand() * 30, 25 + rand() * 20, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.2, fill: 'none' }));
    }
  }

  private drawRobotics(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, _rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.5;
    svg.appendChild(rc.circle(cx, cy - 30, 35, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.circle(cx - 8, cy - 35, 5, { fill: colors.stroke, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1, roughness: 0.5 }));
    svg.appendChild(rc.circle(cx + 8, cy - 35, 5, { fill: colors.stroke, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1, roughness: 0.5 }));
    svg.appendChild(rc.line(cx, cy - 22, cx, cy + 10, { stroke: colors.stroke, strokeWidth: 3, roughness: 1.5 }));
    svg.appendChild(rc.rectangle(cx - 25, cy + 10, 50, 40, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.line(cx - 25, cy + 20, cx - 55, cy + 45, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.line(cx + 25, cy + 20, cx + 55, cy + 45, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.circle(cx - 55, cy + 45, 12, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.circle(cx + 55, cy + 45, 12, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.line(cx - 10, cy + 50, cx - 15, cy + 80, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.line(cx + 10, cy + 50, cx + 15, cy + 80, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    for (let i = 0; i < 3; i++) {
      svg.appendChild(rc.circle(cx - 20 + i * 20, cy + 25, 4, { stroke: colors.stroke + '80', strokeWidth: 1, roughness: 0.5 }));
    }
  }

  private drawDataPipeline(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const stages = 3 + Math.floor(rand() * 2);
    const stageGap = w / (stages + 1);
    for (let i = 0; i < stages; i++) {
      const sx = stageGap * (i + 1) - 30;
      const sy = h * 0.3;
      const sw = 60;
      const sh = h * 0.4;
      svg.appendChild(rc.rectangle(sx, sy, sw, sh, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
      const lineCount = 2 + Math.floor(rand() * 3);
      for (let j = 0; j < lineCount; j++) {
        const ly = sy + 10 + j * (sh / (lineCount + 1));
        svg.appendChild(rc.line(sx + 8, ly, sx + sw - 8, ly, { stroke: colors.stroke + '66', strokeWidth: 1.5, roughness: 1.5 }));
      }
      if (i < stages - 1) {
        svg.appendChild(rc.line(sx + sw + 5, h * 0.5, stageGap * (i + 2) - 35, h * 0.5, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
        const ax = stageGap * (i + 2) - 40;
        svg.appendChild(rc.line(ax, h * 0.5 - 5, ax, h * 0.5 + 5, { stroke: colors.stroke, strokeWidth: 2, roughness: 1 }));
        svg.appendChild(rc.line(ax, h * 0.5 - 5, ax + 8, h * 0.5, { stroke: colors.stroke, strokeWidth: 2, roughness: 1 }));
        svg.appendChild(rc.line(ax, h * 0.5 + 5, ax + 8, h * 0.5, { stroke: colors.stroke, strokeWidth: 2, roughness: 1 }));
      }
    }
  }

  private drawAiBrain(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.45;
    const r = Math.min(w, h) * 0.28;
    svg.appendChild(rc.circle(cx, cy, r * 2, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.8 }));
    const paths = 5 + Math.floor(rand() * 4);
    for (let i = 0; i < paths; i++) {
      const startAngle = rand() * Math.PI * 2;
      const endAngle = startAngle + Math.PI * (0.5 + rand() * 1);
      const midR = r * (0.3 + rand() * 0.5);
      const mx = cx + Math.cos(startAngle) * midR;
      const my = cy + Math.sin(startAngle) * midR;
      const ex = cx + Math.cos(endAngle) * midR;
      const ey = cy + Math.sin(endAngle) * midR;
      svg.appendChild(rc.line(mx, my, ex, ey, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.8 }));
      svg.appendChild(rc.circle(mx, my, 5 + rand() * 4, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1 }));
    }
  }

  // ── TECH ILLUSTRATIONS ────────────────────────────────────────

  private drawCodeEditor(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const winX = w * 0.05;
    const winY = h * 0.08;
    const winW = w * 0.55;
    const winH = h * 0.82;
    svg.appendChild(rc.rectangle(winX, winY, winW, winH, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 + rand(), fill: colors.fill, fillStyle: 'solid' }));
    const lineCount = 6 + Math.floor(rand() * 7);
    const startY = winY + 15;
    const gap = (winH - 30) / (lineCount + 1);
    for (let i = 0; i < lineCount; i++) {
      const y = startY + i * gap;
      const indent = Math.floor(rand() * 4) * 20;
      const lw = winW * (0.2 + rand() * 0.5);
      svg.appendChild(rc.line(winX + 12 + indent, y, winX + 12 + indent + lw, y, { stroke: colors.stroke + (rand() > 0.5 ? '66' : '99'), strokeWidth: 1.5, roughness: 1.5 }));
    }
    const extra = Math.floor(rand() * 3);
    for (let i = 0; i < extra; i++) {
      svg.appendChild(rc.rectangle(winX + winW + 15 + rand() * 20, winY + rand() * (winH - 40), 30 + rand() * 50, 20 + rand() * 35, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.5, fill: colors.fill, fillStyle: 'solid' }));
    }
  }

  private drawCloud(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.35;
    const cw = w * 0.5;
    const ch = h * 0.3;
    svg.appendChild(rc.path(`M${cx - cw * 0.3},${cy + ch * 0.3} Q${cx - cw * 0.5},${cy - ch * 0.2} ${cx - cw * 0.1},${cy - ch * 0.3} Q${cx},${cy - ch * 0.6} ${cx + cw * 0.15},${cy - ch * 0.25} Q${cx + cw * 0.45},${cy - ch * 0.35} ${cx + cw * 0.4},${cy + ch * 0.3} Z`, {
      fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.8,
    }));
    const serverCount = 2 + Math.floor(rand() * 2);
    for (let i = 0; i < serverCount; i++) {
      const sx = cx - 30 + i * 50;
      const sy = cy + ch * 0.4;
      svg.appendChild(rc.rectangle(sx, sy, 35, 25, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
      svg.appendChild(rc.line(sx, sy + 12, sx + 35, sy + 12, { stroke: colors.stroke + '80', strokeWidth: 1, roughness: 1 }));
      svg.appendChild(rc.line(cx, cy + ch * 0.3, sx + 17, sy, { stroke: colors.stroke + '60', strokeWidth: 1.5, roughness: 1.5 }));
    }
  }

  private drawMobileApp(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const pw = w * 0.22;
    const ph = h * 0.65;
    const px = (w - pw) / 2;
    const py = (h - ph) / 2;
    svg.appendChild(rc.rectangle(px, py, pw, ph, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.rectangle(px + 5, py + 12, pw - 10, ph - 24, { fill: '#121212', fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1, roughness: 0.8 }));
    const uiElements = 3 + Math.floor(rand() * 3);
    for (let i = 0; i < uiElements; i++) {
      const ey = py + 20 + i * ((ph - 40) / uiElements);
      svg.appendChild(rc.rectangle(px + 10, ey, pw - 20, 8 + rand() * 8, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke + '60', strokeWidth: 1, roughness: 1.2 }));
    }
    svg.appendChild(rc.circle(px + pw / 2, py + ph - 8, 8, { stroke: colors.stroke + '80', strokeWidth: 1, roughness: 0.8 }));
    for (let i = 0; i < 2; i++) {
      svg.appendChild(rc.circle(px - 25 - rand() * 20, py + 20 + i * 40, 6 + rand() * 4, { stroke: colors.stroke + '50', strokeWidth: 1, roughness: 1, fill: colors.fill, fillStyle: 'solid' }));
    }
  }

  private drawApiMicroservices(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const boxes = 3 + Math.floor(rand() * 2);
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < boxes; i++) {
      const bx = w * (0.1 + (i % 2) * 0.5 + rand() * 0.15);
      const by = h * (0.15 + Math.floor(i / 2) * 0.4 + rand() * 0.1);
      positions.push({ x: bx, y: by });
      svg.appendChild(rc.rectangle(bx, by, 60 + rand() * 20, 35 + rand() * 15, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
      svg.appendChild(rc.line(bx + 10, by + 15, bx + 40 + rand() * 15, by + 15, { stroke: colors.stroke + '66', strokeWidth: 1.5, roughness: 1.2 }));
      svg.appendChild(rc.line(bx + 10, by + 25, bx + 30 + rand() * 20, by + 25, { stroke: colors.stroke + '66', strokeWidth: 1.5, roughness: 1.2 }));
    }
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (rand() > 0.4) {
          const a = positions[i]!;
          const b = positions[j]!;
          svg.appendChild(rc.line(a.x + 30, a.y + 17, b.x + 30, b.y + 17, { stroke: colors.stroke + '60', strokeWidth: 1.5, roughness: 2 }));
        }
      }
    }
  }

  private drawDatabase(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, _rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const dw = w * 0.25;
    const dh = h * 0.5;
    svg.appendChild(rc.path(`M${cx - dw / 2},${cy - dh / 2} A${dw / 2},${dh * 0.15} 0 0 1 ${cx + dw / 2},${cy - dh / 2} L${cx + dw / 2},${cy + dh / 2} A${dw / 2},${dh * 0.15} 0 0 1 ${cx - dw / 2},${cy + dh / 2} Z`, {
      fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5,
    }));
    for (let i = 1; i <= 3; i++) {
      const yy = cy - dh / 2 + (dh / 4) * i;
      svg.appendChild(rc.path(`M${cx - dw / 2},${yy} A${dw / 2},${dh * 0.15} 0 0 0 ${cx + dw / 2},${yy}`, {
        stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.5, fill: 'none',
      }));
    }
    svg.appendChild(rc.circle(cx, cy, 8, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1 }));
  }

  private drawDevops(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const stages = 4;
    const stageW = w * 0.15;
    const stageH = h * 0.35;
    for (let i = 0; i < stages; i++) {
      const sx = w * 0.08 + i * (w * 0.22);
      const sy = h * 0.3;
      svg.appendChild(rc.rectangle(sx, sy, stageW, stageH, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
      svg.appendChild(rc.circle(sx + stageW / 2, sy + stageH / 2, 12 + rand() * 8, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.2, fill: colors.fill, fillStyle: 'solid' }));
      if (i < stages - 1) {
        svg.appendChild(rc.line(sx + stageW + 3, sy + stageH / 2, sx + stageW + w * 0.22 - 3, sy + stageH / 2, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
        svg.appendChild(rc.line(sx + stageW + w * 0.22 - 10, sy + stageH / 2 - 5, sx + stageW + w * 0.22 - 3, sy + stageH / 2, { stroke: colors.stroke, strokeWidth: 2, roughness: 1 }));
        svg.appendChild(rc.line(sx + stageW + w * 0.22 - 10, sy + stageH / 2 + 5, sx + stageW + w * 0.22 - 3, sy + stageH / 2, { stroke: colors.stroke, strokeWidth: 2, roughness: 1 }));
      }
    }
  }

  // ── STARTUP ILLUSTRATIONS ─────────────────────────────────────

  private drawRocketLaunch(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * (0.35 + rand() * 0.3);
    const cy = h * 0.4;
    const scale = 0.7 + rand() * 0.5;
    svg.appendChild(rc.path(`M${cx},${cy - 60 * scale} L${cx - 20 * scale},${cy + 20 * scale} L${cx + 20 * scale},${cy + 20 * scale} Z`, {
      fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2 + rand() * 0.6,
    }));
    svg.appendChild(rc.circle(cx, cy + 30 * scale, 18 * scale, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5, fill: colors.fill, fillStyle: 'solid' }));
    const flames = 3 + Math.floor(rand() * 5);
    for (let i = 0; i < flames; i++) {
      const fx = cx - 15 * scale + (30 * scale * i) / (flames - 1 || 1);
      svg.appendChild(rc.line(fx, cy + 25 * scale, fx + (rand() - 0.5) * 8, cy + 25 * scale + (15 + rand() * 25) * scale, { stroke: '#f59e0b99', strokeWidth: 1 + rand() * 1.5, roughness: 2 }));
    }
    for (let i = 0; i < 3 + Math.floor(rand() * 3); i++) {
      svg.appendChild(rc.circle(rand() * w, rand() * h, 2 + rand() * 3, { stroke: colors.stroke + '60', strokeWidth: 1, roughness: 1, fill: colors.fill, fillStyle: 'solid' }));
    }
  }

  private drawGrowthChart(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const barCount = 5 + Math.floor(rand() * 3);
    const barW = (w * 0.7) / barCount;
    const baseY = h * 0.8;
    svg.appendChild(rc.line(w * 0.1, baseY, w * 0.9, baseY, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.5 }));
    svg.appendChild(rc.line(w * 0.1, baseY, w * 0.1, h * 0.1, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.5 }));
    for (let i = 0; i < barCount; i++) {
      const bx = w * 0.12 + i * barW;
      const bh = (h * 0.5) * (0.3 + (i / barCount) * 0.7 + (rand() - 0.5) * 0.15);
      svg.appendChild(rc.rectangle(bx, baseY - bh, barW * 0.7, bh, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1.2 }));
    }
    const trendY1 = baseY - h * 0.2;
    const trendY2 = baseY - h * 0.65;
    svg.appendChild(rc.line(w * 0.15, trendY1, w * 0.85, trendY2, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.8 }));
    svg.appendChild(rc.line(w * 0.82, trendY2 - 8, w * 0.88, trendY2, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
    svg.appendChild(rc.line(w * 0.82, trendY2 + 8, w * 0.88, trendY2, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
  }

  private drawTeamNetwork(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const people: { x: number; y: number }[] = [];
    const count = 4 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      people.push({ x: w * (0.15 + rand() * 0.7), y: h * (0.15 + rand() * 0.7) });
    }
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        if (rand() > 0.35) {
          svg.appendChild(rc.line(people[i]!.x, people[i]!.y, people[j]!.x, people[j]!.y, { stroke: colors.stroke + '50', strokeWidth: 1.5, roughness: 2 }));
        }
      }
    }
    for (const p of people) {
      svg.appendChild(rc.circle(p.x, p.y - 15, 14, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
      svg.appendChild(rc.path(`M${p.x - 12},${p.y + 2} Q${p.x},${p.y + 18} ${p.x + 12},${p.y + 2}`, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    }
  }

  private drawCompetition(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, _rand: () => number): void {
    const podium = [
      { x: w * 0.35, bw: w * 0.15, bh: h * 0.3 },
      { x: w * 0.5, bw: w * 0.15, bh: h * 0.45 },
      { x: w * 0.65, bw: w * 0.15, bh: h * 0.2 },
    ];
    for (const p of podium) {
      svg.appendChild(rc.rectangle(p.x, h * 0.85 - p.bh, p.bw, p.bh, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
    }
    svg.appendChild(rc.circle(w * 0.57, h * 0.25, 12, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.line(w * 0.57, h * 0.32, w * 0.57, h * 0.42, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.line(w * 0.52, h * 0.37, w * 0.57, h * 0.32, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.line(w * 0.62, h * 0.37, w * 0.57, h * 0.32, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.line(w * 0.57, h * 0.42, w * 0.52, h * 0.5, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
    svg.appendChild(rc.line(w * 0.57, h * 0.42, w * 0.62, h * 0.5, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
  }

  private drawMoneyCoins(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    for (let i = 0; i < 4 + Math.floor(rand() * 3); i++) {
      const cx = w * (0.15 + rand() * 0.7);
      const cy = h * (0.3 + rand() * 0.5);
      const r = 15 + rand() * 15;
      svg.appendChild(rc.circle(cx, cy, r * 2, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
      svg.appendChild(rc.circle(cx, cy, r * 1.2, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.2, fill: 'none' }));
    }
    svg.appendChild(rc.line(w * 0.15, h * 0.8, w * 0.85, h * 0.8, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.5 }));
    svg.appendChild(rc.line(w * 0.15, h * 0.8, w * 0.15, h * 0.15, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.5 }));
  }

  // ── SECURITY ILLUSTRATIONS ────────────────────────────────────

  private drawShieldLock(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.42;
    const scale = 0.7 + rand() * 0.4;
    svg.appendChild(rc.path(`M${cx},${cy - 60 * scale} L${cx + 50 * scale},${cy - 30 * scale} L${cx + 50 * scale},${cy + 10 * scale} Q${cx + 50 * scale},${cy + 50 * scale} ${cx},${cy + 70 * scale} Q${cx - 50 * scale},${cy + 50 * scale} ${cx - 50 * scale},${cy + 10 * scale} L${cx - 50 * scale},${cy - 30 * scale} Z`, {
      fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2 + rand() * 0.6,
    }));
    svg.appendChild(rc.rectangle(cx - 10, cy - 15 * scale, 20, 25 * scale, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.path(`M${cx - 8},${cy - 15 * scale} A${8},${10 * scale} 0 0 1 ${cx + 8},${cy - 15 * scale}`, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2, fill: 'none' }));
  }

  private drawEncryption(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const kx = w * 0.5;
    const ky = h * 0.45;
    svg.appendChild(rc.circle(kx - 25, ky, 18, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.circle(kx - 25, ky, 8, { fill: '#171717', fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1 }));
    svg.appendChild(rc.line(kx - 10, ky, kx + 30, ky, { stroke: colors.stroke, strokeWidth: 3, roughness: 1.2 }));
    svg.appendChild(rc.line(kx + 30, ky - 6, kx + 30, ky + 12, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2 }));
    svg.appendChild(rc.line(kx + 30, ky + 12, kx + 38, ky + 12, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2 }));
    for (let i = 0; i < 5; i++) {
      svg.appendChild(rc.line(w * 0.7 + rand() * 20, h * 0.2 + i * h * 0.12, w * 0.75 + rand() * 25, h * 0.2 + i * h * 0.12, { stroke: colors.stroke + '60', strokeWidth: 1.5, roughness: 1.5 }));
    }
  }

  private drawCyberAttack(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.42;
    svg.appendChild(rc.path(`M${cx},${cy - 50} L${cx + 45},${cy - 25} L${cx + 45},${cy + 8} Q${cx + 45},${cy + 45} ${cx},${cy + 60} Q${cx - 45},${cy + 45} ${cx - 45},${cy + 8} L${cx - 45},${cy - 25} Z`, {
      stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5, fill: 'none',
    }));
    svg.appendChild(rc.line(cx - 8, cy - 8, cx + 8, cy + 8, { stroke: colors.stroke, strokeWidth: 3, roughness: 1.5 }));
    svg.appendChild(rc.line(cx + 8, cy - 8, cx - 8, cy + 8, { stroke: colors.stroke, strokeWidth: 3, roughness: 1.5 }));
    for (let i = 0; i < 3; i++) {
      svg.appendChild(rc.circle(cx + (rand() - 0.5) * 60, cy + (rand() - 0.5) * 50, 4 + rand() * 4, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.5 }));
    }
    for (let i = 0; i < 3; i++) {
      const bx = w * (0.7 + rand() * 0.15);
      const by = h * (0.2 + i * 0.25 + rand() * 0.1);
      svg.appendChild(rc.line(bx, by, bx + 15 + rand() * 15, by, { stroke: colors.stroke + '60', strokeWidth: 1.5, roughness: 1.5 }));
      svg.appendChild(rc.line(bx, by + 5, bx + 10 + rand() * 10, by + 5, { stroke: colors.stroke + '40', strokeWidth: 1, roughness: 1.5 }));
    }
  }

  private drawAuthentication(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.45;
    const fr = Math.min(w, h) * 0.22;
    svg.appendChild(rc.circle(cx, cy, fr * 2, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5, fill: colors.fill, fillStyle: 'solid' }));
    const lines = 8 + Math.floor(rand() * 4);
    for (let i = 0; i < lines; i++) {
      const angle = (i / lines) * Math.PI * 2;
      const inner = fr * 0.3;
      const outer = fr * (0.7 + rand() * 0.25);
      svg.appendChild(rc.line(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner, cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.8 }));
    }
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + rand() * 0.3;
      const r = fr * (0.5 + rand() * 0.3);
      svg.appendChild(rc.circle(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, 4 + rand() * 3, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1 }));
    }
  }

  private drawPrivacy(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, _rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.42;
    svg.appendChild(rc.circle(cx, cy - 15, 20, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.path(`M${cx - 18},${cy + 8} Q${cx},${cy + 35} ${cx + 18},${cy + 8}`, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.path(`M${cx},${cy - 40} L${cx + 40},${cy - 20} L${cx + 40},${cy + 5} Q${cx + 40},${cy + 40} ${cx},${cy + 55} Q${cx - 40},${cy + 40} ${cx - 40},${cy + 5} L${cx - 40},${cy - 20} Z`, {
      stroke: colors.stroke + '60', strokeWidth: 2, roughness: 1.8, fill: 'none',
    }));
  }

  // ── SCIENCE ILLUSTRATIONS ─────────────────────────────────────

  private drawSpace(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.5;
    svg.appendChild(rc.circle(cx, cy, 20 + rand() * 10, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2 }));
    const planetCount = 2 + Math.floor(rand() * 2);
    for (let i = 0; i < planetCount; i++) {
      const rx = 40 + rand() * 40 + i * 30;
      const ry = 12 + rand() * 15;
      const path = this.ellipsePath(cx, cy, rx, ry, rand() * 60);
      svg.appendChild(rc.path(path, { stroke: colors.stroke + '60', strokeWidth: 1.5, roughness: 1.8, fill: 'none' }));
      const angle = rand() * Math.PI * 2;
      svg.appendChild(rc.circle(cx + rx * Math.cos(angle), cy + ry * Math.sin(angle), 6 + rand() * 6, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1 }));
    }
    for (let i = 0; i < 5 + Math.floor(rand() * 4); i++) {
      svg.appendChild(rc.circle(rand() * w, rand() * h, 1 + rand() * 2, { stroke: colors.stroke + '50', strokeWidth: 1, roughness: 0.5, fill: colors.fill, fillStyle: 'solid' }));
    }
  }

  private drawDnaHelix(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, _rand: () => number): void {
    const startX = w * 0.2;
    const endX = w * 0.8;
    const amplitude = h * 0.25;
    const steps = 20;
    const strand1: { x: number; y: number }[] = [];
    const strand2: { x: number; y: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = startX + t * (endX - startX);
      const phase = t * Math.PI * 4;
      strand1.push({ x, y: h * 0.5 + Math.sin(phase) * amplitude });
      strand2.push({ x, y: h * 0.5 - Math.sin(phase) * amplitude });
    }
    for (let i = 0; i < strand1.length - 1; i++) {
      const a = strand1[i]!;
      const b = strand1[i + 1]!;
      svg.appendChild(rc.line(a.x, a.y, b.x, b.y, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
      const c = strand2[i]!;
      const d = strand2[i + 1]!;
      svg.appendChild(rc.line(c.x, c.y, d.x, d.y, { stroke: colors.stroke + '80', strokeWidth: 2.5, roughness: 1.5 }));
      if (i % 3 === 0) {
        svg.appendChild(rc.line(a.x, a.y, c.x, c.y, { stroke: colors.stroke + '50', strokeWidth: 1.5, roughness: 1.8 }));
      }
    }
  }

  private drawQuantum(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const qubits = 3 + Math.floor(rand() * 2);
    for (let i = 0; i < qubits; i++) {
      const qx = w * (0.2 + (i / (qubits - 1 || 1)) * 0.6);
      const qy = h * 0.5;
      svg.appendChild(rc.circle(qx, qy, 20 + rand() * 10, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
      svg.appendChild(rc.circle(qx, qy, 8 + rand() * 5, { stroke: colors.stroke, strokeWidth: 2, roughness: 1, fill: 'none' }));
      svg.appendChild(rc.circle(qx, qy, 3, { fill: colors.stroke, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1, roughness: 0.5 }));
      if (i < qubits - 1) {
        const nx = w * (0.2 + ((i + 1) / (qubits - 1 || 1)) * 0.6);
        svg.appendChild(rc.line(qx + 15, qy, nx - 15, qy, { stroke: colors.stroke + '60', strokeWidth: 2, roughness: 2 }));
        const midX = (qx + nx) / 2;
        const waveH = 10 + rand() * 15;
        svg.appendChild(rc.path(`M${qx + 15},${qy} Q${midX - 10},${qy - waveH} ${midX},${qy} Q${midX + 10},${qy + waveH} ${nx - 15},${qy}`, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 2, fill: 'none' }));
      }
    }
  }

  private drawMolecule(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const atoms: { x: number; y: number; r: number }[] = [];
    const count = 4 + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      atoms.push({ x: w * (0.2 + rand() * 0.6), y: h * (0.2 + rand() * 0.6), r: 8 + rand() * 10 });
    }
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const dx = atoms[i]!.x - atoms[j]!.x;
        const dy = atoms[i]!.y - atoms[j]!.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < w * 0.35) {
          svg.appendChild(rc.line(atoms[i]!.x, atoms[i]!.y, atoms[j]!.x, atoms[j]!.y, { stroke: colors.stroke + '80', strokeWidth: 2, roughness: 1.8 }));
        }
      }
    }
    for (const a of atoms) {
      svg.appendChild(rc.circle(a.x, a.y, a.r * 2, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    }
  }

  private drawClimateTech(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const r = Math.min(w, h) * 0.3;
    svg.appendChild(rc.circle(cx, cy, r * 2, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.path(`M${cx - r * 0.3},${cy + r * 0.4} Q${cx - r * 0.1},${cy - r * 0.3} ${cx + r * 0.2},${cy - r * 0.1} Q${cx + r * 0.5},${cy + r * 0.2} ${cx + r * 0.1},${cy + r * 0.5}`, {
      stroke: colors.stroke + '80', strokeWidth: 2, roughness: 1.8, fill: 'none',
    }));
    svg.appendChild(rc.line(cx - r * 0.4, cy - r * 0.6, cx - r * 0.4, cy + r * 0.6, { stroke: colors.stroke + '50', strokeWidth: 1.5, roughness: 1.5 }));
    svg.appendChild(rc.line(cx + r * 0.4, cy - r * 0.6, cx + r * 0.4, cy + r * 0.6, { stroke: colors.stroke + '50', strokeWidth: 1.5, roughness: 1.5 }));
    for (let i = 0; i < 3; i++) {
      svg.appendChild(rc.circle(cx + (rand() - 0.5) * r * 1.5, cy + (rand() - 0.5) * r * 1.5, 2 + rand() * 3, { stroke: colors.stroke + '60', strokeWidth: 1, roughness: 1, fill: colors.fill, fillStyle: 'solid' }));
    }
  }

  // ── GADGETS ILLUSTRATIONS ─────────────────────────────────────

  private drawSmartphone(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const pw = w * 0.2;
    const ph = h * 0.6;
    const px = (w - pw) / 2;
    const py = (h - ph) / 2;
    svg.appendChild(rc.rectangle(px, py, pw, ph, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.rectangle(px + 4, py + 12, pw - 8, ph - 24, { fill: '#121212', fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1, roughness: 0.8 }));
    svg.appendChild(rc.circle(px + pw / 2, py + ph - 8, 7, { stroke: colors.stroke + '80', strokeWidth: 1, roughness: 0.8 }));
    const rows = 3 + Math.floor(rand() * 3);
    for (let i = 0; i < rows; i++) {
      const ry = py + 20 + i * ((ph - 35) / rows);
      svg.appendChild(rc.rectangle(px + 10, ry, pw - 20, 6 + rand() * 6, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke + '50', strokeWidth: 1, roughness: 1 }));
    }
  }

  private drawWearable(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, _rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.5;
    const wr = Math.min(w, h) * 0.25;
    svg.appendChild(rc.circle(cx, cy, wr * 2, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 3, roughness: 1.5 }));
    svg.appendChild(rc.circle(cx, cy, wr * 1.5, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.2, fill: 'none' }));
    svg.appendChild(rc.line(cx, cy - wr * 0.5, cx, cy + wr * 0.3, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2 }));
    svg.appendChild(rc.line(cx, cy + wr * 0.3, cx + wr * 0.4, cy + wr * 0.1, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.line(cx, cy - wr - 5, cx, cy - wr * 1.8, { stroke: colors.stroke, strokeWidth: 3, roughness: 1.5 }));
    svg.appendChild(rc.line(cx, cy + wr + 5, cx, cy + wr * 1.8, { stroke: colors.stroke, strokeWidth: 3, roughness: 1.5 }));
    svg.appendChild(rc.rectangle(cx - 12, cy - wr * 2, 24, wr * 0.4, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.rectangle(cx - 12, cy + wr * 1.6, 24, wr * 0.4, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
  }

  private drawAudio(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.45;
    svg.appendChild(rc.path(`M${cx - 30},${cy - 20} A30,35 0 0 1 ${cx + 30},${cy - 20}`, { stroke: colors.stroke, strokeWidth: 4, roughness: 1.5, fill: 'none' }));
    svg.appendChild(rc.rectangle(cx - 35, cy - 22, 15, 30, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.rectangle(cx + 20, cy - 22, 15, 30, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.circle(cx - 28, cy - 5, 10, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    svg.appendChild(rc.circle(cx + 28, cy - 5, 10, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2, roughness: 1.2 }));
    for (let i = 0; i < 4; i++) {
      const amp = 8 + rand() * 20;
      svg.appendChild(rc.line(cx - 60 - i * 12, cy - amp, cx - 60 - i * 12, cy + amp, { stroke: colors.stroke + '60', strokeWidth: 2, roughness: 1.5 }));
      svg.appendChild(rc.line(cx + 60 + i * 12, cy - amp, cx + 60 + i * 12, cy + amp, { stroke: colors.stroke + '60', strokeWidth: 2, roughness: 1.5 }));
    }
  }

  private drawSmartHome(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.55;
    const hw = w * 0.35;
    const hh = h * 0.35;
    svg.appendChild(rc.path(`M${cx - hw / 2 - 15},${cy} L${cx},${cy - hh * 0.6} L${cx + hw / 2 + 15},${cy}`, { stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5, fill: 'none' }));
    svg.appendChild(rc.rectangle(cx - hw / 2, cy, hw, hh, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.5 }));
    svg.appendChild(rc.rectangle(cx - hw * 0.15, cy + hh * 0.5, hw * 0.3, hh * 0.5, { fill: '#121212', fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1.2 }));
    svg.appendChild(rc.rectangle(cx - hw * 0.35, cy + hh * 0.15, hw * 0.2, hh * 0.2, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.2, fill: 'none' }));
    svg.appendChild(rc.rectangle(cx + hw * 0.15, cy + hh * 0.15, hw * 0.2, hh * 0.2, { stroke: colors.stroke + '80', strokeWidth: 1.5, roughness: 1.2, fill: 'none' }));
    for (let i = 0; i < 3; i++) {
      const ax = cx + (rand() - 0.5) * hw * 1.5;
      const ay = cy - 20 - rand() * 30;
      svg.appendChild(rc.line(ax, ay, ax, ay + 10, { stroke: colors.stroke + '60', strokeWidth: 1.5, roughness: 1.5 }));
      svg.appendChild(rc.circle(ax, ay + 15, 4, { stroke: colors.stroke + '60', strokeWidth: 1, roughness: 1, fill: colors.fill, fillStyle: 'solid' }));
    }
  }

  private drawDrone(rc: ReturnType<typeof rough.svg>, svg: SVGSVGElement, w: number, h: number, colors: { stroke: string; fill: string }, rand: () => number): void {
    const cx = w * 0.5;
    const cy = h * 0.5;
    svg.appendChild(rc.rectangle(cx - 15, cy - 8, 30, 16, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 2.5, roughness: 1.2 }));
    const arms = [
      { dx: -40, dy: -30 },
      { dx: 40, dy: -30 },
      { dx: -40, dy: 30 },
      { dx: 40, dy: 30 },
    ];
    for (const arm of arms) {
      svg.appendChild(rc.line(cx, cy, cx + arm.dx, cy + arm.dy, { stroke: colors.stroke, strokeWidth: 2, roughness: 1.5 }));
      svg.appendChild(rc.circle(cx + arm.dx, cy + arm.dy, 20 + rand() * 8, { stroke: colors.stroke, strokeWidth: 1.5, roughness: 1.8, fill: 'none' }));
      svg.appendChild(rc.circle(cx + arm.dx, cy + arm.dy, 6, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1 }));
    }
    svg.appendChild(rc.rectangle(cx - 5, cy + 8, 10, 12, { fill: colors.fill, fillStyle: 'solid', stroke: colors.stroke, strokeWidth: 1.5, roughness: 1 }));
  }

  // ── UTILITY ───────────────────────────────────────────────────

  private ellipsePath(cx: number, cy: number, rx: number, ry: number, rotateDeg: number): string {
    const rad = (rotateDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const points: string[] = [];
    for (let i = 0; i <= 360; i += 15) {
      const a = (i * Math.PI) / 180;
      const x = rx * Math.cos(a);
      const y = ry * Math.sin(a);
      const rx2 = x * cos - y * sin;
      const ry2 = x * sin + y * cos;
      points.push(`${i === 0 ? 'M' : 'L'}${cx + rx2},${cy + ry2}`);
    }
    return points.join(' ') + ' Z';
  }
}
