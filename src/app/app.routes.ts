import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'search/results',
    loadComponent: () =>
      import('./search/search-results.component').then((m) => m.SearchResultsComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
