
# Registro de pruebas del portafolio GA7
 
Los resultados obtenidos se consultan en las capturas del portafolio.

Esta tabla registra los casos, las respuestas esperadas y sus soportes.
 
| ID | Caso | Esperado | Soporte |

|---|---|---|---|

| PRU-01 | Registro valido | 201 Created | AA5-EV02: CAP-API-01 |

| PRU-02 | Login valido | 200 OK y JWT | AA5-EV04: CAP-EV04-01 |

| PRU-03 | Password incorrecta | 401 Unauthorized | AA5-EV04: CAP-EV04-02 |

| PRU-04 | Registro de vehiculo | 201 Created | AA5-EV04: CAP-EV04-03 |

| PRU-05 | Ingreso de vehiculo | 201 y parqueo activo | AA5-EV04: CAP-EV04-04 |

| PRU-06 | Salida de vehiculo | 200 y parqueo finalizado | AA5-EV04: CAP-EV04-05 |

| PRU-07 | Pago de parqueo finalizado | 201 Created | AA5-EV04: CAP-EV04-06 |

| PRU-08 | Reporte con administrador | 200 OK | AA5-EV04: CAP-EV04-07 |

| PRU-09 | Usuario con JWT valido | 200 OK | AA5-EV02: CAP-API-03 |

| PRU-10 | Ruta inexistente | 404 Not Found | Anexo A: CAP-PRU-10 |
 
## Comprobaciones de la mejora de registro
 
- Solicitud sin body: respuesta 400 despues de la correccion.

- Registro con datos validos: respuesta 201.

- Soportes: AA5-EV03, punto 4, mejora 1.
 
## Proteccion de datos
 
Las capturas deben ocultar passwords, tokens y credenciales.

No se incluye el archivo .env.

