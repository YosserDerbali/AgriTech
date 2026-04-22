require("dotenv").config();
const { sequelize } = require("./config/database");
const notificationService = require("./services/notification");

async function createTestNotification() {
  console.log("Starting test notification creation...");
  
  try {
    // Test database connection
    console.log("Testing database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Get the farmer user ID (from your earlier login)
    const farmerId = "098e69e7-190b-446e-a454-180a9e66c7e3";
    console.log(`Using farmer ID: ${farmerId}`);
    
    // Create notification
    console.log("Creating notification...");
    const notification = await notificationService.createStructuredNotification(
      farmerId,
      "Test Notification",
      "This is a test notification to verify your notification system is working! 🎉",
      "SYSTEM",
      { test: true, timestamp: new Date().toISOString() }
    );
    
    console.log("✅ Test notification created successfully!");
    console.log("Notification details:", JSON.stringify(notification, null, 2));
    console.log("\n📱 Now go to Profile → Notifications in your app");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Full error:", error);
  }
  
  process.exit(0);
}

createTestNotification();