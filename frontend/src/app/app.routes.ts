import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'materials',
    loadComponent: () =>
      import('./private/materials/components/material-list/material-list').then(
        (m) => m.MaterialList,
      ),
  },
];
