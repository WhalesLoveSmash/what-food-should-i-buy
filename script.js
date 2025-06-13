const healthSlider = document.getElementById("health-slider");
const healthLabel = document.getElementById("health-label");

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


//randomly generate a food suggestion when decide button is clicked
const foods = ["Pizza", "Sushi", "Tacos", "Ice Cream", "Salad"];
document.getElementById("submit-btn").addEventListener("click", () => {
  const randomFood = foods[Math.floor(Math.random() * foods.length)];
  document.getElementById("results").textContent = `Buy some ${randomFood}!`;
});