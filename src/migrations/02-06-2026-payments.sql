DO $$
BEGIN
  CREATE TYPE payment_methods AS ENUM (
    'efectivo',
    'transferencia',
    'tarjeta',
    'otro'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  payment_parking_id INTEGER NOT NULL UNIQUE,
  payment_method payment_methods NOT NULL DEFAULT 'efectivo',
  payment_amount NUMERIC(10, 2) NOT NULL,
  payment_reference VARCHAR(100),
  payment_created_by INTEGER NOT NULL,
  payment_created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  payment_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_payments_parking
    FOREIGN KEY (payment_parking_id)
    REFERENCES parking_records(parking_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT fk_payments_created_by
    FOREIGN KEY (payment_created_by)
    REFERENCES users(user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
