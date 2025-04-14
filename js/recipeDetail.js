// Vẽ biểu đồ dinh dưỡng
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  // Set Data cho biểu đồ dinh dưỡng
  const data = google.visualization.arrayToDataTable([
    ["Category", "Percentage"],
    ["Fat", 38.3],
    ["Carbohydrate", 48.9],
    ["Protein", 12.8],
  ]);

  // Set Options với màu sắc tùy chỉnh
  const options = {
    pieSliceText: "percentage", // Hiển thị phần trăm trong các phân đoạn
    colors: ["#DB4965", "#EA9F77", "#1AB394"], // Màu sắc cho các phân đoạn
    legend: { position: "bottom", alignment: "center" }, // Vị trí của phần giải thích
  };

  // Vẽ biểu đồ
  const chart = new google.visualization.PieChart(
    document.getElementById("myChart")
  );
  chart.draw(data, options);
}

// Hàm để hiển thị công thức từ localStorage
function loadRecipeDetails() {
  // Lấy ID của công thức từ localStorage (thay vì từ URL)
  const recipeId = localStorage.getItem("selectedRecipeId");
  console.log("Recipe ID from localStorage: ", recipeId); // Kiểm tra ID trong localStorage

  // Lấy danh sách công thức từ localStorage
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  console.log("Recipes from localStorage: ", recipes); // Kiểm tra danh sách công thức trong localStorage

  // Tìm công thức với ID tương ứng
  const recipe = recipes.find((r) => r.id === parseInt(recipeId));
  console.log("Found recipe: ", recipe); // Kiểm tra công thức tìm thấy

  // Kiểm tra nếu có công thức
  if (recipe) {
    // Cập nhật thông tin công thức vào các phần tử HTML
    document.querySelector(".name-text").value = recipe.name || "";
    document.querySelector(".description-text").value =
      recipe.description || "";
    document.querySelector(".author-text").value = recipe.author || "";
    document.querySelector(".total-time-text").value = recipe.totalTime || "";
    document.querySelector(".preparation-time-text").value =
      recipe.preparationTime || "";
    document.querySelector(".final-weight-text").value =
      recipe.finalWeight || "";
    document.querySelector(".portions-text").value = recipe.portions || "";

    // Cập nhật method text (công thức chế biến)
    document.querySelector(".method-text").innerText = recipe.method || "";

    // Cập nhật category (thể loại) từ localStorage vào phần tử category-text
    const categoryTextElement = document.querySelector(".category-text");
    if (categoryTextElement) {
      categoryTextElement.innerText = recipe.category || "Unknown";
    }

    // Cập nhật ingredients nếu có
    const ingredientsContainer = document.querySelector(".ingredient-input");
    ingredientsContainer.innerHTML = ""; // Làm sạch trước khi thêm mới

    recipe.ingredients.forEach((ingredient) => {
      const ingredientElement = document.createElement("div");
      ingredientElement.classList.add("ingredient-input");
      ingredientElement.textContent = `${ingredient.name} (${ingredient.quantity}g)`;
      ingredientsContainer.appendChild(ingredientElement);
    });
  } else {
    console.log("No recipe found with this ID.");
  }
}

// Gọi hàm khi trang được tải
window.addEventListener("load", loadRecipeDetails);

// Function to save recipe to localStorage
function saveToFavourites(recipe) {
  // Get current favourites from localStorage
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  // Check if the recipe already exists in favourites
  const exists = favourites.some((item) => item.name === recipe.name);

  if (!exists) {
    // If not, add it to the list
    favourites.push(recipe);
    // Save updated list to localStorage
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }
}

// Function to update UI (heart icon)
function updateHeartIcon(isFavourite) {
  const heartIcon = document.getElementById("heart-icon");
  const favouriteAddText = document.querySelector(".favorite-add");

  if (isFavourite) {
    heartIcon.classList.add("bi-heart-fill");
    heartIcon.classList.remove("bi-suit-heart-fill");
    favouriteAddText.textContent = "Added to favourite";
  } else {
    heartIcon.classList.remove("bi-heart-fill");
    heartIcon.classList.add("bi-suit-heart-fill");
    favouriteAddText.textContent = "Add to favourite";
  }
}

// Event listener for the "Add to favourite" button
document.querySelector(".favorite-tag").addEventListener("click", function () {
  // Get the recipe data from the page
  const recipe = {
    name: document.querySelector(".name-text").value,
    author: document.querySelector(".author-text").value,
    category: document.querySelector(".category-text").textContent, // Assuming this is already populated dynamically
    quantity: document.querySelector(".final-weight-text").value,
    nutrient: {
      energy: document.querySelector(".number-kcal").textContent,
      fat: document.querySelector(".circle-fat").textContent,
      carbohydrate: document.querySelector(".circle-Carbohydrate").textContent,
      protein: document.querySelector(".circle-Protein").textContent,
      fiber: document.querySelector(".circle-Fiber").textContent,
    },
  };

  // Check if this recipe is already a favourite
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const isFavourite = favourites.some((item) => item.name === recipe.name);

  if (isFavourite) {
    alert("This recipe is already in your favourites!");
  } else {
    // Save the recipe to favourites
    saveToFavourites(recipe);
    // Update the heart icon and button text
    updateHeartIcon(true);
  }
});
function logout() {
  // Xóa thông tin đăng nhập khỏi localStorage
  localStorage.removeItem("currentUser");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "login.html";
}
