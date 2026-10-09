const { pool } = require('../config/database');

const createVehicle = async (vehicleData) => {
  const query = `
    INSERT INTO vehicles (
      vehicle_plate,
      vehicle_type,
      vehicle_brand,
      vehicle_color,
      vehicle_created_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      vehicle_id,
      vehicle_plate,
      vehicle_type,
      vehicle_brand,
      vehicle_color,
      vehicle_active,
      vehicle_created_by,
      vehicle_created_at
  `;

  const values = [
    vehicleData.plate,
    vehicleData.type || 'carro',
    vehicleData.brand || null,
    vehicleData.color || null,
    vehicleData.createdBy
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findAllVehicles = async () => {
  const query = `
    SELECT
      vehicle_id,
      vehicle_plate,
      vehicle_type,
      vehicle_brand,
      vehicle_color,
      vehicle_active,
      vehicle_created_by,
      vehicle_created_at,
      vehicle_updated_at
    FROM vehicles
    ORDER BY vehicle_id ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const findVehicleById = async (vehicleId) => {
  const query = `
    SELECT
      vehicle_id,
      vehicle_plate,
      vehicle_type,
      vehicle_brand,
      vehicle_color,
      vehicle_active,
      vehicle_created_by,
      vehicle_created_at,
      vehicle_updated_at
    FROM vehicles
    WHERE vehicle_id = $1
  `;

  const result = await pool.query(query, [vehicleId]);
  return result.rows[0];
};

const findVehicleByPlate = async (plate) => {
  const query = `
    SELECT
      vehicle_id,
      vehicle_plate,
      vehicle_type,
      vehicle_brand,
      vehicle_color,
      vehicle_active,
      vehicle_created_by,
      vehicle_created_at,
      vehicle_updated_at
    FROM vehicles
    WHERE vehicle_plate = $1
  `;

  const result = await pool.query(query, [plate]);
  return result.rows[0];
};

module.exports = {
  createVehicle,
  findAllVehicles,
  findVehicleById,
  findVehicleByPlate
};