import { QueryInterface } from 'sequelize';
import * as bcrypt from 'bcrypt';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  const hashedPassword = await bcrypt.hash('1234', 10);
  await queryInterface.bulkInsert('users', [
    {
      login: 'admin',
      password: hashedPassword,
      full_name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      email_verified: true,
      created_at: new Date(),
    },
  ]);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('users', { login: 'admin' });
};
