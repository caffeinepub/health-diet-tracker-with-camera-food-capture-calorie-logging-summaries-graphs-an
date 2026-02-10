// Local food nutrition database with ~50 common Indian + global foods
// All values are per 100g

export interface FoodNutrition {
  name: string;
  category: 'indian' | 'global' | 'protein' | 'grain' | 'vegetable' | 'fruit' | 'dairy' | 'snack';
  keywords: string[]; // For matching
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
    sugar: number;
  };
}

export const FOOD_DATABASE: FoodNutrition[] = [
  // Indian Foods
  {
    name: 'Roti (Whole Wheat)',
    category: 'indian',
    keywords: ['roti', 'chapati', 'wheat', 'bread', 'flatbread'],
    per100g: { calories: 297, protein: 11, carbs: 51, fat: 7, fiber: 7, sodium: 450, sugar: 2 }
  },
  {
    name: 'White Rice (Cooked)',
    category: 'indian',
    keywords: ['rice', 'white rice', 'steamed rice', 'basmati'],
    per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sodium: 1, sugar: 0.1 }
  },
  {
    name: 'Dal (Lentils)',
    category: 'indian',
    keywords: ['dal', 'lentil', 'daal', 'pulse', 'legume'],
    per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8, sodium: 238, sugar: 2 }
  },
  {
    name: 'Paneer',
    category: 'indian',
    keywords: ['paneer', 'cottage cheese', 'indian cheese'],
    per100g: { calories: 265, protein: 18, carbs: 1.2, fat: 20, fiber: 0, sodium: 18, sugar: 1.2 }
  },
  {
    name: 'Chicken Curry',
    category: 'indian',
    keywords: ['chicken curry', 'curry', 'chicken', 'masala'],
    per100g: { calories: 165, protein: 15, carbs: 8, fat: 9, fiber: 2, sodium: 450, sugar: 3 }
  },
  {
    name: 'Samosa',
    category: 'indian',
    keywords: ['samosa', 'fried', 'snack', 'pastry'],
    per100g: { calories: 262, protein: 5, carbs: 28, fat: 15, fiber: 3, sodium: 420, sugar: 2 }
  },
  {
    name: 'Idli',
    category: 'indian',
    keywords: ['idli', 'steamed', 'rice cake', 'south indian'],
    per100g: { calories: 156, protein: 4, carbs: 30, fat: 2, fiber: 1, sodium: 65, sugar: 1 }
  },
  {
    name: 'Dosa',
    category: 'indian',
    keywords: ['dosa', 'crepe', 'south indian', 'fermented'],
    per100g: { calories: 168, protein: 4, carbs: 28, fat: 4, fiber: 2, sodium: 155, sugar: 1 }
  },
  {
    name: 'Biryani',
    category: 'indian',
    keywords: ['biryani', 'rice', 'spiced rice', 'pulao'],
    per100g: { calories: 185, protein: 7, carbs: 28, fat: 5, fiber: 2, sodium: 380, sugar: 2 }
  },
  {
    name: 'Aloo Gobi',
    category: 'indian',
    keywords: ['aloo gobi', 'potato', 'cauliflower', 'vegetable'],
    per100g: { calories: 95, protein: 2, carbs: 15, fat: 3, fiber: 3, sodium: 320, sugar: 3 }
  },
  {
    name: 'Paratha',
    category: 'indian',
    keywords: ['paratha', 'flatbread', 'fried bread', 'stuffed'],
    per100g: { calories: 320, protein: 6, carbs: 42, fat: 14, fiber: 3, sodium: 480, sugar: 2 }
  },
  {
    name: 'Raita',
    category: 'indian',
    keywords: ['raita', 'yogurt', 'curd', 'cucumber'],
    per100g: { calories: 52, protein: 3, carbs: 5, fat: 2, fiber: 0.5, sodium: 45, sugar: 4 }
  },
  
  // Protein Sources
  {
    name: 'Grilled Chicken Breast',
    category: 'protein',
    keywords: ['chicken', 'breast', 'grilled', 'lean meat'],
    per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74, sugar: 0 }
  },
  {
    name: 'Salmon',
    category: 'protein',
    keywords: ['salmon', 'fish', 'seafood', 'omega'],
    per100g: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sodium: 59, sugar: 0 }
  },
  {
    name: 'Eggs (Boiled)',
    category: 'protein',
    keywords: ['egg', 'boiled', 'hard boiled'],
    per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sodium: 124, sugar: 1.1 }
  },
  {
    name: 'Tofu',
    category: 'protein',
    keywords: ['tofu', 'soy', 'bean curd', 'vegetarian'],
    per100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, sodium: 7, sugar: 0.6 }
  },
  {
    name: 'Greek Yogurt',
    category: 'dairy',
    keywords: ['yogurt', 'greek yogurt', 'curd', 'dairy'],
    per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sodium: 36, sugar: 3.2 }
  },
  {
    name: 'Chickpeas (Cooked)',
    category: 'protein',
    keywords: ['chickpea', 'garbanzo', 'chana', 'legume'],
    per100g: { calories: 164, protein: 8.9, carbs: 27, fat: 2.6, fiber: 7.6, sodium: 7, sugar: 4.8 }
  },
  
  // Grains & Carbs
  {
    name: 'Brown Rice (Cooked)',
    category: 'grain',
    keywords: ['brown rice', 'whole grain', 'rice'],
    per100g: { calories: 112, protein: 2.6, carbs: 24, fat: 0.9, fiber: 1.8, sodium: 1, sugar: 0.4 }
  },
  {
    name: 'Quinoa (Cooked)',
    category: 'grain',
    keywords: ['quinoa', 'grain', 'superfood'],
    per100g: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, sodium: 7, sugar: 0.9 }
  },
  {
    name: 'Oats (Cooked)',
    category: 'grain',
    keywords: ['oats', 'oatmeal', 'porridge'],
    per100g: { calories: 71, protein: 2.5, carbs: 12, fat: 1.5, fiber: 1.7, sodium: 49, sugar: 0.3 }
  },
  {
    name: 'Whole Wheat Bread',
    category: 'grain',
    keywords: ['bread', 'wheat bread', 'whole grain'],
    per100g: { calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, sodium: 400, sugar: 5 }
  },
  {
    name: 'Pasta (Cooked)',
    category: 'grain',
    keywords: ['pasta', 'spaghetti', 'noodles'],
    per100g: { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sodium: 1, sugar: 0.6 }
  },
  
  // Vegetables
  {
    name: 'Broccoli',
    category: 'vegetable',
    keywords: ['broccoli', 'green vegetable', 'cruciferous'],
    per100g: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sodium: 33, sugar: 1.7 }
  },
  {
    name: 'Spinach',
    category: 'vegetable',
    keywords: ['spinach', 'leafy green', 'palak'],
    per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sodium: 79, sugar: 0.4 }
  },
  {
    name: 'Potato (Boiled)',
    category: 'vegetable',
    keywords: ['potato', 'aloo', 'boiled'],
    per100g: { calories: 87, protein: 1.9, carbs: 20, fat: 0.1, fiber: 1.8, sodium: 5, sugar: 0.9 }
  },
  {
    name: 'Carrot',
    category: 'vegetable',
    keywords: ['carrot', 'orange vegetable', 'gajar'],
    per100g: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sodium: 69, sugar: 4.7 }
  },
  {
    name: 'Tomato',
    category: 'vegetable',
    keywords: ['tomato', 'red vegetable', 'tamatar'],
    per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sodium: 5, sugar: 2.6 }
  },
  {
    name: 'Cauliflower',
    category: 'vegetable',
    keywords: ['cauliflower', 'gobi', 'white vegetable'],
    per100g: { calories: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2, sodium: 30, sugar: 1.9 }
  },
  {
    name: 'Bell Pepper',
    category: 'vegetable',
    keywords: ['bell pepper', 'capsicum', 'pepper', 'shimla mirch'],
    per100g: { calories: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1, sodium: 4, sugar: 4.2 }
  },
  
  // Fruits
  {
    name: 'Apple',
    category: 'fruit',
    keywords: ['apple', 'fruit', 'seb'],
    per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sodium: 1, sugar: 10 }
  },
  {
    name: 'Banana',
    category: 'fruit',
    keywords: ['banana', 'fruit', 'kela'],
    per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sodium: 1, sugar: 12 }
  },
  {
    name: 'Orange',
    category: 'fruit',
    keywords: ['orange', 'citrus', 'fruit', 'santra'],
    per100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sodium: 0, sugar: 9 }
  },
  {
    name: 'Mango',
    category: 'fruit',
    keywords: ['mango', 'fruit', 'aam'],
    per100g: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6, sodium: 1, sugar: 14 }
  },
  {
    name: 'Grapes',
    category: 'fruit',
    keywords: ['grape', 'fruit', 'angoor'],
    per100g: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2, fiber: 0.9, sodium: 2, sugar: 16 }
  },
  {
    name: 'Watermelon',
    category: 'fruit',
    keywords: ['watermelon', 'melon', 'fruit', 'tarbooz'],
    per100g: { calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, sodium: 1, sugar: 6 }
  },
  
  // Dairy
  {
    name: 'Milk (Whole)',
    category: 'dairy',
    keywords: ['milk', 'dairy', 'doodh'],
    per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sodium: 44, sugar: 5.1 }
  },
  {
    name: 'Cheddar Cheese',
    category: 'dairy',
    keywords: ['cheese', 'cheddar', 'dairy'],
    per100g: { calories: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sodium: 621, sugar: 0.5 }
  },
  {
    name: 'Butter',
    category: 'dairy',
    keywords: ['butter', 'dairy', 'makhan'],
    per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sodium: 11, sugar: 0.1 }
  },
  
  // Snacks & Others
  {
    name: 'Almonds',
    category: 'snack',
    keywords: ['almond', 'nut', 'badam'],
    per100g: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sodium: 1, sugar: 4.4 }
  },
  {
    name: 'Peanuts',
    category: 'snack',
    keywords: ['peanut', 'nut', 'moongfali'],
    per100g: { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, sodium: 18, sugar: 4 }
  },
  {
    name: 'Pizza (Cheese)',
    category: 'global',
    keywords: ['pizza', 'cheese pizza', 'italian'],
    per100g: { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, sodium: 598, sugar: 3.6 }
  },
  {
    name: 'Burger',
    category: 'global',
    keywords: ['burger', 'hamburger', 'fast food'],
    per100g: { calories: 295, protein: 17, carbs: 24, fat: 14, fiber: 1.5, sodium: 497, sugar: 5 }
  },
  {
    name: 'French Fries',
    category: 'global',
    keywords: ['fries', 'french fries', 'potato', 'fried'],
    per100g: { calories: 312, protein: 3.4, carbs: 41, fat: 15, fiber: 3.8, sodium: 210, sugar: 0.3 }
  },
  {
    name: 'Sandwich (Vegetable)',
    category: 'global',
    keywords: ['sandwich', 'bread', 'vegetable'],
    per100g: { calories: 230, protein: 8, carbs: 32, fat: 7, fiber: 4, sodium: 450, sugar: 4 }
  },
  {
    name: 'Salad (Mixed Green)',
    category: 'global',
    keywords: ['salad', 'green salad', 'vegetable', 'lettuce'],
    per100g: { calories: 33, protein: 2.5, carbs: 6, fat: 0.3, fiber: 2.1, sodium: 65, sugar: 2.3 }
  },
  {
    name: 'Soup (Vegetable)',
    category: 'global',
    keywords: ['soup', 'vegetable soup', 'broth'],
    per100g: { calories: 48, protein: 1.5, carbs: 9, fat: 0.8, fiber: 1.5, sodium: 380, sugar: 3 }
  },
  {
    name: 'Chocolate (Dark)',
    category: 'snack',
    keywords: ['chocolate', 'dark chocolate', 'cocoa'],
    per100g: { calories: 546, protein: 5, carbs: 61, fat: 31, fiber: 7, sodium: 24, sugar: 48 }
  },
  {
    name: 'Ice Cream',
    category: 'snack',
    keywords: ['ice cream', 'dessert', 'frozen'],
    per100g: { calories: 207, protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, sodium: 80, sugar: 21 }
  },
];

// Generic fallback for unknown foods
export const GENERIC_FOOD: FoodNutrition = {
  name: 'Mixed Food',
  category: 'global',
  keywords: ['food', 'meal', 'dish'],
  per100g: { calories: 150, protein: 8, carbs: 20, fat: 5, fiber: 2, sodium: 200, sugar: 3 }
};
