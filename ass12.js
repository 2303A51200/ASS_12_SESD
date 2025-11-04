const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const favoritesDiv = document.getElementById('favorites');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch meals by keyword
async function fetchMeals(query) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();

    if (!data.meals) {
      resultsDiv.innerHTML = `<p>No results found for "${query}". Try another keyword!</p>`;
      return;
    }

    displayMeals(data.meals);
  } catch (error) {
    resultsDiv.innerHTML = `<p>Error fetching meals. Try again later.</p>`;
    console.error(error);
  }
}

// Display meals on the page
function displayMeals(meals) {
  resultsDiv.innerHTML = '';

  meals.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');
    mealDiv.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <p><b>Category:</b> ${meal.strCategory || 'N/A'}</p>
      <button class="favorite-btn" onclick="addToFavorites('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">❤️ Favorite</button>
    `;
    resultsDiv.appendChild(mealDiv);
  });
}

// Add item to favorites
function addToFavorites(id, name, img) {
  if (!favorites.find(f => f.id === id)) {
    favorites.push({ id, name, img });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
  }
}

// Display favorites
function showFavorites() {
  favoritesDiv.innerHTML = '';
  favorites.forEach(fav => {
    const favDiv = document.createElement('div');
    favDiv.classList.add('meal');
    favDiv.innerHTML = `
      <img src="${fav.img}" alt="${fav.name}">
      <h3>${fav.name}</h3>
    `;
    favoritesDiv.appendChild(favDiv);
  });
}

// Search button click
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query === '') {
    resultsDiv.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }
  fetchMeals(query);
});

// Random meal button
randomBtn.addEventListener('click', async () => {
  const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const data = await res.json();
  displayMeals(data.meals);
});

// Load default suggestions (mutton, rice, breakfast, pickle, etc.)
const defaultSuggestions = ['mutton', 'rice', 'breakfast', 'pickle', 'chicken', 'pasta'];

async function loadSuggestions() {
  let allMeals = [];
  for (let food of defaultSuggestions) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`);
    const data = await res.json();
    if (data.meals) allMeals.push(...data.meals.slice(0, 2)); // limit 2 per food
  }
  displayMeals(allMeals);
}

// Initialize app
showFavorites();
loadSuggestions();
