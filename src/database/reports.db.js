const { pool } = require('../config/database');

const getIncomeSummary = async (fromDate, toDate) => {
  const query = `
    SELECT
      COALESCE(SUM(payment_amount), 0) AS total_income,
      COUNT(payment_id) AS total_payments
    FROM payments
    WHERE payment_created_at >= $1::date
      AND payment_created_at < ($2::date + INTERVAL '1 day')
  `;

  const values = [fromDate, toDate];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getIncomeByPaymentMethod = async (fromDate, toDate) => {
  const query = `
    SELECT
      payment_method,
      COALESCE(SUM(payment_amount), 0) AS total_income,
      COUNT(payment_id) AS total_payments
    FROM payments
    WHERE payment_created_at >= $1::date
      AND payment_created_at < ($2::date + INTERVAL '1 day')
    GROUP BY payment_method
    ORDER BY total_income DESC
  `;

  const values = [fromDate, toDate];

  const result = await pool.query(query, values);
  return result.rows;
};

const getIncomeByVehicleType = async (fromDate, toDate) => {
  const query = `
    SELECT
      v.vehicle_type,
      COALESCE(SUM(p.payment_amount), 0) AS total_income,
      COUNT(p.payment_id) AS total_payments
    FROM payments p
    INNER JOIN parking_records pr ON p.payment_parking_id = pr.parking_id
    INNER JOIN vehicles v ON pr.parking_vehicle_id = v.vehicle_id
    WHERE p.payment_created_at >= $1::date
      AND p.payment_created_at < ($2::date + INTERVAL '1 day')
    GROUP BY v.vehicle_type
    ORDER BY total_income DESC
  `;

  const values = [fromDate, toDate];

  const result = await pool.query(query, values);
  return result.rows;
};

const getPaymentDetails = async (fromDate, toDate) => {
  const query = `
    SELECT
      p.payment_id,
      p.payment_parking_id,
      p.payment_method,
      p.payment_amount,
      p.payment_reference,
      p.payment_created_at,
      v.vehicle_plate,
      v.vehicle_type,
      pr.parking_entry_time,
      pr.parking_exit_time,
      pr.parking_total_minutes
    FROM payments p
    INNER JOIN parking_records pr ON p.payment_parking_id = pr.parking_id
    INNER JOIN vehicles v ON pr.parking_vehicle_id = v.vehicle_id
    WHERE p.payment_created_at >= $1::date
      AND p.payment_created_at < ($2::date + INTERVAL '1 day')
    ORDER BY p.payment_created_at DESC
  `;

  const values = [fromDate, toDate];

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  getIncomeSummary,
  getIncomeByPaymentMethod,
  getIncomeByVehicleType,
  getPaymentDetails
};