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

// Hàm gọi khi trang được tải
window.addEventListener("load", () => {
  loadFoods(); // Lấy dữ liệu thực phẩm từ localStorage và render vào form-add

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
});

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
}

// Hàm render thực phẩm vào phần .form-add
function renderFoodsInFormAdd() {
  const foodListContainer = document.getElementById("food-list-container");
  foodListContainer.innerHTML = ""; // Xóa danh sách cũ

  // Lặp qua từng thực phẩm và render vào HTML
  filteredFoods.forEach((food) => {
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
      // Lấy ID của thực phẩm từ data-id
      const foodId = event.target
        .closest(".list-table")
        .getAttribute("data-id");

      // Kiểm tra xem thực phẩm đã có trong ingredients chưa
      const storedIngredients =
        JSON.parse(localStorage.getItem("ingredients")) || [];

      // Tìm thực phẩm trong danh sách ingredients theo ID
      const existingFood = storedIngredients.find(
        (ingredient) => ingredient.id === foodId
      );

      if (existingFood) {
        // Nếu thực phẩm đã có, cập nhật lại số lượng (quantity)
        existingFood.quantity = parseFloat(existingFood.quantity || 0) + 1; // Cộng thêm số lượng

        // Lưu lại danh sách ingredients đã cập nhật vào localStorage
        localStorage.setItem("ingredients", JSON.stringify(storedIngredients));

        // Cập nhật tổng quantity sau khi thêm thực phẩm
        updateTotalQuantity(); // Cập nhật lại tổng số lượng trong ô input

        // Cập nhật lại thông tin quantity trong giao diện theo ID
        const foodItems = document.querySelectorAll(
          `.ingredients-one-item[data-id="${foodId}"] .title-one`
        );
        foodItems.forEach((item) => {
          // Kiểm tra xem ID có trùng với ID trong item không
          if (
            item.closest(".ingredients-one-item").getAttribute("data-id") ===
            foodId
          ) {
            const quantityText = item.textContent.split("(")[0];
            item.textContent = `${quantityText} (${existingFood.quantity}g)`;
          }
        });
      } else {
        // Nếu thực phẩm chưa có, tìm food trong filteredFoods và thêm vào ingredients
        const food = filteredFoods.find((f) => f.id === foodId); // Lấy thực phẩm từ filteredFoods
        addFoodToIngredients(food.name); // Thêm thực phẩm vào Ingredients
      }
      location.reload();
      console.log("Food added to ingredients:", foodId);
    });
  });
}

// Hàm tính tổng dinh dưỡng (không bao gồm kcal)
function calculateTotalNutrients(food) {
  const fat = parseFloat(food.nutrition.fat || 0);
  const carbohydrate = parseFloat(food.nutrition.carbohydrate || 0);
  const protein = parseFloat(food.nutrition.protein || 0);

  return fat + carbohydrate + protein; // Tính tổng dinh dưỡng mà không tính energy
}

// Hàm tìm kiếm thực phẩm theo tên
function searchFoods(query) {
  query = query.toLowerCase(); // Chuyển từ khóa tìm kiếm thành chữ thường
  filteredFoods = foods.filter(
    (food) => food.name.toLowerCase().includes(query) // Lọc thực phẩm theo tên
  );
  renderFoodsInFormAdd(); // Tải lại danh sách thực phẩm sau khi tìm kiếm
}

// Hàm lọc thực phẩm theo thể loại
function filterByCategory(category) {
  if (category === "all" || category === "") {
    filteredFoods = [...foods]; // Hiển thị tất cả thực phẩm nếu chọn "all"
  } else {
    filteredFoods = foods.filter((food) =>
      food.category.toLowerCase().includes(category.toLowerCase())
    ); // Lọc theo thể loại
  }
  renderFoodsInFormAdd(); // Tải lại danh sách thực phẩm sau khi lọc
}

// Hàm sắp xếp thực phẩm theo dưỡng chất
function sortByNutrient(nutrient) {
  if (!nutrient) return; // Nếu không có dưỡng chất chọn, không làm gì

  filteredFoods.sort((a, b) => {
    const nutrientA = parseFloat(a.nutrition[nutrient] || 0);
    const nutrientB = parseFloat(b.nutrition[nutrient] || 0);
    return nutrientB - nutrientA; // Sắp xếp từ cao đến thấp
  });

  renderFoodsInFormAdd(); // Tải lại danh sách thực phẩm sau khi sắp xếp
}
// Hàm cập nhật tổng quantity
function updateTotalQuantity() {
  // Lấy danh sách ingredients từ localStorage
  const storedIngredients =
    JSON.parse(localStorage.getItem("ingredients")) || [];

  // Tính tổng quantity của các thực phẩm, chuyển đổi sang kiểu số nếu cần
  const totalQuantity = storedIngredients.reduce(
    (sum, ingredient) => sum + (parseFloat(ingredient.quantity) || 0), // Sử dụng parseFloat để chuyển thành số
    0
  );

  // Cập nhật giá trị vào input
  document.querySelector(".name-final-weight-text").value = totalQuantity;

  // Lưu tổng quantity vào localStorage
  localStorage.setItem("totalQuantity", totalQuantity);
}

// Hàm gọi khi trang được tải lại
window.addEventListener("load", () => {
  // Cập nhật tổng quantity khi trang tải lại
  const totalQuantity = localStorage.getItem("totalQuantity");
  if (totalQuantity !== null) {
    document.querySelector(".name-final-weight-text").value = totalQuantity;
  }

  // Tiến hành các bước khác, ví dụ tải dữ liệu thực phẩm từ localStorage
  loadFoods();
});

// Hàm gọi khi thực phẩm được thêm vào ingredients
function addFoodToIngredients(foodName) {
  const ingredientContainer = document.querySelector(".ingredients-one");

  // Kiểm tra xem thực phẩm đã có trong danh sách chưa
  if (
    ![...ingredientContainer.getElementsByClassName("title-one")].some((item) =>
      item.textContent.includes(foodName)
    )
  ) {
    // Lấy thực phẩm từ danh sách foods
    const food = foods.find((f) => f.name === foodName); // Lấy thực phẩm từ danh sách foods

    // Kiểm tra nếu food có tồn tại
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
            <input
              class="input-one"
              placeholder="Add new food equivalent"
              type="text"
            />
          </div>
        </div>
        <i class="bi bi-trash-fill trash-icon" id="trash-icon"></i>
      `;

    // Thêm thực phẩm vào danh sách ingredient
    ingredientContainer.style.display = "flex"; // Đảm bảo phần tử .ingredients-one được hiển thị
    ingredientContainer.appendChild(foodItem);

    // Lưu vào localStorage
    let storedIngredients =
      JSON.parse(localStorage.getItem("ingredients")) || [];
    const ingredientData = {
      id: food.id, // Giả sử thực phẩm có ID
      name: food.name,
      nutrition: food.nutrition, // Thông tin dinh dưỡng
      quantity: food.quantity || 0, // Số lượng của thực phẩm
    };
    storedIngredients.push(ingredientData);
    localStorage.setItem("ingredients", JSON.stringify(storedIngredients)); // Lưu lại vào localStorage

    // Cập nhật tổng quantity sau khi thêm thực phẩm
    updateTotalQuantity(); // Cập nhật tổng số lượng vào ô input

    // Thêm sự kiện xóa cho trash icon
    foodItem.querySelector(".trash-icon").addEventListener("click", () => {
      // Lấy id thực phẩm từ food
      const foodId = food.id;

      // Xóa thực phẩm khỏi danh sách ingredients trong DOM
      foodItem.remove(); // Xóa phần tử foodItem khỏi DOM

      // Lấy danh sách ingredients từ localStorage
      let storedIngredients =
        JSON.parse(localStorage.getItem("ingredients")) || [];

      // Lọc bỏ thực phẩm có id trùng với foodId trong storedIngredients
      storedIngredients = storedIngredients.filter(
        (item) => item.id !== foodId
      );

      // Lưu lại danh sách đã cập nhật vào localStorage
      localStorage.setItem("ingredients", JSON.stringify(storedIngredients));

      // Cập nhật tổng quantity sau khi xóa thực phẩm
      updateTotalQuantity(); // Cập nhật lại tổng số lượng trong ô input
    });

    console.log("Food added to ingredients:", food.name);
  }
}

// Hàm để chuyển mũi tên và ẩn/hiện bảng thực phẩm
function toggleFoodList() {
  const foodListContainer = document.getElementById("food-list-container");
  const arrowUp = document.getElementById("arrow-up");
  const arrowDown = document.getElementById("arrow-down");

  // Nếu bảng thực phẩm đang hiển thị, ẩn nó và chuyển mũi tên
  if (foodListContainer.style.display !== "none") {
    foodListContainer.style.display = "none";
    arrowUp.style.display = "none"; // Ẩn mũi tên lên
    arrowDown.style.display = "inline"; // Hiển thị mũi tên xuống
  } else {
    // Nếu bảng thực phẩm đang ẩn, hiển thị nó và chuyển mũi tên
    foodListContainer.style.display = "block";
    arrowUp.style.display = "inline"; // Hiển thị mũi tên lên
    arrowDown.style.display = "none"; // Ẩn mũi tên xuống
  }
}
