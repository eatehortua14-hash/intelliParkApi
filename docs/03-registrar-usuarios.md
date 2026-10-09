# Bloque 3A — Registro de usuarios

## A. Objetivo del módulo

Crear el primer endpoint real del backend:

```txt
POST /api/auth/register
```

Este endpoint permite registrar un usuario en la tabla `users`, cifrando su contraseña con `bcrypt`.

## B. Responsabilidades del endpoint

El registro debe:

1. Recibir nombre, apellido, correo, contraseña y rol.
2. Validar datos básicos.
3. Verificar que el correo no exista.
4. Cifrar la contraseña con `bcrypt`.
5. Guardar el usuario en PostgreSQL.
6. Responder el usuario creado sin mostrar la contraseña.

## C. Archivos involucrados

```txt
src/
  app.js
  routes/
    auth.routes.js
  controllers/
    auth.controller.js
  services/
    auth.service.js
  database/
    users.db.js
  utils/
    password.util.js
```

## D. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `auth.routes.js` | Define la ruta `/register`. |
| `auth.controller.js` | Recibe la petición HTTP y responde al cliente. |
| `auth.service.js` | Maneja la lógica de negocio del registro. |
| `users.db.js` | Ejecuta consultas SQL relacionadas con usuarios. |
| `password.util.js` | Cifra contraseñas usando `bcrypt`. |
| `app.js` | Conecta las rutas de autenticación con Express. |

## E. Flujo del registro

```txt
Postman / Frontend
↓
auth.routes.js
↓
auth.controller.js
↓
auth.service.js
↓
password.util.js
↓
users.db.js
↓
PostgreSQL
```

## F. Reglas aplicadas

- El correo debe ser único.
- La contraseña no se almacena en texto plano.
- La contraseña cifrada se guarda en la columna correspondiente.
- La respuesta no debe exponer la contraseña.
- El rol debe pertenecer a los valores permitidos.

## G. Siguiente paso

Después del registro, se implementa el login de usuarios con JWT.
