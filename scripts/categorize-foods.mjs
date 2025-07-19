import fs from 'fs';
import path from 'path';

// Define the 12 food sub-categories with their descriptions
const FOOD_CATEGORIES = {
  'soups_stews': {
    name: 'Soups & Stews',
    description: 'Hearty and comforting liquid-based dishes, often served hot and containing a mix of meats, seafood, or vegetables.',
    examples: ['Sea Prune Stew', 'Five-Flavor Soup', 'Mudfish Stew', 'Beetle-Worm Soup', 'Blood Soup', 'Sea Squid Soup', 'Seaweed Stew', 'Two-Headed Fish Soup', 'Sea Soup', 'Dumpling Weed Soup', 'Jook', 'Noodle Soup']
  },
  'noodles_dumplings': {
    name: 'Noodles & Dumplings',
    description: 'Dishes centered around flour or rice-based noodles and dough-wrapped fillings, served in broth or fried.',
    examples: ['Seaweed Noodles', 'Dragon Dumplings', 'Air Nomad Dumplings', 'Steamed Dumplings', 'Spiral-Shaped Noodles', 'Noodles', 'Cabbage Noodles', 'Dumplings']
  },
  'baked_goods_pastries': {
    name: 'Baked Goods & Pastries',
    description: 'Savory or sweet items cooked in an oven, typically made from flour dough. Includes pies, tarts, and buns.',
    examples: ['Egg Custard Tart', 'Candied Jackfruit Pie', 'Sweet Buns', 'Seaweed Bread', 'Sweet Red Bean Cake', 'Tart Pie', 'Toast', 'Sweet Rice', 'Fruit Pie', 'Fruit Tart']
  },
  'cookies_biscuits': {
    name: 'Cookies & Biscuits',
    description: 'Small, sweet, or savory baked items, typically flat and crisp. Perfect for snacks or light desserts.',
    examples: ['Blueberry Cookies', 'Sky Bison Biscuits', 'Kale Cookies & Seaweed Cookies', 'Macaroon', 'Fire Cakes']
  },
  'cakes_decadent_desserts': {
    name: 'Cakes & Decadent Desserts',
    description: 'Rich, sweet confections, often served as a final course. Includes cakes, puddings, and frozen treats.',
    examples: ['Mochi', 'Cotton Candy', 'Lychee Nut Ice Smoothie', 'Moon Peach', 'Jennamite (Creeping Crystal)']
  },
  'roasted_grilled_meats': {
    name: 'Roasted & Grilled Meats',
    description: 'Dishes where meat is the central ingredient, cooked over an open flame, roasted, or grilled on skewers.',
    examples: ['Roast Duck', 'Bison Steak', 'Smoked Arctic Hen', 'Puffin-Seal Sausages', 'Braised Turtle Duck', 'Foggy Swamp Chicken', 'Meat Kebabs', 'Hippo-Ox Tail Skewers', 'Smoked Sea Slug']
  },
  'seafood_fish': {
    name: 'Seafood & Fish',
    description: 'Dishes featuring ingredients sourced from oceans, rivers, and lakes, including fish, crustaceans, and mollusks.',
    examples: ['Crab Urchin Stir-Fry', 'Fish Cakes', 'Pickled Fish', 'Sushi', 'Dried Fish', 'Salmon Jerky', 'Fertilized Turtle Duck Egg']
  },
  'vegetarian_dishes': {
    name: 'Vegetarian Dishes',
    description: 'Prepared meals that are strictly plant-based, featuring vegetables, grains, and tofu as the main components.',
    examples: ['Tofu Curry', 'Steamed Vegetables', 'Kale Wraps', 'Mung Bean & Tofu Curry', 'Tofu and Bean Sprouts', 'Steamed Tofu', 'Tofu (Fried Puffs)', 'Kale Smoothie', 'Roasted Seaweed', 'Nuts', 'Tsampa', 'Misty Palms Special Rice']
  },
  'street_food_snacks': {
    name: 'Street Food & Snacks',
    description: 'Convenient, often handheld foods perfect for eating on the go. Includes fried items, flakes, and skewered snacks.',
    examples: ['Flaming Fire Flakes', 'Fried Fish Balls on a Stick', 'Fried Foods on Sticks', 'Sizzle-Crisps', 'Unfried Dough', 'Rice Ball', 'Fire Gummies', 'Hotcakes']
  },
  'spicy_foods': {
    name: 'Spicy Foods',
    description: 'Dishes and drinks characterized by their intense heat, often using chili and other potent spices.',
    examples: ['Azula\'s Lightning', 'The Firebending Masters', 'Spicy Pickled Kelp', 'Superspicy Soufflé', 'Dragon Dumplings', 'Flaming Fire Flakes', 'Fire Cakes', 'Fire Gummies']
  },
  'teas_juices': {
    name: 'Teas & Juices',
    description: 'Non-alcoholic beverages, including brewed teas, fruit juices, and unique cleansing concoctions.',
    examples: ['Bubble Tea', 'Cactus Juice', 'Onion-Banana Juice', 'Spirit Oasis Tea', 'Butter Tea', 'Air Nomad Style Tea', 'Fire Nation Tea', 'Chi-Enhancing Tea', 'Lychee Juice', 'Wine']
  },
  'preserved_travel_foods': {
    name: 'Preserved & Travel Foods',
    description: 'Items prepared for long-term storage, making them ideal for warriors, adventurers, and long journeys.',
    examples: ['Blubbered Seal Jerky', 'Freeze-Dried Cucumberquats', 'Komodo Jerky', 'Tea Eggs', 'Salmon Jerky', 'Dried Fish', 'Pickled Fish']
  }
};

// Map each food item to its appropriate category(ies)
const FOOD_CATEGORIZATION = {
  // Soups & Stews
  'sea-prune-stew': ['soups_stews'],
  'five-flavor-soup': ['soups_stews'],
  'mudfish-stew': ['soups_stews'],
  'beetle-worm-soup': ['soups_stews'],
  'blood-soup': ['soups_stews'],
  'bark-onion-soup': ['soups_stews'],
  'sea-squid-soup': ['soups_stews'],
  'seaweed-stew': ['soups_stews'],
  'two-headed-fish-soup': ['soups_stews'],
  'sea-soup': ['soups_stews'],
  'dumpling-weed-soup': ['soups_stews'],
  'jook': ['soups_stews'],
  'noodle-soup': ['soups_stews'],
  
  // Noodles & Dumplings
  'seaweed-noodles': ['noodles_dumplings'],
  'dragon-dumplings': ['noodles_dumplings'],
  'air-nomad-dumplings': ['noodles_dumplings'],
  'steamed-dumplings': ['noodles_dumplings'],
  'spiral-shaped-noodles': ['noodles_dumplings'],
  'noodles': ['noodles_dumplings'],
  'cabbage-noodles': ['noodles_dumplings'],
  'dumplings': ['noodles_dumplings'],
  
  // Baked Goods & Pastries
  'egg-custard-tart': ['baked_goods_pastries'],
  'candied-jackfruit-pie': ['baked_goods_pastries'],
  'sweet-buns': ['baked_goods_pastries'],
  'seaweed-bread': ['baked_goods_pastries'],
  'sweet-red-bean-cake': ['baked_goods_pastries'],
  'tart-pie': ['baked_goods_pastries'],
  'toast': ['baked_goods_pastries'],
  'sweet-rice': ['baked_goods_pastries'],
  'fruit-pie': ['baked_goods_pastries'],
  'fruit-tart': ['baked_goods_pastries'],
  
  // Cookies & Biscuits
  'blueberry-cookies': ['cookies_biscuits'],
  'sky-bison-biscuits': ['cookies_biscuits'],
  'kale-cookies-seaweed-cookies': ['cookies_biscuits'],
  'macaroon': ['cookies_biscuits'],
  'fire-cakes': ['cookies_biscuits'],
  
  // Cakes & Decadent Desserts
  'mochi': ['cakes_decadent_desserts'],
  'cotton-candy': ['cakes_decadent_desserts'],
  'lychee-nut-ice-smoothie': ['cakes_decadent_desserts'],
  'moon-peach': ['cakes_decadent_desserts'],
  'jennamite': ['cakes_decadent_desserts'],
  'jennamite-creeping-crystal': ['cakes_decadent_desserts'],
  'yue-s-mooncakes': ['cakes_decadent_desserts'],
  
  // Roasted & Grilled Meats
  'roast-duck': ['roasted_grilled_meats'],
  'bison-steak': ['roasted_grilled_meats'],
  'smoked-arctic-hen': ['roasted_grilled_meats'],
  'puffin-seal-sausages': ['roasted_grilled_meats'],
  'braised-turtle-duck': ['roasted_grilled_meats'],
  'foggy-swamp-chicken': ['roasted_grilled_meats'],
  'meat-kebabs': ['roasted_grilled_meats'],
  'hippo-ox-tail-skewers': ['roasted_grilled_meats'],
  'smoked-sea-slug': ['roasted_grilled_meats'],
  
  // Seafood & Fish
  'crab-urchin-stir-fry': ['seafood_fish'],
  'fish-cakes': ['seafood_fish'],
  'pickled-fish': ['seafood_fish'],
  'sushi': ['seafood_fish'],
  'dried-fish': ['seafood_fish'],
  'salmon-jerky': ['seafood_fish'],
  'fertilized-turtle-duck-egg': ['seafood_fish'],
  
  // Vegetarian Dishes
  'tofu-curry': ['vegetarian_dishes'],
  'steamed-vegetables': ['vegetarian_dishes'],
  'kale-wraps': ['vegetarian_dishes'],
  'mung-bean-tofu-curry': ['vegetarian_dishes'],
  'tofu-and-bean-sprouts': ['vegetarian_dishes'],
  'steamed-tofu': ['vegetarian_dishes'],
  'tofu-fried-puffs': ['vegetarian_dishes'],
  'kale-smoothie': ['vegetarian_dishes'],
  'roasted-seaweed': ['vegetarian_dishes'],
  'nuts': ['vegetarian_dishes'],
  'tsampa': ['vegetarian_dishes'],
  'misty-palms-special-rice': ['vegetarian_dishes'],
  
  // Street Food & Snacks
  'flaming-fire-flakes': ['street_food_snacks'],
  'fried-fish-balls': ['street_food_snacks'],
  'fried-fish-balls-on-a-stick': ['street_food_snacks'],
  'fried-foods-on-sticks': ['street_food_snacks'],
  'sizzle-crisps': ['street_food_snacks'],
  'unfried-dough': ['street_food_snacks'],
  'rice-ball': ['street_food_snacks'],
  'fire-gummies': ['street_food_snacks'],
  'hotcakes': ['street_food_snacks'],
  
  // Spicy Foods
  'azula-lightning': ['spicy_foods'],
  'azula-s-lightning': ['spicy_foods'],
  'firebending-masters': ['spicy_foods'],
  'the-firebending-masters': ['spicy_foods'],
  'spicy-pickled-kelp': ['spicy_foods'],
  'superspicy-souffle': ['spicy_foods'],
  'superspicy-souffl': ['spicy_foods'],
  'dragon-dumplings': ['spicy_foods'],
  'flaming-fire-flakes': ['spicy_foods'],
  'fire-cakes': ['spicy_foods'],
  'fire-gummies': ['spicy_foods'],
  
  // Teas & Juices
  'bubble-tea': ['teas_juices'],
  'cactus-juice': ['teas_juices'],
  'onion-banana-juice': ['teas_juices'],
  'spirit-oasis-tea': ['teas_juices'],
  'butter-tea': ['teas_juices'],
  'air-nomad-style-tea': ['teas_juices'],
  'fire-nation-tea': ['teas_juices'],
  'chi-enhancing-tea': ['teas_juices'],
  'lychee-juice': ['teas_juices'],
  'wine': ['teas_juices'],
  'sorghum-liquor': ['teas_juices'],
  'tea-sandwich': ['baked_goods_pastries'],
  
  // Preserved & Travel Foods
  'blubbered-seal-jerky': ['preserved_travel_foods'],
  'freeze-dried-cucumberquats': ['preserved_travel_foods'],
  'komodo-jerky': ['preserved_travel_foods'],
  'tea-eggs': ['preserved_travel_foods'],
  'salmon-jerky': ['preserved_travel_foods'],
  'dried-fish': ['preserved_travel_foods'],
  'pickled-fish': ['preserved_travel_foods']
};

// Helper function to generate slug from name
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Process all food files and update them with category tags
function updateFoodFiles() {
  const foodDir = 'raw-data/foods';
  const files = fs.readdirSync(foodDir).filter(file => file.endsWith('.md') && !file.includes('template'));
  
  console.log(`Processing ${files.length} food files...`);
  
  let updatedCount = 0;
  let missingCount = 0;
  
  for (const file of files) {
    const filePath = path.join(foodDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract the food name from the markdown header
    const nameMatch = content.match(/^#\s*[^#]*?([^#\n]+)/m);
    if (!nameMatch) {
      console.log(`⚠️  Could not extract name from ${file}`);
      continue;
    }
    
    const foodName = nameMatch[1].trim();
    const slug = generateSlug(foodName);
    
    // Find categories for this food
    const categories = FOOD_CATEGORIZATION[slug] || [];
    
    if (categories.length === 0) {
      console.log(`❌ No categories found for: ${foodName} (slug: ${slug})`);
      missingCount++;
      continue;
    }
    
    // Update the JSON blocks with category information
    let updatedContent = content;
    
    // Add category tags to the first JSON block (the main metadata block)
    const jsonBlockRegex = /```json\n([\s\S]*?)\n```/g;
    let jsonBlockCount = 0;
    
    updatedContent = updatedContent.replace(jsonBlockRegex, (match, jsonContent, offset) => {
      jsonBlockCount++;
      
      // Only update the first JSON block (main metadata)
      if (jsonBlockCount === 1) {
        try {
          const jsonData = JSON.parse(jsonContent);
          
          // Add category information
          jsonData.category = categories[0]; // Primary category
          jsonData.categories = categories; // All categories
          jsonData.foodType = FOOD_CATEGORIES[categories[0]]?.name || categories[0];
          
          // Update tags to include category tags
          if (!jsonData.tags) jsonData.tags = [];
          categories.forEach(cat => {
            const catTag = cat; // Keep original format
            if (!jsonData.tags.includes(catTag)) {
              jsonData.tags.push(catTag);
            }
          });
          
          return '```json\n' + JSON.stringify(jsonData, null, 2) + '\n```';
        } catch (error) {
          console.log(`⚠️  Error parsing JSON in ${file}: ${error.message}`);
          return match;
        }
      }
      
      return match;
    });
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Updated ${foodName} with categories: ${categories.join(', ')}`);
    updatedCount++;
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✅ Updated: ${updatedCount} files`);
  console.log(`❌ Missing categories: ${missingCount} files`);
  
  // List foods that need manual categorization
  if (missingCount > 0) {
    console.log(`\n🔍 Foods needing manual categorization:`);
    for (const file of files) {
      const filePath = path.join(foodDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const nameMatch = content.match(/^#\s*[^#]*?([^#\n]+)/m);
      if (nameMatch) {
        const foodName = nameMatch[1].trim();
        const slug = generateSlug(foodName);
        if (!FOOD_CATEGORIZATION[slug]) {
          console.log(`  - ${foodName} (slug: ${slug})`);
        }
      }
    }
  }
}

// Run the update
updateFoodFiles(); 