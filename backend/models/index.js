const { sequelize } = require("../config/database.js");

const { User } = require("./User.js");
const { AgronomistProfile } = require("./AgronomistProfile.js");
const { Article } = require("./Article.js");
const { Notification } = require("./Notification.js");
const { Plant } = require("./Plant.js");
const { Disease } = require("./Disease.js");
const { Image } = require("./Image.js");
const { Prediction } = require("./Prediction.js");
const { Feedback } = require("./Feedback.js");
const { Diagnosis } = require("./Diagnosis.js");
const { AiModel } = require("./AiModel.js");

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
  Diagnosis,
  AiModel,
};
