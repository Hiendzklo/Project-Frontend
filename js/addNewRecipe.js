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

///
let foods = [];
let filteredFoods = [];

// Hàm gọi khi trang được tải
window.addEventListener("load", () => {
  loadFoods(); // Lấy dữ liệu thực phẩm từ localStorage và render vào form-add

  // Gắn sự kiện cho tìm kiếm thực phẩm
  document.querySelector(".search-food").addEventListener("input", (event) => {
    searchFoods(event.target.value);
    console.log("Searching with:", event.target.value);
  });

  // Gắn sự kiện cho sắp xếp theo dưỡng chất (dropdown select)
  document
    .querySelector(".sort-nutrient")
    .addEventListener("change", (event) => {
      sortByNutrient(event.target.value);
      console.log("Sorting by:", event.target.value);
    });

  // Gắn sự kiện cho lọc theo thể loại (category)
  document.querySelector(".all-data").addEventListener("input", (event) => {
    filterByCategory(event.target.value);
    console.log("Category Filtered:", event.target.value);
  });
});

// Hàm load foods từ localStorage
function loadFoods() {
  foods = JSON.parse(localStorage.getItem("foods")) || []; // Lấy thực phẩm từ localStorage
  filteredFoods = [...foods]; // Copy danh sách thực phẩm để xử lý sau

  renderFoodsInFormAdd(); // Render thực phẩm vào form-add
}

// Hàm render thực phẩm vào phần .form-add
// Hàm render thực phẩm vào phần .form-add
function renderFoodsInFormAdd() {
  const foodListContainer = document.getElementById("food-list-container");
  foodListContainer.innerHTML = ""; // Xóa danh sách cũ

  // Lặp qua từng thực phẩm và render vào HTML
  filteredFoods.forEach((food) => {
    const totalNutrient = food.quantity || 0; // Lấy số lượng thực phẩm (quantity)

    const foodItem = document.createElement("div");
    foodItem.classList.add("list-table");
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
        <i class="bi bi-plus-lg" id="add-icon-food"></i>
      `;

    foodListContainer.appendChild(foodItem); // Thêm phần tử thực phẩm vào danh sách
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
