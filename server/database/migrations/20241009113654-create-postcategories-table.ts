import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('post_categories', {
      post_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'posts',
          key: 'id',
        },
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
        primaryKey: true,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('post_categories');
  },
};
