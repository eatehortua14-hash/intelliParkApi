const {
  findAllUsers,
  findUserById,
  updateUserStatus
} = require('../database/users.db');

const getAllUsers = async () => {
  return await findAllUsers();
};

const getUserById = async (userId) => {
  
    if (!userId) {
        throw new Error('El Id del usuario es requerido.');
    }

    const user = await findUserById(userId);

    if (!user) {
        throw new Error('Usuario no encontrado.');
    }

    return user;
};

const changeUserStatus = async (userId, active) => {
  
    if (!userId) {
        throw new Error('El Id del usuario es requerido.');
    }

    if (typeof active !== 'boolean') {
        throw new Error('La propiedad para actualizar el valor es incorrecta.');
    }

    const updatedUser = await updateUserStatus(userId, active);

    if (!updatedUser) {
        throw new Error('El usuario no se encontro para actualizar su estado.');
    }
    
    return updatedUser;
};

module.exports = {
  getAllUsers,
  getUserById,
  changeUserStatus
};