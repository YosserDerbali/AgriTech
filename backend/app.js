const express = require('express')
require("dotenv").config();
const app = express();
const cors = require("cors");
const { sequelize } = require("./models/index.js");
require("./models/index.js");
const cron = require("node-cron");
const cleanupNotifications = require("./services/cleanUpNotification.js");
const { initializeRssSync } = require("./services/cronRescheduler.js");
const adminRoutes = require("./routes/admin.js");
const authRoutes = require("./routes/auth.js");
const farmerRoutes = require("./routes/farmer.js");
const agronomistRoutes = require("./routes/agronomist.js");
const notificationRoutes = require("./routes/notifications.js"); // ← ADD THIS LINE


const isPrivateNetworkHost = (hostname) => {
  if (!hostname) return false;

  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    return true;
  }

  if (hostname.startsWith("192.168.")) {
    return true;
  }

  if (hostname.startsWith("10.")) {
    return true;
  }

  if (hostname.startsWith("172.")) {
    const octets = hostname.split(".");
    const secondOctet = Number(octets[1]);
    return Number.isInteger(secondOctet) && secondOctet >= 16 && secondOctet <= 31;
  }

  return false;
};

const allowLocalDevOrigins = (origin, callback) => {
  if (!origin) return callback(null, true); // allow same-origin or non-browser requests (optional)

  try {
    const url = new URL(origin);
    if (isPrivateNetworkHost(url.hostname)) {
      return callback(null, true);
    }
  } catch (e) {
    // invalid origin
  }

  return callback(new Error("Not allowed by CORS"));
};

app.use(
  cors({
    origin: allowLocalDevOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/farmer", farmerRoutes);
app.use("/agronomist", agronomistRoutes);
app.use("/api/notifications", notificationRoutes); // ← ADD THIS LINE

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database error:", error);
  }
})();


// app.get("/", async (req, res) => {
//   const result = await pool.query("SELECT NOW()");
//   res.json({ serverTime: result.rows[0] });
// });


 // Run cleanup every day at 2:00 AM
 cron.schedule("0 2 * * *", () => {
   console.log("🧹 Running daily notification cleanup");
   cleanupNotifications();
 });

 // Initialize RSS sync with dynamic scheduling from database
 initializeRssSync();

app.post("/create-admin-test", async (req, res) => {
  const { name, email, password } = req.body;
  const bcrypt = require("bcrypt");
  const { User } = require("./models/User");

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password_hash,
    role: "ADMIN",
    isActive: true,
    lastLoginAt: new Date(),
  });

  res.json(user);
});

app.listen(3000, "0.0.0.0", () => {
  console.log('Server is running on port 3000');
});