const { pool } = require('../config/database');

const findUserById = async (userId) => {
  const query = `
    SELECT
      user_id,
      user_first_name,
      user_last_name,
      user_email,
      user_role,
      user_active,
      user_created_at,
      user_updated_at
    FROM users
    WHERE user_id = $1
  `;

  const values = [userId];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const findAllUsers = async () => {
  const query = `
    SELECT 
      user_id,
      user_first_name,
      user_last_name,
      user_email,
      user_role,
      user_active,
      user_created_at
    FROM users
    ORDER BY user_id ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const findUserByUserEmail = async (user_email) => {
  const query = `
    SELECT 
      user_id,
      user_first_name,
      user_last_name,
      user_email,
      user_password,
      user_role,
      user_active,
      user_created_at
    FROM users
    WHERE user_email = $1
  `;

  const values = [user_email];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const createUser = async (userData) => {
  const query = `
    INSERT INTO users (
      user_first_name,
      user_last_name,
      user_email,
      user_password,
      user_role
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
      user_id,
      user_first_name,
      user_last_name,
      user_email,
      user_role,
      user_active,
      user_created_at
  `;

  const values = [
    userData.user_first_name,
    userData.user_last_name,
    userData.user_email,
    userData.user_password_hash,
    userData.user_role || 'operador'
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const updateUserStatus = async (userId, active) => {
  const query = `
    UPDATE users
    SET 
      user_active = $1,
      user_updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $2
    RETURNING
      user_id,
      user_first_name,
      user_last_name,
      user_email,
      user_role,
      user_active,
      user_updated_at
  `;

  const values = [active, userId];

  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = {
  findAllUsers,
  findUserByUserEmail,
  createUser,
  findUserById,
  updateUserStatus
};
