# Bloque 8 — Módulo de pagos

## A. Objetivo del módulo

Crear endpoints para registrar y consultar pagos asociados a registros de parqueo finalizados.

## B. Endpoints protegidos

```txt
POST /api/payments
GET /api/payments
GET /api/payments/:id
GET /api/payments/parking/:parkingId
```

## C. Reglas principales

1. Solo se puede pagar un parqueo finalizado.
2. No se permite pago duplicado para el mismo registro de parqueo.
3. El valor pagado se toma del valor calculado en `parking_records`.
4. Los pagos serán la base para los reportes financieros.

## D. SQL del módulo

Archivo sugerido:

```txt
migracion/004_create_payments.sql
```

## E. Entidad principal

```txt
payments
```

Campos principales esperados:

- `payment_id`.
- `parking_id`.
- `payment_method`.
- `payment_amount`.
- `payment_reference`.
- `payment_created_by`.
- `payment_created_at`.
- `payment_updated_at`.

## F. Métodos de pago permitidos

- efectivo.
- transferencia.
- tarjeta.
- otro.

## G. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `payments.routes.js` | Define las rutas del módulo de pagos. |
| `payments.controller.js` | Recibe peticiones HTTP y responde al cliente. |
| `payments.service.js` | Contiene validaciones y reglas de negocio de pagos. |
| `payments.db.js` | Ejecuta consultas SQL relacionadas con pagos. |
| `auth.middleware.js` | Valida que el usuario esté autenticado. |
| `role.middleware.js` | Valida roles administrador u operador. |
| `validate.middleware.js` | Valida `parkingId`, método de pago y referencia. |
| `app.js` | Conecta `/api/payments` con Express. |

## H. Flujo general del módulo

```txt
Postman / Frontend
↓
payments.routes.js
↓
authenticateToken
↓
authorizeRoles('administrador', 'operador')
↓
payments.controller.js
↓
payments.service.js
↓
payments.db.js
↓
PostgreSQL
```

## I. Reglas aplicadas

- El `parkingId` es obligatorio.
- El registro de parqueo debe existir.
- El registro de parqueo debe estar finalizado.
- El registro de parqueo debe tener valor calculado.
- No debe existir un pago previo para el mismo `parkingId`.
- El usuario que registra el pago se obtiene desde el JWT.

## J. Pruebas principales

```txt
POST /api/payments
GET /api/payments
GET /api/payments/:id
GET /api/payments/parking/:parkingId
```

## K. Errores comunes esperados

- Parqueo inexistente.
- Parqueo aún activo.
- Parqueo sin valor calculado.
- Pago duplicado.
- Método de pago inválido.
- Token faltante o inválido.
- Usuario sin rol autorizado.

## L. Siguiente paso

Después de pagos, se implementan reportes financieros basados en la tabla `payments`.
