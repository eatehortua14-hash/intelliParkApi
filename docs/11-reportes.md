# Bloque 9 — Módulo de reportes básicos

## A. Objetivo del módulo

Crear un endpoint para consultar ingresos por rango de fechas.

Endpoint principal:

```txt
GET /api/reports/income?from=2026-06-01&to=2026-06-30
```

## B. Regla principal

> Los reportes financieros deben basarse en pagos registrados, no solo en parqueos finalizados.

## C. Información que debe devolver el reporte

- Total de ingresos.
- Cantidad de pagos.
- Ingresos por método de pago.
- Ingresos por tipo de vehículo.
- Detalle de pagos registrados.

## D. Regla de autorización

> Solo el rol `administrador` puede consultar reportes financieros.

## E. Responsabilidad de cada archivo

| Archivo | Responsabilidad |
|---|---|
| `reports.routes.js` | Define las rutas del módulo de reportes. |
| `reports.controller.js` | Recibe filtros y responde el reporte. |
| `reports.service.js` | Valida fechas y coordina las consultas del reporte. |
| `reports.db.js` | Ejecuta consultas SQL agregadas sobre pagos, parqueos y vehículos. |
| `auth.middleware.js` | Valida que el usuario esté autenticado. |
| `role.middleware.js` | Permite acceso solo a administrador. |
| `validate.middleware.js` | Valida fechas `from` y `to`. |
| `app.js` | Conecta `/api/reports` con Express. |

## F. Flujo general del módulo

```txt
Postman / Frontend
↓
reports.routes.js
↓
authenticateToken
↓
authorizeRoles('administrador')
↓
validateIncomeReport
↓
reports.controller.js
↓
reports.service.js
↓
reports.db.js
↓
PostgreSQL
```

## G. Filtros disponibles

| Parámetro | Descripción | Formato |
|---|---|---|
| `from` | Fecha inicial del reporte. | `YYYY-MM-DD` |
| `to` | Fecha final del reporte. | `YYYY-MM-DD` |

Si no se envían fechas, puede usarse el día actual como valor por defecto según la implementación del servicio.

## H. Reglas aplicadas

- Las fechas deben tener formato `YYYY-MM-DD`.
- La fecha inicial no puede ser mayor que la fecha final.
- Los reportes deben consultar la tabla `payments` como fuente principal.
- El reporte puede unir información de `parking_records` y `vehicles` para clasificar por tipo de vehículo.

## I. Errores comunes esperados

- Fecha con formato inválido.
- Fecha inicial mayor que fecha final.
- Token no enviado.
- Usuario sin rol administrador.

## J. Siguiente paso

Después de reportes, se ordenan validaciones y manejo de errores para preparar el backend para el frontend.
