<p align="center">
  <img src="docs/images/banner.svg" alt="SuperMarket FrontEnd Banner" width="100%">
</p>

<p align="center">
  <a href="https://santi-osp.github.io/superMarketFrontEnd/"><img src="https://img.shields.io/badge/Production-Live%20Demo-E11D48?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo"></a>
  <a href="https://youtu.be/toM-GmfHZpo"><img src="https://img.shields.io/badge/YouTube-Video%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Video Demo"></a>
  <a href="https://supermarketbackend.onrender.com/docs"><img src="https://img.shields.io/badge/FastAPI-Swagger%20Docs-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI Swagger"></a>
  <img src="https://img.shields.io/badge/Angular-20%20Standalone-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 20">
  <img src="https://img.shields.io/badge/Material-Angular%20Material-3F51B5?style=for-the-badge" alt="Angular Material">
  <img src="https://img.shields.io/badge/Auth-JWT%20Bearer-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT">
</p>

<p align="center">
  <img src="docs/images/divider.svg" width="100%">
</p>

## 🛒 Visión General

**SuperMarket FrontEnd** es una aplicación web empresarial de administración comercial y punto de venta, desarrollada con **Angular 20** bajo el paradigma de *Standalone Components* y estilizada con **Angular Material**.

El cliente se conecta de forma reactiva a una API REST construida en **FastAPI**, implementando autenticación robusta mediante tokens **JWT**, intercepción automática de solicitudes HTTP, control de acceso mediante Guards en rutas protegidas (`/app`), y gestión de estado reactivo desacoplado con **Signals** (`signal` y `computed`).

---

## 🎬 Demostración en Video y Enlaces Públicos

<p align="center">
  <a href="https://youtu.be/toM-GmfHZpo">
    <img src="https://img.youtube.com/vi/toM-GmfHZpo/hqdefault.jpg" alt="Ver video demostrativo en YouTube" width="800" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);">
  </a>
</p>

| Recurso | Enlace de Acceso Directo |
| :--- | :--- |
| **🌐 Frontend en Producción (GitHub Pages)** | [santi-osp.github.io/superMarketFrontEnd](https://santi-osp.github.io/superMarketFrontEnd/) |
| **⚡ Backend API en Producción (Render)** | [supermarketbackend.onrender.com](https://supermarketbackend.onrender.com) |
| **📄 Especificación Swagger OpenAPI** | [supermarketbackend.onrender.com/docs](https://supermarketbackend.onrender.com/docs) |
| **🐙 Repositorio del Backend** | [mengrau/superMarketBackEnd](https://github.com/mengrau/superMarketBackEnd) |

---

## 📸 Recorrido Visual de la Plataforma

### 🔐 Portal de Acceso Seguro (Login JWT)
Control de acceso con validaciones reactivas, almacenamiento protegido del token en `localStorage` y expiración automática de sesión.

<p align="center">
  <img src="docs/screenshots/login-screen.png" alt="Pantalla de Acceso" width="850" style="border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);">
</p>

<p align="center">
  <img src="docs/images/divider.svg" width="100%">
</p>

## ⚡ Módulos y Alcance Funcional

- **🔐 Autenticación & Sesión:** Inicio de sesión con credenciales cifradas, interceptor HTTP para inyectar cabeceras `Authorization: Bearer <token>` y redirección automática en caso de token expirado (HTTP 401).
- **🧾 Facturación y Ventas:** Generación de facturas con cálculo en vivo de subtotales, impuestos (IVA) y descuentos; soporte para detalle multinivel y anulación auditada de transacciones.
- **📦 Control de Inventarios:** Catálogo de productos con categorías, stock mínimo de seguridad, control de alertas por agotamiento y kardex de movimientos.
- **🤝 Compras y Proveedores:** Registro de órdenes de compra recibidas, actualización directa de stock disponible y gestión de catálogo de proveedores autorizados.
- **📱 Navegación Lateral (Sidebar):** Menú colapsable adaptado a dispositivos móviles y escritorios para acceso rápido a cada submódulo operativo.

---

## 🏛️ Arquitectura del Sistema

```mermaid
graph TD
    User[Operador / Administrador] --> SPA[Angular 20 Standalone Application]
    
    subgraph Frontend Core
        SPA --> Router[Angular Router + AuthGuard]
        Router --> Views[Módulos: Ventas · Inventario · Proveedores]
        Views --> State[Estado Reactivo: Signals & Computed]
        State --> Interceptor[HTTP JWT Interceptor]
    end
    
    Interceptor -->|Solicitudes HTTPS con Bearer Token| API[FastAPI Backend en Render]
    API --> DB[(Base de Datos Relacional)]
```

---

## 🚀 Instalación y Puesta en Marcha Local

### Prerrequisitos
- **Node.js:** Versión 18.x, 20.x o 22.x LTS
- **Angular CLI:** `npm install -g @angular/cli@20`

### 1. Clonar el repositorio
```bash
git clone https://github.com/santi-osp/superMarketFrontEnd.git
cd superMarketFrontEnd
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de API
Para apuntar a tu backend local de FastAPI o al entorno de producción, configura `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000' // O 'https://supermarketbackend.onrender.com'
};
```

### 4. Iniciar servidor de desarrollo
```bash
npm run start
```
Abre tu navegador en `http://localhost:4200/`.

### 5. Compilación para producción
```bash
npm run build -- --configuration production
```

---

## 📁 Estructura del Código Fuente

```text
superMarketFrontEnd/
├── docs/
│   ├── images/
│   │   ├── banner.svg           # Hero banner vectorial
│   │   └── divider.svg          # Separador decorativo
│   └── screenshots/
│       └── login-screen.png     # Captura de pantalla oficial
├── public/                      # Recursos estáticos
├── src/
│   ├── app/
│   │   ├── core/                # Interceptores HTTP, servicios de auth y guards
│   │   ├── models/              # Interfaces y DTOs de TypeScript
│   │   ├── pages/               # Vistas principales (Login, Ventas, Inventarios)
│   │   ├── shared/              # Componentes visuales reutilizables de Material
│   │   └── app.routes.ts        # Definición de rutas protegidas
│   ├── environments/            # Variables de entorno dev/prod
│   ├── index.html
│   ├── main.ts                  # Bootstrap standalone de Angular
│   └── styles.scss              # Estilos globales y temas Material
├── angular.json
└── package.json
```

---

## 👨‍💻 Autor y Contacto

Desarrollado por **Santiago Ospina Arango**  
- **GitHub:** [@santi-osp](https://github.com/santi-osp)  
- **Demo en Vivo:** [santi-osp.github.io/superMarketFrontEnd](https://santi-osp.github.io/superMarketFrontEnd/)

---

<p align="center">
  <sub>SuperMarket FrontEnd · Desarrollado con Angular 20 y Material Design.</sub>
</p>