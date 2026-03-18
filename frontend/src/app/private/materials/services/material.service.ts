import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private http: HttpClient = Inject(HttpClient);
}
