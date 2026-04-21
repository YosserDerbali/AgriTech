require("dotenv").config();
const { Sequelize } = require("sequelize");

async function testConnection() {
  // Mask password for logging (hide it)
  const maskedUrl = process.env.DATABASE_URL.replace(/:[^:]*@/, ":***@");
  console.log("📡 Testing database connection...");
  console.log("🔗 URL:", maskedUrl);
  
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful!");
    console.log("🎉 You can now run: node app.js");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("📝 Error:", error.message);
    console.error("\n🔧 FIXES:");
    console.error("1. Go to https://app.supabase.com");
    console.error("2. Select your project");
    console.error("3. Project Settings → Database → Connection string");
    console.error("4. Copy the 'URI' connection string");
    console.error("5. Update DATABASE_URL in .env file");
    console.error("\n📋 Current DATABASE_URL format:", process.env.DATABASE_URL.split('@')[0] + '@...');
    process.exit(1);
  }
}

testConnection();