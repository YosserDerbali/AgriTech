"use strict";
const { v4: uuidv4 } = require("uuid");

// Fixed UUIDs for consistent reference
const DISEASE_DETECTION_MODEL_ID = "550e8400-e29b-41d4-a716-446655440001";
const SPEECH_RECOGNITION_MODEL_ID = "550e8400-e29b-41d4-a716-446655440002";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("ai_models", [
      {
        id: DISEASE_DETECTION_MODEL_ID,
        name: "Plant Disease Classifier",
        version: "meta-llama/llama-4-scout-17b-16e-instruct",
        type: "DISEASE_DETECTION",
        isEnabled: true,
        accuracy: 91.5,
        totalPredictions: 0,
        lastUpdated: new Date(),
      
      },
      {
        id: SPEECH_RECOGNITION_MODEL_ID,
        name: "Whisper Speech Recognition",
        version: "whisper-large-v3-turbo",
        type: "SPEECH_RECOGNITION",
        isEnabled: true,
        accuracy: 95.2,
        totalPredictions: 0,
        lastUpdated: new Date(),
       
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("ai_models", {
      id: [DISEASE_DETECTION_MODEL_ID, SPEECH_RECOGNITION_MODEL_ID],
    });
  },
};
