import { Injectable } from '@angular/core';
import rough from 'roughjs';

interface BannerOptions {
  width: number;
  height: number;
  category: string;
  seed: string;
}

const CATEGORY_COLORS: Record<string, { stroke: string; fill: string }> = {
  ai: { stroke: '#8b5cf6', fill: '#8b5cf620' },
  tech: { stroke: '#3b82f6', fill: '#3b82f620' },
  startup: { stroke: '#f59e0b', fill: '#f59e0b20' },
  security: { stroke: '#ef4444', fill: '#ef444420' },
  science: { stroke: '#10b981', fill: '#10b98120' },
  gadgets: { stroke: '#06b6d4', fill: '#06b6d420' },
};

@Injectable({ providedIn: 'root' })
export class BannerService {
  generate(svgElement: SVGSVGElement, options: BannerOptions): void {
    const { width, height, category, seed } = options;
    const colors: { stroke: string; fill: string } = CATEGORY_COLORS[category] ?? {
      stroke: '#3b82f6',
      fill: '#3b82f620',
    };
    const rc = rough.svg(svgElement);
    const rand = this.createRng(seed);

    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', String(width));
    bg.setAttribute('height', String(height));
    bg.setAttribute('fill', '#171717');
    svgElement.appendChild(bg);

    switch (category) {
      case 'ai':
        this.drawNeuralNetwork(rc, svgElement, width, height, colors, rand);
        break;
      case 'tech':
        this.drawTechCode(rc, svgElement, width, height, colors, rand);
        break;
      case 'startup':
        this.drawRocket(rc, svgElement, width, height, colors, rand);
        break;
      case 'security':
        this.drawShield(rc, svgElement, width, height, colors, rand);
        break;
      case 'science':
        this.drawAtom(rc, svgElement, width, height, colors, rand);
        break;
      case 'gadgets':
        this.drawDevice(rc, svgElement, width, height, colors, rand);
        break;
      default:
        this.drawTechCode(rc, svgElement, width, height, colors, rand);
    }
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

  private drawNeuralNetwork(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
    rand: () => number,
  ): void {
    const layerCount = 3 + Math.floor(rand() * 3);
    const layers: number[] = [];
    for (let i = 0; i < layerCount; i++) {
      layers.push(2 + Math.floor(rand() * 5));
    }
    const layerGap = w / (layers.length + 1);

    const nodePositions: { x: number; y: number }[][] = [];
    for (let l = 0; l < layers.length; l++) {
      const count = layers[l]!;
      const nodes: { x: number; y: number }[] = [];
      const nodeGap = h / (count + 1);
      for (let n = 0; n < count; n++) {
        nodes.push({
          x: layerGap * (l + 1) + (rand() - 0.5) * 10,
          y: nodeGap * (n + 1) + (rand() - 0.5) * 8,
        });
      }
      nodePositions.push(nodes);
    }

    for (let l = 0; l < nodePositions.length - 1; l++) {
      const currentLayer = nodePositions[l];
      const nextLayer = nodePositions[l + 1];
      if (!currentLayer || !nextLayer) continue;
      for (const from of currentLayer) {
        for (const to of nextLayer) {
          if (rand() > 0.3) {
            svg.appendChild(
              rc.line(from.x, from.y, to.x, to.y, {
                stroke: colors.stroke + '4d',
                strokeWidth: 1,
                roughness: 1.5,
              }),
            );
          }
        }
      }
    }

    for (const layer of nodePositions) {
      for (const node of layer) {
        const size = 12 + rand() * 14;
        svg.appendChild(
          rc.circle(node.x, node.y, size, {
            fill: colors.fill,
            fillStyle: 'solid',
            stroke: colors.stroke,
            strokeWidth: 2,
            roughness: 1 + rand() * 0.8,
          }),
        );
      }
    }
  }

  private drawTechCode(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
    rand: () => number,
  ): void {
    const lineCount = 6 + Math.floor(rand() * 7);
    const startY = h * (0.15 + rand() * 0.1);
    const gap = h * (0.06 + rand() * 0.04);
    const windowX = w * (0.03 + rand() * 0.04);
    const windowW = w * (0.45 + rand() * 0.2);
    const windowY = h * (0.08 + rand() * 0.06);
    const windowH = h * (0.7 + rand() * 0.2);

    svg.appendChild(
      rc.rectangle(windowX, windowY, windowW, windowH, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.5 + rand(),
        fill: colors.fill,
        fillStyle: 'solid',
      }),
    );

    for (let i = 0; i < lineCount; i++) {
      const y = startY + i * gap;
      if (y > windowY + windowH - 15) break;
      const indent = Math.floor(rand() * 4) * 25;
      const lineWidth = windowW * (0.2 + rand() * 0.5);

      svg.appendChild(
        rc.line(windowX + 15 + indent, y, windowX + 15 + indent + lineWidth, y, {
          stroke: colors.stroke + (rand() > 0.5 ? '66' : '99'),
          strokeWidth: 1.5 + rand(),
          roughness: 1.5 + rand(),
        }),
      );

      if (rand() > 0.6) {
        const bx = windowX + 15 + indent;
        svg.appendChild(
          rc.rectangle(bx, y - 7, 10, 10, {
            fill: colors.fill,
            fillStyle: 'solid',
            stroke: colors.stroke,
            strokeWidth: 1.5,
            roughness: 1,
          }),
        );
      }
    }

    const extraBlocks = Math.floor(rand() * 3);
    for (let i = 0; i < extraBlocks; i++) {
      const bx = windowX + windowW + 20 + rand() * (w - windowX - windowW - 40);
      const by = windowY + rand() * (windowH - 30);
      const bw = 30 + rand() * 60;
      const bh = 20 + rand() * 40;
      svg.appendChild(
        rc.rectangle(bx, by, bw, bh, {
          stroke: colors.stroke + '80',
          strokeWidth: 1.5,
          roughness: 1.5,
          fill: colors.fill,
          fillStyle: 'solid',
        }),
      );
    }
  }

  private drawRocket(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
    rand: () => number,
  ): void {
    const cx = w * (0.35 + rand() * 0.3);
    const cy = h * (0.35 + rand() * 0.2);
    const scale = 0.7 + rand() * 0.6;

    const noseY = cy - 60 * scale;
    const baseY = cy + 20 * scale;
    const leftX = cx - 20 * scale;
    const rightX = cx + 20 * scale;

    svg.appendChild(
      rc.path(`M${cx},${noseY} L${leftX},${baseY} L${rightX},${baseY} Z`, {
        fill: colors.fill,
        fillStyle: 'solid',
        stroke: colors.stroke,
        strokeWidth: 2.5,
        roughness: 1.2 + rand() * 0.6,
      }),
    );

    svg.appendChild(
      rc.circle(cx, baseY + 15 * scale, 20 * scale, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.5 + rand(),
        fill: colors.fill,
        fillStyle: 'solid',
      }),
    );

    const wingOffset = 15 * scale;
    svg.appendChild(
      rc.line(leftX, baseY, leftX - wingOffset, baseY + 25 * scale, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.5,
      }),
    );
    svg.appendChild(
      rc.line(rightX, baseY, rightX + wingOffset, baseY + 25 * scale, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.5,
      }),
    );

    const flameCount = 3 + Math.floor(rand() * 5);
    for (let i = 0; i < flameCount; i++) {
      const fx = leftX + (rightX - leftX) * (i / (flameCount - 1 || 1));
      const flameLen = (15 + rand() * 25) * scale;
      svg.appendChild(
        rc.line(fx, baseY + 5, fx + (rand() - 0.5) * 8, baseY + 5 + flameLen, {
          stroke: '#f59e0b99',
          strokeWidth: 1 + rand() * 1.5,
          roughness: 2,
        }),
      );
    }

    if (rand() > 0.4) {
      const starCount = 2 + Math.floor(rand() * 4);
      for (let i = 0; i < starCount; i++) {
        const sx = rand() * w;
        const sy = rand() * h;
        svg.appendChild(
          rc.circle(sx, sy, 3 + rand() * 4, {
            stroke: colors.stroke + '60',
            strokeWidth: 1,
            roughness: 1,
            fill: colors.fill,
            fillStyle: 'solid',
          }),
        );
      }
    }
  }

  private drawShield(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
    rand: () => number,
  ): void {
    const cx = w * (0.4 + rand() * 0.2);
    const cy = h * (0.35 + rand() * 0.2);
    const scale = 0.7 + rand() * 0.5;

    const topY = cy - 60 * scale;
    const sideX = 50 * scale;
    const midY = cy + 10 * scale;
    const botY = cy + 70 * scale;

    svg.appendChild(
      rc.path(
        `M${cx},${topY} L${cx + sideX},${topY + 30 * scale} L${cx + sideX},${midY} Q${cx + sideX},${botY - 20 * scale} ${cx},${botY} Q${cx - sideX},${botY - 20 * scale} ${cx - sideX},${midY} L${cx - sideX},${topY + 30 * scale} Z`,
        {
          fill: colors.fill,
          fillStyle: 'solid',
          stroke: colors.stroke,
          strokeWidth: 2.5,
          roughness: 1.2 + rand() * 0.6,
        },
      ),
    );

    const checkSize = 15 * scale;
    svg.appendChild(
      rc.line(cx - checkSize, cy, cx - checkSize * 0.3, cy + checkSize * 1.2, {
        stroke: colors.stroke,
        strokeWidth: 3,
        roughness: 1,
      }),
    );
    svg.appendChild(
      rc.line(cx - checkSize * 0.3, cy + checkSize * 1.2, cx + checkSize, cy - checkSize * 0.5, {
        stroke: colors.stroke,
        strokeWidth: 3,
        roughness: 1,
      }),
    );

    const lockCount = Math.floor(rand() * 3);
    for (let i = 0; i < lockCount; i++) {
      const lx = cx + (rand() - 0.5) * sideX * 2;
      const ly = cy + (rand() - 0.5) * 40 * scale;
      svg.appendChild(
        rc.circle(lx, ly, 6 + rand() * 8, {
          stroke: colors.stroke + '50',
          strokeWidth: 1,
          roughness: 1.5,
        }),
      );
    }
  }

  private drawAtom(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
    rand: () => number,
  ): void {
    const cx = w * (0.4 + rand() * 0.2);
    const cy = h * (0.4 + rand() * 0.2);
    const nucleusSize = 10 + rand() * 10;

    svg.appendChild(
      rc.circle(cx, cy, nucleusSize, {
        fill: colors.fill,
        fillStyle: 'solid',
        stroke: colors.stroke,
        strokeWidth: 2.5,
        roughness: 1,
      }),
    );

    const orbitCount = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < orbitCount; i++) {
      const rx = 50 + rand() * 50;
      const ry = 15 + rand() * 25;
      const rotate = (360 / orbitCount) * i + rand() * 30;
      const path = this.ellipsePath(cx, cy, rx, ry, rotate);
      svg.appendChild(
        rc.path(path, {
          stroke: colors.stroke + '80',
          strokeWidth: 1.5,
          roughness: 1.5 + rand() * 0.5,
          fill: 'none',
        }),
      );

      if (rand() > 0.4) {
        const angle = rand() * Math.PI * 2;
        const electronX = cx + rx * Math.cos(angle);
        const electronY = cy + ry * Math.sin(angle);
        svg.appendChild(
          rc.circle(electronX, electronY, 5 + rand() * 4, {
            fill: colors.fill,
            fillStyle: 'solid',
            stroke: colors.stroke,
            strokeWidth: 1.5,
            roughness: 1,
          }),
        );
      }
    }
  }

  private drawDevice(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
    rand: () => number,
  ): void {
    const deviceType = rand();
    let dx: number, dy: number, dw: number, dh: number;

    if (deviceType < 0.33) {
      dw = w * (0.3 + rand() * 0.15);
      dh = h * (0.5 + rand() * 0.2);
      dx = (w - dw) / 2;
      dy = (h - dh) / 2 - 10;
    } else if (deviceType < 0.66) {
      dw = w * (0.2 + rand() * 0.1);
      dh = h * (0.6 + rand() * 0.15);
      dx = (w - dw) / 2;
      dy = (h - dh) / 2 - 10;
    } else {
      dw = w * (0.4 + rand() * 0.15);
      dh = h * (0.35 + rand() * 0.15);
      dx = (w - dw) / 2;
      dy = (h - dh) / 2 - 10;
    }

    svg.appendChild(
      rc.rectangle(dx, dy, dw, dh, {
        stroke: colors.stroke,
        strokeWidth: 2.5,
        roughness: 1.2 + rand() * 0.6,
        fill: colors.fill,
        fillStyle: 'solid',
      }),
    );

    const bezel = 6 + rand() * 4;
    svg.appendChild(
      rc.rectangle(dx + bezel, dy + bezel, dw - bezel * 2, dh - bezel * 2 - 15, {
        stroke: colors.stroke,
        strokeWidth: 1.5,
        roughness: 1,
        fill: '#121212',
        fillStyle: 'solid',
      }),
    );

    svg.appendChild(
      rc.line(dx + dw * 0.3, dy + dh + 5, dx + dw * 0.7, dy + dh + 5, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.2,
      }),
    );

    svg.appendChild(
      rc.circle(dx + dw / 2, dy + dh + 16, 8 + rand() * 4, {
        stroke: colors.stroke,
        strokeWidth: 1.5,
        roughness: 1,
      }),
    );

    if (deviceType > 0.5) {
      const dotCount = 2 + Math.floor(rand() * 3);
      for (let i = 0; i < dotCount; i++) {
        svg.appendChild(
          rc.circle(dx + dw - 12, dy + 15 + i * 10, 3, {
            stroke: colors.stroke + '80',
            strokeWidth: 1,
            roughness: 0.5,
          }),
        );
      }
    }
  }

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
