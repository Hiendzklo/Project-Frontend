// Function to load favourite recipes from localStorage and render them
function loadFavouriteRecipes() {
  // Retrieve favourite recipes from localStorage
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  // Get the recipes container
  const recipesGrid = document.querySelector(".recipes-grid");

  // Clear the current content of the grid (if needed)
  recipesGrid.innerHTML = "";

  // Iterate over the favourite recipes and generate HTML for each
  favourites.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
        <div class="header-left-recipe">
          <img class="conmunity-icon" src="../assets/icons/Community.png" alt="" />
          <div class="recipe-tag">Community Recipes</div>
        </div>
        <div class="header-right-recipe">
          <h3>${recipe.name}</h3>
          <div class="mid-recipe">
            <p>${recipe.author}</p>
            <button class="like-btn">
              <img src="../assets/icons/favorite_border.png" alt="" />
              <div>37</div>
            </button>
          </div>
          <div class="mid-recipe-two">
            <img src="../assets/icons/vegetable-tag.png" alt="" />
            <p>${recipe.category}</p>
          </div>
          <div class="recipe-stats">
            <p>by</p>
            <p>Energy:</p>
            <p>Fat:</p>
            <p>Carbohydrate:</p>
            <p>Protein:</p>
          </div>
          <div class="recipe-ingredient">
            <p>${recipe.quantity}</p>
            <p>${recipe.nutrient.energy}</p>
            <p class="recipe-fat">${recipe.nutrient.fat}</p>
            <p class="recipe-carbohydrate">${recipe.nutrient.carbohydrate}</p>
            <p class="recipe-protein">${recipe.nutrient.protein}</p>
          </div>
        </div>
      `;

    // Append the recipe card to the recipes grid
    recipesGrid.appendChild(recipeCard);
  });
}

// Call the function to load recipes when the page loads
document.addEventListener("DOMContentLoaded", loadFavouriteRecipes);
