import { QueryInterface } from 'sequelize';
import * as bcrypt from 'bcrypt';

export const up = async (queryInterface: QueryInterface): Promise<void> => {
  const hashedPassword = await bcrypt.hash('12345678', 10);
  await queryInterface.bulkInsert('users', [
    {
      login: 'nartem',
      password: hashedPassword,
      full_name: 'Artem Niklin',
      email: 'nartem@example.com',
      role: 'admin',
      email_verified: true,
      profile_picture: '/images/avatars/nartem.jpg',
      rating: 100,
      created_at: new Date(),
    },
    {
      login: 'tech_guru89',
      password: hashedPassword,
      full_name: 'Alex Johnson',
      email: 'tech_guru89@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/tech.jpg',
      rating: 89,
      created_at: new Date(),
    },
    {
      login: 'coffee_addict22',
      password: hashedPassword,
      full_name: 'Mia Brown',
      email: 'coffee_addict22@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/coffee.jpg',
      rating: 73,
      created_at: new Date(),
    },
    {
      login: 'sunny_rider12',
      password: hashedPassword,
      full_name: 'Jake Wilson',
      email: 'sunny_rider12@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/sun.jpg',
      rating: 56,
      created_at: new Date(),
    },
    {
      login: 'bookworm_ella',
      password: hashedPassword,
      full_name: 'Ella Martinez',
      email: 'bookworm_ella@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/book.jpg',
      rating: 92,
      created_at: new Date(),
    },
    {
      login: 'pixel_artist99',
      password: hashedPassword,
      full_name: 'Ryan Walker',
      email: 'pixel_artist99@example.com',
      role: 'admin',
      email_verified: true,
      profile_picture: '/images/avatars/pixel.jpg',
      rating: 100,
      created_at: new Date(),
    },
    {
      login: 'foodie_quester',
      password: hashedPassword,
      full_name: 'Sophia Davis',
      email: 'foodie_quester@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/food.jpg',
      rating: 68,
      created_at: new Date(),
    },
    {
      login: 'mountain_hiker07',
      password: hashedPassword,
      full_name: 'Liam Anderson',
      email: 'mountain_hiker07@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/mountain.jpg',
      rating: 44,
      created_at: new Date(),
    },
    {
      login: 'dreamer_stella',
      password: hashedPassword,
      full_name: 'Stella Robinson',
      email: 'dreamer_stella@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/dream.jpg',
      rating: 77,
      created_at: new Date(),
    },
    {
      login: 'gamer_kingz47',
      password: hashedPassword,
      full_name: 'Noah Taylor',
      email: 'gamer_kingz47@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/game.jpg',
      rating: 50,
      created_at: new Date(),
    },
    {
      login: 'night_owl42',
      password: hashedPassword,
      full_name: 'Emily Harris',
      email: 'night_owl42@example.com',
      role: 'admin',
      email_verified: true,
      profile_picture: '/images/avatars/night.jpg',
      rating: 100,
      created_at: new Date(),
    },
    {
      login: 'code_master71',
      password: hashedPassword,
      full_name: 'Ethan Clark',
      email: 'code_master71@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/code.jpg',
      rating: 62,
      created_at: new Date(),
    },
    {
      login: 'melody_maker25',
      password: hashedPassword,
      full_name: 'Lily Lee',
      email: 'melody_maker25@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/melody.jpg',
      rating: 81,
      created_at: new Date(),
    },
    {
      login: 'wanderlust_luke',
      password: hashedPassword,
      full_name: 'Luke Young',
      email: 'wanderlust_luke@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/wander.jpg',
      rating: 39,
      created_at: new Date(),
    },
    {
      login: 'ocean_dreamer33',
      password: hashedPassword,
      full_name: 'Ava Adams',
      email: 'ocean_dreamer33@example.com',
      role: 'admin',
      email_verified: true,
      profile_picture: '/images/avatars/ocean.jpg',
      rating: 100,
      created_at: new Date(),
    },
    {
      login: 'fitness_freak50',
      password: hashedPassword,
      full_name: 'Grace Perez',
      email: 'fitness_freak50@example.com',
      role: 'user',
      email_verified: true,
      profile_picture: '/images/avatars/fitness.jpg',
      rating: 100,
      created_at: new Date(),
    },
  ]);
};

export const down = async (queryInterface: QueryInterface): Promise<void> => {
  await queryInterface.bulkDelete('users', { login: 'admin' });
};
