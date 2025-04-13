// Đặt số lượng công thức trên mỗi trang
const recipesPerPage = 2;

// Lưu số trang hiện tại
let currentPage = 1;

function renderRecipes() {
  let recipes = JSON.parse(localStorage.getItem("recipes")) || []; // Lấy danh sách công thức từ localStorage
  const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];

  // Tính toán số lượng trang
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  // Lấy phần tử container để render các công thức vào
  const recipesContainer = document.getElementById("recipes-container");

  // Làm sạch container trước khi render lại
  recipesContainer.innerHTML = "";

  // Tính toán vị trí bắt đầu và kết thúc của các công thức trong trang hiện tại
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;

  // Chỉ render các công thức trong phạm vi của trang hiện tại
  const recipesToRender = recipes.slice(startIndex, endIndex);

  // Lặp qua các công thức cần hiển thị và render chúng
  recipesToRender.forEach((recipe) => {
    // Kiểm tra nếu công thức đã có nutrients, nếu có rồi thì không tính lại
    if (recipe.nutrients) {
      renderRecipeCard(recipe);
      return;
    }

    // Khởi tạo các biến để cộng tổng giá trị dinh dưỡng cho công thức
    let totalEnergy = 0,
      totalFat = 0,
      totalCarbohydrate = 0,
      totalProtein = 0;
    let finalQuantity = 0;

    // Tính toán dinh dưỡng cho mỗi công thức dựa trên các nguyên liệu
    ingredients.forEach((ingredient) => {
      finalQuantity += parseFloat(ingredient.quantity) || 0;
      totalEnergy += parseFloat(ingredient.nutrition.energy) || 0;
      totalFat += parseFloat(ingredient.nutrition.fat) || 0;
      totalCarbohydrate += parseFloat(ingredient.nutrition.carbohydrate) || 0;
      totalProtein += parseFloat(ingredient.nutrition.protein) || 0;
    });

    // Lưu tổng giá trị dinh dưỡng vào mục nutrients trong mỗi công thức
    recipe.nutrients = {
      energy: totalEnergy,
      fat: totalFat,
      carbohydrate: totalCarbohydrate,
      protein: totalProtein,
    };

    // Cập nhật lại localStorage với công thức đã thay đổi
    localStorage.setItem("recipes", JSON.stringify(recipes));

    // Render công thức
    renderRecipeCard(recipe);
  });

  // Cập nhật phân trang
  renderPagination(totalPages);
}

// Hàm render công thức, giúp tái sử dụng mã trong khi không bị tính toán lại dữ liệu dinh dưỡng
function renderRecipeCard(recipe) {
  const recipesContainer = document.getElementById("recipes-container");

  const recipeCard = document.createElement("div");
  recipeCard.classList.add("recipe-card");

  // Thêm data-id để nhận diện công thức khi click
  recipeCard.setAttribute("data-id", recipe.id);
  console.log("Recipe ID: ", recipe.id); // In ra ID công thức để kiểm tra

  recipeCard.innerHTML = `
            <div class="header-left-recipe">
              <img class="community-icon" src="../assets/icons/Community.png" alt="" />
              <div class="recipe-tag">Community Recipes</div>
            </div>
    
            <div class="header-right-recipe">
              <h3>${recipe.name}</h3>
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
                <p>${recipe.finalWeight || 0} g</p>
                <p>${recipe.nutrients.energy || 0} kcal</p>
                <p class="recipe-fat">${recipe.nutrients.fat || 0} g</p>
                <p class="recipe-carbohydrate">${
                  recipe.nutrients.carbohydrate || 0
                } g</p>
                <p class="recipe-protein">${recipe.nutrients.protein || 0} g</p>
              </div>
            </div>
          `;

  // Thêm sự kiện click để lưu ID vào localStorage và chuyển đến trang chi tiết
  recipeCard.addEventListener("click", function (event) {
    // Lưu ID của công thức vào localStorage
    localStorage.setItem("selectedRecipeId", recipe.id); // Lưu ID vào localStorage

    // Chuyển đến trang chi tiết công thức
    window.location.href = "recipeDetail.html"; // Chuyển đến trang chi tiết mà không cần ID trong URL
  });

  recipesContainer.appendChild(recipeCard); // Thêm công thức vào container
}

// Hàm render phân trang
function renderPagination(totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = ""; // Xóa nội dung cũ

  // Thêm nút quay lại
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderRecipes();
    }
  });
  paginationContainer.appendChild(prevButton);

  // Thêm các nút trang
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderRecipes(); // Hiển thị lại công thức khi thay đổi trang
    });
    paginationContainer.appendChild(pageButton);
  }

  // Thêm nút tiếp theo
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderRecipes();
    }
  });
  paginationContainer.appendChild(nextButton);
}

// Gọi hàm renderRecipes khi trang được tải
window.addEventListener("load", () => {
  renderRecipes();
});
