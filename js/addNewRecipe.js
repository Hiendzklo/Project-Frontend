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
// Biến toàn cục
let currentPage = 1;
const ITEMS_PER_PAGE = 9;
let foods = [];
let filteredFoods = [];

// Hàm gọi khi trang được tải
window.addEventListener("load", () => {
  loadFoods(); // Load thực phẩm từ localStorage

  // Gắn sự kiện cho tìm kiếm
  document.querySelector(".search-food").addEventListener("input", (event) => {
    searchFoods(event.target.value);
    console.log("Searching with:", event.target.value);
  });

  // Gắn sự kiện cho sắp xếp theo dưỡng chất
  document
    .querySelector(".sort-nutrient")
    .addEventListener("change", (event) => {
      sortByNutrient(event.target.value);
      console.log("Sorting by:", event.target.value);
    });
});

// Hàm load foods từ localStorage
function loadFoods() {
  foods = JSON.parse(localStorage.getItem("foods")) || []; // Lấy thực phẩm từ localStorage
  filteredFoods = [...foods]; // Lọc thực phẩm theo nhu cầu

  renderFoodsInFormAdd(); // Render thực phẩm vào phần .form-add
}

// Hàm render thực phẩm vào .form-add
function renderFoodsInFormAdd() {
  const formAddContainer = document.querySelector(".form-add");
  formAddContainer.innerHTML = ""; // Làm sạch danh sách thực phẩm hiện tại trong phần form-add

  // Render danh sách thực phẩm
  foods.forEach((food) => {
    const foodItem = document.createElement("div");
    foodItem.classList.add("form-header");
    foodItem.innerHTML = `
      <i class="bi bi-chevron-up" id="arrow-up"></i>
      <div class="food-title">${food.name}</div>
      <input class="add-ingredient" type="text" placeholder="Add new food equivalent" />
      <i class="bi bi-trash-fill" id="trash-icon"></i>
    `;

    formAddContainer.appendChild(foodItem);
  });
}

// Hàm tìm kiếm thực phẩm
function searchFoods(query) {
  query = query.toLowerCase(); // Chuyển từ khóa tìm kiếm thành chữ thường
  filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(query)
  ); // Lọc theo tên thực phẩm
  loadFoods(); // Tải lại thực phẩm sau khi tìm kiếm
}

// Hàm lọc theo dưỡng chất
function sortByNutrient(nutrient) {
  if (!nutrient) return; // Nếu không có dưỡng chất chọn, không làm gì

  // Sắp xếp thực phẩm theo dưỡng chất từ cao đến thấp
  filteredFoods.sort((a, b) => {
    const nutrientA = parseFloat(a.nutrition[nutrient] || 0);
    const nutrientB = parseFloat(b.nutrition[nutrient] || 0);
    return nutrientB - nutrientA;
  });

  loadFoods(); // Tải lại thực phẩm sau khi sắp xếp
}

// Hàm thêm thực phẩm vào danh sách
document.querySelector(".add-ingredient").addEventListener("input", (event) => {
  const newFood = {
    id: Date.now().toString(),
    name: event.target.value,
    nutrition: {
      energy: "Unknown",
      fat: "Unknown",
      carbohydrate: "Unknown",
      protein: "Unknown",
    },
  };

  foods.push(newFood); // Thêm thực phẩm mới vào danh sách
  localStorage.setItem("foods", JSON.stringify(foods)); // Lưu danh sách vào localStorage
  loadFoods(); // Tải lại thực phẩm sau khi thêm mới
});

// Lưu thực phẩm vào localStorage khi có thay đổi
function saveFoodsToLocalStorage() {
  localStorage.setItem("foods", JSON.stringify(foods)); // Lưu thực phẩm vào localStorage
}

// Khi người dùng thay đổi thực phẩm
function updateFoodInList(updatedFood) {
  const index = foods.findIndex((food) => food.id === updatedFood.id);
  if (index !== -1) {
    foods[index] = updatedFood;
    saveFoodsToLocalStorage(); // Lưu lại thực phẩm đã cập nhật
    loadFoods(); // Tải lại danh sách thực phẩm
  }
}
