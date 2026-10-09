const {
  getAllUsers,
  getUserById,
  changeUserStatus
} = require('../services/users.service');

const findAll = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      message: 'Usuarios listados con éxito.',
      data: users
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const findById = async (req, res) => {
  try {
    const user = await getUserById(req.params.user_id);

    res.status(200).json({
      message: 'Usuario encontrado con éxito.',
      data: user
    });
  } catch (error) {
    res.status(404).json({
      message: error.message
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const user = await changeUserStatus(req.params.user_id, req.body.user_active);

    res.status(200).json({
      message: 'Estado del usuario actualizado con éxito.',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  findAll,
  findById,
  updateStatus
};