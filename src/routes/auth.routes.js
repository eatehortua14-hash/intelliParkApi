const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const {
  validateRegisterUser,
  validateLogin
} = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/user-register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación o correo ya registrado
 */
router.post('/user-register', validateRegisterUser, register);

/**
 * @swagger
 * /api/auth/user-login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso. Retorna token JWT.
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/user-login', validateLogin, login);

/**
 * @swagger
 * /api/auth/user-me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado obtenido correctamente
 *       401:
 *         description: Token faltante, inválido o vencido
 */
router.get('/user-me',  authenticateToken, getMe);

module.exports = router;