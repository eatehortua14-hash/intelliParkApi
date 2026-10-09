# Bloque 6 — Ingreso de vehículos al parqueadero

## A. Objetivo del módulo

Permitir registrar el ingreso de un vehículo al parqueadero dentro del sistema IntelliPark.

A partir de este módulo, el sistema empieza a comportarse como un parqueadero real, ya que permite controlar qué vehículos se encuentran actualmente dentro del establecimiento.

## B. Endpoints protegidos

```txt
POST /api/parking/check-in
GET /api/parking/active
```

El endpoint `check-in` permite registrar el ingreso de un vehículo.

El endpoint `active` permite consultar los vehículos que actualmente están dentro del parqueadero.

## C. Regla principal

> No permitir dos ingresos activos para la misma placa.

## D. Enfoque del módulo

El operador solo necesita registrar datos mínimos del vehículo:

- Placa.
- Tipo de vehículo.
- Marca opcional.
- Color opcional.

Si la placa no existe en la tabla `vehicles`, el sistema crea el vehículo automáticamente.

Si la placa ya existe, el sistema reutiliza ese vehículo y verifica si ya tiene un ingreso activo.

## E. Entidad principal

La entidad principal es:

```txt
parking_records
```

Esta tabla representa cada uso del parqueadero, desde el ingreso hasta la salida del vehículo.

## F. Campos principales

- `parking_id`.
- `vehicle_id` o equivalente definido en la base de datos.
- `parking_entry_time`.
- `parking_exit_time`.
- `parking_status`.
- `parking_total_minutes`.
- `parking_total_amount`.
- `parking_created_by`.
- `parking_created_at`.
- `parking_updated_at`.

En este módulo se usa principalmente:

- `vehicle_id`.
- `parking_entry_time`.
- `parking_status`.
- `parking_created_by`.

Los campos de salida, minutos y valor total se usan en el módulo de salida.

## G. Estados del parqueo

- activo.
- finalizado.
- cancelado.

El estado `activo` indica que el vehículo se encuentra actualmente dentro del parqueadero.

## H. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `parking.routes.js` | Define las rutas del módulo de parqueadero. |
| `parking.controller.js` | Recibe peticiones HTTP y responde al cliente. |
| `parking.service.js` | Contiene la lógica de negocio para registrar ingresos de vehículos. |
| `parking.db.js` | Ejecuta consultas SQL relacionadas con `parking_records`. |
| `vehicles.db.js` | Se reutiliza para buscar o crear vehículos por placa. |
| `auth.middleware.js` | Valida que el usuario esté autenticado con token JWT. |
| `role.middleware.js` | Valida que el usuario tenga rol administrador u operador. |
| `validate.middleware.js` | Valida los datos de entrada. |
| `app.js` | Conecta `/api/parking` con Express. |

## I. Flujo general del módulo

```txt
Postman / Frontend
↓
parking.routes.js
↓
authenticateToken
↓
authorizeRoles('administrador', 'operador')
↓
parking.controller.js
↓
parking.service.js
↓
vehicles.db.js
↓
parking.db.js
↓
PostgreSQL
```

## J. Reglas aplicadas

- La placa es obligatoria.
- La placa se normaliza a mayúsculas.
- Si el vehículo no existe, se crea automáticamente.
- Si el vehículo existe, se reutiliza el registro existente.
- No se permite registrar un nuevo ingreso si el vehículo ya tiene un parqueo activo.
- El usuario que registra el ingreso se obtiene desde el token JWT.
- No se envía el usuario creador desde el body.
- Solo los roles administrador y operador pueden registrar ingresos.
- Los registros activos representan vehículos que aún están dentro del parqueadero.

## K. Protección desde base de datos

Además de validar desde el backend, se recomienda una restricción mediante índice único parcial para evitar que un mismo vehículo tenga dos registros activos.

Regla reforzada:

> Un vehículo no puede estar dos veces dentro del parqueadero al mismo tiempo.

## L. Pruebas principales

```txt
POST /api/parking/check-in
GET /api/parking/active
```

## M. Errores comunes esperados

- No enviar placa.
- Enviar un tipo de vehículo no permitido.
- Intentar ingresar dos veces la misma placa sin haber registrado salida.
- Enviar la petición sin token.
- Enviar un token inválido o vencido.
- Usar un usuario sin rol autorizado.
- Tener el vehículo inactivo.

## N. Decisión de diseño

Se decidió que el check-in sea el proceso principal de ingreso al parqueadero.

El sistema no obliga a registrar previamente el vehículo desde el módulo de vehículos. Si la placa no existe, el sistema la crea automáticamente durante el ingreso.

Esto hace que el flujo sea más realista, porque en un parqueadero común el operador registra la placa en el momento en que el vehículo entra.

## O. Siguiente paso recomendado

Crear el proceso de salida del vehículo:

```txt
POST /api/parking/check-out
```

Reglas principales:

- Un vehículo solo puede tener salida si tiene un ingreso activo.
- El sistema debe calcular el tiempo de permanencia.
- El sistema debe calcular el valor del servicio.
- El registro debe cambiar de activo a finalizado.
