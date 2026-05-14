// Seed script for initial data
const { sequelize, AiModel, SystemSettings } = require('./models');

const seedData = async () => {
  try {
    console.log('🌱 Starting data seed...');

    // Create default system settings
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({
        maintenanceMode: false,
        maxImageSizeMB: 10,
        confidenceThreshold: 0.8,
        notificationsEnabled: true,
        externalBlogSyncEnabled: false,
        externalBlogSyncIntervalHours: 6,
      });
      console.log('✅ Created default system settings');
    } else {
      console.log('ℹ️  System settings already exist');
    }

    // Create AI models if they don't exist
    const existingModels = await AiModel.count();
    if (existingModels === 0) {
      await AiModel.bulkCreate([
        {
          name: 'Plant Disease Detection Model',
          version: '2.1.0',
          type: 'DISEASE_DETECTION',
          accuracy: 91.5,
          totalPredictions: 1243,
          isEnabled: true,
          lastUpdated: new Date(),
        },
        {
          name: 'Whisper Speech Recognition',
          version: '1.0.0',
          type: 'SPEECH_RECOGNITION',
          accuracy: 87.2,
          totalPredictions: 456,
          isEnabled: true,
          lastUpdated: new Date(),
        },
      ]);
      console.log('✅ Created AI models');
    } else {
      console.log('ℹ️  AI models already exist');
    }

    console.log('✅ Data seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedData();
