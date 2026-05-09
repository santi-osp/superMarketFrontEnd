/**
 * Definición de roles y permisos
 * IMPORTANTE: Reemplaza los UUIDs con los valores reales de tu base de datos
 */

// TODO: Reemplazar estos UUIDs con los valores reales de la BD
export const ROLE_IDS = {
  ADMIN: 'b730e630-4bd0-4771-ba4f-66376617e1f5', // UUID del rol administrador
  EMPLEADO: '44a9d5aa-11d4-4cc4-b16c-8e3bdd9ff29a', // UUID del rol empleado
};

/**
 * Matriz de permisos por rol
 * Define qué rutas puede acceder cada rol
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLE_IDS.ADMIN]: [
    // Acceso total
    'usuarios',
    'roles',
    'empleados',
    'clientes',
    'proveedores',
    'sucursales',
    'tipos-producto',
    'productos',
    'inventarios',
    'compras-proveedor',
    'facturas',
  ],
  [ROLE_IDS.EMPLEADO]: [
    // Acceso de lectura a estas rutas (sin CRUD)
    'facturas',
    'clientes',
    'proveedores',
    'sucursales',
    'tipos-producto',
    'productos',
    'compras-proveedor',
  ],
};

/**
 * Rutas permitidas para cada rol en el menú de navegación
 */
export const MENU_ITEMS_BY_ROLE: Record<string, string[]> = {
  [ROLE_IDS.ADMIN]: [
    'usuarios',
    'roles',
    'empleados',
    'clientes',
    'proveedores',
    'sucursales',
    'tipos-producto',
    'productos',
    'inventarios',
    'compras-proveedor',
    'facturas',
  ],
  [ROLE_IDS.EMPLEADO]: [
    'facturas',
    'clientes',
    'proveedores',
    'sucursales',
    'tipos-producto',
    'productos',
    'compras-proveedor',
  ],
};
