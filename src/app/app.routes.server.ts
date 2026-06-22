import type { ServerRoute } from '@angular/ssr';
import { RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'agentwork-news/news/:slug',
    renderMode: RenderMode.Client,
  },
  {
    path: 'github/repo/:owner/:name',
    renderMode: RenderMode.Client,
  },
  {
    path: 'github/dev/:username',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
