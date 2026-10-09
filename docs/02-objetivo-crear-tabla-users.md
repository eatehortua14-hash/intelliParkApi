# Bloque 2 — Crear tabla `users` y primera capa de acceso a datos

## A. Contexto

Si `GET http://localhost:3000/api/health` responde correctamente, significa que ya está funcionando:

- Node.js + Express.
- dotenv.
- CORS.
- Conexión con PostgreSQL.
- Servidor activo.
- Endpoint inicial de prueba.

Antes de avanzar con JWT y login, se debe crear la base de datos inicial, especialmente la tabla `users`, porque el módulo de autenticación depende de ella.

## B. Objetivo del módulo

Crear la primera tabla real del sistema IntelliPark:

```txt
users
```

Esta tabla permite almacenar los usuarios que ingresarán al sistema, por ejemplo:

- Administrador.
- Operador.
- Cliente, si el proyecto lo mantiene como rol futuro.

## C. Ruta de trabajo

1. Crear tabla `users` en PostgreSQL.
2. Crear archivo `users.db.js`.
3. Probar una consulta real desde Node.js.
4. Confirmar la arquitectura por capas.
5. Luego pasar a autenticación: register y login.

## D. Por qué se crea primero `users`

Para implementar login, primero debe existir un lugar donde guardar usuarios.

Flujo futuro:

```txt
Registro de usuario
↓
Contraseña cifrada con bcrypt
↓
Usuario guardado en users
↓
Login consulta el usuario
↓
bcrypt compara contraseña
↓
JWT genera token
```

## E. Archivos involucrados

```txt
intellipark-api/
  src/
    database/
      users.db.js
  migracion/
    user.sql
```

## F. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `migracion/user.sql` | Guardar el script SQL de creación de la tabla `users` y sus tipos asociados. |
| `src/database/users.db.js` | Contener consultas SQL relacionadas con usuarios. |

## G. Funciones esperadas en `users.db.js`

| Función | Propósito |
|---|---|
| `findAllUsers()` | Obtener todos los usuarios. |
| `findUserByUserEmail()` | Buscar un usuario por correo. Es clave para el login. |
| `findUserById()` | Buscar un usuario por ID. Es útil para rutas protegidas como `user-me`. |
| `createUser()` | Crear un usuario nuevo. Es clave para el registro. |
| `updateUserStatus()` | Activar o desactivar un usuario. |

## H. Seguridad en consultas SQL

Se deben usar parámetros como `$1`, `$2`, `$3` en lugar de concatenar valores directamente dentro del SQL.

Esto evita inyección SQL.

Ejemplo conceptual:

```txt
Consulta SQL con placeholders
+
Arreglo de valores separado
```

Los valores dinámicos se envían separados para que PostgreSQL los trate como datos y no como instrucciones.

## I. Siguiente paso

Después de crear la tabla y la capa `users.db.js`, se puede avanzar al registro de usuarios mediante:

```txt
POST /api/auth/register
```
