document.addEventListener('DOMContentLoaded', () => {
  const imageUpload = document.getElementById('image-upload');
  const budgetInput = document.getElementById('budget');
  const healthSlider = document.getElementById('health-slider');
  const healthLabel = document.getElementById('health-label');
  const notesInput = document.getElementById('notes');
  const submitBtn = document.getElementById('submit-btn');
  const resultsDiv = document.getElementById('results');

  // Update health label text dynamically as slider moves
  healthSlider.addEventListener('input', () => {
    const val = parseInt(healthSlider.value, 10);
    if (val <= 33) healthLabel.textContent = 'Unhealthy';
    else if (val <= 66) healthLabel.textContent = 'Average';
    else healthLabel.textContent = 'Healthy';
  });

  // Convert numeric health slider value to descriptive text
  function getHealthinessText(val) {
    if (val <= 33) return 'unhealthy';
    else if (val <= 66) return 'average healthiness';
    else return 'healthy';
  }

  // Simulated async food detection function
  async function detectFoodsFromImages(files) {
    // Replace with real image recognition API call in production
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['cheese', 'bread', 'carrot']);
      }, 500);
    });
  }

  // Generate food and recipe suggestions based on inputs
  function generateSuggestions(detectedFoods, budget, healthiness, notes) {
    let baseSuggestions;

    if (healthiness === 'healthy') {
      baseSuggestions = ['fresh vegetables', 'lean proteins', 'whole grains', 'fruits', 'nuts'];
    } else if (healthiness === 'average healthiness') {
      baseSuggestions = ['balanced mix of vegetables', 'chicken', 'rice', 'fruits', 'legumes'];
    } else {
      baseSuggestions = ['comfort foods', 'carbs', 'cheese', 'some vegetables'];
    }

    // Determine number of suggestions based on budget
    let maxItems = 3;
    if (budget > 50) maxItems = 6;
    else if (budget > 25) maxItems = 5;
    else if (budget > 10) maxItems = 4;

    const suggestions = baseSuggestions.slice(0, maxItems);

    // Example recipe suggestions
    const recipes = [
      { title: "Veggie Stir Fry", desc: "Quick sauté of fresh veggies with soy sauce and garlic." },
      { title: "Grilled Chicken Salad", desc: "Lean grilled chicken served on mixed greens." },
      { title: "Hearty Vegetable Soup", desc: "Warm and filling soup with assorted vegetables." },
      { title: "Cheese and Bread Platter", desc: "Simple combo of cheeses and fresh bread." },
      { title: "Fruit & Nut Snack", desc: "Healthy snack combining fresh fruit and nuts." },
    ];

    return { suggestions, recipes };
  }

  // Render suggestions and recipes in results container
  function displayResults(suggestions, recipes, budget, healthiness, notes) {
    resultsDiv.innerHTML = ''; // Clear previous results

    // Summary paragraph
    const summary = document.createElement('p');
    summary.style.fontWeight = '700';
    summary.style.marginBottom = '25px';
    summary.style.fontSize = '1.5rem';
    summary.textContent = `Budget: $${budget} | Healthiness preference: ${healthiness} | Notes: ${notes || 'None'}`;
    resultsDiv.appendChild(summary);

    // Suggestions container with horizontal scroll
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    suggestions.forEach(suggestion => {
      const sug = document.createElement('div');
      sug.className = 'suggestion';
      sug.textContent = suggestion;
      suggestionsContainer.appendChild(sug);
    });
    resultsDiv.appendChild(suggestionsContainer);

    // Recipes container with horizontal scroll
    const recipesContainer = document.createElement('div');
    recipesContainer.className = 'recipes-container';
    recipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'recipe-card';

      const title = document.createElement('h3');
      title.textContent = recipe.title;

      const desc = document.createElement('p');
      desc.textContent = recipe.desc;

      card.appendChild(title);
      card.appendChild(desc);
      recipesContainer.appendChild(card);
    });
    resultsDiv.appendChild(recipesContainer);
  }

  // Handle submit button click
  submitBtn.addEventListener('click', async () => {
    const files = imageUpload.files;
    const budgetVal = budgetInput.value ? parseFloat(budgetInput.value) : 0;
    const healthVal = parseInt(healthSlider.value, 10);
    const notesVal = notesInput.value.trim();

    // Basic validation
    if (files.length === 0) {
      alert('Please upload at least one image of your food.');
      return;
    }
    if (budgetVal < 0 || isNaN(budgetVal)) {
      alert('Please enter a valid budget.');
      return;
    }

    // Simulate detection (replace with real API call)
    const detectedFoods = await detectFoodsFromImages(files);

    // Generate and display results
    const { suggestions, recipes } = generateSuggestions(
      detectedFoods,
      budgetVal,
      getHealthinessText(healthVal),
      notesVal
    );

    displayResults(suggestions, recipes, budgetVal, getHealthinessText(healthVal), notesVal);

    // Smooth scroll results into view
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});