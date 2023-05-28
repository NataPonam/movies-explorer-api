require('dotenv').config();

const {
  NODE_ENV, JWT_SECRET, DATABASE, PORT = 3000 || 3001,
} = process.env;
const MONGODB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const JWT_SECRET_STRING = 'dev-secret';
module.exports = {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  DATABASE,
  MONGODB_URL,
  JWT_SECRET_STRING,
};
