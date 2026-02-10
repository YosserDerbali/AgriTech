const { sequelize } = require("../config/database");

const { User } = require("./User");
const { AgronomistProfile } = require("./AgronomistProfile");
const { Article } = require("./Article");
const { Notification } = require("./Notification");
const { Plant } = require("./Plant");
const { Disease } = require("./Disease");
const { Image } = require("./Image");
const { Prediction } = require("./Prediction");
const { Feedback } = require("./Feedback");

module.exports = {
  sequelize,
  User,
  AgronomistProfile,
  Article,
  Notification,
  Plant,
  Disease,
  Image,
  Prediction,
  Feedback,
};
