import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CompraProveedorService } from '../../core/services/compra-proveedor.service';
import { ProductoService } from '../../core/services/producto.service';
import { CompraProveedorRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { formatDate, money, shortId } from '../../shared/ids';

export interface CompraProveedorDetailDialogData {
  id: string;
  fallback?: CompraProveedorRead;
}

@Component({
  selector: 'app-compra-proveedor-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './compra-proveedor-detail-dialog.html',
  styleUrl: './compra-proveedor-detail-dialog.scss',
})
export class CompraProveedorDetailDialogComponent {
  private readonly svc = inject(CompraProveedorService);
  private readonly productoSvc = inject(ProductoService);

  readonly data = inject<CompraProveedorDetailDialogData>(MAT_DIALOG_DATA);
  readonly compra = signal<CompraProveedorRead | null>(this.data.fallback ?? null);
  readonly productNames = signal(new Map<string, string>());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly shortId = shortId;
  readonly formatDate = formatDate;
  readonly money = money;

  constructor() {
    this.loadProducts();
    this.load();
  }

  loadProducts(): void {
    this.productoSvc.list().subscribe({
      next: (productos) => {
        this.productNames.set(new Map(productos.map((producto) => [producto.id, producto.nombre])));
      },
      error: () => {
        this.productNames.set(new Map());
      },
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.svc.get(this.data.id).subscribe({
      next: (compra) => {
        this.compra.set(compra);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(httpErrorMessage(err));
        this.loading.set(false);
      },
    });
  }

  estadoClass(compra: CompraProveedorRead): string {
    return (compra.estado || '').toLowerCase() === 'anulada' ? 'anulada' : '';
  }

  productName(id: string): string {
    return this.productNames().get(id) ?? shortId(id);
  }

  subtotal(cantidad: number, precioCompra: number | string): string {
    return money(Number(cantidad) * Number(precioCompra));
  }
}
