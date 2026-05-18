import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'calculator', pathMatch: 'full' },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./calculator/components/calculator/calculator').then((m) => m.Calculator),
  },
  {
    path: 'materials',
    loadComponent: () =>
      import('./materials/components/material-list/material-list').then((m) => m.MaterialList),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/components/settings/settings').then((m) => m.Settings),
  },
];
