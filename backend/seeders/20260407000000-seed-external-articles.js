"use strict";
const { v4: uuidv4 } = require("uuid");

const ARTICLE_TITLES = [
  "Signs and Symptoms of Plant Disease: Is It Fungal, Viral or Bacterial?",
  "Integrated Pest Management (IPM) Principles",
  "Preventing Plant Diseases on Farms",
  "Fungal and Fungal-like Diseases of Plants",
  "Managing Plant Diseases With Crop Rotation",
  "Soil Health: Building the Foundation of Productive Farming",
  "Tomato Diseases: Identification and Management",
  "Plant Health: The Root of One Health",
  "The Future of Crop Pests and Pathogens in Relation to Food Systems",
  "Fungal and Bacterial Diseases of Vegetables",
  "What Is Integrated Pest Management (IPM)?",
  "Disease Management for Vegetable Crops",
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("articles", [
      {
        id: uuidv4(),
        author_id: null,
        author_name: "Michigan State University Extension",
        title: "Signs and Symptoms of Plant Disease: Is It Fungal, Viral or Bacterial?",
        content: `Plant diseases can be caused by three main types of pathogens: fungi, viruses, and bacteria. Correctly identifying the cause is the first step to effective management.

## Fungal Diseases

Fungi are the most common cause of plant disease. Key signs include:

- **Powdery or fuzzy growth** on leaf surfaces (powdery mildew, gray mold)
- **Spots with concentric rings** (early blight)
- **Rust-colored pustules** on undersides of leaves (rust diseases)
- **Wilting** accompanied by darkened vascular tissue inside stems

Fungal spores spread easily through wind, water splash, and infected tools. Most fungal diseases thrive in warm, humid conditions.

## Bacterial Diseases

Bacteria enter plants through wounds or natural openings. Signs include:

- **Water-soaked, greasy lesions** that turn brown or black
- **Slimy, foul-smelling rot** (soft rot bacteria)
- **Angular leaf spots** limited by leaf veins
- **Ooze or slime** on cut stems (bacterial wilt)

Bacterial diseases spread rapidly in warm, wet weather and through contaminated irrigation water.

## Viral Diseases

Viruses are transmitted by insects (aphids, thrips, whiteflies) or through infected seed. Signs include:

- **Mosaic patterns** — irregular green/yellow mottling on leaves
- **Leaf curl or distortion**
- **Stunted growth** and reduced yield
- **Ring spots** on leaves or fruit

There is no chemical cure for viral diseases; prevention through vector control and resistant varieties is essential.

## Quick Diagnosis Tips

1. Check where symptoms first appear (older vs. newer leaves)
2. Look for signs of the pathogen itself (spores, ooze)
3. Note weather conditions — fungi favor humidity, bacteria favor warmth and wet
4. Send samples to your local extension plant disease clinic for confirmation`,
        excerpt:
          "Learn how to distinguish between fungal, viral, and bacterial plant diseases by their signs and symptoms — a critical first step for effective crop management.",
        cover_image_url:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
        source: "EXTERNAL",
        external_url:
          "https://www.canr.msu.edu/news/signs_and_symptoms_of_plant_disease_is_it_fungal_viral_or_bacterial",
        tags: ["plant disease", "diagnosis", "fungal", "bacterial", "viral"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 14),
        updated_at: new Date(Date.now() - 86400000 * 14),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "US Environmental Protection Agency",
        title: "Integrated Pest Management (IPM) Principles",
        content: `Integrated Pest Management (IPM) is an effective and environmentally sensitive approach to pest management that relies on a combination of common-sense practices.

## What Is IPM?

IPM programs use current, comprehensive information on the life cycles of pests and their interaction with the environment. This information, in combination with available pest control methods, is used to manage pest damage by the most economical means while minimizing possible hazards to people, property, and the environment.

## The Four Core IPM Principles

### 1. Set Action Thresholds
Before taking any pest control action, IPM first sets an action threshold — a point at which pest populations or environmental conditions indicate that pest control action must be taken. Sighting a single pest does not always mean control is needed.

### 2. Monitor and Identify Pests
Not all insects, weeds, and other living organisms require control. IPM programs work to monitor for pests and identify them accurately, so that appropriate control decisions can be made in conjunction with action thresholds.

### 3. Prevention
As a first line of pest control, IPM programs work to manage the crop, lawn, or indoor space to prevent pests from becoming a threat. This may mean selecting pest-resistant varieties, planting pest-free rootstock, and maintaining healthy soil.

### 4. Control
Once monitoring, identification, and action thresholds indicate that pest control is required, IPM evaluates the proper control method for both effectiveness and risk. Effective, less risky pest controls are chosen first — including biological controls, habitat manipulation, and resistant varieties.

## Benefits of IPM

- Reduces risk to human health and the environment
- Lowers pesticide costs
- Prevents resistance development in pests
- Maintains healthy ecosystems`,
        excerpt:
          "The US EPA's guide to Integrated Pest Management — a science-based approach that combines monitoring, prevention, and targeted control to manage pests with minimal environmental impact.",
        cover_image_url:
          "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
        source: "EXTERNAL",
        external_url:
          "https://www.epa.gov/safepestcontrol/integrated-pest-management-ipm-principles",
        tags: ["IPM", "pest management", "prevention", "sustainable farming"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 12),
        updated_at: new Date(Date.now() - 86400000 * 12),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "University of Minnesota Extension",
        title: "Preventing Plant Diseases on Farms",
        content: `Preventing plant diseases before they occur is far more cost-effective than treating them after they appear. These strategies apply to vegetable and field crop farms of all sizes.

## Start with Healthy Plant Material

- Purchase certified disease-free seed and transplants
- Inspect transplants before bringing them to the field
- Avoid saving seed from diseased crops

## Practice Crop Rotation

Rotating crops breaks the disease cycle by removing host plants from fields where pathogens have built up. A minimum three-year rotation away from susceptible crops is recommended for most soilborne diseases.

## Choose Resistant Varieties

Many modern varieties have been bred for resistance to common diseases. Check seed catalogs and extension resources for varieties with documented resistance ratings.

## Manage Soil and Water

- Improve drainage in fields prone to waterlogging — wet soils favor root rots and Phytophthora
- Avoid working in fields when soil is saturated (compaction spreads soilborne pathogens)
- Use drip irrigation where possible to keep foliage dry

## Sanitation Practices

- Clean and disinfect equipment between fields
- Remove and destroy crop debris at the end of the season
- Control weeds, which can harbor disease vectors

## Scout Regularly

Early detection is critical. Walk fields at least once a week during the growing season. When you find suspicious symptoms, consult your local extension service or send a sample to a plant disease clinic.`,
        excerpt:
          "Practical, farm-tested strategies for preventing plant diseases before they start — from selecting healthy seed to crop rotation, resistant varieties, and field sanitation.",
        cover_image_url:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        source: "EXTERNAL",
        external_url:
          "https://extension.umn.edu/vegetables/preventing-plant-diseases-farms",
        tags: ["disease prevention", "crop rotation", "sanitation", "resistant varieties"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 10),
        updated_at: new Date(Date.now() - 86400000 * 10),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "Ohio State University Extension",
        title: "Fungal and Fungal-like Diseases of Plants",
        content: `Fungi and fungal-like organisms (oomycetes) cause the majority of plant diseases. Understanding their biology helps you choose the most effective management tools.

## True Fungi vs. Oomycetes

**True fungi** (e.g., Botrytis, Alternaria, Fusarium) produce spores and spread primarily by air and water. They are controlled by fungicides targeting fungal cell membranes.

**Oomycetes** (e.g., Phytophthora, Pythium, downy mildew pathogens) look like fungi but are more closely related to algae. They require different chemistry — fungicides effective against true fungi often do not work against oomycetes.

## Common Fungal Diseases

| Disease | Pathogen | Crops Affected |
|---------|----------|----------------|
| Powdery mildew | Erysiphe spp. | Cucurbits, grapes, cereals |
| Gray mold | Botrytis cinerea | Strawberry, tomato, lettuce |
| Early blight | Alternaria solani | Tomato, potato |
| Anthracnose | Colletotrichum spp. | Pepper, bean, cucurbits |
| Fusarium wilt | Fusarium oxysporum | Tomato, basil, watermelon |

## Common Oomycete Diseases

| Disease | Pathogen | Crops Affected |
|---------|----------|----------------|
| Late blight | Phytophthora infestans | Tomato, potato |
| Downy mildew | Various Peronospora spp. | Cucurbits, basil, spinach |
| Root rot | Pythium spp. | Seedlings of most crops |
| Crown rot | Phytophthora capsici | Pepper, cucurbits |

## Management Principles

1. **Cultural controls first**: Improve air circulation, reduce leaf wetness
2. **Correct diagnosis**: Know whether you are dealing with a fungus or oomycete before selecting fungicides
3. **Rotate fungicide classes**: Prevents resistance development
4. **Timing**: Apply preventively or at first sign of disease`,
        excerpt:
          "A comprehensive guide to the most economically important fungal and oomycete plant diseases — including identification tables, affected crops, and management principles.",
        cover_image_url:
          "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800",
        source: "EXTERNAL",
        external_url: "https://ohioline.osu.edu/factsheet/plpath-gen-7",
        tags: ["fungal disease", "oomycetes", "plant pathology", "disease identification"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 9),
        updated_at: new Date(Date.now() - 86400000 * 9),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "SARE — Sustainable Agriculture Research & Education",
        title: "Managing Plant Diseases With Crop Rotation",
        content: `Crop rotation is one of the oldest and most effective tools for managing plant diseases. By removing host plants from fields for one or more seasons, you starve out pathogens that depend on those plants to survive.

## Why Rotation Works

Most soilborne pathogens — fungi, bacteria, nematodes — require living host tissue or crop debris to persist. When you move susceptible crops out of an infested field, the pathogen population gradually declines. The longer the rotation, the greater the reduction.

## Rotation Length Guidelines

| Pathogen Type | Minimum Break |
|--------------|---------------|
| Foliar fungi (Alternaria, Septoria) | 1–2 years |
| Soilborne fungi (Fusarium wilt) | 3–4 years |
| Sclerotia-forming fungi (Sclerotinia) | 3–4 years |
| Bacterial pathogens | 2–3 years |
| Root-knot nematodes | 3+ years with non-host crops |

## Designing an Effective Rotation

1. **Know your pathogen's host range**: Some fungi infect many plant families; rotating within the same family provides little benefit.
2. **Use non-host crops**: For Fusarium wilt of tomato, rotating to corn or grasses provides a complete break.
3. **Include cover crops**: Brassica cover crops (mustard, radish) release compounds that suppress soilborne pathogens.
4. **Keep records**: Track where you grew each crop to enforce rotation intervals.

## Limitations

Rotation is less effective against:
- Airborne pathogens (rust, powdery mildew) that reinfect from outside the field
- Pathogens with very long soil survival (Verticillium dahliae can persist 10+ years)
- Highly mobile soilborne pathogens spread by water or equipment`,
        excerpt:
          "How strategic crop rotation disrupts soilborne disease cycles — with rotation length guidelines by pathogen type and tips for designing effective rotations.",
        cover_image_url:
          "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
        source: "EXTERNAL",
        external_url:
          "https://www.sare.org/publications/crop-rotation-on-organic-farms/physical-and-biological-processes-in-crop-production/managing-plant-diseases-with-crop-rotation/",
        tags: ["crop rotation", "disease management", "soilborne disease", "sustainable farming"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 8),
        updated_at: new Date(Date.now() - 86400000 * 8),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "USDA Natural Resources Conservation Service",
        title: "Soil Health: Building the Foundation of Productive Farming",
        content: `Soil health — the continued capacity of soil to function as a vital living ecosystem — is the foundation of sustainable and productive agriculture.

## What Is Soil Health?

Healthy soil is biologically diverse, structurally stable, and chemically balanced. It supports plant growth, regulates water flow, cycles nutrients, and suppresses pests and diseases. A teaspoon of healthy agricultural soil contains billions of microorganisms.

## The Five Soil Health Principles

### 1. Minimize Disturbance
Tillage disrupts soil structure and kills beneficial organisms. Reduced or no-till systems preserve aggregates that hold water and resist erosion.

### 2. Maintain Living Roots
Living roots feed soil biology through root exudates. Cover crops between cash crop seasons maintain this continuous feeding.

### 3. Keep the Soil Covered
Bare soil is vulnerable to erosion, compaction from rain impact, and temperature extremes. Mulches and cover crops protect the surface.

### 4. Maximize Diversity
Diverse crop rotations and cover crop mixes support diverse microbial communities, which improves nutrient cycling and disease suppression.

### 5. Integrate Livestock
Grazing animals return nutrients and stimulate soil biology when managed with appropriate rest periods.

## Soil Health Indicators

- **Organic matter content** (>3% is good for most soils)
- **Aggregate stability** (water-stable aggregates resist erosion)
- **Infiltration rate** (healthy soils absorb water quickly)
- **Earthworm counts** (>10 per cubic foot indicates biological activity)
- **Respiration rate** (CO₂ released indicates microbial activity)

## Getting Started

Request a comprehensive soil test that includes biological indicators, not just NPK. Work with your local NRCS office to develop a soil health management plan tailored to your farm.`,
        excerpt:
          "USDA's guide to soil health principles — why living soil is the foundation of disease suppression, water retention, and long-term farm productivity.",
        cover_image_url:
          "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800",
        source: "EXTERNAL",
        external_url:
          "https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soil/soil-health",
        tags: ["soil health", "organic matter", "sustainable farming", "cover crops"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 7),
        updated_at: new Date(Date.now() - 86400000 * 7),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "PlantVillage — Penn State University",
        title: "Tomato Diseases: Identification and Management",
        content: `Tomatoes are susceptible to a wide range of diseases. Early and accurate identification is essential for effective management.

## Early Blight (Alternaria solani)

**Symptoms:** Dark, concentric-ringed spots (target spots) on older leaves, with yellow halos. Lesions on stems appear sunken and dark.

**Management:** Remove infected leaves, apply copper-based or chlorothalonil fungicides preventively, rotate crops.

## Late Blight (Phytophthora infestans)

**Symptoms:** Large, water-soaked, irregular lesions on leaves that turn brown with pale green margins. White sporulation on leaf undersides in humid conditions.

**Management:** Requires oomycete-specific fungicides (mefenoxam, dimethomorph). Scout daily during cool, wet weather. Remove and destroy infected plants immediately.

## Septoria Leaf Spot (Septoria lycopersici)

**Symptoms:** Numerous small, circular spots with dark borders and light-colored centers on lower leaves. Tiny black dots (pycnidia) visible inside spots with hand lens.

**Management:** Remove affected leaves, apply fungicides containing mancozeb or chlorothalonil, improve air circulation.

## Fusarium Wilt (Fusarium oxysporum f. sp. lycopersici)

**Symptoms:** Yellowing of leaves on one side of the plant, progressing to full wilt. Brown discoloration visible in cut stems.

**Management:** No effective chemical treatment. Use resistant varieties (labeled 'F'), rotate with non-solanaceous crops for 3–4 years.

## Tomato Mosaic Virus (ToMV)

**Symptoms:** Mosaic (light and dark green mottling) on leaves, leaf distortion, stunted growth.

**Management:** Use virus-free seed and transplants, control aphid vectors, remove infected plants promptly.

## General Tomato Disease Prevention

- Stake or cage plants to improve airflow
- Water at the base; avoid wetting foliage
- Apply mulch to reduce soil splash
- Scout twice weekly during the growing season`,
        excerpt:
          "Identification and management guide for the most common tomato diseases — from early blight and late blight to Fusarium wilt and viral diseases.",
        cover_image_url:
          "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800",
        source: "EXTERNAL",
        external_url: "https://plantvillage.psu.edu/topics/tomato/infos",
        tags: ["tomato", "disease management", "late blight", "early blight", "Fusarium wilt"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 6),
        updated_at: new Date(Date.now() - 86400000 * 6),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "Food and Agriculture Organization of the United Nations",
        title: "Plant Health: The Root of One Health",
        content: `Plants are the foundation of life on Earth. They produce 80% of the food we eat, generate the oxygen we breathe, and support entire ecosystems. Plant health is therefore inseparable from human health, animal health, and ecosystem health — a concept known as "One Health."

## Why Plant Health Matters

- Over 40% of global food crops are lost to pests and diseases annually
- Plant pests cost the global economy more than $220 billion per year
- Invasive plant pests threaten biodiversity and can cause irreversible ecosystem damage

## The Interconnection with Human Health

Healthy plants mean food security. When plant diseases decimate crops, the consequences ripple outward:

- **Malnutrition**: Reduced availability of fruits, vegetables, and grains
- **Economic hardship**: Smallholder farmers lose their livelihoods
- **Migration**: Food insecurity drives rural-to-urban and cross-border migration

## Climate Change and Plant Health

Rising temperatures and changing rainfall patterns are expanding the geographic range of many plant pathogens and their insect vectors. Pests previously limited to tropical regions are now appearing in temperate zones. Early warning and surveillance systems are more important than ever.

## International Standards for Plant Health

The International Plant Protection Convention (IPPC), administered by FAO, coordinates global efforts to prevent the spread of plant pests across borders. Countries use phytosanitary measures — inspections, treatments, and import regulations — based on IPPC standards.

## What Farmers Can Do

- Report unusual symptoms to national plant protection organizations
- Follow phytosanitary regulations when moving plant material
- Use certified, disease-free planting material
- Adopt diversified farming systems that reduce vulnerability`,
        excerpt:
          "FAO's perspective on why plant health is central to human health, food security, and ecosystem stability — and what farmers can do to be part of the solution.",
        cover_image_url:
          "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800",
        source: "EXTERNAL",
        external_url: "https://www.fao.org/one-health/areas-of-work/plant-health/en",
        tags: ["plant health", "food security", "FAO", "climate change", "One Health"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 5),
        updated_at: new Date(Date.now() - 86400000 * 5),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "CGIAR",
        title: "The Future of Crop Pests and Pathogens in Relation to Food Systems",
        content: `As global temperatures rise and agriculture intensifies, the landscape of crop pests and pathogens is changing rapidly. Understanding these shifts is essential for building resilient food systems.

## Key Trends

### Geographic Range Expansion
Many fungal pathogens and insect vectors are moving poleward as winters become milder. Wheat blast (Magnaporthe triticum), previously confined to South America, has now appeared in Bangladesh and Zambia.

### Emergence of New Strains
Pathogens evolve constantly. New races of wheat stem rust (Ug99) and cassava mosaic virus have emerged with the ability to overcome previously resistant varieties, threatening food security for hundreds of millions.

### Increased Pesticide Resistance
Intensive use of fungicides has led to resistance in key pathogens. Septoria tritici blotch of wheat (Zymoseptoria tritici) has developed resistance to multiple fungicide classes across Europe.

## The Role of Digital Tools and AI

Emerging technologies are transforming how we detect and respond to plant disease outbreaks:

- **AI-powered image diagnosis**: Mobile apps that identify diseases from smartphone photos
- **Satellite monitoring**: Remote sensing to detect crop stress before symptoms are visible
- **Early warning systems**: Networks of weather stations and crop monitoring to predict disease risk

## Building Resilient Food Systems

CGIAR researchers advocate for:

1. **Diversified farming systems** that reduce the risk of catastrophic single-crop failures
2. **Investment in breeding** for broad-spectrum disease resistance
3. **Global surveillance networks** to detect new pathogen strains early
4. **Support for smallholder farmers** who are most vulnerable to crop losses

## Conclusion

The future of food security depends on our ability to anticipate and respond to evolving plant pest and pathogen threats. International collaboration, digital tools, and resilient farming practices are all essential components of the solution.`,
        excerpt:
          "CGIAR's analysis of how climate change, pathogen evolution, and new technology are reshaping the crop disease landscape — and what resilient food systems will require.",
        cover_image_url:
          "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800",
        source: "EXTERNAL",
        external_url:
          "https://www.cgiar.org/news-events/news/what-do-we-know-about-the-future-of-crop-pests-and-pathogens-in-relation-to-food-systems/",
        tags: ["food security", "climate change", "CGIAR", "plant pathogens", "AI diagnosis"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 4),
        updated_at: new Date(Date.now() - 86400000 * 4),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "University of Maryland Extension",
        title: "Fungal and Bacterial Diseases of Vegetables",
        content: `Vegetable crops face pressure from both fungal and bacterial pathogens throughout the growing season. This guide covers the most important diseases by crop group.

## Brassicas (Cabbage, Broccoli, Kale)

**Clubroot** (Plasmodiophora brassicae): Swollen, distorted roots; yellowing and wilting foliage. Soilborne; survives 10+ years. Lime soil to pH 7.2 to suppress, use resistant varieties.

**Black rot** (Xanthomonas campestris): V-shaped yellow lesions from leaf margins; veins turn black. Spread by infected seed and rain splash. Use certified seed, avoid overhead irrigation.

## Cucurbits (Cucumber, Squash, Melon)

**Powdery mildew** (Podosphaera xanthii): White powdery coating on leaves. Thrives in warm, dry-to-moderate humidity. Apply sulfur or potassium bicarbonate fungicides.

**Angular leaf spot** (Pseudomonas syringae): Water-soaked, angular lesions limited by veins, turning tan. Bacterial; spreads in wet conditions. Use copper sprays, disease-free seed.

**Gummy stem blight** (Stagonosporopsis cucurbitacearum): Tan lesions with pinkish gummy exudate on stems. Apply fungicides containing thiophanate-methyl or azoxystrobin.

## Solanums (Tomato, Pepper, Eggplant)

**Bacterial speck** (Pseudomonas syringae pv. tomato): Small, dark spots with yellow halos on tomato leaves. Cool, wet weather. Copper sprays provide partial control.

**Phytophthora blight** (Phytophthora capsici): Crown rot, wilting, water-soaked fruit on pepper, squash, and eggplant. Improve drainage; apply mefenoxam-containing fungicides.

## General Management Principles

- Use disease-free, certified seed
- Rotate crops on a 3-year cycle minimum
- Apply mulch to reduce soil splash
- Scout weekly and act at first sign of disease
- Alternate fungicide modes of action to prevent resistance`,
        excerpt:
          "A crop-by-crop guide to the most important fungal and bacterial diseases of vegetables — with identification clues and targeted management recommendations.",
        cover_image_url:
          "https://images.unsplash.com/photo-1449175334484-4e4df04c9a31?w=800",
        source: "EXTERNAL",
        external_url:
          "https://extension.umd.edu/resource/fungal-and-bacterial-diseases-vegetables",
        tags: ["vegetables", "fungal disease", "bacterial disease", "disease management"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 3),
        updated_at: new Date(Date.now() - 86400000 * 3),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "UC Statewide Integrated Pest Management Program",
        title: "What Is Integrated Pest Management (IPM)?",
        content: `Integrated Pest Management (IPM) is a sustainable, science-based approach to managing pests that combines biological, cultural, physical, and chemical tools in a way that minimizes economic, health, and environmental risks.

## The IPM Pyramid

IPM strategies are organized by preference, from least to most disruptive:

### Level 1 — Prevention (Base of the Pyramid)
The best pest management is preventing pests from becoming a problem in the first place:
- Select disease-resistant varieties
- Use certified, pest-free planting material
- Maintain healthy soil to support plant vigor
- Practice good sanitation (remove crop debris)

### Level 2 — Monitoring and Identification
Regular field scouting and accurate pest identification are the cornerstones of IPM. You cannot make good management decisions without knowing what pest you have and how many are present.
- Scout fields weekly (or more frequently during high-risk periods)
- Use sticky traps, pheromone lures, and visual inspection
- Record pest counts and compare against action thresholds

### Level 3 — Biological Controls
Encourage or release natural enemies of pests:
- Predatory insects (ladybugs, lacewings, parasitic wasps)
- Beneficial nematodes for soil pests
- Microbial insecticides (Bacillus thuringiensis for caterpillars)

### Level 4 — Cultural and Physical Controls
Modify the environment to make it less hospitable for pests:
- Adjust planting dates to avoid pest peaks
- Use row covers to exclude insects
- Trap crops to attract pests away from main crop

### Level 5 — Chemical Controls (Only When Necessary)
When other methods are insufficient, pesticides may be used:
- Choose the least toxic, most target-specific product
- Apply only when and where pest thresholds are exceeded
- Rotate chemical classes to prevent resistance

## Economic Thresholds

A key IPM concept is the economic threshold — the pest density at which control is justified by the cost of crop damage. Acting only at or above this threshold prevents unnecessary pesticide applications.`,
        excerpt:
          "UC IPM's comprehensive explanation of the Integrated Pest Management pyramid — from prevention and monitoring to biological controls and judicious pesticide use.",
        cover_image_url:
          "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800",
        source: "EXTERNAL",
        external_url: "https://ipm.ucanr.edu/what-is-ipm/",
        tags: ["IPM", "pest management", "biological control", "economic threshold"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 2),
        updated_at: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: uuidv4(),
        author_id: null,
        author_name: "University of Minnesota Extension",
        title: "Disease Management for Vegetable Crops",
        content: `Effective disease management in vegetable production requires an integrated approach combining sound cultural practices with timely, targeted chemical applications when necessary.

## The Disease Triangle

Plant disease only occurs when three conditions overlap simultaneously:
1. **Susceptible host**: A crop variety that can be infected
2. **Virulent pathogen**: A pathogen capable of causing disease on that host
3. **Favorable environment**: Temperature and moisture conditions that allow infection and spread

Management strategies target any one or more of these three factors.

## Cultural Practices for Disease Management

### Variety Selection
Choose varieties with documented resistance ratings. Resistance does not mean immunity — resistant varieties may still show some disease symptoms under heavy pressure, but crop losses are greatly reduced.

### Planting Density and Spacing
Dense plantings restrict air movement, creating humid microclimates that favor fungal and bacterial diseases. Follow spacing recommendations for each crop.

### Irrigation Management
- Use drip or subsurface irrigation to keep foliage dry
- If using overhead irrigation, water in the morning so plants dry quickly
- Avoid irrigation late in the day, which leaves plants wet overnight

### Nutrient Management
Both deficiency and excess of key nutrients affect disease susceptibility:
- Nitrogen excess promotes lush, disease-susceptible growth
- Calcium deficiency increases susceptibility to certain bacterial diseases
- Potassium supports cell wall integrity and disease resistance

## Fungicide Application Guidelines

When cultural methods are insufficient, fungicides can help manage foliar diseases:

1. **Scout first**: Confirm the disease and assess severity before spraying
2. **Act early**: Fungicides are most effective preventively or at first symptom appearance
3. **Cover completely**: Ensure thorough coverage of leaf undersides where spores germinate
4. **Rotate modes of action**: Prevents fungicide resistance development
5. **Observe pre-harvest intervals**: Always follow label restrictions

## Record Keeping

Document all disease observations, spray applications, and yield outcomes. Good records allow you to identify patterns over multiple seasons and refine your management approach year by year.`,
        excerpt:
          "A systematic approach to vegetable disease management — using the disease triangle framework, cultural practices, smart irrigation, and evidence-based fungicide use.",
        cover_image_url:
          "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800",
        source: "EXTERNAL",
        external_url: "https://extension.umn.edu/vegetables/disease-management",
        tags: ["vegetable crops", "disease management", "fungicide", "cultural practices"],
        published: true,
        created_at: new Date(Date.now() - 86400000 * 1),
        updated_at: new Date(Date.now() - 86400000 * 1),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "articles",
      {
        title: ARTICLE_TITLES,
      },
      {}
    );
  },
};
