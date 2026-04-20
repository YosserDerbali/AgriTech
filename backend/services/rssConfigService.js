const Parser = require("rss-parser");
const { RssConfiguration } = require("../models/index.js");

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["enclosure", "enclosure"],
      ["content:encoded", "contentEncoded"],
    ],
  },
  timeout: 10000,
});

// Resource limits
const LIMITS = {
  MAX_FEEDS: 50,
  MAX_KEYWORDS: 200,
  MAX_IMAGES: 100,
  MAX_SYNC_INTERVAL_HOURS: 720,
  MIN_SYNC_INTERVAL_HOURS: 1,
  MAX_SYNC_TIME_HOUR: 23,
  MIN_SYNC_TIME_HOUR: 0,
  MAX_PARSER_TIMEOUT_MS: 60000,
  MIN_PARSER_TIMEOUT_MS: 1000,
  MAX_BATCH_SIZE: 20,
  MIN_BATCH_SIZE: 1,
  MAX_KEYWORD_LENGTH: 100,
};

/**
 * Parse stored value to proper type based on data_type
 */
function parseValue(value, dataType) {
  try {
    switch (dataType) {
      case "string":
        return value;
      case "number":
        return parseFloat(value);
      case "boolean":
        return value === "true";
      case "json_array":
      case "json_object":
        return JSON.parse(value);
      default:
        return value;
    }
  } catch (error) {
    console.error(`Error parsing value for data type ${dataType}:`, error);
    return value;
  }
}

/**
 * Convert value to storage string based on data_type
 */
function serializeValue(value, dataType) {
  try {
    switch (dataType) {
      case "string":
        return String(value);
      case "number":
        return String(Number(value));
      case "boolean":
        return String(Boolean(value));
      case "json_array":
      case "json_object":
        return JSON.stringify(value);
      default:
        return String(value);
    }
  } catch (error) {
    console.error(`Error serializing value for data type ${dataType}:`, error);
    throw new Error(`Failed to serialize value: ${error.message}`);
  }
}

/**
 * Validate URL format
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate image URL format
 */
function isValidImageUrl(url) {
  if (!isValidUrl(url)) return false;
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  return validExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

/**
 * Get all configurations parsed
 */
async function getAllConfigurations() {
  try {
    const configs = await RssConfiguration.findAll({
      where: { is_active: true },
      order: [["category", "ASC"], ["key", "ASC"]],
    });

    return configs.map((config) => ({
      id: config.id,
      key: config.key,
      value: parseValue(config.value, config.data_type),
      description: config.description,
      category: config.category,
      dataType: config.data_type,
      isActive: config.is_active,
      createdAt: config.created_at,
      updatedAt: config.updated_at,
    }));
  } catch (error) {
    console.error("Error fetching all configurations:", error);
    throw new Error("Failed to fetch configurations");
  }
}

/**
 * Get configurations by category
 */
async function getConfigurationsByCategory(category) {
  try {
    const configs = await RssConfiguration.findAll({
      where: { category, is_active: true },
      order: [["key", "ASC"]],
    });

    return configs.map((config) => ({
      id: config.id,
      key: config.key,
      value: parseValue(config.value, config.data_type),
      description: config.description,
      category: config.category,
      dataType: config.data_type,
      isActive: config.is_active,
      createdAt: config.created_at,
      updatedAt: config.updated_at,
    }));
  } catch (error) {
    console.error(`Error fetching configurations for category ${category}:`, error);
    throw new Error(`Failed to fetch ${category} configurations`);
  }
}

/**
 * Get single configuration by key
 */
async function getConfigurationByKey(key) {
  try {
    const config = await RssConfiguration.findOne({
      where: { key, is_active: true },
    });

    if (!config) {
      return null;
    }

    return {
      id: config.id,
      key: config.key,
      value: parseValue(config.value, config.data_type),
      description: config.description,
      category: config.category,
      dataType: config.data_type,
      isActive: config.is_active,
      createdAt: config.created_at,
      updatedAt: config.updated_at,
    };
  } catch (error) {
    console.error(`Error fetching configuration for key ${key}:`, error);
    throw new Error("Failed to fetch configuration");
  }
}

/**
 * Validate and update configuration
 */
async function updateConfiguration(key, data) {
  try {
    const config = await RssConfiguration.findOne({
      where: { key },
    });

    if (!config) {
      throw new Error(`Configuration key '${key}' not found`);
    }

    let newValue = data.value;
    let errorMessage = null;

    // Validate based on key and data_type
    switch (key) {
      case "rss_feeds":
        if (!Array.isArray(newValue)) {
          errorMessage = "RSS feeds must be an array";
          break;
        }
        if (newValue.length > LIMITS.MAX_FEEDS) {
          errorMessage = `Maximum ${LIMITS.MAX_FEEDS} feeds allowed`;
          break;
        }
        for (const feed of newValue) {
          if (!feed.url || !feed.authorName) {
            errorMessage = "Each feed must have url and authorName";
            break;
          }
          if (!isValidUrl(feed.url)) {
            errorMessage = `Invalid URL for feed: ${feed.url}`;
            break;
          }
          if (typeof feed.isActive !== "boolean") {
            errorMessage = `isActive must be a boolean for feed: ${feed.url}`;
            break;
          }
        }
        // Check for duplicate URLs
        const urls = newValue.map((f) => f.url);
        const uniqueUrls = new Set(urls);
        if (urls.length !== uniqueUrls.size) {
          errorMessage = "Duplicate feed URLs detected";
          break;
        }
        break;

      case "agri_keywords":
      case "tag_keywords":
        if (!Array.isArray(newValue)) {
          errorMessage = "Keywords must be an array";
          break;
        }
        if (newValue.length > LIMITS.MAX_KEYWORDS) {
          errorMessage = `Maximum ${LIMITS.MAX_KEYWORDS} keywords allowed`;
          break;
        }
        for (const keyword of newValue) {
          if (typeof keyword !== "string") {
            errorMessage = "Keywords must be strings";
            break;
          }
          const trimmed = keyword.trim();
          if (trimmed.length === 0) {
            errorMessage = "Keywords cannot be empty";
            break;
          }
          if (trimmed.length > LIMITS.MAX_KEYWORD_LENGTH) {
            errorMessage = `Keywords cannot exceed ${LIMITS.MAX_KEYWORD_LENGTH} characters`;
            break;
          }
        }
        // Check for duplicates (case-insensitive)
        const lowerKeywords = newValue.map((k) => k.toLowerCase().trim());
        const uniqueKeywords = new Set(lowerKeywords);
        if (lowerKeywords.length !== uniqueKeywords.size) {
          errorMessage = "Duplicate keywords detected (case-insensitive)";
          break;
        }
        break;

      case "fallback_images":
        if (!Array.isArray(newValue)) {
          errorMessage = "Fallback images must be an array";
          break;
        }
        if (newValue.length > LIMITS.MAX_IMAGES) {
          errorMessage = `Maximum ${LIMITS.MAX_IMAGES} images allowed`;
          break;
        }
        for (const image of newValue) {
          if (!isValidImageUrl(image)) {
            errorMessage = `Invalid image URL: ${image}`;
            break;
          }
        }
        // Check for duplicates
        const uniqueImages = new Set(newValue);
        if (newValue.length !== uniqueImages.size) {
          errorMessage = "Duplicate image URLs detected";
          break;
        }
        break;

      case "sync_interval_hours":
        newValue = Number(newValue);
        if (isNaN(newValue)) {
          errorMessage = "Sync interval must be a number";
          break;
        }
        if (newValue < LIMITS.MIN_SYNC_INTERVAL_HOURS || newValue > LIMITS.MAX_SYNC_INTERVAL_HOURS) {
          errorMessage = `Sync interval must be between ${LIMITS.MIN_SYNC_INTERVAL_HOURS} and ${LIMITS.MAX_SYNC_INTERVAL_HOURS} hours`;
          break;
        }
        break;

      case "sync_time_hour":
        newValue = Number(newValue);
        if (isNaN(newValue)) {
          errorMessage = "Sync time must be a number";
          break;
        }
        if (!Number.isInteger(newValue) || newValue < LIMITS.MIN_SYNC_TIME_HOUR || newValue > LIMITS.MAX_SYNC_TIME_HOUR) {
          errorMessage = `Sync time must be an integer between ${LIMITS.MIN_SYNC_TIME_HOUR} and ${LIMITS.MAX_SYNC_TIME_HOUR}`;
          break;
        }
        break;

      case "parser_timeout":
        newValue = Number(newValue);
        if (isNaN(newValue)) {
          errorMessage = "Parser timeout must be a number";
          break;
        }
        if (newValue < LIMITS.MIN_PARSER_TIMEOUT_MS || newValue > LIMITS.MAX_PARSER_TIMEOUT_MS) {
          errorMessage = `Parser timeout must be between ${LIMITS.MIN_PARSER_TIMEOUT_MS} and ${LIMITS.MAX_PARSER_TIMEOUT_MS} ms`;
          break;
        }
        break;

      case "batch_size_min":
        newValue = Number(newValue);
        if (isNaN(newValue)) {
          errorMessage = "Batch size min must be a number";
          break;
        }
        if (newValue < LIMITS.MIN_BATCH_SIZE || newValue > LIMITS.MAX_BATCH_SIZE) {
          errorMessage = `Batch size min must be between ${LIMITS.MIN_BATCH_SIZE} and ${LIMITS.MAX_BATCH_SIZE}`;
          break;
        }
        // Get batch_size_max to validate
        const batchMaxConfig = await getConfigurationByKey("batch_size_max");
        if (batchMaxConfig && newValue > batchMaxConfig.value) {
          errorMessage = "Batch size min cannot be greater than batch size max";
          break;
        }
        break;

      case "batch_size_max":
        newValue = Number(newValue);
        if (isNaN(newValue)) {
          errorMessage = "Batch size max must be a number";
          break;
        }
        if (newValue < LIMITS.MIN_BATCH_SIZE || newValue > LIMITS.MAX_BATCH_SIZE) {
          errorMessage = `Batch size max must be between ${LIMITS.MIN_BATCH_SIZE} and ${LIMITS.MAX_BATCH_SIZE}`;
          break;
        }
        // Get batch_size_min to validate
        const batchMinConfig = await getConfigurationByKey("batch_size_min");
        if (batchMinConfig && newValue < batchMinConfig.value) {
          errorMessage = "Batch size max cannot be less than batch size min";
          break;
        }
        break;

      case "sync_enabled":
        newValue = Boolean(newValue);
        break;

      default:
        errorMessage = `Unknown configuration key: ${key}`;
    }

    if (errorMessage) {
      return { success: false, error: errorMessage };
    }

    // Serialize and update
    const serializedValue = serializeValue(newValue, config.data_type);
    await config.update({
      value: serializedValue,
      updated_at: new Date(),
    });

    return {
      success: true,
      data: {
        id: config.id,
        key: config.key,
        value: newValue,
        description: config.description,
        category: config.category,
        dataType: config.data_type,
        isActive: config.is_active,
        createdAt: config.created_at,
        updatedAt: new Date(),
      },
    };
  } catch (error) {
    console.error(`Error updating configuration ${key}:`, error);
    return {
      success: false,
      error: error.message || "Failed to update configuration",
    };
  }
}

/**
 * Validate RSS feed URL
 */
async function validateFeedUrl(url) {
  try {
    if (!isValidUrl(url)) {
      return {
        valid: false,
        error: "Invalid URL format",
      };
    }

    const feed = await parser.parseURL(url);

    if (!feed || !feed.items) {
      return {
        valid: false,
        error: "Unable to parse RSS feed",
      };
    }

    return {
      valid: true,
      feedTitle: feed.title || "Unknown Feed",
      itemCount: feed.items.length,
    };
  } catch (error) {
    console.error(`Error validating feed URL ${url}:`, error);
    return {
      valid: false,
      error: error.message || "Failed to validate RSS feed",
    };
  }
}

/**
 * Preview RSS sync (dry run without saving)
 */
async function previewFeedSync() {
  try {
    // Get all configurations
    const allConfigs = await getAllConfigurations();
    const configMap = new Map(allConfigs.map((c) => [c.key, c.value]));

    // Check if sync is enabled
    if (!configMap.get("sync_enabled")) {
      return {
        totalArticles: 0,
        articles: [],
        message: "RSS sync is disabled",
      };
    }

    // Get feeds and filter by isActive
    const allFeeds = configMap.get("rss_feeds") || [];
    const activeFeeds = allFeeds.filter((feed) => feed.isActive);

    if (activeFeeds.length === 0) {
      return {
        totalArticles: 0,
        articles: [],
        message: "No active RSS feeds configured",
      };
    }

    // Get keywords for relevance filtering
    const agriKeywords = configMap.get("agri_keywords") || [];
    const tagKeywords = configMap.get("tag_keywords") || [];

    // Fetch all feeds
    const feedPromises = activeFeeds.map(async (feed) => {
      try {
        const parsedFeed = await parser.parseURL(feed.url);
        return {
          feed,
          items: parsedFeed.items || [],
        };
      } catch (error) {
        console.error(`Error fetching feed ${feed.url}:`, error);
        return {
          feed,
          items: [],
          error: error.message,
        };
      }
    });

    const results = await Promise.allSettled(feedPromises);
    const allArticles = [];

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.items) {
        const { feed, items } = result.value;
        for (const item of items) {
          // Check relevance using keywords
          const title = (item.title || "").toLowerCase();
          const content = (item.contentSnippet || item["content:encoded"] || "").toLowerCase();

          const isRelevant = agriKeywords.some((keyword) =>
            title.includes(keyword.toLowerCase()) || content.includes(keyword.toLowerCase())
          );

          // Extract tags
          const tags = tagKeywords.filter((keyword) =>
            title.includes(keyword.toLowerCase()) || content.includes(keyword.toLowerCase())
          );

          allArticles.push({
            title: item.title || "Untitled",
            url: item.link || item.guid || "",
            feed: feed.authorName || feed.url,
            relevant: isRelevant,
            tags,
          });
        }
      }
    }

    return {
      totalArticles: allArticles.length,
      articles: allArticles,
      message: `Preview complete: ${allArticles.length} articles from ${activeFeeds.length} feeds`,
    };
  } catch (error) {
    console.error("Error in preview RSS sync:", error);
    throw new Error(`Preview sync failed: ${error.message}`);
  }
}

module.exports = {
  parseValue,
  serializeValue,
  getAllConfigurations,
  getConfigurationsByCategory,
  getConfigurationByKey,
  updateConfiguration,
  validateFeedUrl,
  previewFeedSync,
  LIMITS,
};
