const { findUserByUserEmail, createUser, findUserById } = require('../database/users.db');
const { comparePassword, hashPassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util.js');

 
const registerUser = async (userData) => {
    const { user_first_name, user_last_name, user_email, 
            user_password, user_role } = userData;

    if (!user_first_name || !user_last_name || !user_email 
        || !user_password || !user_role) {
        
        throw new Error('Nombre, Apellido, Correo, Contraseña y Role son requeridos.');
    }

    const existingUser = await findUserByUserEmail(user_email);

    if (existingUser) {
        throw new Error('El correo electrónico ya esta registrado.');
    }

    const user_password_hash = await hashPassword(user_password);

    const newUser = await createUser({
        user_first_name,
        user_last_name,
        user_email,
        user_password_hash,
        user_role
    });

    return newUser;
}

const loginUser = async (credentials) => {
    const { user_email, user_password } = credentials;

    if (!user_email || !user_password) {
        throw new Error('El correo eletrónico y la contraseña son requeridos');
    }

     const user = await findUserByUserEmail(user_email);

    if (!user) {
        throw new Error('Correo eletrónico o contraseña invalida.');
    }

    if (!user.user_active) {
        throw new Error('EL usuario esta inactivo');
    }

    const passwordIsValid = await comparePassword(user_password, user.user_password);

    if (!passwordIsValid) {
        throw new Error('Correo eletrónico o contraseña invalida.');
    }

    const token = generateToken({
        user_id: user.user_id,
        user_email: user.user_email,
        user_role: user.user_role
    });

    return {
        token,
        user: {
            user_id: user.user_id,
            user_first_name: user.user_first_name,
            user_last_name: user.user_last_name,
            user_email: user.user_email,
            user_role: user.user_role
        }
    };
}

const getAuthenticatedUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('El usuario no encontrado.');
  }

  if (!user.user_active) {
    throw new Error('El usuario no esta activo.');
  }

  return {
    user_id: user.user_id,
    user_first_name: user.user_first_name,
    user_last_name: user.user_last_name,
    user_email: user.user_email,
    user_role: user.user_role,
    user_active: user.user_active
  };
};


module.exports = {
  registerUser,
  loginUser,
  getAuthenticatedUser
};
