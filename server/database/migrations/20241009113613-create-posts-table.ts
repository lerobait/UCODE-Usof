import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('posts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', // имя таблицы, на которую ссылаемся
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      publish_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories', // имя таблицы, на которую ссылаемся
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('posts');
  },
};
