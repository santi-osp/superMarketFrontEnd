/** Contratos alineados con `superMarketBackEnd/src/models.py` y endpoints FastAPI. */

export type ApiId = string;
export type ApiDateTime = string;
export type ApiDecimal = number | string;

export interface AuditFields {
  fecha_creacion?: ApiDateTime | null;
  fecha_actualizacion?: ApiDateTime | null;
  id_usuario_creacion?: ApiId | null;
  id_usuario_edicion?: ApiId | null;
}

export interface UsuarioRead extends AuditFields {
  id: ApiId;
  username: string;
  id_rol: ApiId;
  estado: boolean;
  /** Campos de compatibilidad con pantallas legacy del frontend anterior. */
  id_usuario: ApiId;
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  rol: ApiId;
  telefono: string | null;
  activo: boolean;
}

export interface UsuarioCreate {
  username: string;
  password: string;
  id_rol: ApiId;
  estado?: boolean;
}

export interface UsuarioUpdate {
  username?: string;
  password?: string;
  id_rol?: ApiId;
  estado?: boolean;
}

export interface RolRead {
  id: ApiId;
  nombre: string;
  descripcion: string | null;
  salario: ApiDecimal | null;
  activo: boolean;
  fecha_creacion?: ApiDateTime | null;
  fecha_actualizacion?: ApiDateTime | null;
}

export interface RolCreate {
  nombre: string;
  descripcion?: string | null;
  salario?: ApiDecimal | null;
  activo?: boolean;
}

export interface RolUpdate {
  nombre?: string;
  descripcion?: string | null;
  salario?: ApiDecimal | null;
  activo?: boolean;
}

export interface ClienteRead extends AuditFields {
  id: ApiId;
  nombre: string;
  tipo_identificacion: string;
  identificacion: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  estado: boolean;
}

export interface ClienteCreate {
  nombre: string;
  tipo_identificacion: string;
  identificacion: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  estado?: boolean;
  id_usuario_creacion?: ApiId | null;
}

export interface ClienteUpdate {
  nombre?: string;
  tipo_identificacion?: string;
  identificacion?: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  estado?: boolean;
  id_usuario_edicion?: ApiId | null;
}

export interface EmpleadoRead extends AuditFields {
  id: ApiId;
  username: string;
  id_rol: ApiId;
  estado: boolean;
  nombre: string;
  tipo_identificacion: string;
  identificacion: string;
  telefono: string | null;
  direccion: string | null;
  cargo: string | null;
  salario: string | null;
}

export interface EmpleadoCreate {
  username: string;
  password: string;
  id_rol: ApiId;
  estado?: boolean;
  nombre: string;
  tipo_identificacion: string;
  identificacion: string;
  telefono?: string | null;
  direccion?: string | null;
  cargo?: string | null;
  salario?: string | null;
  id_usuario_creacion?: ApiId | null;
}

export interface EmpleadoUpdate {
  username?: string;
  password?: string;
  id_rol?: ApiId;
  estado?: boolean;
  nombre?: string;
  tipo_identificacion?: string;
  identificacion?: string;
  telefono?: string | null;
  direccion?: string | null;
  cargo?: string | null;
  salario?: string | null;
}

export interface SucursalRead extends AuditFields {
  id: ApiId;
  nombre: string;
  direccion: string | null;
  gerente: string | null;
  telefono: string | null;
  estado: boolean;
}

export interface SucursalCreate {
  nombre: string;
  direccion?: string | null;
  gerente?: string | null;
  telefono?: string | null;
  estado?: boolean;
}

export interface SucursalUpdate {
  nombre?: string;
  direccion?: string | null;
  gerente?: string | null;
  telefono?: string | null;
  estado?: boolean;
}

export interface ProveedorRead extends AuditFields {
  id: ApiId;
  nombre: string;
  nit: string;
  telefono: string | null;
  direccion: string | null;
  correo: string | null;
  estado: boolean;
}

export interface ProveedorCreate {
  nombre: string;
  nit: string;
  telefono?: string | null;
  direccion?: string | null;
  correo?: string | null;
  estado?: boolean;
}

export interface ProveedorUpdate {
  nombre?: string;
  nit?: string;
  telefono?: string | null;
  direccion?: string | null;
  correo?: string | null;
  estado?: boolean;
}

export interface TipoProductoRead {
  id: ApiId;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  fecha_creacion?: ApiDateTime | null;
  fecha_actualizacion?: ApiDateTime | null;
}

export interface TipoProductoCreate {
  nombre: string;
  descripcion?: string | null;
  estado?: boolean;
}

export interface TipoProductoUpdate {
  nombre?: string;
  descripcion?: string | null;
  estado?: boolean;
}

export interface ProductoRead extends AuditFields {
  id: ApiId;
  nombre: string;
  codigo_barras: string | null;
  precio_venta: ApiDecimal;
  fecha_vencimiento: ApiDateTime | null;
  id_tipo: ApiId | null;
  id_proveedor: ApiId | null;
  estado: boolean;
  /** Campos de compatibilidad con componentes legacy. */
  id_producto: ApiId;
  id_categoria: ApiId;
  descripcion: string | null;
}

export interface ProductoCreate {
  nombre: string;
  precio_venta: ApiDecimal;
  codigo_barras?: string | null;
  fecha_vencimiento?: ApiDateTime | null;
  id_tipo?: ApiId | null;
  id_proveedor?: ApiId | null;
  estado?: boolean;
}

export interface ProductoUpdate {
  nombre?: string;
  precio_venta?: ApiDecimal;
  codigo_barras?: string | null;
  fecha_vencimiento?: ApiDateTime | null;
  id_tipo?: ApiId | null;
  id_proveedor?: ApiId | null;
  estado?: boolean;
}

export interface InventarioRead extends AuditFields {
  id: ApiId;
  id_producto: ApiId;
  id_sucursal: ApiId;
  stock_actual: number;
  stock_minimo: number;
  ubicacion: string | null;
  estado: boolean;
}

export interface InventarioCreate {
  id_producto: ApiId;
  id_sucursal: ApiId;
  stock_actual: number;
  stock_minimo: number;
  ubicacion?: string | null;
  estado?: boolean;
}

export interface InventarioUpdate {
  id_producto?: ApiId;
  id_sucursal?: ApiId;
  stock_actual?: number;
  stock_minimo?: number;
  ubicacion?: string | null;
  estado?: boolean;
}

export interface DetalleFacturaCreate {
  id_producto: ApiId;
  cantidad: number;
  precio_unitario: ApiDecimal;
}

export interface DetalleFacturaUpdate {
  id_producto?: ApiId;
  cantidad?: number;
  precio_unitario?: ApiDecimal;
}

export interface DetalleFacturaRead {
  id: ApiId;
  id_factura: ApiId;
  id_producto: ApiId;
  cantidad: number;
  precio_unitario: ApiDecimal;
  subtotal: ApiDecimal;
  fecha_creacion?: ApiDateTime | null;
}

export interface FacturaRead extends AuditFields {
  id: ApiId;
  fecha: ApiDateTime | null;
  total: ApiDecimal;
  metodo_pago: string | null;
  id_cliente: ApiId;
  id_empleado: ApiId;
  id_sucursal: ApiId;
  estado: string;
  detalles: DetalleFacturaRead[];
}

export interface FacturaCreate {
  metodo_pago?: string | null;
  id_cliente: ApiId;
  id_empleado: ApiId;
  id_sucursal: ApiId;
  detalles: DetalleFacturaCreate[];
}

export interface FacturaUpdate {
  metodo_pago?: string | null;
  estado?: string;
}

export interface DetalleCompraCreate {
  id_producto: ApiId;
  cantidad: number;
  precio_compra: ApiDecimal;
}

export interface DetalleCompraUpdate {
  id_producto?: ApiId;
  cantidad?: number;
  precio_compra?: ApiDecimal;
}

export interface DetalleCompraRead {
  id: ApiId;
  id_compra: ApiId;
  id_producto: ApiId;
  cantidad: number;
  precio_compra: ApiDecimal;
  fecha_creacion?: ApiDateTime | null;
}

export interface CompraProveedorRead extends AuditFields {
  id: ApiId;
  fecha: ApiDateTime | null;
  total_compra: ApiDecimal;
  id_proveedor: ApiId;
  id_sucursal: ApiId | null;
  estado: string;
  detalles: DetalleCompraRead[];
}

export interface CompraProveedorCreate {
  id_proveedor: ApiId;
  id_sucursal?: ApiId | null;
  detalles: DetalleCompraCreate[];
}

export interface CompraProveedorUpdate {
  estado?: string;
}

/* Interfaces legacy preservadas para que m?dulos antiguos no referenciados sigan compilando. */
export interface CategoriaRead {
  id_categoria: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null;
  estado?: boolean;
  id_usuario_creacion: string;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string | null;
  estado?: boolean;
  id_usuario_edita: string;
}

export interface PedidoRead {
  id_pedido: string;
  id_usuario: string;
  nombre: string;
  descripcion: string | null;
  estado: string | null;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface PedidoCreate {
  id_usuario: string;
  nombre: string;
  descripcion?: string | null;
  estado?: string | null;
  id_usuario_creacion: string;
}

export interface PedidoUpdate {
  id_usuario?: string;
  nombre?: string;
  descripcion?: string | null;
  estado?: string | null;
  id_usuario_edita: string;
}

export interface DetallePedidoRead {
  id_detalle_pedido: string;
  id_pedido: string;
  id_producto: string;
  nombre: string;
  descripcion: string | null;
  estado: string | null;
}

export interface DetallePedidoCreate {
  id_pedido: string;
  id_producto: string;
  nombre: string;
  descripcion?: string | null;
  estado?: string | null;
}

export interface DetallePedidoUpdate {
  id_pedido?: string;
  id_producto?: string;
  nombre?: string;
  descripcion?: string | null;
  estado?: string | null;
}

export interface PagoRead {
  id_pago: string;
  id_pedido: string;
  nombre: string;
  descripcion: string | null;
  estado: string | null;
  referencia: string;
  tipo_pago: string;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface PagoCreate {
  id_pedido: string;
  nombre: string;
  descripcion?: string | null;
  estado?: string | null;
  referencia: string;
  tipo_pago: string;
  id_usuario_creacion: string;
}

export interface PagoUpdate {
  id_pedido?: string;
  nombre?: string;
  descripcion?: string | null;
  estado?: string | null;
  referencia?: string;
  tipo_pago?: string;
  id_usuario_edita: string;
}
