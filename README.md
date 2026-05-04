# Aplicación Angular (`web/`)

Este directorio es el **proyecto Angular** generado con Angular CLI 20.

La documentación completa del frontend (stack, instalación, estructura, rutas, backend, CORS, etc.) está en el archivo **`../README.md`** de la carpeta padre (`frontend-programacion-de-software`).

## Comandos rápidos

```bash
npm install
npm start          # http://localhost:4200
npm run build      # salida en dist/
```

Desde la carpeta padre también puedes usar `npm start` (delega a este proyecto).

## CI

Se agregó workflow de GitHub Actions en `.github/workflows`:

- `ci.yml` (CI - SuperMarketFrontEnd)
	- Se ejecuta en `push` y `pull_request` a ramas `DEV`, `QA` y `PROD`.
	- Ejecuta instalación limpia con `npm ci`.
	- Compila frontend en modo producción con `npm run build:prod`.
	- Ejecuta pruebas unitarias en modo headless.
	- Publica artefactos de cobertura y bundle (`dist/web`).
