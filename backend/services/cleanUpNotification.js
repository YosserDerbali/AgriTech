const { Notification } = require("../models/Notification");
const { Op } = require("sequelize");

const CLEANUP_DAYS = 60;

const cleanupNotifications = async () => {
  try {
    const cutoffDate = new Date(Date.now() - CLEANUP_DAYS * 24 * 60 * 60 * 1000);

    const deletedCount = await Notification.destroy({
      where: {
        deleted_at: {
          [Op.lt]: cutoffDate,
        },
      },
    });

    console.log(`✅ Cleaned up ${deletedCount} old notifications`);
  } catch (err) {
    console.error("❌ Failed to clean notifications:", err);
  }
};

module.exports = cleanupNotifications;
