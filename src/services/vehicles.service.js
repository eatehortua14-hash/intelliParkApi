const {
  createVehicle,
  findAllVehicles,
  findVehicleById,
  findVehicleByPlate
} = require('../database/vehicles.db');

const registerVehicle = async (vehicleData, authenticatedUser) => {
  const { vehicle_plate } = vehicleData;

  if (!vehicle_plate) {
    throw new Error('La placa del vehículo es requerida.');
  }

  const normalizedPlate = vehicle_plate.trim().toUpperCase();

  const existingVehicle = await findVehicleByPlate(normalizedPlate);

  if (existingVehicle) {
    throw new Error('La placa del vehículo ya está registrada.');
  }

  const newVehicle = await createVehicle({
    plate: normalizedPlate,
    type: vehicleData.vehicle_type || 'carro',
    brand: vehicleData.vehicle_brand,
    color: vehicleData.vehicle_color,
    createdBy: authenticatedUser.user_id
  });

  return newVehicle;
};

const getAllVehicles = async () => {
  return await findAllVehicles();
};

const getVehicleById = async (vehicleId) => {
  const vehicle = await findVehicleById(vehicleId);

  if (!vehicle) {
    throw new Error('Vehículo no encontrado.');
  }

  return vehicle;
};

const getVehicleByPlate = async (plate) => {
  if (!plate) {
    throw new Error('La placa del vehículo es requerida.');
  }

  const normalizedPlate = plate.trim().toUpperCase();

  const vehicle = await findVehicleByPlate(normalizedPlate);

  if (!vehicle) {
    throw new Error('Vehículo no encontrado.');
  }

  return vehicle;
};

module.exports = {
  registerVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleByPlate
};
