// Hàm hiển thị các công thức từ localStorage
function renderRecipes() {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  // Lấy phần tử container để render các công thức vào
  const recipesContainer = document.getElementById("recipes-container");
  const ingredients = JSON.parse(localStorage.getItem("ingredients"));

  // Làm sạch container trước khi render lại
  recipesContainer.innerHTML = "";

  // Lặp qua từng công thức và render chúng
  recipes.forEach((recipe) => {
    // Lấy thông tin ingredients từ localStorage

    // Khởi tạo các biến để cộng tổng giá trị dinh dưỡng
    let totalEnergy = 0,
      totalFat = 0,
      totalCarbohydrate = 0,
      totalProtein = 0;
    totalQuantity = 0;

    ingredients.forEach((ingredient) => {
      totalQuantity += parseFloat(ingredient.quantity) || 0;
      totalEnergy += parseFloat(ingredient.nutrition.energy) || 0;
      totalFat += parseFloat(ingredient.nutrition.fat) || 0;
      totalCarbohydrate += parseFloat(ingredient.nutrition.carbohydrate) || 0;
      totalProtein += parseFloat(ingredient.nutrition.protein) || 0;
    });

    // Kiểm tra log tổng các giá trị dinh dưỡng
    console.log(`Total Energy: ${totalEnergy} kcal`);
    console.log(`Total Fat: ${totalFat} g`);
    console.log(`Total Carbohydrate: ${totalCarbohydrate} g`);
    console.log(`Total Protein: ${totalProtein} g`);

    // Tạo phần tử card cho mỗi công thức
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
          <div class="header-left-recipe">
            <img
              class="community-icon"
              src="../assets/icons/Community.png"
              alt=""
            />
            <div class="recipe-tag">Community Recipes</div>
          </div>
      
          <div class="header-right-recipe">
            <h3>
              ${recipe.name}
            </h3>
            <div class="mid-recipe">
              <p>${recipe.description || "Unknown"}</p>
              <button class="like-btn">
                <img src="../assets/icons/favorite_border.png" alt="" />
                <div>${recipe.likes || 0}</div>
              </button>
            </div>
      
            <div class="mid-recipe-two">
              <img src="../assets/icons/vegetable-tag.png" alt="" />
              <p>${recipe.category || "Category"}</p>
            </div>
            <div class="recipe-stats">
              <p>by</p>
              <p> kcal</p>
              <p> Fat</p>
              <p> Carbohydrate</p>
              <p> Protein</p>
            </div>
      
            <div class="recipe-ingredient">
              <p>${totalQuantity} g</p>
              <p>${totalEnergy} kcal</p>
              <p class="recipe-fat">${totalFat} g</p>
              <p class="recipe-carbohydrate">${totalCarbohydrate} g</p>
              <p class="recipe-protein">${totalProtein} g</p>
            </div>
          </div>
        `;

    recipesContainer.appendChild(recipeCard); // Thêm công thức vào container
  });
}

// Gọi hàm renderRecipes khi trang được tải
window.addEventListener("load", () => {
  renderRecipes();
});
