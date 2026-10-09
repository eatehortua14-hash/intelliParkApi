# Bloque 1 — Configuración inicial del backend

## A. Objetivo del módulo

Crear la base funcional del backend de **IntelliPark**.

## B. Elementos configurados

| Elemento | Estado |
|---|---|
| Proyecto Node.js inicializado | OK |
| Dependencias instaladas | OK |
| Estructura de carpetas creada | OK |
| Servidor Express configurado | OK |
| Variables de entorno con `.env` | OK |
| CORS habilitado | OK |
| Conexión inicial a PostgreSQL | OK |
| Endpoint de prueba `GET /api/health` | OK |

## C. Resultado esperado

El backend debe responder correctamente en:

```txt
GET http://localhost:3000/api/health
```

La respuesta debe confirmar que:

- El servidor Express está activo.
- La API está corriendo.
- La conexión con PostgreSQL funciona.

## D. Archivos principales del bloque

| Archivo | Responsabilidad |
|---|---|
| `src/app.js` | Configuración general de Express, middlewares y rutas. |
| `src/server.js` | Levantamiento del servidor. |
| `src/config/database.js` | Configuración del pool de conexión a PostgreSQL. |
| `.env` | Variables de entorno del proyecto. |
| `.gitignore` | Archivos y carpetas excluidas del repositorio. |
| `package.json` | Dependencias y scripts del proyecto. |

## E. Siguiente paso

Después de validar `GET /api/health`, el siguiente bloque es la creación de la tabla `users` y la primera capa de acceso a datos.
