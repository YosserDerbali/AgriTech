'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('articles', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    author_id: {
      type: Sequelize.UUID,
      references: { model: 'users', key: 'id' },
      onDelete: 'SET NULL',
    },
    title: { type: Sequelize.STRING, allowNull: false },
    content: { type: Sequelize.TEXT, allowNull: false },
    source: { type: Sequelize.ENUM('AGRONOMIST','EXTERNAL'), allowNull: false },
    external_url: { type: Sequelize.TEXT, allowNull: true },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('articles');
}
