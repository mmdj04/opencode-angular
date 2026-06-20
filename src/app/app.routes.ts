import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'msn/news/:slug',
    loadComponent: () => import('./msn/news-article.component').then((m) => m.NewsArticleComponent),
  },
  {
    path: 'msn',
    loadComponent: () => import('./msn/msn.component').then((m) => m.MsnComponent),
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
