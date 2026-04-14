const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const { User } = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

// Helper to remove sensitive fields
const sanitizeUser = (user) => {
  const { password_hash, ...safeUser } = user.toJSON();
  return safeUser;
};

// 🔹 Register (Farmer or Agronomist via mobile)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["FARMER", "AGRONOMIST"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selection" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const now = new Date();

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      lastLoginAt: now,
      isActive: true,
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔹 Login (Farmer, Agronomist, Admin)
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Role mismatch" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Update lastLoginAt
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔹 Google sign in / sign up
exports.googleAuth = async (req, res) => {
  try {
    const { accessToken, role } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Google access token is required" });
    }

    if (!role || !["FARMER", "AGRONOMIST"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selection" });
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      return res.status(401).json({ message: "Unable to verify Google account" });
    }

    const profile = await profileResponse.json();

    if (!profile.email || profile.email_verified === false) {
      return res.status(401).json({ message: "Google account email is not verified" });
    }

    let user = await User.findOne({ where: { email: profile.email } });

    if (user) {
      if (user.role !== role) {
        return res.status(403).json({ message: "Role mismatch" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive" });
      }

      user.name = profile.name || user.name;
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      const password_hash = await bcrypt.hash(randomUUID(), 10);

      user = await User.create({
        name: profile.name || profile.email.split("@")[0],
        email: profile.email,
        password_hash,
        role,
        lastLoginAt: new Date(),
        isActive: true,
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 🔹 Admin-only login endpoint
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email, role: "ADMIN" } });
    if (!user) return res.status(403).json({ message: "Admins only" });
   
    const valid = await bcrypt.compare(password, user.dataValues.password_hash);
    
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    // ✅ Update lastLoginAt for admin
    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
