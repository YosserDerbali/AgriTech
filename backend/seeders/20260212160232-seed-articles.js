"use strict";
const { v4: uuidv4 } = require("uuid");
const { User } = require("../models/User");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all users to map names to their UUIDs
    const users = await User.findAll({ attributes: ["id", "name"] });

    // Helper to get user id by name
    const getUserIdByName = (name) => {
      const user = users.find((u) => u.name === name);
      return user ? user.id : null;
    };

    await queryInterface.bulkInsert("articles", [
      {
        id: uuidv4(),
        author_id: getUserIdByName("Dr. Sarah Green"),
        title: 'Understanding Early Blight in Tomatoes',
        content: `Early blight is one of the most common diseases affecting tomato plants worldwide. Caused by the fungus Alternaria solani, it can significantly reduce crop yield if not managed properly.

## Symptoms

- Dark, concentric rings on lower leaves (target spots)
- Yellow halos around the spots
- Leaves eventually dry and fall off
- Stems may show dark, sunken lesions

## Prevention

1. **Crop Rotation**: Avoid planting tomatoes in the same location for 2-3 years
2. **Proper Spacing**: Ensure adequate air circulation between plants
3. **Mulching**: Apply organic mulch to prevent soil splash
4. **Watering**: Water at the base, avoid wetting leaves

## Treatment

Apply copper-based fungicides at the first sign of infection. Remove and destroy affected leaves immediately.`,
        excerpt: 'Learn how to identify, prevent, and treat early blight in your tomato crops.',
        cover_image_url: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
        source: 'AGRONOMIST',
        external_url: null,
        tags: ['tomato', 'fungal disease', 'early blight', 'prevention'],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 3),
        updated_at: new Date(Date.now() - 86400000 * 3),
      },
      {
        id: uuidv4(),
        author_id: getUserIdByName("Dr. Sarah Green"),
        title: 'Best Practices for Corn Pest Management',
        content: `Integrated Pest Management (IPM) is essential for sustainable corn production. This guide covers the most effective strategies for managing common corn pests.

## Common Pests

- Corn borers
- Armyworms
- Aphids
- Rootworms

## IPM Strategies

1. **Monitoring**: Regular field scouting
2. **Biological Control**: Encourage natural predators
3. **Cultural Practices**: Crop rotation and resistant varieties
4. **Chemical Control**: Use as last resort, targeted application`,
        excerpt: 'A comprehensive guide to integrated pest management for corn farmers.',
        cover_image_url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800',
        source: 'AGRONOMIST',
        external_url: null,
        tags: ['corn', 'pest management', 'IPM', 'sustainable farming'],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 7),
        updated_at: new Date(Date.now() - 86400000 * 5),
      },
      {
        id: uuidv4(),
        author_id: getUserIdByName("FAO Plant Production"), // fallback if external, can be null
        title: 'Climate-Smart Agriculture: Adapting to Changing Weather Patterns',
        content: `Climate change poses significant challenges to agricultural productivity worldwide. This article explores practical strategies for adapting farming practices to changing weather patterns.

## Key Challenges

- Unpredictable rainfall patterns
- Increased frequency of droughts
- Rising temperatures affecting crop cycles
- New pest and disease pressures

## Adaptation Strategies

1. **Drought-resistant varieties**: Selecting crops bred for water efficiency
2. **Water harvesting**: Collecting and storing rainwater
3. **Conservation tillage**: Reducing soil disturbance to retain moisture
4. **Diversification**: Growing multiple crops to spread risk

## Looking Forward

Farmers who embrace climate-smart practices today will be better positioned for the challenges ahead.`,
        excerpt: 'Practical strategies for adapting your farm to climate change.',
        cover_image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        source: 'EXTERNAL',
        external_url: 'https://www.fao.org/agriculture',
        tags: ['climate change', 'adaptation', 'sustainable farming'],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 2),
        updated_at: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: uuidv4(),
        author_id: getUserIdByName("Agricultural Research Institute"), // fallback if external, can be null
        title: 'Soil Health: The Foundation of Productive Farming',
        content: `Healthy soil is the cornerstone of sustainable agriculture. Understanding and maintaining soil health can dramatically improve crop yields while reducing input costs.

## Indicators of Healthy Soil

- Good structure and aggregation
- Active biological community
- Balanced nutrient levels
- Adequate organic matter content

## Improving Soil Health

1. **Cover crops**: Protect and enrich soil between main crops
2. **Composting**: Add organic matter to improve structure
3. **Reduced tillage**: Preserve soil structure and biology
4. **Crop rotation**: Break pest cycles and balance nutrients`,
        excerpt: 'Understanding soil health for better crop yields.',
        cover_image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        source: 'EXTERNAL',
        external_url: 'https://www.agriculture.org/soil-health',
        tags: ['soil health', 'organic farming', 'composting'],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 5),
        updated_at: new Date(Date.now() - 86400000 * 5),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("articles", null, {});
  },
};
