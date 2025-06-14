// Example datasets for suggestions and recipes
const ALL_FOOD_SUGGESTIONS = [
  { name: "Chicken Breast", price: 6, healthy: true },
  { name: "Salmon Fillet", price: 8, healthy: true },
  { name: "Broccoli", price: 2, healthy: true },
  { name: "Spinach", price: 2, healthy: true },
  { name: "Brown Rice", price: 3, healthy: true },
  { name: "Quinoa", price: 4, healthy: true },
  { name: "Sweet Potato", price: 3, healthy: true },
  { name: "Greek Yogurt", price: 5, healthy: true },
  { name: "Almonds (small pack)", price: 7, healthy: true },
  { name: "Eggs (dozen)", price: 4, healthy: true },
  { name: "Tofu", price: 3, healthy: true },
  { name: "Apples", price: 2, healthy: true },
  { name: "Bananas", price: 1, healthy: true },
  { name: "Cheese", price: 5, healthy: false },
  { name: "Bread (whole wheat)", price: 3, healthy: false },
  { name: "Carrot", price: 1, healthy: true },
  { name: "Chocolate Bar", price: 3, healthy: false },
  { name: "Ice Cream", price: 4, healthy: false },
  { name: "Peanut Butter", price: 4, healthy: true },
  { name: "Oats", price: 3, healthy: true },
];

const ALL_RECIPES = [
  {
    title: "Grilled Chicken with Quinoa Salad",
    ingredients: ["Chicken Breast", "Quinoa", "Spinach", "Lemon", "Olive Oil"],
    description:
      "A healthy and flavorful grilled chicken served with a refreshing quinoa salad.",
  },
  {
    title: "Salmon and Sweet Potato Bake",
    ingredients: ["Salmon Fillet", "Sweet Potato", "Broccoli", "Garlic", "Herbs"],
    description:
      "Oven-baked salmon paired with roasted sweet potatoes and broccoli for a balanced meal.",
  },
  {
    title: "Vegetarian Stir-Fry with Tofu",
    ingredients: ["Tofu", "Broccoli", "Carrot", "Soy Sauce", "Brown Rice"],
    description:
      "A quick and tasty vegetarian stir-fry loaded with fresh vegetables and tofu.",
  },
  {
    title: "Greek Yogurt and Almond Parfait",
    ingredients: ["Greek Yogurt", "Almonds", "Honey", "Berries"],
    description:
      "A creamy and crunchy parfait perfect for breakfast or a healthy snack.",
  },
  {
    title: "Oatmeal with Bananas and Peanut Butter",
    ingredients: ["Oats", "Bananas", "Peanut Butter", "Cinnamon"],
    description:
      "Warm and comforting oatmeal topped with bananas and peanut butter for energy.",
  },
];

// A helper function to filter suggestions by healthiness preference
function filterSuggestionsByHealthiness(suggestions, preference) {
  if (preference === "healthy") {
    return suggestions.filter((f) => f.healthy);
  } else if (preference === "indulgent") {
    return suggestions.filter((f) => !f.healthy);
  }
  return suggestions; // balanced
}

// Generate food suggestions based on budget and preference
function generateSuggestions(budget, healthPref, notes) {
  const filtered = filterSuggestionsByHealthiness(ALL_FOOD_SUGGESTIONS, healthPref);

  // If notes mention 'scared of vegetables', filter out most vegetables but keep some easy ones
  let vegBlacklist = [];
  if (notes.toLowerCase().includes("scared of vegetables")) {
    vegBlacklist = ["Broccoli", "Spinach", "Carrot"];
  }

  const filteredNoVeg = filtered.filter((food) => !vegBlacklist.includes(food.name));

  // Pick as many items as possible without exceeding budget - greedily cheapest first
  let remainingBudget = budget;
  let chosen = [];

  // Sort cheapest first for max variety
  const sorted = filteredNoVeg.sort((a, b) => a.price - b.price);

  for (const food of sorted) {
    if (food.price <= remainingBudget) {
      chosen.push(food);
      remainingBudget -= food.price;
    }
  }

  return chosen;
}

// Generate recipe cards that can be made from chosen foods (matching at least 1 ingredient)
function generateRecipes(chosenFoods) {
  const chosenNames = chosenFoods.map((f) => f.name);

  // Find recipes that have at least one ingredient from chosen foods
  const matchingRecipes = ALL_RECIPES.filter((recipe) =>
    recipe.ingredients.some((ing) => chosenNames.includes(ing))
  );

  // Limit recipes to max 4 so not overwhelming
  return matchingRecipes.slice(0, 4);
}

function createFoodCard(food) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<h3>${food.name}</h3><p>Approx. Price: $${food.price}</p>`;
  return div;
}

function createRecipeCard(recipe) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `<h3>${recipe.title}</h3><p>${recipe.description}</p><p class="ingredients">Ingredients: ${recipe.ingredients.join(", ")}</p>`;
  return div;
}

function renderOutput(suggestions, recipes) {
  const output = document.getElementById("output");
  output.innerHTML = "";

  if (suggestions.length === 0) {
    output.textContent = "Sorry, no suggestions fit your budget and preferences.";
    return;
  }

  // Section: Suggestions
  const sugTitle = document.createElement("h2");
  sugTitle.textContent = "Food Suggestions for You";
  output.appendChild(sugTitle);

  const sugScroll = document.createElement("div");
  sugScroll.className = "scroll-container";

  suggestions.forEach((food) => {
    sugScroll.appendChild(createFoodCard(food));
  });

  output.appendChild(sugScroll);

  // Section: Recipes
  if (recipes.length > 0) {
    const recTitle = document.createElement("h2");
    recTitle.textContent = "Try These Recipes";
    output.appendChild(recTitle);

    const recScroll = document.createElement("div");
    recScroll.className = "scroll-container";

    recipes.forEach((recipe) => {
      recScroll.appendChild(createRecipeCard(recipe));
    });

    output.appendChild(recScroll);
  }
}

document.getElementById("foodForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const budget = Number(document.getElementById("budget").value);
  const healthPref = document.getElementById("healthPref").value;
  const notes = document.getElementById("notes").value.trim();

  const suggestions = generateSuggestions(budget, healthPref, notes);
  const recipes = generateRecipes(suggestions);

  renderOutput(suggestions, recipes);
});