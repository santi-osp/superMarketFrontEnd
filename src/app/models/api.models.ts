/** Contratos alineados con `src/api/*.py` del backend FastAPI. */

export interface UsuarioRead {
  id_usuario: string;
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  rol: string;
  telefono: string | null;
  activo: boolean;
}

export interface UsuarioCreate {
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  clave: string;
  rol: string;
  telefono?: string | null;
  activo?: boolean;
}

export interface UsuarioUpdate {
  nombre_completo?: string;
  nombre_usuario?: string;
  email?: string;
  clave?: string;
  rol?: string;
  telefono?: string | null;
  activo?: boolean;
}

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

export interface ProductoRead {
  id_producto: string;
  id_categoria: string;
  nombre: string;
  descripcion: string | null;
  fecha_creacion: string | null;
  fecha_edicion: string | null;
  id_usuario_creacion: string;
  id_usuario_edita: string | null;
}

export interface ProductoCreate {
  id_categoria: string;
  nombre: string;
  descripcion?: string | null;
  id_usuario_creacion: string;
}

export interface ProductoUpdate {
  id_categoria?: string;
  nombre?: string;
  descripcion?: string | null;
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
