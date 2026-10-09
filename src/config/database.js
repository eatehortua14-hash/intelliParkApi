const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD    
});

const testConnection = async () => {
    try{
        const result = await pool.query('SELECT NOW()');
        console.log('Database connected successfully:', result.rows[0].now);
    }catch(error){
        console.error('Database connection error:', error.message);
    }
}

module.exports = {
  pool,
  testConnection
};
