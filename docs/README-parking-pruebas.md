# Pruebas de ingreso y salida de IntelliPark
 
## Seguridad
Ambas operaciones requieren JWT de administrador u operador.
 
## Ingreso
Metodo: POST
Endpoint: /api/parking/check-in
Body: {"vehicle_plate":"SMA902"}
Esperado: 201 Created y parqueo activo.
Soporte: AA5-EV04, CAP-EV04-04.
 
## Salida
Metodo: POST
Endpoint: /api/parking/check-out
Body: {"vehicle_plate":"SMA902"}
Esperado: 200 OK, parqueo finalizado, tiempo y valor calculados.
Soporte: AA5-EV04, CAP-EV04-05.
 
## Trazabilidad
La placa debe coincidir con las capturas.
El parkingId identifica el parqueo utilizado para registrar el pago.
Los resultados reales se consultan en los soportes referenciados.
