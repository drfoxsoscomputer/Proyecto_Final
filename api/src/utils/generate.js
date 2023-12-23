const { sign } = require('jsonwebtoken');
require ('dotenv').config();
const {SECRET_KEY} = process.env;

const generateToken = (user) => {
  const secretKey = SECRET_KEY;
  const token = sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '5h' });
  return token;
};

module.exports = generateToken;

// const crypto = require('crypto');

// const generateSecret = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// const secret = generateSecret();
// console.log(`La cadena secreta generada es: ${secret}`);
