import { inject, Injectable, signal } from '@angular/core';
import { CreateOrderDTO, MonthlySummary, Order } from '../models/order.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _orders = signal<Order[]>([]);
  private _summaries = signal<MonthlySummary[]>([]);

  orders = this._orders.asReadonly();
  summaries = this._summaries.asReadonly();

  baseUrl = environment.ordersApiUrl;
  http: HttpClient = inject(HttpClient);

  loadOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      tap((orders) => {
        const sorted = [...orders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        this._orders.set(sorted);
      }),
    );
  }

  createOrder(orderDTO: CreateOrderDTO): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, orderDTO).pipe(
      tap((newOrder) => {
        this._orders.update((prev) => [newOrder, ...prev]);
      }),
    );
  }

  loadSummary(): Observable<MonthlySummary[]> {
    return this.http.get<MonthlySummary[]>(`${this.baseUrl}/summary`).pipe(
      tap((result) => {
        this._summaries.set(result);
      }),
    );
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this._orders.update((orders) => orders.filter((o) => o._id !== id));
      }),
    );
  }
}
