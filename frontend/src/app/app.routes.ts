import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./calculator/components/calculator/calculator').then((m) => m.Calculator),
  },
  {
    path: 'materials',
    loadComponent: () =>
      import('./materials/components/material-list/material-list').then((m) => m.MaterialList),
  },
];
