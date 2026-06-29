import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CreateMaterialDTO, Material } from '../models/material.model';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  #state = signal(new Map<string, Material>());
  materials = this.#state.asReadonly();

  baseUrl = environment.apiUrl;
  http: HttpClient = inject(HttpClient);

  getMaterials() {
    this.http
      .get<Material[]>(this.baseUrl)
      .pipe(
        catchError((err) => {
          console.error('Error fetching materials.', err);

          const fallback = [
            {
              id: 'abcdefg',
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
        const materialsMap = new Map(result.map((m) => [m.id, m]));
        this.#state.set(materialsMap);
      });
  }

  createMaterial(materialDTO: CreateMaterialDTO): Observable<Material> {
    return this.http.post<Material>(this.baseUrl, materialDTO).pipe(
      tap((newMaterial) => {
        this.#state.update((previousState) => {
          const newMap = new Map(previousState);
          newMap.set(newMaterial.id, newMaterial);
          return newMap;
        });
      }),
    );
  }

  updateMaterial(id: string, changes: Partial<CreateMaterialDTO>): Observable<Material> {
    return this.http.patch<Material>(`${this.baseUrl}/${id}`, changes).pipe(
      tap((updatedMaterial) => {
        this.#state.update((previousState) => {
          const newMap = new Map(previousState);
          newMap.set(updatedMaterial.id, updatedMaterial);
          return newMap;
        });
      }),
    );
  }

  deleteMaterial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.#state.update((previousState) => {
          const newMap = new Map(previousState);
          newMap.delete(id);
          return newMap;
        });
      }),
    );
  }
}
