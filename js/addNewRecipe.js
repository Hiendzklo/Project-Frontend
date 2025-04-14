//addNewRecipe.js
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  // Set Data
  const data = google.visualization.arrayToDataTable([
    ["Category", "Percentage"],
    ["Fat", 2.2],
    ["Carbohydrate", 95.6],
    ["Protein", 2.2],
  ]);

  // Set Options with customized colors
  const options = {
    pieSliceText: "percentage", // Hiển thị phần trăm trong các phân đoạn
    colors: ["#DB4965", "#EA9F77", "#1AB394"], // Màu sắc cho các phân đoạn
    legend: { position: "bottom", alignment: "center" }, // Vị trí của phần giải thích
  };

  // Draw the chart
  const chart = new google.visualization.PieChart(
    document.getElementById("myChart")
  );
  chart.draw(data, options);
}

// Giả sử thực phẩm sẽ được load từ localStorage
let foods = [];
let filteredFoods = [];

// Biến phân trang
let currentPage = 1;
let itemsPerPage = 3; // Số lượng thực phẩm mỗi trang
let totalPages = 0; // Tổng số trang, sẽ được tính sau khi lọc thực phẩm

// Hàm gọi khi trang được tải
window.addEventListener("load", () => {
  loadFoods(); // Lấy dữ liệu thực phẩm từ localStorage và render vào form-add

  // Cập nhật tổng quantity khi trang tải lại
  const totalQuantity = localStorage.getItem("totalQuantity");
  if (totalQuantity !== null) {
    document.querySelector(".name-final-weight-text").value = totalQuantity;
  }

  // Gắn sự kiện cho tìm kiếm thực phẩm
  document.querySelector(".search-food").addEventListener("input", (event) => {
    searchFoods(event.target.value);
  });

  // Gắn sự kiện cho sắp xếp theo dưỡng chất (dropdown select)
  document
    .querySelector(".sort-nutrient")
    .addEventListener("change", (event) => {
      sortByNutrient(event.target.value);
    });

  // Gắn sự kiện cho lọc theo thể loại (category)
  document.querySelector(".all-data").addEventListener("input", (event) => {
    filterByCategory(event.target.value);
  });

  // Lắng nghe sự kiện click trên mũi tên lên
  document.getElementById("arrow-up").addEventListener("click", () => {
    toggleFoodList(); // Gọi hàm để chuyển mũi tên và ẩn/hiện bảng thực phẩm
  });

  // Lắng nghe sự kiện click trên mũi tên xuống
  document.getElementById("arrow-down").addEventListener("click", () => {
    toggleFoodList(); // Gọi hàm để chuyển mũi tên và ẩn/hiện bảng thực phẩm
  });

  // Các nút phân trang
  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      paginateFoods(currentPage);
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      paginateFoods(currentPage);
    }
  });

  // Lắng nghe sự kiện khi nhấn nút Publish
  document.querySelector(".button-publish").addEventListener("click", () => {
    saveRecipeData(); // Lưu dữ liệu khi nhấn nút Publish
  });

  // Tải lại dữ liệu từ localStorage khi trang được tải lại
  loadRecipeData();
});

// Hàm tải thực phẩm và phân trang
function loadFoods() {
  foods = JSON.parse(localStorage.getItem("foods")) || []; // Lấy thực phẩm từ localStorage
  filteredFoods = [...foods]; // Copy danh sách thực phẩm để xử lý sau

  // Render thực phẩm vào form-add
  renderFoodsInFormAdd();

  // Tải lại danh sách ingredients từ localStorage nếu có
  const storedIngredients =
    JSON.parse(localStorage.getItem("ingredients")) || [];
  const ingredientContainer = document.querySelector(".ingredients-one");

  // Duyệt qua các thực phẩm trong ingredients và hiển thị chúng
  storedIngredients.forEach((ingredient) => {
    // Kiểm tra nếu thực phẩm đã có trong DOM để tránh thêm trùng
    const existingFoodInDOM = document.querySelector(
      `.title-one[data-id="${ingredient.id}"]`
    );
    if (!existingFoodInDOM) {
      const foodItem = document.createElement("div");
      foodItem.classList.add("ingredients-one-item");
      foodItem.style.display = "flex";
      foodItem.innerHTML = `
        <div class="ingredients-one-content">
          <div class="title-one" data-id="${ingredient.id}">${ingredient.name} (${ingredient.quantity}g)</div>
          <div class="add-one">
            <i class="bi bi-plus-lg" id="add-icon"></i>
            <input class="input-one" placeholder="Add new food equivalent" type="text"/>
          </div>
        </div>
        <i class="bi bi-trash-fill trash-icon" id="trash-icon"></i>
      `;

      ingredientContainer.style.display = "flex"; // Đảm bảo phần tử .ingredients-one được hiển thị
      ingredientContainer.appendChild(foodItem);

      // Thêm sự kiện xóa cho trash icon
      foodItem.querySelector(".trash-icon").addEventListener("click", () => {
        // Xóa thực phẩm khỏi danh sách ingredients trong DOM
        foodItem.remove();

        // Lấy danh sách ingredients từ localStorage
        let storedIngredients =
          JSON.parse(localStorage.getItem("ingredients")) || [];

        // Lọc bỏ thực phẩm có id trùng với foodId trong storedIngredients
        storedIngredients = storedIngredients.filter(
          (item) => item.id !== ingredient.id
        );

        // Lưu lại danh sách đã cập nhật vào localStorage
        localStorage.setItem("ingredients", JSON.stringify(storedIngredients));

        // Cập nhật tổng quantity sau khi xóa thực phẩm
        updateTotalQuantity();
      });
    }
  });

  // Cập nhật tổng số trang sau khi tải thực phẩm
  totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  paginateFoods(currentPage);
}

// Hàm phân trang
function paginateFoods(page) {
  currentPage = page; // Cập nhật trang hiện tại

  // Tính toán số thực phẩm cần hiển thị cho trang hiện tại
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentFoods = filteredFoods.slice(start, end); // Cắt danh sách thực phẩm theo trang

  // Render lại danh sách thực phẩm
  renderFoodsInFormAdd(currentFoods);

  // Cập nhật trạng thái các nút phân trang
  updatePagination();
}

// Cập nhật giao diện phân trang
function updatePagination() {
  // Cập nhật trạng thái các nút phân trang
  document.getElementById("prev-page").style.display =
    currentPage > 1 ? "inline" : "none";
  document.getElementById("next-page").style.display =
    currentPage < totalPages ? "inline" : "none";

  // Hiển thị các nút trang
  const paginationButtons = document.querySelectorAll(".pagination button");
  paginationButtons.forEach((button) => {
    button.classList.remove("active"); // Bỏ lớp active khỏi tất cả nút
    const pageNumber = parseInt(button.textContent); // Lấy số trang
    if (pageNumber === currentPage) {
      button.classList.add("active"); // Thêm lớp active vào nút hiện tại
    }
  });
}

// Hàm render thực phẩm vào phần .form-add
function renderFoodsInFormAdd(foodsToRender = filteredFoods) {
  const foodListContainer = document.getElementById("food-list-container");
  foodListContainer.innerHTML = ""; // Xóa danh sách cũ

  // Lặp qua từng thực phẩm và render vào HTML
  foodsToRender.forEach((food) => {
    const totalNutrient = food.quantity || 0; // Lấy số lượng thực phẩm (quantity)

    const foodItem = document.createElement("div");
    foodItem.classList.add("list-table");
    foodItem.setAttribute("data-id", food.id); // Lưu ID vào data-id để tham chiếu
    foodItem.innerHTML = `
      <div class="table-header">
        <div class="table-header-content">
          <div class="table-header-tiltel">${food.name}</div>
          <div class="table-header-text">Community Recipes</div>
        </div>
        <div class="small-table">
          <div class="small-table-number">1</div>
          <div class="small-table-text">portion (${totalNutrient} grams)</div>
          <div class="small-table-data">${totalNutrient}g</div>
        </div>
      </div>
      <div class="food-data">
        <p>${food.nutrition.energy || "Unknown"} kcal</p>
        <p>${food.nutrition.fat || "Unknown"} g</p>
        <p>${food.nutrition.carbohydrate || "Unknown"} g</p>
        <p>${food.nutrition.protein || "Unknown"} g</p>
      </div>
      <i class="bi bi-plus-lg" id="add-icon-food"></i> <!-- Đã thay thế id -->
    `;

    foodListContainer.appendChild(foodItem); // Thêm phần tử thực phẩm vào danh sách
  });

  // Gắn sự kiện click cho dấu cộng
  document.querySelectorAll("#add-icon-food").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const foodId = event.target
        .closest(".list-table")
        .getAttribute("data-id");

      const storedIngredients =
        JSON.parse(localStorage.getItem("ingredients")) || [];

      const existingFood = storedIngredients.find(
        (ingredient) => ingredient.id === foodId
      );

      if (existingFood) {
        existingFood.quantity = parseFloat(existingFood.quantity || 0) + 1;
        localStorage.setItem("ingredients", JSON.stringify(storedIngredients));
        updateTotalQuantity();
      } else {
        const food = filteredFoods.find((f) => f.id === foodId);
        addFoodToIngredients(food.name);
      }
      location.reload();
    });
  });
}

// Hàm tìm kiếm thực phẩm theo tên
function searchFoods(query) {
  query = query.toLowerCase();
  filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(query)
  );
  paginateFoods(currentPage);
}

// Hàm lọc thực phẩm theo thể loại
function filterByCategory(category) {
  if (category === "all" || category === "") {
    filteredFoods = [...foods];
  } else {
    filteredFoods = foods.filter((food) =>
      food.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  paginateFoods(currentPage);
}

// Hàm sắp xếp thực phẩm theo dưỡng chất
function sortByNutrient(nutrient) {
  if (!nutrient) return;
  filteredFoods.sort((a, b) => {
    const nutrientA = parseFloat(a.nutrition[nutrient] || 0);
    const nutrientB = parseFloat(b.nutrition[nutrient] || 0);
    return nutrientB - nutrientA;
  });
  paginateFoods(currentPage);
}

// Hàm cập nhật tổng quantity
function updateTotalQuantity() {
  const storedIngredients =
    JSON.parse(localStorage.getItem("ingredients")) || [];
  const totalQuantity = storedIngredients.reduce(
    (sum, ingredient) => sum + (parseFloat(ingredient.quantity) || 0),
    0
  );
  document.querySelector(".name-final-weight-text").value = totalQuantity;
  localStorage.setItem("totalQuantity", totalQuantity);
}

// Hàm để thêm thực phẩm vào ingredients
function addFoodToIngredients(foodName) {
  const ingredientContainer = document.querySelector(".ingredients-one");

  // Kiểm tra nếu thực phẩm đã có trong danh sách
  if (
    ![...ingredientContainer.getElementsByClassName("title-one")].some((item) =>
      item.textContent.includes(foodName)
    )
  ) {
    const food = foods.find((f) => f.name === foodName); // Lấy thực phẩm từ danh sách foods
    if (!food) {
      console.error("Food not found!");
      return;
    }

    const foodItem = document.createElement("div");
    foodItem.classList.add("ingredients-one-item");
    foodItem.style.display = "flex"; // Đảm bảo phần tử ingredients-one được hiển thị khi thêm thực phẩm vào
    foodItem.innerHTML = `
      <div class="ingredients-one-content">
        <div class="title-one">${food.name} (${food.quantity}g)</div>
        <div class="add-one">
          <i class="bi bi-plus-lg" id="add-icon"></i>
          <input class="input-one" placeholder="Add new food equivalent" type="text"/>
        </div>
      </div>
      <i class="bi bi-trash-fill trash-icon" id="trash-icon"></i>
    `;

    ingredientContainer.style.display = "flex"; // Đảm bảo phần tử .ingredients-one được hiển thị
    ingredientContainer.appendChild(foodItem);

    // Lưu vào localStorage
    let storedIngredients =
      JSON.parse(localStorage.getItem("ingredients")) || [];

    // Thêm thông tin vào ingredients (bao gồm tên và số lượng)
    const ingredientData = {
      name: food.name,
      quantity: food.quantity || 0, // Lưu số lượng của thực phẩm
    };

    storedIngredients.push(ingredientData);
    localStorage.setItem("ingredients", JSON.stringify(storedIngredients)); // Lưu lại vào localStorage

    // Cập nhật tổng quantity sau khi thêm thực phẩm
    updateTotalQuantity(); // Cập nhật tổng số lượng vào ô input
  }
}

// Hàm để hiển thị vi chất dinh dưỡng
function displayMicronutrients(food) {
  const micronutrientsTableBody = document.getElementById(
    "micronutrients-table-body"
  );

  // Kiểm tra nếu có vi chất dinh dưỡng trong thực phẩm
  if (food.micronutrients) {
    for (let micronutrient in food.micronutrients) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${micronutrient}</td>
        <td>${food.micronutrients[micronutrient]} mg</td>
      `;
      micronutrientsTableBody.appendChild(row);
    }
  }
}

// Hàm để chuyển mũi tên và ẩn/hiện bảng thực phẩm
function toggleFoodList() {
  const foodListContainer = document.getElementById("food-list-container");
  const arrowUp = document.getElementById("arrow-up");
  const arrowDown = document.getElementById("arrow-down");

  if (foodListContainer.style.display !== "none") {
    foodListContainer.style.display = "none";
    arrowUp.style.display = "none"; // Ẩn mũi tên lên
    arrowDown.style.display = "inline"; // Hiển thị mũi tên xuống
  } else {
    foodListContainer.style.display = "block";
    arrowUp.style.display = "inline"; // Hiển thị mũi tên lên
    arrowDown.style.display = "none"; // Ẩn mũi tên xuống
  }
}
// Hàm để chuyển mũi tên và ẩn/hiện bảng thực phẩm
function toggleFoodList() {
  const foodListContainer = document.getElementById("food-list-container");
  const arrowUp = document.getElementById("arrow-up");
  const arrowDown = document.getElementById("arrow-down");

  if (foodListContainer.style.display !== "none") {
    foodListContainer.style.display = "none";
    arrowUp.style.display = "none"; // Ẩn mũi tên lên
    arrowDown.style.display = "inline"; // Hiển thị mũi tên xuống
  } else {
    foodListContainer.style.display = "block";
    arrowUp.style.display = "inline"; // Hiển thị mũi tên lên
    arrowDown.style.display = "none"; // Ẩn mũi tên xuống
  }
}

// Hàm để hiển thị công thức từ localStorage
function loadRecipeData() {
  const recipeId = localStorage.getItem("selectedRecipeId");
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const recipe = recipes.find((r) => r.id === parseInt(recipeId));

  if (recipe) {
    const nameTextElement = document.querySelector(".name-text");
    if (nameTextElement) nameTextElement.value = recipe.name || "";

    const descriptionTextElement = document.querySelector(".description-text");
    if (descriptionTextElement)
      descriptionTextElement.value = recipe.description || "";

    const authorTextElement = document.querySelector(".author-text");
    if (authorTextElement) authorTextElement.value = recipe.author || "";

    const totalTimeTextElement = document.querySelector(".total-time-text");
    if (totalTimeTextElement)
      totalTimeTextElement.value = recipe.totalTime || "";

    const preparationTimeTextElement = document.querySelector(
      ".preparation-time-text"
    );
    if (preparationTimeTextElement)
      preparationTimeTextElement.value = recipe.preparationTime || "";

    const finalWeightTextElement = document.querySelector(".final-weight-text");
    if (finalWeightTextElement)
      finalWeightTextElement.value = recipe.finalWeight || "";

    const portionsTextElement = document.querySelector(".portions-text");
    if (portionsTextElement) portionsTextElement.value = recipe.portions || "";

    const methodTextElement = document.querySelector(".method-text");
    if (methodTextElement) methodTextElement.innerText = recipe.method || "";

    const categoryTextElement = document.querySelector(".category-text");
    if (categoryTextElement) {
      categoryTextElement.innerText = recipe.category || "Unknown";
    }

    const ingredientsContainer = document.querySelector(".ingredient-input");
    if (ingredientsContainer) {
      ingredientsContainer.innerHTML = "";
      recipe.ingredients.forEach((ingredient) => {
        const ingredientElement = document.createElement("div");
        ingredientElement.classList.add("ingredient-input");
        ingredientElement.textContent = `${ingredient.name} (${ingredient.quantity}g)`;
        ingredientsContainer.appendChild(ingredientElement);
      });
    }
  } else {
    console.log("No recipe found with this ID.");
  }
}

// Gọi hàm khi trang được tải
window.addEventListener("load", loadRecipeData);

// Biến cờ để tránh lưu dữ liệu nhiều lần
let isSaving = false;

// Hàm lưu công thức vào localStorage
function saveRecipeData() {
  if (isSaving) return;

  isSaving = true;

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const ingredients = JSON.parse(localStorage.getItem("ingredients")) || [];

  const nameTextElement = document.querySelector(".name-text");
  const nameTextDescriptionElement = document.querySelector(
    ".name-text-description"
  );
  const nameFinalWeightTextElement = document.querySelector(
    ".name-final-weight-text"
  );
  const portionsTextElement = document.querySelector(".portions-text");
  const totalTimeTextElement = document.querySelector(".total-time-text");
  const prepTimeTextElement = document.querySelector(".preparation-time-text");
  const methodTextElement = document.querySelector(".method-text");
  const categorySelectElement = document.querySelector(".vegetable-text");

  const ingredientsData = ingredients.map((ingredient) => ({
    name: ingredient.name,
    quantity: ingredient.quantity,
  }));

  const recipeData = {
    id: Date.now(),
    name: nameTextElement.value,
    description: nameTextDescriptionElement.value,
    totalTime: totalTimeTextElement.value,
    preparationTime: prepTimeTextElement.value,
    finalWeight: nameFinalWeightTextElement.value,
    portions: portionsTextElement.value,
    ingredients: ingredientsData,
    method: methodTextElement.value,
    category: categorySelectElement.value,
  };

  // Kiểm tra trùng lặp dựa trên ID
  const isDuplicate = recipes.some((recipe) => recipe.id === recipeData.id);

  if (isDuplicate) {
    isSaving = false;
    return;
  }

  recipes.push(recipeData);
  localStorage.setItem("recipes", JSON.stringify(recipes));

  isSaving = false;
}

// Hàm để cập nhật tên người dùng động từ localStorage
function updateUsername() {
  // Lấy đối tượng người dùng từ localStorage
  const users = JSON.parse(localStorage.getItem("users"));

  // Kiểm tra xem có người dùng trong localStorage không và nó không rỗng
  if (users) {
    let username;

    // Nếu users là một mảng, lấy tên người dùng từ người dùng đầu tiên
    if (Array.isArray(users)) {
      username = users[0].username; // Lấy tên người dùng của người dùng đầu tiên
    } else {
      // Nếu users là một đối tượng, chỉ cần lấy tên người dùng trực tiếp
      username = users.username;
    }

    // Nếu có tên người dùng, cập nhật span với tên người dùng
    if (username) {
      document.querySelector(".user-info span").textContent = username;
    }
  } else {
    // Nếu không có người dùng trong localStorage, đặt giá trị mặc định
    document.querySelector(".user-info span").textContent = "Guest";
  }
}

// Gọi hàm khi trang được tải
document.addEventListener("DOMContentLoaded", updateUsername);

function logout() {
  // Xóa thông tin đăng nhập khỏi localStorage
  localStorage.removeItem("currentUser");
  // Chuyển hướng về trang đăng nhập
  window.location.href = "login.html";
}
