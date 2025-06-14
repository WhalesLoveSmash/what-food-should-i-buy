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

// Example Gemini vision function (replace with your actual API call)
async function analyzeImageWithGemini(imageFile) {
  // Dummy example simulating a call returning recognized foods
  // Replace with your real API call logic here

  // Simulate delay and response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['apple', 'banana', 'bread']);
    }, 1000);
  });
}

// Main handler
submitBtn.addEventListener('click', async () => {
  resultsDiv.textContent = 'Analyzing images...';

  const files = imageUpload.files;
  if (!files.length) {
    resultsDiv.textContent = 'Please upload at least one image.';
    return;
  }

  let allFoodItems = [];

  // Analyze each uploaded image
  for (const file of files) {
    try {
      const foods = await analyzeImageWithGemini(file);
      allFoodItems = allFoodItems.concat(foods);
    } catch (e) {
      console.error('Error analyzing image:', e);
    }
  }

  if (allFoodItems.length === 0) {
    resultsDiv.textContent = "Oops! Couldn't read your food pics. Try again or upload clearer images.";
    return;
  }

  // Compose a simple suggestion message (you can expand this later)
  const budget = budgetInput.value || 'any';
  const healthiness = healthLabel.textContent.toLowerCase();
  const notes = notesInput.value || 'no special considerations';

  resultsDiv.innerHTML = `
    <p>Detected foods: ${allFoodItems.join(', ')}</p>
    <p>Budget: ${budget}</p>
    <p>Healthiness preference: ${healthiness}</p>
    <p>Notes: ${notes}</p>
    <p><strong>Suggested food to buy:</strong> Based on your current food and preferences, consider adding fresh vegetables and proteins to balance your diet.</p>
  `;
});