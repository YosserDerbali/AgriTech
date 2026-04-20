const { sequelize } = require("../config/database.js");

const { User } = require("./User.js");
const { AgronomistProfile } = require("./AgronomistProfile.js");
const { Article } = require("./Article.js");
const { Notification } = require("./Notification.js");
const { Feedback } = require("./Feedback.js");
const { Diagnosis } = require("./Diagnoses.js");
const { AiModel } = require("./AiModel.js");
const initRssConfiguration = require("./RssConfiguration.js");

// Initialize RssConfiguration model with sequelize instance
const RssConfiguration = initRssConfiguration(sequelize);

module.exports = {
  sequelize,
  User,
  AgronomistProfile,
  Article,
  Notification,
  Feedback,
  Diagnosis,
  AiModel,
  RssConfiguration,
};
