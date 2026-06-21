import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'agentwork-news/news/:slug',
    loadComponent: () =>
      import('./agentwork-news/news-article.component').then((m) => m.NewsArticleComponent),
  },
  {
    path: 'agentwork-news',
    loadComponent: () =>
      import('./agentwork-news/agentwork-news.component').then((m) => m.AgentworkNewsComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'search/results',
    loadComponent: () =>
      import('./search/search-results.component').then((m) => m.SearchResultsComponent),
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./auth/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./auth/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
