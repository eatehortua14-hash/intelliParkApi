# Bloque 5 — Módulo de vehículos

## A. Objetivo del módulo

Permitir registrar y consultar vehículos dentro del sistema IntelliPark.

Se decidió manejar el vehículo de forma simple porque en un parqueadero común normalmente no se solicitan datos personales del propietario. El dato principal para operar el servicio es la placa del vehículo.

## B. Endpoints protegidos

```txt
POST /api/vehicles
GET /api/vehicles
GET /api/vehicles/:id
GET /api/vehicles/plate/:plate
```

## C. Regla inicial

> Solo los roles `administrador` y `operador` pueden registrar y consultar vehículos.

## D. Enfoque del módulo

El vehículo se registra con información mínima:

- Placa.
- Tipo de vehículo.
- Marca opcional.
- Color opcional.
- Usuario que registró el vehículo.

No se registran datos personales como nombre del dueño, teléfono o información del cliente.

## E. Tipos de vehículo permitidos

- carro.
- moto.
- camioneta.
- otro.

## F. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `vehicles.routes.js` | Define las rutas del módulo vehículos. |
| `vehicles.controller.js` | Recibe peticiones HTTP y responde al cliente. |
| `vehicles.service.js` | Contiene la lógica de negocio del módulo vehículos. |
| `vehicles.db.js` | Ejecuta consultas SQL relacionadas con vehículos. |
| `auth.middleware.js` | Valida que el usuario esté autenticado con token JWT. |
| `role.middleware.js` | Valida si el usuario tiene rol administrador u operador. |
| `validate.middleware.js` | Valida datos como placa, tipo e ID. |
| `app.js` | Conecta `/api/vehicles` con Express. |

## G. Flujo general del módulo

```txt
Postman / Frontend
↓
vehicles.routes.js
↓
authenticateToken
↓
authorizeRoles('administrador', 'operador')
↓
vehicles.controller.js
↓
vehicles.service.js
↓
vehicles.db.js
↓
PostgreSQL
```

## H. Reglas aplicadas

- La placa es obligatoria.
- La placa debe ser única.
- La placa se normaliza a mayúsculas para evitar duplicados por diferencias de escritura.
- El tipo de vehículo debe pertenecer a los valores permitidos.
- El vehículo queda activo por defecto.
- El usuario que registra el vehículo se obtiene desde el token JWT.
- No se envían datos del usuario creador desde el body.
- No se solicitan datos personales del propietario.

## I. Pruebas principales en Postman o Swagger

Antes de probar el módulo, se debe iniciar sesión con un usuario administrador u operador y copiar el token JWT.

```txt
POST /api/vehicles
GET /api/vehicles
GET /api/vehicles/:id
GET /api/vehicles/plate/:plate
```

## J. Errores comunes esperados

- Placa no enviada.
- Placa ya registrada.
- Tipo de vehículo no permitido.
- Token no enviado.
- Token inválido o vencido.
- Usuario sin rol autorizado.

## K. Decisión de diseño

Se decidió no registrar información del propietario porque IntelliPark, en su primera versión, representa un flujo básico de parqueadero.

En esta etapa, el sistema no maneja clientes frecuentes, mensualidades, convenios ni facturación nominativa.

Si el proyecto crece, más adelante podrían crearse módulos adicionales:

- clientes.
- vehículos de clientes.
- mensualidades.
- convenios.
- suscripciones.

## L. Siguiente paso recomendado

El siguiente módulo es el ingreso de vehículos al parqueadero:

```txt
POST /api/parking/check-in
GET /api/parking/active
```

Regla principal:

> No permitir dos ingresos activos para la misma placa.
