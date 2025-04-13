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
let itemsPerPage = 1; // Số lượng thực phẩm mỗi trang
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

// Hàm hiển thị dữ liệu công thức từ localStorage
function loadRecipeData() {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  // Kiểm tra nếu có công thức
  if (recipes.length > 0) {
    const latestRecipe = recipes[recipes.length - 1]; // Lấy công thức mới nhất

    // Lấy các phần tử input và gán giá trị từ localStorage vào
    const nameTextElement = document.querySelector(".name-text");
    const nameTextDescriptionElement = document.querySelector(
      ".name-text-description"
    );
    const nameFinalWeightTextElement = document.querySelector(
      ".name-final-weight-text"
    );
    const portionsTextElement = document.querySelector(".portions-text");
    const totalTimeTextElement = document.querySelector(".total-time-text");
    const prepTimeTextElement = document.querySelector(
      ".preparation-time-text"
    );

    // Kiểm tra nếu phần tử tồn tại và nếu trường name-final-weight-text đang trống
    if (nameTextElement) nameTextElement.value = latestRecipe.name || "";
    if (nameTextDescriptionElement)
      nameTextDescriptionElement.value = latestRecipe.description || "";

    // Chỉ gán giá trị cho name-final-weight-text nếu trường trống
    if (nameFinalWeightTextElement && !nameFinalWeightTextElement.value) {
      nameFinalWeightTextElement.value = latestRecipe.finalWeight || "";
    }

    if (portionsTextElement)
      portionsTextElement.value = latestRecipe.portions || "";
    if (totalTimeTextElement)
      totalTimeTextElement.value = latestRecipe.totalTime || "";
    if (prepTimeTextElement)
      prepTimeTextElement.value = latestRecipe.preparationTime || "";
  }
}

// Biến cờ để tránh lưu dữ liệu nhiều lần
let isSaving = false;

// Hàm lưu công thức vào localStorage
function saveRecipeData() {
  // Kiểm tra nếu đang lưu, không cho phép thêm nữa
  if (isSaving) {
    return; // Nếu công thức đang được lưu, không cho phép lưu lại
  }

  // Đánh dấu đang lưu công thức
  isSaving = true;

  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const ingredients = JSON.parse(localStorage.getItem("ingredients")) || []; // Lấy danh sách ingredients hiện có từ localStorage

  // Lấy dữ liệu từ các input, kiểm tra sự tồn tại của các phần tử trước khi lấy giá trị
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

  // Lấy dữ liệu từ ô input .method-text (phương pháp)
  const methodTextElement = document.querySelector(".method-text"); // Ô input cho phương pháp

  // Lấy dữ liệu từ select .vegetable-text (category)
  const categorySelectElement = document.querySelector(".vegetable-text"); // Ô select cho thể loại
  const categoryValue = categorySelectElement
    ? categorySelectElement.value
    : "all"; // Lấy giá trị đã chọn

  // Lấy danh sách thực phẩm từ localStorage và chuyển thành đối tượng name và quantity
  const ingredientsData = ingredients.map((ingredient) => ({
    name: ingredient.name,
    quantity: ingredient.quantity,
  }));

  // Tạo đối tượng chứa thông tin công thức
  const recipeData = {
    id: Date.now(), // Tạo ID duy nhất cho công thức
    name: nameTextElement ? nameTextElement.value : "",
    description: nameTextDescriptionElement
      ? nameTextDescriptionElement.value
      : "",
    totalTime: totalTimeTextElement ? totalTimeTextElement.value : "",
    preparationTime: prepTimeTextElement ? prepTimeTextElement.value : "",
    finalWeight: nameFinalWeightTextElement
      ? nameFinalWeightTextElement.value
      : "",
    portions: portionsTextElement ? portionsTextElement.value : "",
    ingredients: ingredientsData, // Lưu thông tin về thực phẩm (name và quantity)
    method: methodTextElement ? methodTextElement.value : "", // Lưu phương pháp từ input .method-text
    category: categoryValue, // Lưu category từ select .vegetable-text
  };

  // Kiểm tra xem công thức đã có trong localStorage chưa (tránh thêm trùng lặp)
  const isDuplicate = recipes.some((recipe) => recipe.name === recipeData.name);

  if (isDuplicate) {
    isSaving = false; // Đánh dấu kết thúc lưu
    return;
  }

  // Thêm công thức mới vào danh sách công thức
  recipes.push(recipeData);

  // Lưu lại mảng công thức vào localStorage
  localStorage.setItem("recipes", JSON.stringify(recipes));

  // Đánh dấu kết thúc lưu
  isSaving = false;
}
