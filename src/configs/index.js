require('dotenv').config();

const { PORT = 3001, JWT_SECRET = 'f7585a14c9e90b0058253652d000dbf34029c94925d6e9dc8286ff326823d2d5', DATABASE_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const SALT_ROUND = 10;
const JWT_STORAGE_TIME = '7d';

module.exports = {
  SALT_ROUND,
  JWT_SECRET,
  JWT_STORAGE_TIME,
  PORT,
  DATABASE_URL,
};
