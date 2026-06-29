import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocalKeys, LocalManager } from '../../shared/services/local-manager.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Auth, LoginData, LoginResponse, RegisterData } from '../models/auth.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthAdapter } from '../adapters/auth.adapter';
import { appRoutes } from '../../app.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  localManager = inject(LocalManager);
  router = inject(Router);
  baseUrl = environment.authApiUrl;

  login(data: LoginData): Observable<Auth> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      map(AuthAdapter),
      tap((auth) => {
        this.localManager.setData(LocalKeys.ACCESS_TOKEN, auth.accessToken);
        this.localManager.setData(LocalKeys.REFRESH_TOKEN, auth.refreshToken);
      }),
    );
  }

  register(data: RegisterData): Observable<Auth> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/register`, data).pipe(
      map(AuthAdapter),
      tap((auth) => {
        this.localManager.setData(LocalKeys.ACCESS_TOKEN, auth.accessToken);
        this.localManager.setData(LocalKeys.REFRESH_TOKEN, auth.refreshToken);
      }),
    );
  }

  refreshToken(): Observable<Auth> {
    const refreshToken = this.localManager.getData<string>(LocalKeys.REFRESH_TOKEN);

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token.'));
    }

    return this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
      map(AuthAdapter),
      tap((auth) => {
        this.localManager.setData(LocalKeys.ACCESS_TOKEN, auth.accessToken);
        this.localManager.setData(LocalKeys.REFRESH_TOKEN, auth.refreshToken);
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      }),
    );
  }

  logout() {
    const refreshToken = this.localManager.getData(LocalKeys.REFRESH_TOKEN);

    if (refreshToken) {
      this.http.post(`${this.baseUrl}/logout`, { refreshToken }).subscribe({
        error: () => {
          this.localManager.clearStorage();
          this.router.navigate([appRoutes.public.login], { replaceUrl: true });
        },
        complete: () => {
          this.localManager.clearStorage();
          this.router.navigate([appRoutes.public.login], { replaceUrl: true });
        },
      });
    } else {
      this.localManager.clearStorage();
      this.router.navigate([appRoutes.public.login], { replaceUrl: true });
    }
  }
}
