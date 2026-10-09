# Bloque 3C — Middleware de autenticación con JWT

## A. Objetivo del módulo

Crear un middleware que permita proteger rutas mediante JWT.

El middleware debe:

1. Leer el token enviado en el header `Authorization`.
2. Validar que el token exista.
3. Verificar que el token sea válido.
4. Guardar los datos del usuario en `req.user`.
5. Permitir continuar a la ruta protegida.

## B. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `jwt.util.js` | Generar y verificar tokens JWT. |
| `auth.middleware.js` | Proteger rutas validando el token. |
| `users.db.js` | Buscar usuario por ID. |
| `auth.service.js` | Obtener el usuario autenticado. |
| `auth.controller.js` | Responder la ruta de usuario autenticado. |
| `auth.routes.js` | Registrar la ruta protegida. |

## C. Ruta protegida principal

```txt
GET /api/auth/me
```

o según el nombre usado en el proyecto:

```txt
GET /api/auth/user-me
```

## D. Flujo de autenticación

```txt
Postman / Frontend
↓
Header Authorization: Bearer TOKEN
↓
auth.routes.js
↓
authenticateToken
↓
req.user = datos del token
↓
auth.controller.js
↓
auth.service.js
↓
users.db.js
↓
PostgreSQL
```

## E. Cadena completa de autenticación

```txt
register → login → token JWT → ruta protegida
```

## F. Reglas aplicadas

- Las rutas protegidas no deben recibir el `userId` desde el body.
- El usuario autenticado se obtiene desde el token JWT.
- Si el token falta, es inválido o está vencido, la petición debe bloquearse.

## G. Siguiente paso

Después de validar el middleware JWT, se puede implementar autorización por roles para limitar acciones de administrador, operador o cliente.
