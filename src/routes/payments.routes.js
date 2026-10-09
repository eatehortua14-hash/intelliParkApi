const express = require('express');

const {
  create,
  findAll,
  findById,
  findByParkingId
} = require('../controllers/payments.controller');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const {
  validatePayment,
  validateIdParam,
  validateParkingIdParam
} = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Registrar pago
 *     description: Registra el pago de un parqueo finalizado. No permite pagos duplicados para el mismo registro de parqueo.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - parking_id
 *             properties:
 *               parking_id:
 *                 type: integer
 *                 example: 1
 *               payment_method:
 *                 type: string
 *                 enum: [efectivo, transferencia, tarjeta, otro]
 *                 example: efectivo
 *               payment_reference:
 *                 type: string
 *                 example: REF-12345
 *     responses:
 *       201:
 *         description: Pago registrado correctamente.
 *       400:
 *         description: Datos inválidos, parqueo no finalizado o pago duplicado.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para realizar esta operación.
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validatePayment,
  create
);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Consultar todos los pagos
 *     description: Lista los pagos registrados en el sistema.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pagos consultados correctamente.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 */
router.get(
  '/',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  findAll
);

/**
 * @swagger
 * /api/payments/parking/{parkingId}:
 *   get:
 *     summary: Consultar pago por registro de parqueo
 *     description: Consulta el pago asociado a un registro de parqueo específico.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parkingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del registro de parqueo.
 *         example: 1
 *     responses:
 *       200:
 *         description: Pago consultado correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 *       404:
 *         description: No se encontró pago para el registro de parqueo indicado.
 */
router.get(
  '/parking/:parkingId',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validateParkingIdParam,
  findByParkingId
);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Consultar pago por ID
 *     description: Consulta el detalle de un pago usando su identificador.
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del pago.
 *         example: 1
 *     responses:
 *       200:
 *         description: Pago consultado correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 *       404:
 *         description: Pago no encontrado.
 */
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validateIdParam,
  findById
);

module.exports = router;
