
# Hallazgo: campo del registro de pagos en Swagger
 
## Diferencia encontrada

Swagger mostraba parking_id en el cuerpo de POST /api/payments.

El middleware y el servicio requieren payment_parking_id.
 
## Correccion realizada

Se reemplazo parking_id por payment_parking_id en required y properties

del esquema documentado en src/routes/payments.routes.js.
 
## Verificacion

Se reviso el formulario de POST /api/payments en Swagger.

El formulario actualizado muestra payment_parking_id.
 
## Soportes

- AA5-EV03, punto 4, mejora 2.

- Captura de Swagger con el campo corregido.

- Commit de la correccion: 43dea2b.
 
No se modificaron columnas de PostgreSQL.

