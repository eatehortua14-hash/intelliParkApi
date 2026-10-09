const {
  checkInVehicle,
  checkOutVehicle,
  getActiveParkingRecords
} = require('../services/parking.service');

const checkIn = async (req, res) => {
  try {
    const parkingRecord = await checkInVehicle(req.body, req.user);

    res.status(201).json({
      message: 'Vehículo registrado con éxito.',
      data: parkingRecord
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const checkOut = async (req, res) => {
  try {
    const parkingRecord = await checkOutVehicle(req.body);

    res.status(200).json({
      message: 'Salida de vehículo registrada con éxito.',
      data: parkingRecord
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const findActive = async (req, res) => {
  try {
    const activeRecords = await getActiveParkingRecords();

    res.status(200).json({
      message: 'Registros de estacionamiento activos recuperados con éxito',
      data: activeRecords
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  findActive
};