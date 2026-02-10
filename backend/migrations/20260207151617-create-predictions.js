'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('predictions', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    image_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'images', key: 'id' }, onDelete: 'CASCADE' },
    disease_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'diseases', key: 'id' } },
    confidence: { type: Sequelize.FLOAT, allowNull: true },
    ai_model_version: { type: Sequelize.STRING, allowNull: true },
    validated: { type: Sequelize.BOOLEAN, defaultValue: false },
    validated_by: { type: Sequelize.UUID, allowNull: true, references: { model: 'users', key: 'id' } },
    status: { type: Sequelize.ENUM('PENDING','APPROVED','REJECTED'), defaultValue: 'PENDING' },
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('predictions');
}
