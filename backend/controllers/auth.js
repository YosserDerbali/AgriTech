const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

// 🔹 Google Sign-In (OAuth provider)
exports.googleSignIn = async (req, res) => {
  try {
    const { email, name, photo, providerUid, role } = req.body;

    if (!email || !providerUid || !role) {
      return res.status(400).json({ message: "Email, provider UID, and role are required" });
    }

    if (!["FARMER", "AGRONOMIST"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selection" });
    }

    // Check if user exists
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user from provider data
      // Generate a random password since OAuth users don't have passwords
      const randomPassword = require('crypto').randomBytes(16).toString('hex');
      const password_hash = await bcrypt.hash(randomPassword, 10);
      
      const now = new Date();
      user = await User.create({
        name: name || 'OAuth User',
        email,
        password_hash,
        role,
        firebaseUid: providerUid,
        profilePhoto: photo || null,
        lastLoginAt: now,
        isActive: true,
      });
    } else {
      // Update existing user with provider data
      user.firebaseUid = providerUid;
      if (photo) {
        user.profilePhoto = photo;
      }
      user.lastLoginAt = new Date();
      
      // Update role if different (in case user is accessing as different role)
      if (user.role !== role) {
        user.role = role;
      }
      
      await user.save();
    }

    // Generate JWT for backend
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("OAuth Sign-In error:", error);
    res.status(500).json({ message: "OAuth sign-in failed" });
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
