document.addEventListener('DOMContentLoaded', () => {
  const imageUpload = document.getElementById('image-upload');
  const budgetInput = document.getElementById('budget');
  const healthSlider = document.getElementById('health-slider');
  const healthLabel = document.getElementById('health-label');
  const notesInput = document.getElementById('notes');
  const submitBtn = document.getElementById('submit-btn');
  const resultsDiv = document.getElementById('results');

  // Update health label text based on slider value
  healthSlider.addEventListener('input', () => {
    const val = parseInt(healthSlider.value);
    if (val <= 33) healthLabel.textContent = 'Unhealthy';
    else if (val <= 66) healthLabel.textContent = 'Average';
    else healthLabel.textContent = 'Healthy';
  });

  // Utility: convert slider number to text for suggestion prompt
  function getHealthinessText(val) {
    if (val <= 33) return 'unhealthy';
    else if (val <= 66) return 'average healthiness';
    else return 'healthy';
  }

  // Fake async function to simulate food detection from images
  async function detectFoodsFromImages(files) {
    // In real usage, call your vision API here.
    // For demo, just return some sample foods.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['cheese', 'bread', 'carrot']); 
      }, 500);
    });
  }

  // Generate suggestions based on inputs, budget, healthiness, notes
  function generateSuggestions(detectedFoods, budget, healthiness, notes) {
    // Simulate adding variety and recipe suggestions

    // Base suggestions depending on healthiness
    let baseSuggestions = [];
    if (healthiness === 'healthy') {
      baseSuggestions = ['fresh vegetables', 'lean proteins', 'whole grains', 'fruits', 'nuts'];
    } else if (healthiness === 'average healthiness') {
      baseSuggestions = ['balanced mix of vegetables', 'chicken', 'rice', 'fruits', 'legumes'];
    } else {
      baseSuggestions = ['comfort foods', 'carbs', 'cheese', 'some vegetables'];
    }

    // Add budget effect - more budget adds more items (up to 6)
    let maxItems = 3;
    if (budget > 50) maxItems = 6;
    else if (budget > 25) maxItems = 5;
    else if (budget > 10) maxItems = 4;

    const suggestions = baseSuggestions.slice(0, maxItems);

    // Recipe suggestions (keep it short & sweet)
    const recipes = [
      {
        title: "Veggie Stir Fry",
        desc: "Quick sauté of fresh veggies with soy sauce and garlic."
      },
      {
        title: "Grilled Chicken Salad",
        desc: "Lean grilled chicken served on mixed greens."
      },
      {
        title: "Hearty Vegetable Soup",
        desc: "Warm and filling soup with assorted vegetables."
      },
      {
        title: "Cheese and Bread Platter",
        desc: "Simple combo of cheeses and fresh bread."
      },
      {
        title: "Fruit & Nut Snack",
        desc: "Healthy snack combining fresh fruit and nuts."
      },
    ];

    return { suggestions, recipes };
  }

  // Display results in #results container with 2 horizontal scroll sections
  function displayResults(suggestions, recipes, budget, healthiness, notes) {
    resultsDiv.innerHTML = ''; // clear previous

    // Header summary
    const summary = document.createElement('p');
    summary.style.fontWeight = '700';
    summary.style.marginBottom = '25px';
    summary.style.fontSize = '1.5rem';
    summary.textContent = `Budget: $${budget} | Healthiness preference: ${healthiness} | Notes: ${notes || 'None'}`;
    resultsDiv.appendChild(summary);

    // Suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    suggestions.forEach(s => {
      const sug = document.createElement('div');
      sug.className = 'suggestion';
      sug.textContent = s;
      suggestionsContainer.appendChild(sug);
    });
    resultsDiv.appendChild(suggestionsContainer);

    // Recipes container
    const recipesContainer = document.createElement('div');
    recipesContainer.className = 'recipes-container';
    recipes.forEach(r => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      const title = document.createElement('h3');
      title.textContent = r.title;
      const desc = document.createElement('p');
      desc.textContent = r.desc;
      card.appendChild(title);
      card.appendChild(desc);
      recipesContainer.appendChild(card);
    });
    resultsDiv.appendChild(recipesContainer);
  }

  // Submit button click handler
  submitBtn.addEventListener('click', async () => {
    // Get user inputs
    const files = imageUpload.files;
    const budgetVal = budgetInput.value ? parseFloat(budgetInput.value) : 0;
    const healthVal = parseInt(healthSlider.value);
    const notesVal = notesInput.value.trim();

    // Simple validation
    if (files.length === 0) {
      alert('Please upload at least one image of your food.');
      return;
    }
    if (budgetVal < 0 || isNaN(budgetVal)) {
      alert('Please enter a valid budget.');
      return;
    }

    // Fake detect foods from images (replace with real API calls)
    const detectedFoods = await detectFoodsFromImages(files);

    // Generate suggestions
    const { suggestions, recipes } = generateSuggestions(detectedFoods, budgetVal, getHealthinessText(healthVal), notesVal);

    // Display results
    displayResults(suggestions, recipes, budgetVal, getHealthinessText(healthVal), notesVal);

    // Scroll results smoothly into view
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});