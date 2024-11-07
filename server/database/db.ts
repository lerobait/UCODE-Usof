import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Post } from './models/Post';
import { Comment } from './models/Comment';
import { Like } from './models/Like';
import { PostCategory } from './models/PostCategory';
import { Category } from './models/Category';
import { PasswordReset } from './models/PasswordReset';
import { Favorite } from './models/Favorite';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const sequelize = new Sequelize({
  database: DB_NAME,
  dialect: 'mysql',
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  models: [
    User,
    Post,
    Comment,
    Like,
    PostCategory,
    Category,
    PasswordReset,
    Favorite,
  ],
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
