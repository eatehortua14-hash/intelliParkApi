const {
  registerVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleByPlate
} = require('../services/vehicles.service');

const create = async (req, res) => {
  try {
    const vehicle = await registerVehicle(req.body, req.user);

    res.status(201).json({
      message: 'Vehículo registrado con éxito.',
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const findAll = async (req, res) => {
  try {
    const vehicles = await getAllVehicles();

    res.status(200).json({
      message: 'Vehículos retornados con éxito.',
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const findById = async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);

    res.status(200).json({
      message: 'Vehículo retornado con éxito.',
      data: vehicle
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

const findByPlate = async (req, res) => {
  try {
    const vehicle = await getVehicleByPlate(req.params.plate);

    res.status(200).json({
      message: 'Vehículo retornado con éxito.',
      data: vehicle
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

module.exports = {
  create,
  findAll,
  findById,
  findByPlate
};