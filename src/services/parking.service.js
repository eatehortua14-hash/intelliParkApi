const {
  createVehicle,
  findVehicleByPlate
} = require('../database/vehicles.db');

const {
  createParkingRecord,
  findActiveParkingByVehicleId,
  findActiveParkingRecords,
  updateParkingRecordCheckOut
} = require('../database/parking.db');

const PARKING_RATES = {
  carro: 3000,
  moto: 2000,
  camioneta: 4000,
  otro: 3000
};

const calculateParkingFee = (entryTime, exitTime, vehicleType) => {
  const entryDate = new Date(entryTime);
  const exitDate = new Date(exitTime);

  const differenceInMilliseconds = exitDate.getTime() - entryDate.getTime();

  const totalMinutes = Math.max(
    1,
    Math.ceil(differenceInMilliseconds / 60000)
  );

  const chargedHours = Math.max(
    1,
    Math.ceil(totalMinutes / 60)
  );

  const ratePerHour = PARKING_RATES[vehicleType] || PARKING_RATES.otro;

  const totalAmount = chargedHours * ratePerHour;

  return {
    totalMinutes,
    chargedHours,
    ratePerHour,
    totalAmount
  };
};

const checkInVehicle = async (checkInData, authenticatedUser) => {
  const { vehicle_plate } = checkInData;

  if (!vehicle_plate) {
    throw new Error('La placa del vehículo es requerida.');
  }

  const normalizedPlate = vehicle_plate.trim().toUpperCase();

  let vehicle = await findVehicleByPlate(normalizedPlate);

  if (!vehicle) {
    vehicle = await createVehicle({
      plate: normalizedPlate,
      type: checkInData.vehicle_type || 'carro',
      brand: checkInData.vehicle_brand,
      color: checkInData.vehicle_color,
      createdBy: authenticatedUser.user_id
    });
  }

  if (!vehicle.vehicle_active) {
    throw new Error('El vehículo se encuentra inactivo.');
  }

  const activeParking = await findActiveParkingByVehicleId(vehicle.vehicle_id);

  if (activeParking) {
    throw new Error('El vehículo ya tiene un registro de parqueo activo.');
  }

  const parkingRecord = await createParkingRecord({
    vehicleId: vehicle.vehicle_id,
    createdBy: authenticatedUser.user_id
  });

  return {
    parkingId: parkingRecord.parking_id,
    vehicleId: vehicle.vehicle_id,
    plate: vehicle.vehicle_plate,
    type: vehicle.vehicle_type,
    brand: vehicle.vehicle_brand,
    color: vehicle.vehicle_color,
    entryTime: parkingRecord.parking_entry_time,
    status: parkingRecord.parking_status,
    createdBy: parkingRecord.parking_created_by
  };
};

const checkOutVehicle = async (checkOutData) => {
  const { vehicle_plate } = checkOutData;

  if (!vehicle_plate) {
    throw new Error('La placa del vehículo es requerida.');
  }

  const normalizedPlate = vehicle_plate.trim().toUpperCase();

  const vehicle = await findVehicleByPlate(normalizedPlate);

  if (!vehicle) {
    throw new Error('Vehículo no encontrado.');
  }

  if (!vehicle.vehicle_active) {
    throw new Error('El vehículo se encuentra inactivo.');
  }

  const activeParking = await findActiveParkingByVehicleId(vehicle.vehicle_id);

  if (!activeParking) {
    throw new Error('El vehículo no tiene un registro de parqueo activo.');
  }

  const exitTime = new Date();

  const paymentCalculation = calculateParkingFee(
    activeParking.parking_entry_time,
    exitTime,
    vehicle.vehicle_type
  );

  const updatedParkingRecord = await updateParkingRecordCheckOut({
    parkingId: activeParking.parking_id,
    exitTime,
    totalMinutes: paymentCalculation.totalMinutes,
    totalAmount: paymentCalculation.totalAmount
  });

  return {
    parkingId: updatedParkingRecord.parking_id,
    vehicleId: vehicle.vehicle_id,
    plate: vehicle.vehicle_plate,
    type: vehicle.vehicle_type,
    brand: vehicle.vehicle_brand,
    color: vehicle.vehicle_color,
    entryTime: updatedParkingRecord.parking_entry_time,
    exitTime: updatedParkingRecord.parking_exit_time,
    status: updatedParkingRecord.parking_status,
    totalMinutes: updatedParkingRecord.parking_total_minutes,
    chargedHours: paymentCalculation.chargedHours,
    ratePerHour: paymentCalculation.ratePerHour,
    totalAmount: updatedParkingRecord.parking_total_amount
  };
};

const getActiveParkingRecords = async () => {
  return await findActiveParkingRecords();
};

module.exports = {
  checkInVehicle,
  checkOutVehicle,
  getActiveParkingRecords
};
