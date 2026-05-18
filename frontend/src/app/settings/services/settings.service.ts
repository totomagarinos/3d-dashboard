import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Settings } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _settingsData = signal<Settings | null>(null);
  settingsData = this._settingsData.asReadonly();

  baseUrl = environment.settingsApiUrl;
  http: HttpClient = inject(HttpClient);

  loadSettings(): Observable<Settings> {
    return this.http.get<Settings>(this.baseUrl).pipe(
      tap((result) => {
        this._settingsData.set(result);
      }),
      catchError(() => {
        const fallback = {
          electricityPricePerKwH: 140,
          consumptionWatts: 120,
          machineWearPerHour: 4320,
          partsPrice: 150000,
          errorMarginPercentage: 5,
        };

        this._settingsData.set(fallback);

        return of(fallback);
      }),
    );
  }

  updateSettings(data: Partial<Settings>): Observable<Settings> {
    return this.http.patch<Settings>(this.baseUrl, data).pipe(
      tap((updatedSettings) => {
        this._settingsData.set(updatedSettings);
      }),
    );
  }
}
