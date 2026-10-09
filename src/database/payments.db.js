const { pool } = require('../config/database');

const createPayment = async (paymentData) => {
  const query = `
    INSERT INTO payments (
      payment_parking_id,
      payment_method,
      payment_amount,
      payment_reference,
      payment_created_by
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      payment_id,
      payment_parking_id,
      payment_method,
      payment_amount,
      payment_reference,
      payment_created_by,
      payment_created_at,
      payment_updated_at
  `;

  const values = [
    paymentData.parkingId,
    paymentData.paymentMethod || 'efectivo',
    paymentData.paymentAmount,
    paymentData.paymentReference || null,
    paymentData.createdBy
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findPaymentById = async (paymentId) => {
  const query = `
    SELECT
      p.payment_id,
      p.payment_parking_id,
      p.payment_method,
      p.payment_amount,
      p.payment_reference,
      p.payment_created_by,
      p.payment_created_at,
      p.payment_updated_at,
      pr.parking_vehicle_id,
      pr.parking_entry_time,
      pr.parking_exit_time,
      pr.parking_status,
      pr.parking_total_minutes,
      v.vehicle_plate,
      v.vehicle_type
    FROM payments p
    INNER JOIN parking_records pr ON p.payment_parking_id = pr.parking_id
    INNER JOIN vehicles v ON pr.parking_vehicle_id = v.vehicle_id
    WHERE p.payment_id = $1
  `;

  const result = await pool.query(query, [paymentId]);
  return result.rows[0];
};

const findPaymentByParkingId = async (parkingId) => {
  const query = `
    SELECT
      payment_id,
      payment_parking_id,
      payment_method,
      payment_amount,
      payment_reference,
      payment_created_by,
      payment_created_at,
      payment_updated_at
    FROM payments
    WHERE payment_parking_id = $1
  `;

  const result = await pool.query(query, [parkingId]);
  return result.rows[0];
};

const findAllPayments = async () => {
  const query = `
    SELECT
      p.payment_id,
      p.payment_parking_id,
      p.payment_method,
      p.payment_amount,
      p.payment_reference,
      p.payment_created_by,
      p.payment_created_at,
      pr.parking_entry_time,
      pr.parking_exit_time,
      pr.parking_total_minutes,
      v.vehicle_plate,
      v.vehicle_type
    FROM payments p
    INNER JOIN parking_records pr ON p.payment_parking_id = pr.parking_id
    INNER JOIN vehicles v ON pr.parking_vehicle_id = v.vehicle_id
    ORDER BY p.payment_created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const findParkingRecordForPayment = async (parkingId) => {
  const query = `
    SELECT
      pr.parking_id,
      pr.parking_vehicle_id,
      pr.parking_entry_time,
      pr.parking_exit_time,
      pr.parking_status,
      pr.parking_total_minutes,
      pr.parking_total_amount,
      v.vehicle_plate,
      v.vehicle_type
    FROM parking_records pr
    INNER JOIN vehicles v ON pr.parking_vehicle_id = v.vehicle_id
    WHERE pr.parking_id = $1
  `;

  const result = await pool.query(query, [parkingId]);
  return result.rows[0];
};

module.exports = {
  createPayment,
  findPaymentById,
  findPaymentByParkingId,
  findAllPayments,
  findParkingRecordForPayment
};
