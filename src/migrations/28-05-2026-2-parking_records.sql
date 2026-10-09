DO $$
BEGIN
  CREATE TYPE parking_statuses AS ENUM (
    'activo',
    'finalizado',
    'cancelado'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS parking_records (
  parking_id SERIAL PRIMARY KEY,
  parking_vehicle_id INTEGER NOT NULL,
  parking_entry_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  parking_exit_time TIMESTAMP,
  parking_status parking_statuses NOT NULL DEFAULT 'activo',
  parking_total_minutes INTEGER,
  parking_total_amount NUMERIC(10, 2),
  parking_created_by INTEGER NOT NULL,
  parking_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  parking_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_parking_vehicle
    FOREIGN KEY (parking_vehicle_id)
    REFERENCES vehicles(vehicle_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_parking_created_by
    FOREIGN KEY (parking_created_by)
    REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_parking_vehicle
ON parking_records(parking_vehicle_id)
WHERE parking_status = 'activo';