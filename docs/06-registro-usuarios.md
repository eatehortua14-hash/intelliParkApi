# Bloque 4 — Módulo de usuarios

## A. Objetivo del módulo

Permitir que un administrador consulte usuarios y active o desactive cuentas.

## B. Endpoints protegidos

```txt
GET /api/users
GET /api/users/:user_id
PATCH /api/users/:user_id/status
```

## C. Regla inicial

> Solo el rol `administrador` puede consultar y modificar usuarios.

## D. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `users.routes.js` | Define las rutas del módulo usuarios. |
| `users.controller.js` | Recibe peticiones HTTP y responde al cliente. |
| `users.service.js` | Contiene la lógica de negocio de usuarios. |
| `users.db.js` | Ejecuta consultas SQL de usuarios. |
| `auth.middleware.js` | Valida que el usuario esté autenticado. |
| `role.middleware.js` | Valida si el usuario tiene el rol permitido. |
| `validate.middleware.js` | Valida parámetros y datos recibidos. |
| `app.js` | Conecta `/api/users` con Express. |

## E. Flujo general del módulo

```txt
Postman / Frontend
↓
users.routes.js
↓
authenticateToken
↓
authorizeRoles('administrador')
↓
users.controller.js
↓
users.service.js
↓
users.db.js
↓
PostgreSQL
```

## F. Reglas aplicadas

- El listado de usuarios requiere token válido.
- La consulta por ID requiere rol administrador.
- La activación o desactivación de usuarios requiere rol administrador.
- El estado debe enviarse como booleano.
- No se debe eliminar físicamente un usuario; se recomienda manejar activación/desactivación.

## G. Pruebas principales

```txt
GET /api/users
GET /api/users/:user_id
PATCH /api/users/:user_id/status
```

## H. Siguiente paso

Después del módulo de usuarios, se implementa el módulo de vehículos.
