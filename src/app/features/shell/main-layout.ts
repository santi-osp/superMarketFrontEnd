import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead } from '../../models/api.models';
import { httpErrorMessage } from '../../shared/http-error';

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
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  @ViewChild('sidenavShell') private sidenavShell?: MatSidenavContainer;

  readonly usuarios = signal<UsuarioRead[]>([]);

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

  ngOnInit(): void {
    this.usuarioService.list().subscribe({
      next: (rows) => this.usuarios.set(rows),
      error: (err: HttpErrorResponse) =>
        this.snack.open(httpErrorMessage(err), 'Cerrar', { duration: 5000 }),
    });
  }

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
