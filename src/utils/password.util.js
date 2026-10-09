const bcrypt = require('bcrypt');

const SALT_ROUND = 10;

const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, SALT_ROUND)
}

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword
}
