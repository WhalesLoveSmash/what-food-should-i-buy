// script.js

// Replace with your actual Gemini API key and endpoint
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; 

const imageInput = document.getElementById('image-upload');
const submitBtn = document.getElementById('submit-btn');
const resultsDiv = document.getElementById('results');
const healthSlider = document.getElementById('health-slider');
const healthLabel = document.getElementById('health-label');

healthSlider.addEventListener('input', () => {
  const val = healthSlider.value;
  if (val < 33) healthLabel.textContent = 'Unhealthy';
  else if (val < 67) healthLabel.textContent = 'Average';
  else healthLabel.textContent = 'Healthy';
});

submitBtn.addEventListener('click', async () => {
  clearResults();
  
  const files = imageInput.files;
  if (!files.length) {
    showError('Please upload at least one image of your food.');
    shakeElement(imageInput);
    return;
  }
  
  const budget = document.getElementById('budget').value || 'No budget set';
  const healthiness = healthSlider.value;
  const notes = document.getElementById('notes').value.trim() || 'No additional notes';

  try {
    // Read images as base64 strings
    const base64Images = await Promise.all(Array.from(files).map(readFileAsBase64));

    // Call Gemini Vision API (replace with your real call)
    let visionResponse = await callGeminiVisionAPI(base64Images);

    // If Vision API fails or low confidence, fallback to Gemini text analysis
    if (!visionResponse.success || !visionResponse.confident) {
      visionResponse = await callGeminiTextAPI({ budget, healthiness, notes });
    }

    if (visionResponse.success) {
      displayResults(visionResponse.recommendation);
    } else {
      showError('Oops! Couldn\'t analyze your food pics. Try again or upload clearer images.');
      shakeElement(imageInput);
    }
  } catch (error) {
    console.error('API error:', error);
    showError('Something went wrong. Please try again later.');
  }
});

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // remove data:*/*;base64, prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callGeminiVisionAPI(base64Images) {
  // TODO: Replace with your real Gemini Vision API call logic
  // Example dummy success response:
  console.log('Calling Gemini Vision API with images:', base64Images.length);
  
  // Simulate success and confident recognition 80% of the time
  const success = Math.random() < 0.8;
  const confident = Math.random() < 0.85;
  
  if (success && confident) {
    return {
      success: true,
      confident: true,
      recommendation: 'Based on your food pics, buy fresh vegetables and lean proteins for a balanced diet.'
    };
  } else {
    return { success: false, confident: false };
  }
}

async function callGeminiTextAPI({ budget, healthiness, notes }) {
  // TODO: Replace with your real Gemini GPT text call logic
  console.log('Calling Gemini text fallback with:', { budget, healthiness, notes });

  // Simulate fallback success:
  return {
    success: true,
    recommendation: `Considering your budget (${budget}), healthiness preference (${healthiness}), and notes ("${notes}"), I recommend buying whole grains, seasonal fruits, and some nuts.`
  };
}

function displayResults(text) {
  resultsDiv.textContent = text;
}

function showError(message) {
  resultsDiv.textContent = message;
  resultsDiv.style.color = '#ff4c4c'; // Red for errors
}

function clearResults() {
  resultsDiv.textContent = '';
  resultsDiv.style.color = 'white';
}

function shakeElement(element) {
  element.classList.add('shake');
  setTimeout(() => element.classList.remove('shake'), 600);
}