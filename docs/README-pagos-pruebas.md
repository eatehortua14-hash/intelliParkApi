
# Pruebas de pagos de IntelliPark
 
## Seguridad

Las operaciones requieren JWT de administrador u operador.
 
## Registro de pago

Metodo: POST

Endpoint: /api/payments
 
Campos:

- payment_parking_id: identificador del parqueo finalizado.

- payment_method: efectivo, transferencia, tarjeta u otro.

- payment_reference: referencia opcional.
 
Condiciones:

- El parqueo debe existir y estar finalizado.

- Debe tener un monto calculado.

- No debe tener un pago previo.
 
Respuesta esperada: 201 Created y datos del pago.

Soporte: AA5-EV04, CAP-EV04-06.
 
## Parqueo inexistente

Enviar payment_parking_id con un ID positivo que no exista.

Respuesta esperada: 400 Bad Request.

Soporte: AA5-EV04, CAP-EV04-08.
 
## Consulta por parqueo

Metodo: GET

Endpoint: /api/payments/parking/:parkingId

Respuesta esperada: 200 si existe el pago; 404 si no existe.
 
Los resultados obtenidos se respaldan con las capturas referenciadas.

