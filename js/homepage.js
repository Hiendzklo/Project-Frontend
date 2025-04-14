let currentPage = 1; // Start from page 1
const recipesPerPage = 2; // Number of recipes per page

// Function to load favourite recipes from localStorage and render them
function loadFavouriteRecipes() {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  // Get the recipes container
  const recipesGrid = document.querySelector(".recipes-grid");

  // Clear the current content of the grid
  recipesGrid.innerHTML = "";

  // Filter based on search input
  const searchQuery = document
    .querySelector(".search-input")
    .value.toLowerCase();
  const categoryFilter = document
    .querySelector(".category-input")
    .value.toLowerCase();

  // Filter the favourites based on search and category filter
  const filteredRecipes = favourites.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter
      ? recipe.category.toLowerCase().includes(categoryFilter)
      : true;
    return matchesSearch && matchesCategory;
  });

  // Sort the filtered recipes based on the nutrient input
  const sortByNutrient = document.querySelector(".sort-input").value;
  if (sortByNutrient) {
    filteredRecipes.sort((a, b) => {
      if (sortByNutrient === "Energy") {
        return parseInt(a.nutrient.energy) - parseInt(b.nutrient.energy);
      } else if (sortByNutrient === "Fat") {
        return parseFloat(a.nutrient.fat) - parseFloat(b.nutrient.fat);
      } else if (sortByNutrient === "Carbohydrate") {
        return (
          parseFloat(a.nutrient.carbohydrate) -
          parseFloat(b.nutrient.carbohydrate)
        );
      } else if (sortByNutrient === "Protein") {
        return parseFloat(a.nutrient.protein) - parseFloat(b.nutrient.protein);
      }
      return 0;
    });
  }

  // Paginate the filtered recipes
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentPageRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Generate the recipe cards
  currentPageRecipes.forEach((recipe) => {
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
            <p>by</p> ${recipe.quantity}
            <p>Energy</p>
            <p>Fat</p>
            <p>Carbohydrate</p>
            <p>Protein</p>
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

  // Update the pagination buttons
  updatePaginationButtons(totalPages);
}

// Function to update the pagination buttons
function updatePaginationButtons(totalPages) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  // Create the previous button
  const prevButton = document.createElement("img");
  prevButton.src = "../assets/icons/Item → Button.png";
  pagination.appendChild(prevButton);

  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      currentPage = i;
      loadFavouriteRecipes();
    });
    pagination.appendChild(pageButton);
  }

  // Create the next button
  const nextButton = document.createElement("img");
  nextButton.src = "../assets/icons/Item → Next page.png";
  pagination.appendChild(nextButton);

  // Add event listeners for next and previous buttons
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadFavouriteRecipes();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadFavouriteRecipes();
    }
  });
}

// Event listener for search and category filter changes
document
  .querySelector(".search-input")
  .addEventListener("input", loadFavouriteRecipes);
document
  .querySelector(".category-input")
  .addEventListener("input", loadFavouriteRecipes);
document
  .querySelector(".sort-input")
  .addEventListener("change", loadFavouriteRecipes);

// Call the function to load recipes when the page loads
document.addEventListener("DOMContentLoaded", loadFavouriteRecipes);

// Function to update the username dynamically from localStorage
function updateUsername() {
  // Retrieve the users object from localStorage
  const users = JSON.parse(localStorage.getItem("users"));

  // Check if users exists and is not empty
  if (users) {
    let username;

    // If users is an array, get the username from the first user
    if (Array.isArray(users)) {
      username = users[0].username; // Get the username of the first user
    } else {
      // If users is an object, just get the username directly
      username = users.username;
    }

    // If a username exists, update the span with the username
    if (username) {
      document.querySelector(".user-info span").textContent = username;
    }
  } else {
    // If no users in localStorage, set default value
    document.querySelector(".user-info span").textContent = "Guest";
  }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", updateUsername);

function logout() {
  // Xóa thông tin đăng nhập khỏi localStorage
  localStorage.removeItem("currentUser");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "login.html";
}
