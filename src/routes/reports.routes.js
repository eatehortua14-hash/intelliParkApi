const express = require('express');

const {
  incomeReport
} = require('../controllers/reports.controller');

const { authenticateToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const {
  validateIncomeReport
} = require('../middlewares/validate.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/reports/income:
 *   get:
 *     summary: Generar reporte de ingresos
 *     description: Genera un reporte financiero basado en los pagos registrados. Permite filtrar por rango de fechas.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del reporte en formato YYYY-MM-DD.
 *         example: 2026-06-01
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del reporte en formato YYYY-MM-DD.
 *         example: 2026-06-30
 *     responses:
 *       200:
 *         description: Reporte de ingresos generado correctamente.
 *       400:
 *         description: Fechas inválidas o rango incorrecto.
 *       401:
 *         description: Token de autorización requerido, inválido o vencido.
 *       403:
 *         description: Usuario sin permisos para consultar reportes.
 */
router.get(
  '/income',
  authenticateToken,
  authorizeRoles('administrador'),
  validateIncomeReport,
  incomeReport
);

module.exports = router;
