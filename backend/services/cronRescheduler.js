const cron = require("node-cron");
const { getConfigurationByKey } = require("./rssConfigService.js");
const { syncArticlesFromRSS } = require("./articleSyncService.js");

// Track current cron task
let currentRssTask = null;

/**
 * Convert hours interval to cron expression
 */
function hoursToCron(intervalHours, timeHour) {
  const hour = Math.max(0, Math.min(23, parseInt(timeHour) || 0));

  // For intervals >= 24 hours, use day-based scheduling
  if (intervalHours >= 24) {
    const days = Math.floor(intervalHours / 24);
    return `0 ${hour} */${days} * *`;
  }

  // For intervals < 24 hours, use hour-based scheduling
  return `0 ${hour} */${intervalHours} * *`;
}

/**
 * Calculate next sync time based on current time and schedule
 */
function calculateNextSyncTime(intervalHours, timeHour) {
  const now = new Date();
  const targetHour = Math.max(0, Math.min(23, parseInt(timeHour) || 0));

  let nextSync = new Date(now);

  // Calculate days and hours from interval
  if (intervalHours >= 24) {
    const days = Math.floor(intervalHours / 24);
    const daysSinceEpoch = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
    const dayOfWeek = daysSinceEpoch % days;

    // Find next day that matches the schedule
    const daysUntilNext = (days - dayOfWeek) % days;
    if (daysUntilNext === 0 && now.getHours() >= targetHour) {
      // Today has passed, schedule for next occurrence
      nextSync.setDate(now.getDate() + days);
    } else {
      nextSync.setDate(now.getDate() + daysUntilNext);
    }
  } else {
    // Hour-based scheduling
    const hoursSinceEpoch = Math.floor(now.getTime() / (60 * 60 * 1000));
    const hourInCycle = hoursSinceEpoch % intervalHours;

    const hoursUntilNext = (intervalHours - hourInCycle) % intervalHours;
    if (hoursUntilNext === 0 && now.getHours() >= targetHour) {
      // This hour has passed, schedule for next occurrence
      nextSync.setHours(now.getHours() + intervalHours);
    } else {
      nextSync.setHours(now.getHours() + hoursUntilNext);
    }
  }

  // Set the target hour
  nextSync.setHours(targetHour, 0, 0, 0);

  return nextSync;
}

/**
 * Stop the current RSS sync cron task
 */
function stopRssSync() {
  if (currentRssTask) {
    currentRssTask.stop();
    currentRssTask = null;
    console.log("📰 RSS sync cron task stopped.");
  }
}

/**
 * Schedule RSS sync based on configuration
 */
async function scheduleRssSync() {
  try {
    // Get scheduling configuration
    const syncEnabled = await getConfigurationByKey("sync_enabled");
    const syncIntervalHours = await getConfigurationByKey("sync_interval_hours");
    const syncTimeHour = await getConfigurationByKey("sync_time_hour");

    // Stop any existing task
    stopRssSync();

    // If sync is disabled, don't schedule
    if (!syncEnabled || !syncEnabled.value) {
      console.log("📰 RSS sync is disabled. No cron task scheduled.");
      return null;
    }

    const interval = syncIntervalHours?.value || 144; // Default 6 days
    const hour = syncTimeHour?.value || 3; // Default 3 AM

    // Create cron expression
    const cronExpression = hoursToCron(interval, hour);

    // Schedule new task
    currentRssTask = cron.schedule(cronExpression, async () => {
      console.log("📰 Running scheduled RSS article sync");
      await syncArticlesFromRSS();
    });

    // Calculate and log next sync time
    const nextSyncTime = calculateNextSyncTime(interval, hour);
    console.log(`📰 RSS sync cron task scheduled: ${cronExpression}`);
    console.log(`📰 Next sync: ${nextSyncTime.toISOString()}`);

    return {
      cronExpression,
      nextSyncTime,
    };
  } catch (error) {
    console.error("❌ Error scheduling RSS sync:", error);
    return null;
  }
}

/**
 * Reschedule RSS sync (used when configuration changes)
 */
async function rescheduleRssSync() {
  console.log("📰 Rescheduling RSS sync due to configuration change...");
  return await scheduleRssSync();
}

/**
 * Initialize RSS sync on server startup
 */
async function initializeRssSync() {
  console.log("📰 Initializing RSS sync cron job...");
  const result = await scheduleRssSync();
  if (result) {
    console.log(`📰 RSS sync initialized successfully. Next sync: ${result.nextSyncTime.toISOString()}`);
  } else {
    console.log("📰 RSS sync initialization complete (no task scheduled).");
  }
  return result;
}

/**
 * Get current schedule information
 */
async function getScheduleInfo() {
  try {
    const syncEnabled = await getConfigurationByKey("sync_enabled");
    const syncIntervalHours = await getConfigurationByKey("sync_interval_hours");
    const syncTimeHour = await getConfigurationByKey("sync_time_hour");

    const interval = syncIntervalHours?.value || 144;
    const hour = syncTimeHour?.value || 3;
    const enabled = syncEnabled?.value || false;

    let nextSyncTime = null;
    let cronExpression = null;

    if (enabled && currentRssTask) {
      cronExpression = hoursToCron(interval, hour);
      nextSyncTime = calculateNextSyncTime(interval, hour);
    }

    return {
      enabled,
      intervalHours: interval,
      timeHour: hour,
      cronExpression,
      nextSyncTime,
      isScheduled: currentRssTask !== null,
    };
  } catch (error) {
    console.error("❌ Error getting schedule info:", error);
    return null;
  }
}

module.exports = {
  hoursToCron,
  calculateNextSyncTime,
  scheduleRssSync,
  rescheduleRssSync,
  initializeRssSync,
  getScheduleInfo,
  stopRssSync,
};
