"use strict";
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("password123", 10);

    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        name: "John Farmer",
        email: "john@farm.com",
        role: "FARMER",
        isActive: true,
        password_hash: passwordHash,
        lastLoginAt: new Date(Date.now() - 3600000),
      },
      {
        id: uuidv4(),
        name: "Dr. Sarah Green",
        email: "sarah@agro.com",
        role: "AGRONOMIST",
        isActive: true,
        password_hash: passwordHash,
        lastLoginAt: new Date(Date.now() - 7200000),
      },
      {
        id: uuidv4(),
        name: "Admin User",
        email: "admin@system.com",
        role: "ADMIN",
        isActive: true,
        password_hash: passwordHash,
        lastLoginAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Maria Fields",
        email: "maria@farm.com",
        role: "FARMER",
        isActive: true,
        password_hash: passwordHash,
        lastLoginAt: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: uuidv4(),
        name: "Dr. Robert Plant",
        email: "robert@agro.com",
        role: "AGRONOMIST",
        isActive: false,
        password_hash: passwordHash,
        lastLoginAt: new Date(Date.now() - 86400000 * 10),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
