const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const {
  notFoundHandler,
  errorHandler
} = require('./middlewares/error.middleware');

const { pool } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const vehiclesRoutes = require('./routes/vehicles.routes');
const parkingRoutes = require('./routes/parking.routes');
const paymentsRoutes = require('./routes/payments.routes');
const reportsRoutes = require('./routes/reports.routes');

const app = express();
app.disable("x-powered-by");

app.use(cors());

// La fotografía viaja temporalmente como Base64.
// El límite evita aceptar cuerpos demasiado grandes.
app.use(express.json({ limit: '8mb' }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/api/health', async (req, res) => {
    try{
        const databaseResult = await pool.query('SELECT NOW()');

        res.status(200).json({
            status: 'ok',
            message: 'IntelliPark API está en funcionamiento.',
            database: {
                connected: true,
                time: databaseResult.rows[0].now
            }
        })
    }
    catch(error){
        res.status(500).json({
            status: 'error',
            message: 'IntelliPark API está en funcionamiento, pero la conexión a la base de datos falló.',
            database: {
                connected: false,
                error: error.message
            }   
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reports', reportsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
