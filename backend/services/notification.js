const { Notification } = require("../models/Notification");
const { User } = require("../models/User");
const { Op } = require("sequelize");

// Notify all agronomists
exports.notifyAgronomists = async (message) => {
  const agronomists = await User.findAll({ where: { role: "AGRONOMIST" } });

  const notifications = agronomists.map((user) => ({
    user_id: user.id,
    message,
  }));

  await Notification.bulkCreate(notifications);
};

// Notify a specific user
exports.notifyUser = async (userId, message) => {
  await Notification.create({ user_id: userId, message });
};

// Fetch notifications (only active ones)
exports.getUserNotifications = async (userId) => {
  return await Notification.findAll({
    where: {
      user_id: userId,
      deleted_at: null, // <-- exclude soft-deleted notifications
    },
    order: [["created_at", "DESC"]],
  });
};

// Soft delete a notification
exports.deleteNotification = async (notificationId) => {
  await Notification.update(
    { deleted_at: new Date() },
    { where: { id: notificationId } }
  );
};
