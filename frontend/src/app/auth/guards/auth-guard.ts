import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { LocalKeys, LocalManager } from '../../shared/services/local-manager.service';
import { appRoutes } from '../../app.routes';

export const authGuard: CanActivateChildFn = () => {
  const localManager = inject(LocalManager);
  const router = inject(Router);

  const token = localManager.getData(LocalKeys.ACCESS_TOKEN);

  if (token) return true;

  router.navigate([appRoutes.public.login], { replaceUrl: true });
  return false;
};
