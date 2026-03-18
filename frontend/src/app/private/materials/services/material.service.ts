import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Material } from '../models/material.model';
import { catchError, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  #state = signal(new Map<string, Material>());

  baseUrl = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  constructor() {
    this.getMaterials();
  }

  getMaterials() {
    this.http
      .get<Material[]>(this.baseUrl)
      .pipe(
        catchError((err) => {
          console.error('Error fetching materials.', err);

          const fallback = [
            {
              _id: 'abcdefg',
              type: 'PLA',
              brand: 'Grilon',
              weight: 1000,
              price: 20000,
            },
          ];

          if (!environment.useFallback) {
            return throwError(() => err);
          }

          return of(fallback);
        }),
      )
      .subscribe((result) => {
        const materialsMap = new Map(result.map((m) => [m._id, m]));
        this.#state.set(materialsMap);
      });
  }
}
