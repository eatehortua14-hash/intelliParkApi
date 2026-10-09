# Bloque 10 — Validaciones básicas y manejo de errores

## A. Objetivo del módulo

Agregar validaciones básicas y manejo de errores consistente para preparar el backend antes de conectarlo con el frontend.

## B. Elementos que se validan

- Registro de usuarios.
- Login.
- IDs por parámetro.
- Estado activo/inactivo de usuario.
- Registro de vehículos.
- Ingreso de vehículos.
- Salida de vehículos.
- Registro de pagos.
- Reportes por fecha.
- Rutas no encontradas.
- Errores generales del servidor.

## C. Archivos principales

| Archivo | Responsabilidad |
|---|---|
| `validate.middleware.js` | Centraliza validaciones básicas de entrada. |
| `error.middleware.js` | Maneja rutas inexistentes y errores generales. |
| `auth.routes.js` | Usa validaciones para register y login. |
| `users.routes.js` | Usa validaciones para ID y estado de usuario. |
| `vehicles.routes.js` | Usa validaciones para vehículo, ID y placa. |
| `parking.routes.js` | Usa validaciones para check-in y check-out. |
| `payments.routes.js` | Usa validaciones para pagos. |
| `reports.routes.js` | Usa validación de fechas del reporte. |
| `app.js` | Registra middlewares de error después de las rutas. |

## D. Tipos de validación

### Usuarios

- Nombre requerido.
- Apellido requerido.
- Correo válido.
- Contraseña mínima.
- Rol permitido.

### Login

- Correo requerido.
- Contraseña requerida.
- Formato válido de correo.

### Vehículos

- Placa requerida.
- Tipo de vehículo permitido.
- Marca y color como texto si se envían.

### Parqueadero

- Check-in con placa obligatoria.
- Check-out con placa obligatoria.
- Tipo de vehículo válido.

### Pagos

- `parkingId` obligatorio.
- Método de pago permitido.
- Referencia como texto y con longitud controlada.

### Reportes

- Fecha `from` en formato `YYYY-MM-DD`.
- Fecha `to` en formato `YYYY-MM-DD`.
- Fecha inicial menor o igual a fecha final.

## E. Manejo de rutas inexistentes

Si una ruta no existe, la API debe responder con un mensaje claro indicando:

- Ruta solicitada.
- Método HTTP utilizado.
- Mensaje de ruta no encontrada.

## F. Manejo de errores generales

Los errores no controlados deben responder de forma genérica para evitar exponer detalles internos del servidor.

## G. Decisión técnica

Se mantiene un enfoque simple y pedagógico, usando validaciones manuales sin agregar librerías adicionales.

Esto permite que los aprendices comprendan primero el flujo de validación antes de incorporar herramientas más avanzadas.

## H. Siguiente paso

Después de validar y ordenar errores, el siguiente paso es documentar la API con Swagger y preparar la documentación para el frontend.
