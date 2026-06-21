import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  afterNextRender,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import type { OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mermaid-diagram',
  template: `
    <div class="my-6 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4">
      <div #diagramContainer class="flex justify-center overflow-x-auto"></div>
      @if (caption) {
        <p class="text-muted-foreground mt-3 text-center text-xs italic">{{ caption }}</p>
      }
    </div>
  `,
})
export class MermaidDiagramComponent implements OnChanges {
  @Input({ required: true }) code = '';
  @Input() caption = '';
  @ViewChild('diagramContainer') container!: ElementRef<HTMLDivElement>;

  private readonly isBrowser: boolean;
  private counter = 0;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    afterNextRender(() => {
      this.renderDiagram();
    });
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.isBrowser && this.container) {
      this.renderDiagram();
    }
  }

  private async renderDiagram(): Promise<void> {
    if (!this.isBrowser || !this.container || !this.code) return;

    try {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        themeVariables: {
          primaryColor: '#8b5cf6',
          primaryTextColor: '#e0e0e0',
          primaryBorderColor: '#3b82f6',
          lineColor: '#6b7280',
          secondaryColor: '#1f1f1f',
          tertiaryColor: '#171717',
          fontFamily: 'Inter, sans-serif',
        },
      });

      this.counter++;
      const id = `mermaid-diagram-${this.counter}`;
      const { svg } = await mermaid.render(id, this.code);
      this.container.nativeElement.innerHTML = svg;
    } catch (error) {
      console.error('Mermaid render error:', error);
      this.container.nativeElement.innerHTML =
        `<pre class="text-muted-foreground text-xs">${this.code}</pre>`;
    }
  }
}
