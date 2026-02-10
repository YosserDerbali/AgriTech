const { User } = require("./models/User");
const bcrypt = require("bcrypt");

(async () => {
  const password_hash = await bcrypt.hash("Admin123!", 10);
  const admin = await User.create({
    name: "Super Admin",
    email: "admin@example.com",
    password_hash,
    role: "ADMIN",
    isActive: true,
    lastLoginAt: new Date(),
  });
  console.log(admin.toJSON());
})();
