const healthSlider = document.getElementById("health-slider");
const healthLabel = document.getElementById("health-label");
const resultsDiv = document.getElementById("results");
const submitBtn = document.getElementById("submit-btn");
const imageUpload = document.getElementById("image-upload");

const API_KEY = "AIzaSyD5oDL3L0-M_JZDwYn-fq7la_8yL3xLKVA"; // Your API key

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
  if (val < 20) healthLabel.textContent = "Degenerate";
  else if (val < 40) healthLabel.textContent = "Lazy";
  else if (val < 60) healthLabel.textContent = "Average";
  else if (val < 80) healthLabel.textContent = "Can Cook";
  else healthLabel.textContent = "Immortal";
});

function playErrorSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) { }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function callVisionAPIBatch(base64Images) {
  try {
    const requests = base64Images.map(base64 => ({
      image: { content: base64 },
      features: [{ type: "LABEL_DETECTION", maxResults: 10 }]
    }));

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Vision API error: ${errorData.error.message || response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Vision API batch error:", err);
    playErrorSound();
    resultsDiv.innerHTML = `
      <p style="color:#f00; font-weight:700; margin-top:20px;">
        Oops! Couldn't read your food pics. Try again or upload clearer images.
      </p>
    `;
    resultsDiv.classList.add('shake');
    setTimeout(() => resultsDiv.classList.remove('shake'), 600);
    return null;
  }
}

// Swipe navigation logic for results
let currentPage = 0;
let pages = [];

function showPage(index) {
  if (index < 0 || index >= pages.length) return;
  currentPage = index;
  resultsDiv.innerHTML = pages[index];
}

function addSwipeListeners() {
  let touchStartX = 0;
  let touchEndX = 0;

  resultsDiv.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  resultsDiv.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  });

  function handleSwipeGesture() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 50) return; // Ignore small swipes

    if (swipeDistance > 0) {
      // Swipe right → previous page
      showPage(currentPage - 1);
    } else {
      // Swipe left → next page
      showPage(currentPage + 1);
    }
  }
}

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const files = Array.from(imageUpload.files);

  if (files.length === 0) {
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

  // Validate files: max 5 files, max 5MB each, and image types only
  const maxFiles = 5;
  const maxFileSizeMB = 5;
  const validTypes = ["image/jpeg", "image/png", "image/webp"];

  if (files.length > maxFiles) {
    playErrorSound();
    resultsDiv.innerHTML = `
      <p style="color:#f00; font-weight:700; margin-top:20px;">
        You can upload up to ${maxFiles} images only.
      </p>
    `;
    resultsDiv.classList.add('shake');
    setTimeout(() => resultsDiv.classList.remove('shake'), 600);
    return;
  }

  for (const file of files) {
    if (!validTypes.includes(file.type)) {
      playErrorSound();
      resultsDiv.innerHTML = `
        <p style="color:#f00; font-weight:700; margin-top:20px;">
          Unsupported file type: ${file.type}. Please upload JPG, PNG, or WEBP images only.
        </p>
      `;
      resultsDiv.classList.add('shake');
      setTimeout(() => resultsDiv.classList.remove('shake'), 600);
      return;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      playErrorSound();
      resultsDiv.innerHTML = `
        <p style="color:#f00; font-weight:700; margin-top:20px;">
          File too large: ${file.name} exceeds ${maxFileSizeMB}MB limit.
        </p>
      `;
      resultsDiv.classList.add('shake');
      setTimeout(() => resultsDiv.classList.remove('shake'), 600);
      return;
    }
  }

  resultsDiv.innerHTML = `<p style="color: white; font-weight: 600; margin-top: 20px;">Analyzing your food pics...</p>`;

  // Convert all images to base64 in parallel
  let base64Images;
  try {
    base64Images = await Promise.all(files.map(fileToBase64));
  } catch (err) {
    playErrorSound();
    resultsDiv.innerHTML = `
      <p style="color:#f00; font-weight:700; margin-top:20px;">
        Failed to read one or more files. Try again.
      </p>
    `;
    return;
  }

  const visionResponse = await callVisionAPIBatch(base64Images);
  if (!visionResponse) return;

  // Extract labels per image
  pages = base64Images.map((_, i) => {
    const annotations = visionResponse.responses[i]?.labelAnnotations || [];
    const labels = annotations.map(a => a.description);

    const budget = document.getElementById("budget").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const health = healthLabel.textContent;

    const budgetText = budget === "" ? "No budget set" : budget;
    const notesText = notes === "" ? "No extra notes" : notes;

    const normalizedHealth = health.trim().toLowerCase();

    const keyMap = {
      "degenerate": "Degenerate",
      "lazy": "Lazy",
      "average": "Average",
      "can cook": "Can Cook",
      "immortal": "Immortal"
    };

    const normalizedKey = keyMap[normalizedHealth] || "Average";

    const groceries = groceryOptions[normalizedKey];
    const meals = mealIdeas[normalizedKey];

    return `
      <h2>Image ${i + 1} Detected Food Items:</h2>
      <ul>${labels.length ? labels.map(item => `<li>${item}</li>`).join('') : '<li>No labels found</li>'}</ul>

      <h2>Suggested Grocery List (Budget: ${budgetText})</h2>
      <ul>${groceries.map(item => `<li>${item}</li>`).join('')}</ul>

      <h2>Meal Ideas</h2>
      <ul>${meals.map(item => `<li>${item}</li>`).join('')}</ul>

      <p><em>Notes: ${notesText}</em></p>

      <p style="font-size: 0.9rem; color: #00b4d8;">Swipe left/right to see other images</p>
    `;
  });

  currentPage = 0;
  showPage(currentPage);
  addSwipeListeners();
});