import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FacturaService } from '../../core/services/factura.service';
import { ProductoService } from '../../core/services/producto.service';
import { FacturaRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';
import { formatDate, money, shortId } from '../../shared/ids';

export interface FacturaDetailDialogData {
  id: string;
  fallback?: FacturaRead;
}

@Component({
  selector: 'app-factura-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './factura-detail-dialog.html',
  styleUrl: './factura-detail-dialog.scss',
})
export class FacturaDetailDialogComponent {
  private readonly svc = inject(FacturaService);
  private readonly productoSvc = inject(ProductoService);

  readonly data = inject<FacturaDetailDialogData>(MAT_DIALOG_DATA);
  readonly factura = signal<FacturaRead | null>(this.data.fallback ?? null);
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
      next: (factura) => {
        this.factura.set(factura);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(httpErrorMessage(err));
        this.loading.set(false);
      },
    });
  }

  estadoClass(factura: FacturaRead): string {
    return (factura.estado || '').toLowerCase() === 'anulada' ? 'anulada' : '';
  }

  productName(id: string): string {
    return this.productNames().get(id) ?? shortId(id);
  }
}
