CREATE TYPE roles AS ENUM (
  'operador',
  'administrador'
);

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  user_first_name VARCHAR(60) NOT NULL,
  user_last_name VARCHAR(60) NOT NULL,
  user_email VARCHAR(100) NOT NULL UNIQUE,
  user_password TEXT NOT NULL,
  user_role roles NOT NULL DEFAULT 'operador',
  user_active BOOLEAN NOT NULL DEFAULT true,
  user_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
