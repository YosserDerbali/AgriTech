const Parser = require("rss-parser");
const { Article } = require("../models/Article");
const { Op } = require("sequelize");
const { getConfigurationByKey } = require("./rssConfigService.js");

// ── Configuration Cache ───────────────────────────────────────────────────────────
let configCache = null;
let configCacheTime = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Get configuration value from database or cache
 */
async function getConfig(key) {
  try {
    // Check cache
    if (configCache && configCacheTime && Date.now() - configCacheTime < CACHE_TTL) {
      return configCache.get(key);
    }

    // Refresh cache
    const config = await getConfigurationByKey(key);
    if (configCache) {
      configCache.set(key, config?.value);
    } else {
      configCache = new Map([[key, config?.value]]);
    }
    configCacheTime = Date.now();

    return config?.value;
  } catch (error) {
    console.error(`Error fetching config ${key}:`, error);
    return null;
  }
}

/**
 * Clear configuration cache
 */
function clearConfigCache() {
  configCache = null;
  configCacheTime = null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripHtml(html = "") {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isRelevant(item, keywords) {
  const text = `${item.title || ""} ${item.contentSnippet || ""}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw.toLowerCase()));
}

function extractTags(item, tagKeywords) {
  const text = `${item.title || ""} ${item.contentSnippet || ""}`.toLowerCase();
  return tagKeywords
    .filter((kw) => text.includes(kw.toLowerCase()))
    .slice(0, 6);
}

function extractImage(item, fallbackImages) {
  // Try media:content
  if (item.mediaContent) {
    const url = item.mediaContent?.["$"]?.url || item.mediaContent?.url;
    if (url) return url;
  }
  // Try enclosure (podcasts / image attachments)
  if (item.enclosure?.url) return item.enclosure.url;
  // Fallback to a random agriculture photo
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}

function buildContent(item) {
  // Prefer full HTML content, strip tags; fall back to snippet or title
  const raw = item.contentEncoded || item.content || item.contentSnippet || item.title || "";
  return stripHtml(raw) || item.title;
}

function buildExcerpt(item) {
  const text = stripHtml(item.contentSnippet || item.content || item.title || "");
  if (text.length <= 200) return text;
  return text.slice(0, 197) + "...";
}

// ── Main sync function ────────────────────────────────────────────────────────

const syncArticlesFromRSS = async () => {
  console.log("📰 Starting RSS article sync...");

  try {
    // Check if sync is enabled
    const syncEnabled = await getConfig("sync_enabled");
    if (!syncEnabled) {
      console.log("📰 RSS sync is disabled. Skipping sync.");
      return;
    }

    // Get configuration values
    const allFeeds = (await getConfig("rss_feeds")) || [];
    const activeFeeds = allFeeds.filter((feed) => feed.isActive);

    if (activeFeeds.length === 0) {
      console.log("📰 No active RSS feeds configured. Skipping sync.");
      return;
    }

    const agriKeywords = (await getConfig("agri_keywords")) || [];
    const tagKeywords = (await getConfig("tag_keywords")) || [];
    const fallbackImages = (await getConfig("fallback_images")) || [];
    const parserTimeout = (await getConfig("parser_timeout")) || 10000;
    const batchSizeMin = (await getConfig("batch_size_min")) || 5;
    const batchSizeMax = (await getConfig("batch_size_max")) || 8;

    // Create parser with dynamic timeout
    const parser = new Parser({
      customFields: {
        item: [
          ["media:content", "mediaContent"],
          ["enclosure", "enclosure"],
          ["content:encoded", "contentEncoded"],
        ],
      },
      timeout: parserTimeout,
    });

    console.log(`📰 Syncing from ${activeFeeds.length} active feed(s)...`);

    // 1. Fetch all feeds in parallel (failures are soft — we skip bad feeds)
    const feedResults = await Promise.allSettled(
      activeFeeds.map(async (feed) => {
        const parsed = await parser.parseURL(feed.url);
        return parsed.items.map((item) => ({ item, authorName: feed.authorName }));
      })
    );

    const allCandidates = [];
    feedResults.forEach((result, i) => {
      if (result.status === "fulfilled") {
        allCandidates.push(...result.value);
      } else {
        console.warn(
          `⚠️  Could not fetch feed "${activeFeeds[i].url}": ${result.reason?.message}`
        );
      }
    });

    // 2. Keep only agriculture-relevant items that have a URL and title
    const relevant = allCandidates.filter(
      ({ item }) => item.link && item.title && isRelevant(item, agriKeywords)
    );

    if (relevant.length === 0) {
      console.log("📰 No relevant articles found in feeds this cycle.");
      return;
    }

    // 3. Check which URLs already exist in the database
    const candidateUrls = relevant.map(({ item }) => item.link);
    const existing = await Article.findAll({
      where: { external_url: { [Op.in]: candidateUrls } },
      attributes: ["external_url"],
    });
    const existingUrls = new Set(existing.map((a) => a.external_url));

    const newCandidates = relevant.filter(
      ({ item }) => !existingUrls.has(item.link)
    );

    if (newCandidates.length === 0) {
      console.log("📰 All fetched articles are already in the database.");
      return;
    }

    // 4. Pick batch size articles at random from what's new
    const shuffled = newCandidates.sort(() => Math.random() - 0.5);
    const batchSize = Math.min(
      newCandidates.length,
      Math.floor(Math.random() * (batchSizeMax - batchSizeMin + 1)) + batchSizeMin
    );
    const toInsert = shuffled.slice(0, batchSize);

    // 5. Build DB records and insert
    const records = toInsert.map(({ item, authorName }) => ({
      author_id: null,
      author_name: authorName,
      title: item.title.trim(),
      content: buildContent(item),
      excerpt: buildExcerpt(item),
      cover_image_url: extractImage(item, fallbackImages),
      source: "EXTERNAL",
      external_url: item.link,
      tags: extractTags(item, tagKeywords),
      published: true,
      created_at: item.pubDate ? new Date(item.pubDate) : new Date(),
      updated_at: new Date(),
    }));

    await Article.bulkCreate(records);
    console.log(
      `✅ RSS sync complete — inserted ${records.length} new article(s).`
    );

    // Clear cache to ensure fresh config on next run
    clearConfigCache();
  } catch (err) {
    console.error("❌ RSS article sync failed:", err.message);
    // Clear cache on error to potentially fix stale config issues
    clearConfigCache();
  }
};

module.exports = { syncArticlesFromRSS, clearConfigCache };
