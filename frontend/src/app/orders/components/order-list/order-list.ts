import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order-list',
  imports: [CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {
  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);

  orders = this.orderService.orders;
  summaries = this.orderService.summaries;

  loading = signal<boolean>(true);
  summaryLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  summaryError = signal<string | null>(null);
  expandedOrderId = signal<string | null>(null);
  orderToDelete = signal<string | null>(null);

  ngOnInit(): void {
    this.orderService
      .loadOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Error al cargar órdenes.');
        },
      });

    this.orderService
      .loadSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.summaryLoading.set(false);
        },
        error: () => {
          this.summaryLoading.set(false);
          this.summaryError.set('Error al cargar resumen del mes.');
        },
      });
  }

  toggleOrder(id: string) {
    if (this.expandedOrderId() === id) {
      this.expandedOrderId.set(null);
    } else {
      this.expandedOrderId.set(id);
    }
  }

  monthName(month: number): string {
    if (month < 1 || month > 12) {
      return 'Invalid month';
    }

    return [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ][month - 1];
  }

  openDeleteModal(id: string) {
    this.orderToDelete.set(id);
  }

  closeDeleteModal() {
    this.orderToDelete.set(null);
  }

  confirmDelete() {
    const id = this.orderToDelete();
    if (id) {
      this.orderService
        .deleteOrder(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.closeDeleteModal();
          },
          error: () => {
            this.error.set('Error al eliminar la orden');
          },
        });
    }
  }
}
