const express = require('express');
const {
  findAll,
  findById,
  updateStatus
} = require('../controllers/users.controller');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const {
  validateUserIdParam,
  validateUserStatus
} = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Consultar usuarios
 *     description: Lista los usuarios registrados en el sistema. Solo disponible para administradores.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuarios consultados correctamente.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 */
router.get(
  '/',
  authenticateToken,
  authorizeRoles('administrador'),
  findAll
);

/**
 * @swagger
 * /api/users/{user_id}:
 *   get:
 *     summary: Consultar usuario por ID
 *     description: Consulta la información de un usuario específico. Solo disponible para administradores.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del usuario.
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario consultado correctamente.
 *       400:
 *         description: Parámetro inválido.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar esta información.
 *       404:
 *         description: Usuario no encontrado.
 */
router.get(
  '/:user_id',
  authenticateToken,
  authorizeRoles('administrador'),
  validateUserIdParam,
  findById
);

/**
 * @swagger
 * /api/users/{user_id}/status:
 *   patch:
 *     summary: Actualizar estado de usuario
 *     description: Activa o desactiva una cuenta de usuario. Solo disponible para administradores.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador del usuario.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_active
 *             properties:
 *               user_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Estado del usuario actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para realizar esta operación.
 *       404:
 *         description: Usuario no encontrado.
 */
router.patch(
  '/:user_id/status',
  authenticateToken,
  authorizeRoles('administrador'),
  validateUserStatus,
  updateStatus
);

module.exports = router;
