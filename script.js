document.addEventListener('DOMContentLoaded', () => {
  const imageUpload = document.getElementById('image-upload');
  const budgetInput = document.getElementById('budget');
  const healthSlider = document.getElementById('health-slider');
  const healthText = document.getElementById('health-text');
  const healthText = document.getElementById('health-text');
  const notesInput = document.getElementById('notes');
  const submitBtn = document.getElementById('submit-btn');
  const resultsDiv = document.getElementById('results');

  // Animate healthText fade out and in when changing text
  function animateHealthText(newText) {
    healthText.style.opacity = 0;
    setTimeout(() => {
      healthText.textContent = newText;
      healthText.style.opacity = 1;
    }, 200);
  }

  // Update health text dynamically as slider moves with animation using 5 categories
  healthSlider.addEventListener('input', () => {
    const val = parseInt(healthSlider.value, 10);
    if (val <= 20) animateHealthText('Degenerate');
    else if (val <= 40) animateHealthText('Lazy');
    else if (val <= 60) animateHealthText('Average');
    else if (val <= 80) animateHealthText('Healthy');
    else animateHealthText('Immortal');
  });

  // Convert numeric health slider value to descriptive text (lowercase), matching 5 categories
  function getHealthinessText(val) {
    if (val <= 20) return 'degenerate';
    else if (val <= 40) return 'lazy';
    else if (val <= 60) return 'average';
    else if (val <= 80) return 'healthy';
    else return 'immortal';
  }

  // Simulated async food detection function
  async function detectFoodsFromImages(files) {
    // Replace with real image recognition API call in production
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(['cheese', 'bread', 'carrot']); // example detected foods
        resolve(['cheese', 'bread', 'carrot']); // example detected foods
      }, 500);
    });
  }

  // Generate food and recipe suggestions based on inputs and detected foods
  // Generate food and recipe suggestions based on inputs and detected foods
  function generateSuggestions(detectedFoods, budget, healthiness, notes) {
    let baseSuggestions;

    if (healthiness === 'healthy' || healthiness === 'immortal') {
      baseSuggestions = ['fresh vegetables', 'lean proteins', 'whole grains', 'fruits', 'nuts'];
    } else if (healthiness === 'average') {
      baseSuggestions = ['balanced mix of vegetables', 'chicken', 'rice', 'fruits', 'legumes'];
    } else if (healthiness === 'lazy') {
      baseSuggestions = ['comfort foods', 'carbs', 'cheese', 'some vegetables'];
    } else { // degenerate
      baseSuggestions = ['fast food', 'pizza', 'chips', 'soda', 'ice cream'];
    }

    // Promote detected foods if they exist in base suggestions (put detected foods at front)
    const detectedLower = detectedFoods.map(f => f.toLowerCase());
    const promotedSuggestions = [];
    const others = [];

    baseSuggestions.forEach(item => {
      if (detectedLower.includes(item.toLowerCase())) {
        promotedSuggestions.push(item);
      } else {
        others.push(item);
      }
    });

    const combinedSuggestions = [...promotedSuggestions, ...others];

    // Determine number of suggestions based on budget
    let maxItems = 4;
    if (budget > 50) maxItems = 6;
    else if (budget > 25) maxItems = 5;

    const suggestions = combinedSuggestions.slice(0, maxItems);
    const suggestions = combinedSuggestions.slice(0, maxItems);

    // Example recipe suggestions (can be expanded later)
    // Example recipe suggestions (can be expanded later)
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
    const healthDesc = getHealthinessText(healthVal);
    const healthDesc = getHealthinessText(healthVal);
    const { suggestions, recipes } = generateSuggestions(
      detectedFoods,
      budgetVal,
      healthDesc,
      healthDesc,
      notesVal
    );

    displayResults(suggestions, recipes, budgetVal, healthDesc, notesVal);
    displayResults(suggestions, recipes, budgetVal, healthDesc, notesVal);

    // Smooth scroll results into view
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});