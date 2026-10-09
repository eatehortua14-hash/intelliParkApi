# Bloque 11 — Instalación y configuración de Swagger

## A. Objetivo

Incorporar Swagger al backend de IntelliPark para documentar, visualizar y probar los endpoints de la API desde el navegador.

Swagger funciona como una documentación interactiva de la API. Permite ver rutas disponibles, métodos HTTP, datos que se deben enviar, respuestas esperadas y también probar endpoints protegidos con JWT.

## B. Rutas disponibles

Documentación interactiva:

```txt
GET http://localhost:3000/api/docs
```

JSON OpenAPI:

```txt
GET http://localhost:3000/api/docs.json
```

## C. Dependencias instaladas

- `swagger-ui-express`.
- `swagger-jsdoc`.

`swagger-ui-express` permite mostrar la documentación de Swagger en una interfaz web.

`swagger-jsdoc` permite construir la documentación OpenAPI a partir de comentarios escritos dentro de los archivos de rutas.

## D. Archivo de configuración

Se creó el archivo:

```txt
src/config/swagger.js
```

Este archivo contiene la configuración principal de Swagger/OpenAPI para el proyecto IntelliPark.

## E. Elementos definidos en la configuración

- Nombre de la API.
- Versión de la API.
- Descripción general del proyecto.
- Servidor local de desarrollo.
- Tags o categorías de endpoints.
- Esquema de autenticación con Bearer Token.
- Esquemas reutilizables para los cuerpos de las peticiones.
- Ubicación de los archivos donde Swagger debe leer la documentación.

## F. Integración en `app.js`

Swagger se configuró en `app.js` para exponer:

- `/api/docs`.
- `/api/docs.json`.

La documentación debe registrarse antes del middleware de rutas no encontradas.

Si Swagger se registra después del `notFoundHandler`, la ruta `/api/docs` podría responder como inexistente.

## G. Organización por tags

| Tag | Propósito |
|---|---|
| `Health` | Verificación del estado de la API. |
| `Auth` | Registro, login y consulta del usuario autenticado. |
| `Users` | Gestión de usuarios. |
| `Vehicles` | Registro y consulta de vehículos. |
| `Parking` | Ingreso y salida de vehículos del parqueadero. |
| `Payments` | Registro y consulta de pagos. |
| `Reports` | Reportes básicos de ingresos. |

## H. Autenticación en Swagger

Se configuró un esquema de seguridad llamado `bearerAuth`.

Este esquema permite probar endpoints protegidos con JWT desde Swagger.

Flujo de uso:

1. Hacer login.
2. Copiar el token generado por el backend.
3. Abrir Swagger.
4. Hacer clic en **Authorize**.
5. Pegar el token.
6. Ejecutar endpoints protegidos.

## I. Importancia del Bearer Token

Los endpoints protegidos no reciben el `userId` desde el body, params o query.

El usuario autenticado se identifica a partir del token JWT.

Cuando el backend recibe una petición protegida, el middleware de autenticación valida el token y extrae datos como:

- `userId`.
- `email`.
- `role`.

Por esta razón, rutas como:

```txt
GET /api/auth/user-me
```

no necesitan recibir un `userId` como parámetro. El `userId` se obtiene directamente desde el JWT.

## J. Documentación de rutas

Para que Swagger muestre los endpoints, se deben agregar comentarios de documentación en los archivos de rutas.

Estos comentarios indican:

- Método HTTP.
- URL del endpoint.
- Descripción de la operación.
- Categoría o tag.
- Si requiere autenticación.
- Body esperado.
- Parámetros.
- Respuestas posibles.

## K. Archivos principales documentados

- `src/routes/auth.routes.js`.
- `src/routes/users.routes.js`.
- `src/routes/vehicles.routes.js`.
- `src/routes/parking.routes.js`.
- `src/routes/payments.routes.js`.
- `src/routes/reports.routes.js`.

## L. Prueba inicial

Después de instalar y configurar Swagger, se debe iniciar el servidor:

```txt
npm run dev
```

Luego se abre en el navegador:

```txt
http://localhost:3000/api/docs
```

También se puede validar:

```txt
http://localhost:3000/api/docs.json
```

## M. Error común encontrado

Durante la prueba del endpoint de usuario autenticado, Swagger enviaba la petición sin el header `Authorization`.

El backend respondió:

> El token de autorización es requerido.

La solución fue usar el botón **Authorize** de Swagger y asegurarse de que la ruta estuviera documentada con seguridad `bearerAuth`.

## N. Decisión técnica

Swagger se incorporó como herramienta de documentación y prueba del backend.

Esto permite que IntelliPark tenga una documentación más profesional, útil para pruebas con aprendices, revisión técnica y futura integración con Angular.

## O. Siguiente paso recomendado

Documentar todos los endpoints principales de la API:

- Auth.
- Users.
- Vehicles.
- Parking.
- Payments.
- Reports.

Esta documentación servirá como contrato técnico entre backend y frontend.
