import { SequelizeOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const config: SequelizeOptions = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'mysql',
};

module.exports = config;
