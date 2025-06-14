// script.js

const form = document.getElementById('food-form');
const submitBtn = document.getElementById('submit-btn');
const imageUpload = document.getElementById('image-upload');
const budgetInput = document.getElementById('budget');
const healthSlider = document.getElementById('health-slider');
const healthLabel = document.getElementById('health-label');
const notesInput = document.getElementById('notes');

const resultsScreen = document.getElementById('results-screen');
const resultsDiv = document.getElementById('results');
const toRecipesBtn = document.getElementById('to-recipes-btn');
const backToFormBtn = document.getElementById('back-to-form-btn');

const recipesScreen = document.getElementById('recipes-screen');
const recipesDiv = document.getElementById('recipes');
const backToResultsBtn = document.getElementById('back-to-results-btn');

const appScreens = document.querySelectorAll('.screen');

// Sounds - replace URLs with your own if you want
const successSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const errorSound = new Audio('https://actions.google.com/sounds/v1/cartoon/metal_twang.ogg');

// Update health label on slider input
healthSlider.addEventListener('input', () => {
  const val = healthSlider.value;
  if (val <= 25) healthLabel.textContent = 'Unhealthy';
  else if (val <= 75) healthLabel.textContent = 'Average';
  else healthLabel.textContent = 'Healthy';
});

// Show the given screen and hide others
function showScreen(screen) {
  appScreens.forEach(s => s.classList.remove('active-screen'));
  screen.classList.add('active-screen');
}

// Shake animation for errors
function shake(element) {
  element.classList.add('shake');
  setTimeout(() => element.classList.remove('shake'), 600);
}

// Basic form validation: require budget > 0 or notes filled
function validateForm() {
  if ((!budgetInput.value || Number(budgetInput.value) <= 0) && !notesInput.value.trim()) {
    shake(form);
    errorSound.play();
    return false;
  }
  return true;
}

// Call Gemini chat API with prompt text
async function callGeminiAPI(promptText) {
  const apiKey = 'YOUR_API_KEY_HERE'; // <-- Put your real Gemini API key here or load from .env
  const url = 'https://api.gemini.chat/v1/chat/completions'; // Check your actual endpoint

  const body = {
    model: 'gemini-1-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that suggests food to buy based on user input.' },
      { role: 'user', content: promptText }
    ]
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.error || resp.statusText);
  }

  const data = await resp.json();
  return data.choices[0].message.content;
}

// On submit button click
submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  submitBtn.disabled = true;
  resultsDiv.textContent = 'Deciding...';
  showScreen(resultsScreen);

  try {
    // Gather inputs
    const budget = budgetInput.value.trim() || 'unspecified';
    const healthPercent = healthSlider.value;
    const notes = notesInput.value.trim() || 'none';

    // Describe uploaded image files by name
    const files = imageUpload.files;
    let imageDesc = 'no pictures uploaded';
    if (files.length > 0) {
      const names = Array.from(files).map(f => f.name).join(', ');
      imageDesc = `these pictures: ${names}`;
    }

    // Compose prompt
    const prompt = `
I have ${imageDesc}. My budget is $${budget}. My healthiness preference is ${healthPercent} out of 100. Additional notes: ${notes}.
Based on this information, please suggest what food I should buy.
    `;

    // Call Gemini text API
    const response = await callGeminiAPI(prompt);

    resultsDiv.textContent = response;
    successSound.play();
  } catch (err) {
    console.error(err);
    resultsDiv.textContent = "Oops! Something went wrong with the food suggestions. Please try again.";
    errorSound.play();
  } finally {
    submitBtn.disabled = false;
  }
});

// Button to go from results screen to recipes screen (stub - add your own recipes logic)
toRecipesBtn.addEventListener('click', () => {
  recipesDiv.textContent = 'Recipes screen placeholder. Add your recipes here!';
  showScreen(recipesScreen);
});

// Back buttons to navigate between screens
backToFormBtn.addEventListener('click', () => showScreen(form.parentElement));
backToResultsBtn.addEventListener('click', () => showScreen(resultsScreen));

// Initialize first screen on load
showScreen(form.parentElement);