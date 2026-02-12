"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("ai_models", [
      {
        id: uuidv4(),
        name: "Plant Disease Classifier",
        version: "v2.1.0",
        type: "DISEASE_DETECTION",
        isEnabled: true,
        accuracy: 91.5,
        totalPredictions: 1523,
        lastUpdated: new Date(Date.now() - 86400000 * 7),
      },
      {
        id: uuidv4(),
        name: "Whisper Speech Recognition",
        version: "v1.0.0",
        type: "SPEECH_RECOGNITION",
        isEnabled: true,
        accuracy: 95.2,
        totalPredictions: 342,
        lastUpdated: new Date(Date.now() - 86400000 * 14),
      },
      {
        id: uuidv4(),
        name: "Agronomist Recommender",
        version: "v1.2.0",
        type: "RECOMMENDATION",
        isEnabled: true,
        accuracy: 88.3,
        totalPredictions: 156,
        lastUpdated: new Date(Date.now() - 86400000 * 3),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ai_models", null, {});
  },
};
