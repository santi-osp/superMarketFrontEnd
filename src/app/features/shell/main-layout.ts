import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth.service';

const SIDEBAR_KEY = 'shell_sidebar_collapsed';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  @ViewChild('sidenavShell') private sidenavShell?: MatSidenavContainer;

  readonly sidebarCollapsed = signal(
    typeof localStorage !== 'undefined' && localStorage.getItem(SIDEBAR_KEY) === '1',
  );

  readonly nav = [
    { path: 'usuarios', label: 'Usuarios', icon: 'people' },
    { path: 'roles', label: 'Roles', icon: 'admin_panel_settings' },
    { path: 'empleados', label: 'Empleados', icon: 'badge' },
    { path: 'clientes', label: 'Clientes', icon: 'groups' },
    { path: 'proveedores', label: 'Proveedores', icon: 'local_shipping' },
    { path: 'sucursales', label: 'Sucursales', icon: 'storefront' },
    { path: 'tipos-producto', label: 'Tipos producto', icon: 'category' },
    { path: 'productos', label: 'Productos', icon: 'inventory_2' },
    { path: 'inventarios', label: 'Inventarios', icon: 'warehouse' },
    { path: 'compras-proveedor', label: 'Compras', icon: 'shopping_bag' },
    { path: 'facturas', label: 'Facturas', icon: 'receipt_long' },
  ];

  ngAfterViewInit(): void {
    this.syncContentMarginsWithDrawer();
  }

  private syncContentMarginsWithDrawer(): void {
    const shell = this.sidenavShell;
    if (!shell) return;
    shell.updateContentMargins();
  }

  toggleSidebar(): void {
    const next = !this.sidebarCollapsed();
    this.sidebarCollapsed.set(next);
    localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
    queueMicrotask(() => this.syncContentMarginsWithDrawer());
    window.setTimeout(() => this.syncContentMarginsWithDrawer(), 80);
    window.setTimeout(() => this.syncContentMarginsWithDrawer(), 360);
  }

  logout(): void {
    this.auth.clearSession();
    void this.router.navigateByUrl('/login');
  }
}
