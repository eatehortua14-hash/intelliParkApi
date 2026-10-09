const VALID_ROLES = ['administrador', 'operador'];
const VALID_VEHICLE_TYPES = ['carro', 'moto'];
const VALID_PAYMENT_METHODS = ['efectivo', 'transferencia', 'tarjeta', 'otro'];

const sendValidationError = (res, errors) => {
  return res.status(400).json({
    message: 'Error de validación',
    errors
  });
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isPositiveInteger = (value) => {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0;
};

const isValidDate = (dateValue) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(dateValue);
};

const validateRegisterUser = (req, res, next) => {
  const errors = [];
  const { user_first_name, user_last_name, user_email, user_password, user_role } = req.body;

  if (!user_first_name || typeof user_first_name !== 'string') {
    errors.push('El nombre es requerido y debe ser texto');
  }

  if (!user_last_name || typeof user_last_name !== 'string') {
    errors.push('El apellido es requerido y debe ser texto');
  }

  if (!user_email || typeof user_email !== 'string') {
    errors.push('El correo electrónico es requerido y debe ser texto');
  } else if (!isValidEmail(user_email)) {
    errors.push('El formato del correo electrónico es inválido');
  }

  if (!user_password || typeof user_password !== 'string') {
    errors.push('La contraseña es requerida y debe ser texto');
  } else if (user_password.length < 6) {
    errors.push('La contraseña debe tener mínimo 6 caracteres');
  }

  if (user_role && !VALID_ROLES.includes(user_role)) {
    errors.push('El rol es inválido');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  return next();
};

const validateLogin = (req, res, next) => {
  const errors = [];
  const { user_email, user_password } = req.body;

  if (!user_email || typeof user_email !== 'string') {
    errors.push('El correo electrónico es requerido y debe ser texto');
  } else if (!isValidEmail(user_email)) {
    errors.push('El formato del correo electrónico es inválido');
  }

  if (!user_password || typeof user_password !== 'string') {
    errors.push('La contraseña es requerida y debe ser texto');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  return next();
};

const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!isPositiveInteger(id)) {
    return sendValidationError(res, ['El ID debe ser un entero positivo']);
  }

  return next();
};

const validateUserIdParam = (req, res, next) => {
  if (!isPositiveInteger(req.params.user_id)) {
    return sendValidationError(res, ['El ID de usuario debe ser un entero positivo']);
  }

  return next();
};

const validateParkingIdParam = (req, res, next) => {
  const { parkingId } = req.params;

  if (!isPositiveInteger(parkingId)) {
    return sendValidationError(res, ['El ID de parqueo debe ser un entero positivo']);
  }

  return next();
};

const validateUserStatus = (req, res, next) => {
  const { user_active } = req.body;

  if (typeof user_active !== 'boolean') {
    return sendValidationError(res, ['El valor de estado debe ser true o false']);
  }

  return next();
};

const validateVehicle = (req, res, next) => {
  const errors = [];
  const { vehicle_plate, vehicle_type, vehicle_brand, vehicle_color } = req.body;

  if (!vehicle_plate || typeof vehicle_plate !== 'string') {
    errors.push('La placa del vehículo es requerida y debe ser texto');
  } else if (vehicle_plate.trim().length > 15) {
    errors.push('La placa del vehículo debe tener máximo 15 caracteres');
  }

  if (vehicle_type && !VALID_VEHICLE_TYPES.includes(vehicle_type)) {
    errors.push('El tipo de vehículo es inválido');
  }

  if (vehicle_brand && typeof vehicle_brand !== 'string') {
    errors.push('La marca del vehículo debe ser texto');
  }

  if (vehicle_color && typeof vehicle_color !== 'string') {
    errors.push('El color del vehículo debe ser texto');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  return next();
};

const validatePlateParam = (req, res, next) => {
  const { plate } = req.params;

  if (!plate || typeof plate !== 'string') {
    return sendValidationError(res, ['La placa del vehículo es requerida']);
  }

  return next();
};

const validateCheckIn = (req, res, next) => {
  const errors = [];
  const { vehicle_plate, vehicle_type, vehicle_brand, vehicle_color } = req.body;

  if (!vehicle_plate || typeof vehicle_plate !== 'string') {
    errors.push('La placa del vehículo es requerida y debe ser texto');
  } else if (vehicle_plate.trim().length > 15) {
    errors.push('La placa del vehículo debe tener máximo 15 caracteres');
  }

  if (vehicle_type && !VALID_VEHICLE_TYPES.includes(vehicle_type)) {
    errors.push('El tipo de vehículo es inválido');
  }

  if (vehicle_brand && typeof vehicle_brand !== 'string') {
    errors.push('La marca del vehículo debe ser texto');
  }

  if (vehicle_color && typeof vehicle_color !== 'string') {
    errors.push('El color del vehículo debe ser texto');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  return next();
};

const validateCheckOut = (req, res, next) => {
  const { vehicle_plate } = req.body;

  if (!vehicle_plate || typeof vehicle_plate !== 'string') {
    return sendValidationError(res, ['La placa del vehículo es requerida y debe ser texto']);
  }

  if (vehicle_plate.trim().length < 5) {
    return sendValidationError(res, ['La placa del vehículo debe tener mínimo 5 caracteres']);
  }

  return next();
};

const validatePayment = (req, res, next) => {
  const errors = [];
  const { payment_parking_id, payment_method, payment_reference } = req.body;

  if (!payment_parking_id || !isPositiveInteger(payment_parking_id)) {
    errors.push('El ID de parqueo es requerido y debe ser un entero positivo');
  }

  if (payment_method && !VALID_PAYMENT_METHODS.includes(payment_method)) {
    errors.push('El método de pago es inválido');
  }

  if (payment_reference && typeof payment_reference !== 'string') {
    errors.push('La referencia de pago debe ser texto');
  }

  if (payment_reference && payment_reference.length > 100) {
    errors.push('La referencia de pago debe tener máximo 100 caracteres');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  return next();
};

const validateIncomeReport = (req, res, next) => {
  const errors = [];
  const { from, to } = req.query;

  if (from && !isValidDate(from)) {
    errors.push('La fecha de inicio debe tener formato AAAA-MM-DD');
  }

  if (to && !isValidDate(to)) {
    errors.push('La fecha de fin debe tener formato AAAA-MM-DD');
  }

  if (from && to && isValidDate(from) && isValidDate(to) && from > to) {
    errors.push('La fecha de inicio no puede ser mayor a la fecha de fin');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  return next();
};

module.exports = {
  validateRegisterUser,
  validateLogin,
  validateIdParam,
  validateParkingIdParam,
  validateUserStatus,
  validateVehicle,
  validatePlateParam,
  validateCheckIn,
  validateCheckOut,
  validatePayment,
  validateIncomeReport,
  validateUserIdParam
};
