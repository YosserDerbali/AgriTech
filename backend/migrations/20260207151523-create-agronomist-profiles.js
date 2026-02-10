'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('agronomist_profiles', {
    user_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    specialties: { type: Sequelize.ARRAY(Sequelize.TEXT), allowNull: true },
    experience_years: { type: Sequelize.INTEGER, allowNull: true },
    bio: { type: Sequelize.TEXT, allowNull: true },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('agronomist_profiles');
}
