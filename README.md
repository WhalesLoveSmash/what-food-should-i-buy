https://whaleslovesmash.github.io/what-food-should-i-buy/ <br> <br>
Upload pictures of your fridge and cupboard <br>
Set your budget <br>
Chose where you fall between health nut and total degenerate <br>
Enter any additional considerations and get your shopping list <br>
Tbh this is a gemini wrapper 😭 <br>

#todo: diferent cooking things like can say have oven and crockpot <br> 
smoother slider, <br>
make food/recipies reach horizontrol screen edges on desktop, <br>
hide api key (requires workaround since no backend on GH Pages) <br>

Tech stack and implementation:

This is a fully client-side, static web app with zero dependencies or build tooling — just vanilla HTML, CSS, and ES6+ JavaScript. No frameworks, no bundlers, no node modules.

Image uploads are handled via native <input type="file" multiple> with no backend — image recognition is stubbed with a promise simulating async behavior, making it easy to swap in a real API later without changing UI logic.

Health slider uses native <input type="range"> with dynamic label updates tied directly to input events — minimal DOM manipulation and no external UI libraries.

Suggestion generation is pure JS logic encapsulated in a few pure functions, cleanly separating concerns between detection, suggestion creation, and rendering. This keeps the code modular and easy to extend or refactor.

Results rendering uses programmatic DOM creation and appends to avoid innerHTML risks, allowing fine control over structure and style. Horizontal scroll containers are custom CSS, avoiding third-party scroll or carousel libs for simplicity and performance.

Form input validation is minimal but explicit, focusing on user experience and edge case prevention before any processing happens.

Entire UI is styled responsively with straightforward CSS classes and media queries, avoiding CSS preprocessors or frameworks to keep the codebase lightweight and fully transparent.

Deployed as a GitHub Pages static site for zero-config hosting and instant global availability.
