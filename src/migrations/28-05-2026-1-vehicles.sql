DO $$
BEGIN
  CREATE TYPE vehicle_types AS ENUM (
    'carro',
    'moto'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id SERIAL PRIMARY KEY,
  vehicle_plate VARCHAR(15) NOT NULL UNIQUE,
  vehicle_type vehicle_types NOT NULL DEFAULT 'carro',
  vehicle_brand VARCHAR(60),
  vehicle_color VARCHAR(40),
  vehicle_active BOOLEAN NOT NULL DEFAULT true,
  vehicle_created_by INTEGER NOT NULL,
  vehicle_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vehicle_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_vehicles_created_by
    FOREIGN KEY (vehicle_created_by)
    REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);