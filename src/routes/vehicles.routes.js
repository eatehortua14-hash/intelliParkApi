const express = require('express');

const {
  create,
  findAll,
  findById,
  findByPlate
} = require('../controllers/vehicles.controller');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const {
  validateVehicle,
  validateIdParam,
  validatePlateParam
} = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Registrar vehículo
 *     description: Registra un vehículo con información básica para la operación del parqueadero.
 *     tags:
 *       - Vehicles
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
 *         description: Vehículo registrado correctamente.
 *       400:
 *         description: Datos inválidos o placa ya registrada.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para realizar esta operación.
 */
router.post(
  '/',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validateVehicle,
  create
);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Consultar vehículos
 *     description: Lista los vehículos registrados en el sistema.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehículos consultados correctamente.
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
 * /api/vehicles/plate/{plate}:
 *   get:
 *     summary: Consultar vehículo por placa
 *     description: Consulta un vehículo registrado usando su placa.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: plate
 *         required: true
 *         schema:
 *           type: string
 *         description: Placa del vehículo.
 *         example: ABC123
 *     responses:
 *       200:
 *         description: Vehículo consultado correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 *       404:
 *         description: Vehículo no encontrado.
 */
router.get(
  '/plate/:plate',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validatePlateParam,
  findByPlate
);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Consultar vehículo por ID
 *     description: Consulta un vehículo registrado usando su identificador.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del vehículo.
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehículo consultado correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 *       404:
 *         description: Vehículo no encontrado.
 */
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('administrador', 'operador'),
  validateIdParam,
  findById
);

module.exports = router;
