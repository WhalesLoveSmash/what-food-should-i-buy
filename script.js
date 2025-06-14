const healthSlider = document.getElementById("health-slider");
const healthLabel = document.getElementById("health-label");
const resultsDiv = document.getElementById("results");
const submitBtn = document.getElementById("submit-btn");
const imageUpload = document.getElementById("image-upload");

const API_KEY = "AIzaSyD5oDL3L0-M_JZDwYn-fq7la_8yL3xLKVA"; // Your Gemini API key

// Grocery and meal suggestions (can be expanded or replaced with AI results later)
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

// Update health label on slider input
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

// Play a soft error beep sound
function playErrorSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    // AudioContext might fail in some browsers; ignore error
  }
}

// Convert a File object to base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // Strip data: prefix
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Call Vision API for label detection on one base64 image string
async function callVisionAPI(imageBase64) {
  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageBase64 },
              features: [{ type: "LABEL_DETECTION", maxResults: 10 }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Vision API error: ${errorData.error.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (err) {
    playErrorSound();
    resultsDiv.innerHTML = `
      <p style="color:#f00; font-weight:700; margin-top:20px;">
        Oops! Couldn't read your food pics. Try again or upload clearer images.
      </p>
    `;
    console.error(err);
    resultsDiv.classList.add('shake');
    setTimeout(() => resultsDiv.classList.remove('shake'), 600);
    return null;
  }
}

// Main function to handle the form submission
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const files = Array.from(imageUpload.files);

  if (files.length === 0) {
    // No images uploaded → shake and error sound + message
    playErrorSound();
    resultsDiv.innerHTML = `
      <p style="color:#f00; font-weight:700; margin-top:20px;">
        Please upload at least one picture of your food!
      </p>
    `;
    resultsDiv.classList.add('shake');
    setTimeout(() => resultsDiv.classList.remove('shake'), 600);
    return;
  }

  // Show loading message
  resultsDiv.innerHTML = `<p style="color: white; font-weight: 600; margin-top: 20px;">Analyzing your food pics...</p>`;

  // Convert all images to base64 strings
  let labelsAll = [];
  for (const file of files) {
    const base64 = await fileToBase64(file);
    const visionResponse = await callVisionAPI(base64);
    if (!visionResponse) return; // Error already handled

    // Extract labels from Vision API response
    const labels = visionResponse.responses[0]?.labelAnnotations?.map(l => l.description) || [];
    labelsAll = labelsAll.concat(labels);
  }

  // Deduplicate labels
  labelsAll = [...new Set(labelsAll)];

  // Now get form inputs
  const budget = document.getElementById("budget").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const health = healthLabel.textContent;

  const budgetText = budget === "" ? "No budget set" : budget;
  const notesText = notes === "" ? "No extra notes" : notes;

  // Normalize health label text to match keys
  const normalizedHealth = health.trim().toLowerCase();

  const keyMap = {
    "degenerate": "Degenerate",
    "lazy": "Lazy",
    "average": "Average",
    "can cook": "Can Cook",
    "immortal": "Immortal"
  };

  const normalizedKey = keyMap[normalizedHealth] || "Average";

  // For now, just use the static groceryOptions and mealIdeas based on healthiness slider
  const groceries = groceryOptions[normalizedKey];
  const meals = mealIdeas[normalizedKey];

  // Show final results
  resultsDiv.innerHTML = `
    <h2>Detected Food Items from your pics:</h2>
    <ul>${labelsAll.map(item => `<li>${item}</li>`).join("")}</ul>

    <h2>Suggested Grocery List (Budget: ${budgetText})</h2>
    <ul>${groceries.map(item => `<li>${item}</li>`).join("")}</ul>

    <h2>Meal Ideas</h2>
    <ul>${meals.map(item => `<li>${item}</li>`).join("")}</ul>

    <p><em>Notes: ${notesText}</em></p>
  `;
});