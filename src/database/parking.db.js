const { pool } = require('../config/database');

const createParkingRecord = async (parkingData) => {
  const query = `
    INSERT INTO parking_records (
      parking_vehicle_id,
      parking_created_by
    )
    VALUES ($1, $2)
    RETURNING
      parking_id,
      parking_vehicle_id,
      parking_entry_time,
      parking_exit_time,
      parking_status,
      parking_total_minutes,
      parking_total_amount,
      parking_created_by,
      parking_created_at
  `;

  const values = [
    parkingData.vehicleId,
    parkingData.createdBy
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findActiveParkingByVehicleId = async (vehicleId) => {
  const query = `
    SELECT
      parking_id,
      parking_vehicle_id,
      parking_entry_time,
      parking_exit_time,
      parking_status,
      parking_total_minutes,
      parking_total_amount,
      parking_created_by,
      parking_created_at,
      parking_updated_at
    FROM parking_records
    WHERE parking_vehicle_id = $1
      AND parking_status = 'activo'
  `;

  const values = [vehicleId];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findActiveParkingRecords = async () => {
  const query = `
    SELECT
      pr.parking_id,
      pr.parking_vehicle_id,
      v.vehicle_plate,
      v.vehicle_type,
      v.vehicle_brand,
      v.vehicle_color,
      pr.parking_entry_time,
      pr.parking_status,
      pr.parking_created_by,
      pr.parking_created_at
    FROM parking_records pr
    INNER JOIN vehicles v ON pr.parking_vehicle_id = v.vehicle_id
    WHERE pr.parking_status = 'activo'
    ORDER BY pr.parking_entry_time ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updateParkingRecordCheckOut = async (checkOutData) => {
  const query = `
    UPDATE parking_records
    SET
      parking_exit_time = $1,
      parking_status = 'finalizado',
      parking_total_minutes = $2,
      parking_total_amount = $3,
      parking_updated_at = CURRENT_TIMESTAMP
    WHERE parking_id = $4
    RETURNING
      parking_id,
      parking_vehicle_id,
      parking_entry_time,
      parking_exit_time,
      parking_status,
      parking_total_minutes,
      parking_total_amount,
      parking_created_by,
      parking_created_at,
      parking_updated_at
  `;

  const values = [
    checkOutData.exitTime,
    checkOutData.totalMinutes,
    checkOutData.totalAmount,
    checkOutData.parkingId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  createParkingRecord,
  findActiveParkingByVehicleId,
  findActiveParkingRecords,
  updateParkingRecordCheckOut
};