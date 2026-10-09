const express = require('express');

const {
  checkIn,
  checkOut,
  findActive
} = require('../controllers/parking.controller');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const {
  validateCheckIn,
  validateCheckOut
} = require('../middlewares/validate.middleware');

const {
  recognizePlate
} = require('../controllers/plate-recognition.controller');

const {
  validatePlateImage
} = require('../middlewares/plate-image.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/parking/recognize-plate:
 *   post:
 *     summary: Reconocer la placa de un vehículo con Gemini
 *     description: Recibe una imagen en Base64, la analiza sin almacenarla y retorna la placa detectada.
 *     tags:
 *       - Parking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - image_base64
 *               - mime_type
 *             properties:
 *               image_base64:
 *                 type: string
 *                 description: Contenido Base64 sin el prefijo data URI.
 *               mime_type:
 *                 type: string
 *                 enum: [image/jpeg, image/png, image/webp]
 *     responses:
 *       200:
 *         description: Placa reconocida correctamente.
 *       400:
 *         description: Imagen inválida.
 *       401:
 *         description: Token faltante, inválido o vencido.
 *       422:
 *         description: No fue posible reconocer una placa.
 *       429:
 *         description: Límite gratuito de Gemini alcanzado.
 */
router.post(
  '/recognize-plate',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validatePlateImage,
  recognizePlate
);

/**
 * @swagger
 * /api/parking/check-in:
 *   post:
 *     summary: Registrar ingreso de vehículo
 *     description: Registra el ingreso de un vehículo al parqueadero. Si la placa no existe, el sistema puede crear el vehículo automáticamente según la lógica del servicio.
 *     tags:
 *       - Parking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_plate
 *             properties:
 *               vehicle_plate:
 *                 type: string
 *                 example: ABC123
 *               vehicle_type:
 *                 type: string
 *                 enum: [carro, moto, camioneta, otro]
 *                 example: carro
 *               vehicle_brand:
 *                 type: string
 *                 example: Renault
 *               vehicle_color:
 *                 type: string
 *                 example: Gris
 *     responses:
 *       201:
 *         description: Ingreso de vehículo registrado correctamente.
 *       400:
 *         description: Datos inválidos o el vehículo ya tiene un ingreso activo.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para realizar esta operación.
 */
router.post(
  '/check-in',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validateCheckIn,
  checkIn
);

/**
 * @swagger
 * /api/parking/check-out:
 *   post:
 *     summary: Registrar salida de vehículo
 *     description: Registra la salida de un vehículo, calcula el tiempo de permanencia y el valor total del servicio.
 *     tags:
 *       - Parking
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_plate
 *             properties:
 *               vehicle_plate:
 *                 type: string
 *                 example: ABC123
 *     responses:
 *       200:
 *         description: Salida de vehículo registrada correctamente.
 *       400:
 *         description: Datos inválidos, vehículo inexistente o sin ingreso activo.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para realizar esta operación.
 */
router.post(
  '/check-out',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validateCheckOut,
  checkOut
);

/**
 * @swagger
 * /api/parking/active:
 *   get:
 *     summary: Consultar vehículos activos en parqueadero
 *     description: Lista los registros de parqueo que se encuentran activos, es decir, vehículos que aún no tienen salida registrada.
 *     tags:
 *       - Parking
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registros activos consultados correctamente.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 */
router.get(
  '/active',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  findActive
);


module.exports = router;
