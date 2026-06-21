import { Injectable } from '@angular/core';
import rough from 'roughjs';

interface BannerOptions {
  width: number;
  height: number;
  category: string;
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
    const { width, height, category } = options;
    const colors: { stroke: string; fill: string } = CATEGORY_COLORS[category] ?? {
      stroke: '#3b82f6',
      fill: '#3b82f620',
    };
    const rc = rough.svg(svgElement);

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
        this.drawNeuralNetwork(rc, svgElement, width, height, colors);
        break;
      case 'tech':
        this.drawTechCode(rc, svgElement, width, height, colors);
        break;
      case 'startup':
        this.drawRocket(rc, svgElement, width, height, colors);
        break;
      case 'security':
        this.drawShield(rc, svgElement, width, height, colors);
        break;
      case 'science':
        this.drawAtom(rc, svgElement, width, height, colors);
        break;
      case 'gadgets':
        this.drawDevice(rc, svgElement, width, height, colors);
        break;
      default:
        this.drawTechCode(rc, svgElement, width, height, colors);
    }
  }

  private drawNeuralNetwork(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
  ): void {
    const layers = [3, 5, 5, 3];
    const layerGap = w / (layers.length + 1);

    const nodePositions: { x: number; y: number }[][] = [];
    for (let l = 0; l < layers.length; l++) {
      const count = layers[l]!;
      const nodes: { x: number; y: number }[] = [];
      const nodeGap = h / (count + 1);
      for (let n = 0; n < count; n++) {
        nodes.push({ x: layerGap * (l + 1), y: nodeGap * (n + 1) });
      }
      nodePositions.push(nodes);
    }

    for (let l = 0; l < nodePositions.length - 1; l++) {
      const currentLayer = nodePositions[l];
      const nextLayer = nodePositions[l + 1];
      if (!currentLayer || !nextLayer) continue;
      for (const from of currentLayer) {
        for (const to of nextLayer) {
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

    for (const layer of nodePositions) {
      for (const node of layer) {
        svg.appendChild(
          rc.circle(node.x, node.y, 16, {
            fill: colors.fill,
            fillStyle: 'solid',
            stroke: colors.stroke,
            strokeWidth: 2,
            roughness: 1.2,
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
  ): void {
    const lineCount = 8;
    const startY = h * 0.2;
    const gap = h * 0.08;

    for (let i = 0; i < lineCount; i++) {
      const y = startY + i * gap;
      const indent = (i % 3) * 30;
      const lineWidth = w * (0.3 + Math.random() * 0.35);

      svg.appendChild(
        rc.line(40 + indent, y, 40 + indent + lineWidth, y, {
          stroke: colors.stroke + (i % 2 === 0 ? '66' : '99'),
          strokeWidth: 2,
          roughness: 1.8,
        }),
      );

      if (i % 3 === 0) {
        svg.appendChild(
          rc.rectangle(40 + indent, y - 8, 12, 12, {
            fill: colors.fill,
            fillStyle: 'solid',
            stroke: colors.stroke,
            strokeWidth: 1.5,
            roughness: 1,
          }),
        );
      }
    }

    svg.appendChild(
      rc.rectangle(w * 0.05, h * 0.1, w * 0.55, h * 0.8, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 2,
        fill: colors.fill,
        fillStyle: 'solid',
      }),
    );
  }

  private drawRocket(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
  ): void {
    const cx = w * 0.5;
    const cy = h * 0.45;

    svg.appendChild(
      rc.path(`M${cx},${cy - 60} L${cx - 20},${cy + 20} L${cx + 20},${cy + 20} Z`, {
        fill: colors.fill,
        fillStyle: 'solid',
        stroke: colors.stroke,
        strokeWidth: 2.5,
        roughness: 1.5,
      }),
    );

    svg.appendChild(
      rc.circle(cx, cy + 35, 30, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 2,
        fill: colors.fill,
        fillStyle: 'solid',
      }),
    );

    svg.appendChild(
      rc.line(cx - 20, cy + 20, cx - 35, cy + 45, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.5,
      }),
    );
    svg.appendChild(
      rc.line(cx + 20, cy + 20, cx + 35, cy + 45, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.5,
      }),
    );

    for (let i = 0; i < 5; i++) {
      svg.appendChild(
        rc.line(cx - 15 + i * 8, cy + 50, cx - 10 + i * 6, cy + 70 + Math.random() * 20, {
          stroke: '#f59e0b99',
          strokeWidth: 1.5,
          roughness: 2,
        }),
      );
    }
  }

  private drawShield(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
  ): void {
    const cx = w * 0.5;
    const cy = h * 0.45;

    svg.appendChild(
      rc.path(
        `M${cx},${cy - 60} L${cx + 50},${cy - 30} L${cx + 50},${cy + 10} Q${cx + 50},${cy + 50} ${cx},${cy + 70} Q${cx - 50},${cy + 50} ${cx - 50},${cy + 10} L${cx - 50},${cy - 30} Z`,
        {
          fill: colors.fill,
          fillStyle: 'solid',
          stroke: colors.stroke,
          strokeWidth: 2.5,
          roughness: 1.5,
        },
      ),
    );

    svg.appendChild(
      rc.line(cx - 15, cy, cx - 5, cy + 20, {
        stroke: colors.stroke,
        strokeWidth: 3,
        roughness: 1,
      }),
    );
    svg.appendChild(
      rc.line(cx - 5, cy + 20, cx + 25, cy - 15, {
        stroke: colors.stroke,
        strokeWidth: 3,
        roughness: 1,
      }),
    );
  }

  private drawAtom(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
  ): void {
    const cx = w * 0.5;
    const cy = h * 0.5;

    svg.appendChild(
      rc.circle(cx, cy, 14, {
        fill: colors.fill,
        fillStyle: 'solid',
        stroke: colors.stroke,
        strokeWidth: 2.5,
        roughness: 1,
      }),
    );

    const orbits = [
      { rx: 80, ry: 30, rotate: 0 },
      { rx: 80, ry: 30, rotate: 60 },
      { rx: 80, ry: 30, rotate: 120 },
    ];

    for (const orbit of orbits) {
      const path = this.ellipsePath(cx, cy, orbit.rx, orbit.ry, orbit.rotate);
      svg.appendChild(
        rc.path(path, {
          stroke: colors.stroke + '80',
          strokeWidth: 1.5,
          roughness: 1.8,
          fill: 'none',
        }),
      );
    }
  }

  private drawDevice(
    rc: ReturnType<typeof rough.svg>,
    svg: SVGSVGElement,
    w: number,
    h: number,
    colors: { stroke: string; fill: string },
  ): void {
    const dx = w * 0.3;
    const dy = h * 0.2;
    const dw = w * 0.4;
    const dh = h * 0.5;

    svg.appendChild(
      rc.rectangle(dx, dy, dw, dh, {
        stroke: colors.stroke,
        strokeWidth: 2.5,
        roughness: 1.5,
        fill: colors.fill,
        fillStyle: 'solid',
      }),
    );

    svg.appendChild(
      rc.rectangle(dx + 8, dy + 8, dw - 16, dh - 30, {
        stroke: colors.stroke,
        strokeWidth: 1.5,
        roughness: 1,
        fill: '#121212',
        fillStyle: 'solid',
      }),
    );

    svg.appendChild(
      rc.line(dx + dw * 0.35, dy + dh + 5, dx + dw * 0.65, dy + dh + 5, {
        stroke: colors.stroke,
        strokeWidth: 2,
        roughness: 1.2,
      }),
    );

    svg.appendChild(
      rc.circle(dx + dw / 2, dy + dh + 18, 10, {
        stroke: colors.stroke,
        strokeWidth: 1.5,
        roughness: 1,
      }),
    );
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
