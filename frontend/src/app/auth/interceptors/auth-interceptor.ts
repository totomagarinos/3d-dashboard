import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalKeys, LocalManager } from '../../shared/services/local-manager.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, catchError, filter, switchMap, throwError } from 'rxjs';

let isRefreshing = false;
let refreshSubject: BehaviorSubject<string | null> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localManager = inject(LocalManager);
  const authService = inject(AuthService);

  const token = localManager.getData<string>(LocalKeys.ACCESS_TOKEN);

  const authReq = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 403) && !req.url.includes('refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject = new BehaviorSubject<string | null>(null);

          return authService.refreshToken().pipe(
            switchMap((newTokens) => {
              isRefreshing = false;
              refreshSubject!.next(newTokens.accessToken);
              refreshSubject!.complete();

              return next(
                req.clone({ setHeaders: { Authorization: `Bearer ${newTokens.accessToken}` } }),
              );
            }),
            catchError((err) => {
              isRefreshing = false;
              refreshSubject!.error(err);
              authService.logout();
              return throwError(() => err);
            }),
          );
        } else {
          return refreshSubject!.pipe(
            filter((token) => token !== null),
            switchMap((token) => {
              return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
            }),
          );
        }
      }
      return throwError(() => error);
    }),
  );
};
