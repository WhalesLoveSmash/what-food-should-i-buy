// script.js

const imageUpload = document.getElementById('image-upload');
const budgetInput = document.getElementById('budget');
const healthSlider = document.getElementById('health-slider');
const healthLabel = document.getElementById('health-label');
const notesInput = document.getElementById('notes');
const submitBtn = document.getElementById('submit-btn');
const resultsDiv = document.getElementById('results');

// Update health label and blur focused input to hide keyboard on mobile
healthSlider.addEventListener('input', () => {
  const val = healthSlider.value;
  if (val < 33) healthLabel.textContent = 'Unhealthy';
  else if (val < 67) healthLabel.textContent = 'Average';
  else healthLabel.textContent = 'Healthy';

  if (document.activeElement && document.activeElement.tagName === 'INPUT') {
    document.activeElement.blur();
  }
});

// Smooth scroll when focusing on notes (textarea) on mobile to avoid keyboard blocking
notesInput.addEventListener('focus', () => {
  setTimeout(() => {
    notesInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300); // slight delay to allow keyboard to start appearing
});

// Dummy Gemini vision simulation - replace with your real API call
async function analyzeImageWithGemini(imageFile) {
  // Simulate delay & example recognized foods
  return new Promise((resolve) => {
    setTimeout(() => {
      // Randomize a few food items for demo purposes
      const demoFoods = ['apple', 'banana', 'bread', 'cheese', 'carrot'];
      // Return 3 random items for fun
      const shuffled = demoFoods.sort(() => 0.5 - Math.random());
      resolve(shuffled.slice(0, 3));
    }, 1000);
  });
}

// Main form submit logic
submitBtn.addEventListener('click', async () => {
  resultsDiv.textContent = 'Analyzing images...';

  const files = imageUpload.files;
  if (!files.length) {
    resultsDiv.textContent = 'Please upload at least one image.';
    return;
  }

  try {
    let allFoodItems = [];

    for (const file of files) {
      const foods = await analyzeImageWithGemini(file);
      allFoodItems = allFoodItems.concat(foods);
    }

    // Remove duplicates
    allFoodItems = [...new Set(allFoodItems)];

    if (allFoodItems.length === 0) {
      resultsDiv.textContent = "Oops! Couldn't read your food pics. Try again or upload clearer images.";
      return;
    }

    const budget = budgetInput.value || 'any';
    const healthiness = healthLabel.textContent.toLowerCase();
    const notes = notesInput.value.trim() || 'no special considerations';

    resultsDiv.innerHTML = `
      <p>Detected foods: ${allFoodItems.join(', ')}</p>
      <p>Budget: ${budget}</p>
      <p>Healthiness preference: ${healthiness}</p>
      <p>Notes: ${notes}</p>
      <p><strong>Suggested food to buy:</strong> Based on your current food and preferences, consider adding fresh vegetables and proteins to balance your diet.</p>
    `;
  } catch (error) {
    console.error('Error during analysis:', error);
    resultsDiv.textContent = "Something went wrong while analyzing. Please try again.";
  }
});