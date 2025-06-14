// Wait for DOM ready
document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('food-form');
  const submitBtn = document.getElementById('submit-btn');
  const resultsDiv = document.getElementById('results');
  const budgetInput = document.getElementById('budget');
  const healthSlider = document.getElementById('health-slider');
  const healthLabel = document.getElementById('health-label');
  const notesInput = document.getElementById('notes');

  // Update health label dynamically
  healthSlider.addEventListener('input', () => {
    const val = parseInt(healthSlider.value);
    if (val <= 33) healthLabel.textContent = 'Unhealthy';
    else if (val <= 66) healthLabel.textContent = 'Average';
    else healthLabel.textContent = 'Healthy';

    // On mobile, hide number keyboard if open on budget input
    if (document.activeElement === budgetInput) {
      budgetInput.blur();
    }
  });

  // Smooth scroll into view when notes textarea focused (mobile-friendly)
  notesInput.addEventListener('focus', () => {
    setTimeout(() => {
      notesInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  });

  // Fake food detection for demo — Replace with your real detection logic
  // For now, just return a fixed array for testing
  function detectFoodsFromImages() {
    // You can read from the file input, run vision API, etc.
    // For now, pretend we detected:
    return ['cheese', 'bread', 'carrot'];
  }

  // Mock suggestion generation based on inputs
  // You can replace this with AI or API calls
  function generateSuggestions(budget, healthiness, notes) {
    // Suggest food items based on budget and healthiness
    // We'll pick some items depending on healthiness preference
    const healthyFoods = ['fresh vegetables', 'lean proteins', 'whole grains', 'fruits', 'nuts'];
    const averageFoods = ['pasta', 'chicken', 'rice', 'cheese', 'eggs'];
    const unhealthyFoods = ['snacks', 'processed meats', 'soda', 'chips'];

    let chosenFoods;
    if (healthiness > 66) chosenFoods = healthyFoods;
    else if (healthiness > 33) chosenFoods = averageFoods;
    else chosenFoods = unhealthyFoods;

    // Calculate approx number of items user can buy for the budget
    // Just a rough guess: average cost $3 per item
    const maxItems = Math.min(chosenFoods.length, Math.floor(budget / 3));

    return chosenFoods.slice(0, maxItems);
  }

  // Mock recipe generation
  function generateRecipes() {
    return [
      {
        title: 'Veggie Stir Fry',
        ingredients: ['Broccoli', 'Carrots', 'Bell Peppers', 'Soy Sauce', 'Garlic'],
        instructions: 'Chop vegetables. Heat oil in a pan. Stir fry veggies until tender. Add soy sauce and garlic. Serve over rice.'
      },
      {
        title: 'Chicken and Rice Bowl',
        ingredients: ['Chicken Breast', 'Rice', 'Mixed Vegetables', 'Teriyaki Sauce'],
        instructions: 'Cook rice. Grill chicken. Steam vegetables. Combine and drizzle with teriyaki sauce.'
      },
      {
        title: 'Fruit & Nut Salad',
        ingredients: ['Mixed Greens', 'Apple Slices', 'Walnuts', 'Cranberries', 'Feta Cheese'],
        instructions: 'Mix greens with apple slices, walnuts, and cranberries. Top with feta cheese and a light vinaigrette.'
      }
    ];
  }

  // Clear previous results and build new output UI
  function displayResults(suggestions, recipes, budget, healthinessText, notes) {
    resultsDiv.innerHTML = '';

    // Main heading for suggestions
    const sugTitle = document.createElement('h2');
    sugTitle.textContent = 'Suggested Food to Buy';
    sugTitle.className = 'results-section-title';
    resultsDiv.appendChild(sugTitle);

    // Suggestions horizontal scroll container
    const sugContainer = document.createElement('div');
    sugContainer.className = 'horizontal-scroll-container';
    suggestions.forEach(food => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.textContent = food;
      sugContainer.appendChild(card);
    });
    resultsDiv.appendChild(sugContainer);

    // Budget + healthiness + notes summary below suggestions
    const summary = document.createElement('p');
    summary.style.marginTop = '15px';
    summary.style.fontStyle = 'italic';
    summary.style.color = '#ade8f4';
    summary.textContent = `Budget: $${budget} · Healthiness preference: ${healthinessText} · Notes: ${notes || 'None'}`;
    resultsDiv.appendChild(summary);

    // Recipes section
    const recTitle = document.createElement('h2');
    recTitle.textContent = 'Recommended Recipes';
    recTitle.className = 'results-section-title';
    resultsDiv.appendChild(recTitle);

    // Recipes horizontal scroll container
    const recContainer = document.createElement('div');
    recContainer.className = 'horizontal-scroll-container';
    recipes.forEach(recipe => {
      const recCard = document.createElement('div');
      recCard.className = 'recipe-card';

      const title = document.createElement('h4');
      title.textContent = recipe.title;
      recCard.appendChild(title);

      const ingr = document.createElement('div');
      ingr.className = 'recipe-ingredients';
      ingr.textContent = 'Ingredients: ' + recipe.ingredients.join(', ');
      recCard.appendChild(ingr);

      const instr = document.createElement('div');
      instr.className = 'recipe-instructions';
      instr.textContent = recipe.instructions;
      recCard.appendChild(instr);

      recContainer.appendChild(recCard);
    });
    resultsDiv.appendChild(recContainer);
  }

  // Determine healthiness text label from slider value
  function getHealthinessText(val) {
    if (val <= 33) return 'Unhealthy';
    else if (val <= 66) return 'Average';
    else return 'Healthy';
  }

  // Main event handler for submit button
  submitBtn.addEventListener('click', () => {
    // Get inputs
    const budgetVal = parseFloat(budgetInput.value) || 0;
    const healthVal = parseInt(healthSlider.value);
    const notesVal = notesInput.value.trim();

    // Detect foods from images (mocked)
    const detectedFoods = detectFoodsFromImages();

    // Generate suggestions based on inputs
    const suggestions = generateSuggestions(budgetVal, healthVal, notesVal);

    // Generate recipes (mocked)
    const recipes = generateRecipes();

    // Display results
    displayResults(suggestions, recipes, budgetVal, getHealthinessText(healthVal), notesVal);
  });
});