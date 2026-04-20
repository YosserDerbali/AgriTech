"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("diagnoses", [
      {
        id: uuidv4(),
        image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        plant_name: 'Tomato',
        disease_name: 'Early Blight',
        confidence: 0.87,
        status: 'APPROVED',
        treatment: 'Apply copper-based fungicide. Remove affected leaves. Ensure proper spacing for air circulation.',
        agronomist_notes: 'Common issue in humid conditions. Recommend preventive spraying.',
        created_at: new Date(Date.now() - 86400000 * 2),
        updated_at: new Date(Date.now() - 86400000),
      },
      {
        id: uuidv4(),
        image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
        plant_name: 'Corn',
        disease_name: 'Leaf Rust',
        confidence: 0.72,
        status: 'PENDING',
        treatment: null,
        agronomist_notes: null,
        created_at: new Date(Date.now() - 3600000 * 5),
        updated_at: new Date(Date.now() - 3600000 * 5),
      },
      {
        id: uuidv4(),
        image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82ber2a?w=400',
        plant_name: 'Apple',
        disease_name: 'Powdery Mildew',
        confidence: 0.45,
        status: 'REJECTED',
        treatment: null,
        agronomist_notes: 'Image quality too low. Please submit a clearer photo of the affected area.',
        created_at: new Date(Date.now() - 86400000 * 5),
        updated_at: new Date(Date.now() - 86400000 * 3),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("diagnoses", null, {});
  },
};
