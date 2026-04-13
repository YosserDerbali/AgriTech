"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create rss_configurations table
    await queryInterface.createTable("rss_configurations", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      key: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      data_type: {
        type: Sequelize.ENUM("string", "number", "boolean", "json_array", "json_object"),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    });

    // Insert default configuration records
    const defaultFeeds = [
      {
        url: "https://cropwatch.unl.edu/feed/",
        authorName: "CropWatch — University of Nebraska-Lincoln",
        isActive: true,
      },
      {
        url: "https://www.usda.gov/media/blog/rss.xml",
        authorName: "USDA Blog",
        isActive: true,
      },
      {
        url: "https://nifa.usda.gov/rss.xml",
        authorName: "USDA National Institute of Food and Agriculture",
        isActive: true,
      },
      {
        url: "https://blog-crop-news.extension.umn.edu/feeds/posts/default",
        authorName: "University of Minnesota Extension — Crop News",
        isActive: true,
      },
      {
        url: "https://ipm.ucanr.edu/rss/whatsnewrss.xml",
        authorName: "UC Statewide IPM Program",
        isActive: true,
      },
      {
        url: "https://www.canr.msu.edu/news/rss",
        authorName: "Michigan State University Extension",
        isActive: true,
      },
    ];

    const agriKeywords = [
      "disease", "pest", "crop", "plant", "farm", "soil", "harvest",
      "fungal", "bacterial", "blight", "yield", "seed", "fertilizer",
      "irrigation", "drought", "agriculture", "agronomy", "weed",
      "insect", "spray", "fungicide", "herbicide", "rotation", "mildew",
      "pathogen", "nematode", "rust", "borer", "aphid", "virus",
      "tomato", "corn", "wheat", "potato", "vegetable", "fruit",
    ];

    const tagKeywords = [
      "disease", "pest management", "IPM", "fungal", "bacterial", "viral",
      "crop rotation", "soil health", "fertilizer", "irrigation", "drought",
      "blight", "mildew", "rust", "nematode", "weed", "herbicide",
      "fungicide", "insecticide", "harvest", "yield", "seed", "cover crops",
      "sustainable farming", "organic", "tomato", "corn", "wheat", "potato",
    ];

    const fallbackImages = [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=800",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800",
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800",
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800",
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800",
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
    ];

    await queryInterface.bulkInsert("rss_configurations", [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        key: "rss_feeds",
        value: JSON.stringify(defaultFeeds),
        description: "RSS feed sources for article scraping",
        category: "feeds",
        data_type: "json_array",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        key: "agri_keywords",
        value: JSON.stringify(agriKeywords),
        description: "Keywords for filtering agriculture-relevant articles",
        category: "keywords",
        data_type: "json_array",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        key: "tag_keywords",
        value: JSON.stringify(tagKeywords),
        description: "Keywords for extracting article tags",
        category: "keywords",
        data_type: "json_array",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        key: "fallback_images",
        value: JSON.stringify(fallbackImages),
        description: "Fallback images for articles without cover images",
        category: "images",
        data_type: "json_array",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        key: "sync_interval_hours",
        value: "144",
        description: "Interval between RSS sync operations in hours (144 = 6 days)",
        category: "scheduling",
        data_type: "number",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        key: "sync_time_hour",
        value: "3",
        description: "Hour of day to run RSS sync (0-23)",
        category: "scheduling",
        data_type: "number",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440007",
        key: "parser_timeout",
        value: "10000",
        description: "RSS parser timeout in milliseconds",
        category: "scheduling",
        data_type: "number",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440008",
        key: "batch_size_min",
        value: "5",
        description: "Minimum number of articles to insert per sync",
        category: "scheduling",
        data_type: "number",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440009",
        key: "batch_size_max",
        value: "8",
        description: "Maximum number of articles to insert per sync",
        category: "scheduling",
        data_type: "number",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        key: "sync_enabled",
        value: "true",
        description: "Master switch to enable or disable RSS sync",
        category: "scheduling",
        data_type: "boolean",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Drop the table
    await queryInterface.dropTable("rss_configurations");
  },
};
