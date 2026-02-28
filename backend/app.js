const express = require('express')
const app = express();
const cors = require("cors");
const { sequelize } = require("./models/index.js");
require("./models/index.js");
const cron = require("node-cron");
const cleanupNotifications = require("./services/cleanUpNotification.js");
const adminRoutes = require("./routes/admin.js");
const authRoutes = require("./routes/auth.js");



app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/auth", authRoutes);  // ADD THIS LINE
app.use("/admin", adminRoutes);

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





app.listen(3000, () => {
  console.log('Server is running on port 3000');
});