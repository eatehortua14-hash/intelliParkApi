# Bloque 7 — Módulo de salida de vehículos

## A. Objetivo del módulo

Crear el endpoint:

```txt
POST /api/parking/check-out
```

Este endpoint completa el ciclo operativo principal del parqueadero:

```txt
Ingreso → Permanencia → Salida → Cálculo del valor
```

## B. Responsabilidades del endpoint

El endpoint debe:

1. Recibir la placa del vehículo.
2. Buscar si el vehículo existe.
3. Validar que tenga un ingreso activo.
4. Calcular el tiempo de permanencia.
5. Calcular el valor a pagar.
6. Actualizar el registro de parqueo como finalizado.
7. Guardar hora de salida, minutos totales y valor total.

## C. Regla principal

> Un vehículo solo puede tener salida si tiene un ingreso activo.

## D. Tarifa inicial del parqueadero

Para no crear todavía una tabla de tarifas, se maneja una tarifa fija en el servicio.

| Tipo de vehículo | Tarifa por hora o fracción |
|---|---:|
| carro | $3.500 |
| moto | $2.000 |

Ejemplo de cobro por hora o fracción:

| Tiempo de permanencia | Horas cobradas |
|---|---:|
| 10 minutos | 1 hora |
| 61 minutos | 2 horas |
| 120 minutos | 2 horas |
| 121 minutos | 3 horas |

## E. Archivos involucrados

| Archivo | Responsabilidad |
|---|---|
| `parking.routes.js` | Define la ruta de salida. |
| `parking.controller.js` | Recibe la petición HTTP y responde al cliente. |
| `parking.service.js` | Calcula tiempo, valor y aplica reglas de negocio. |
| `parking.db.js` | Actualiza el registro de parqueo en PostgreSQL. |
| `vehicles.db.js` | Permite buscar el vehículo por placa. |
| `auth.middleware.js` | Valida token JWT. |
| `role.middleware.js` | Valida roles autorizados. |

## F. Flujo general del módulo

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

## G. Reglas aplicadas en el service

- Si la placa no existe, se devuelve error.
- Si el vehículo no tiene ingreso activo, se devuelve error.
- Si tiene ingreso activo, se calcula tiempo y valor.
- El registro se actualiza como `finalizado`.
- Se guarda la hora de salida.
- Se guardan minutos totales y valor total.

## H. Resultado esperado

Después de ejecutar el check-out, el registro de parqueo debe quedar con:

- Estado `finalizado`.
- Hora de salida.
- Total de minutos.
- Valor total calculado.

## I. Siguiente paso

Después de la salida del vehículo, el siguiente módulo es el registro del pago.
