# Bloque 3B — Login de usuarios con JWT

## A. Objetivo del módulo

Crear el login del sistema IntelliPark mediante el endpoint:

```txt
POST /api/auth/login
```

Este endpoint permite validar credenciales y devolver un token JWT.

## B. Responsabilidades del login

El login debe:

1. Recibir correo y contraseña.
2. Validar que el usuario exista.
3. Validar que el usuario esté activo.
4. Comparar la contraseña enviada con la contraseña cifrada en base de datos.
5. Generar un token JWT.
6. Devolver datos básicos del usuario y el token.

## C. Archivos involucrados

```txt
src/
  routes/
    auth.routes.js
  controllers/
    auth.controller.js
  services/
    auth.service.js
  utils/
    password.util.js
    jwt.util.js
```

## D. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `auth.routes.js` | Agrega la ruta `/login`. |
| `auth.controller.js` | Recibe la petición HTTP del login. |
| `auth.service.js` | Valida credenciales y coordina la lógica de autenticación. |
| `password.util.js` | Compara contraseñas con bcrypt. |
| `jwt.util.js` | Genera el token JWT. |
| `users.db.js` | Busca el usuario por correo. |

## E. Flujo del login

```txt
Postman / Frontend
↓
auth.routes.js
↓
auth.controller.js
↓
auth.service.js
↓
users.db.js
↓
password.util.js
↓
jwt.util.js
↓
Response con token
```

## F. Regla de seguridad

Cuando el correo o la contraseña no coinciden, la respuesta debe ser genérica. No conviene indicar si falló el correo o la contraseña por separado.

## G. Resultado esperado

El sistema debe responder con:

- Mensaje de login exitoso.
- Token JWT.
- Datos básicos del usuario autenticado.

## H. Siguiente paso

Después del login, se implementa el middleware de autenticación para proteger rutas usando el token JWT.
