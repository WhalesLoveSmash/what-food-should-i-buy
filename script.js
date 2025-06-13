const healthSlider = document.getElementById("health-slider");
const healthLabel = document.getElementById("health-label");
const resultsDiv = document.getElementById("results");

const groceryOptions = {
  "Degenerate": ["Frozen Pizza", "Chips", "Soda", "Instant Noodles", "Ice Cream"],
  "Lazy": ["Bread", "Cheese", "Deli Meat", "Microwave Meals", "Juice"],
  "Average": ["Chicken Breast", "Rice", "Broccoli", "Eggs", "Yogurt"],
  "Can Cook": ["Salmon", "Quinoa", "Spinach", "Avocado", "Sweet Potatoes"],
  "Immortal": ["Kale", "Chia Seeds", "Almond Butter", "Organic Veggies", "Salmon"]
};

const mealIdeas = {
  "Degenerate": ["Microwave pizza", "Instant noodles", "Chips and dip"],
  "Lazy": ["Sandwiches", "Salad bowl", "Rotisserie chicken"],
  "Average": ["Grilled chicken with rice", "Veggie stir-fry", "Omelette"],
  "Can Cook": ["Salmon quinoa bowl", "Sweet potato and spinach salad", "Avocado toast"],
  "Immortal": ["Chia seed pudding", "Kale smoothie", "Organic veggie stir-fry"]
};

healthSlider.addEventListener("input", () => {
  const val = healthSlider.value;
  if (val < 20) {
    healthLabel.textContent = "Degenerate";
  } else if (val < 40) {
    healthLabel.textContent = "Lazy";
  } else if (val < 60) {
    healthLabel.textContent = "Average";
  } else if (val < 80) {
    healthLabel.textContent = "Can Cook";
  } else {
    healthLabel.textContent = "Immortal";
  }
});

document.getElementById("submit-btn").addEventListener("click", () => {
  const budget = document.getElementById("budget").value || "No budget set";
  const health = healthLabel.textContent;
  const notes = document.getElementById("notes").value || "No extra notes";

  const groceries = groceryOptions[health];
  const meals = mealIdeas[health];

  const groceryListHTML = groceries.map(item => `<li>${item}</li>`).join("");
  const mealListHTML = meals.map(item => `<li>${item}</li>`).join("");

  resultsDiv.innerHTML = `
    <h2>Suggested Grocery List (Budget: ${budget})</h2>
    <ul>${groceryListHTML}</ul>
    <h2>Meal Ideas</h2>
    <ul>${mealListHTML}</ul>
    <p><em>Notes: ${notes}</em></p>
  `;
});