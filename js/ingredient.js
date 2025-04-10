// Biến toàn cục
let currentPage = 1; // Trang hiện tại
const ITEMS_PER_PAGE = 9; // Số lượng thực phẩm mỗi trang
let foods = []; // Danh sách tất cả thực phẩm
let filteredFoods = []; // Danh sách thực phẩm đã lọc và sắp xếp

// Hàm gọi khi trang được tải
window.addEventListener("DOMContentLoaded", () => {
  loadFoods(); // Tải thực phẩm khi trang được tải
  // Gắn sự kiện cho tìm kiếm
  document.querySelector(".search-input").addEventListener("input", (event) => {
    searchFoods(event.target.value); // Gọi hàm tìm kiếm khi người dùng nhập
  });

  // Gắn sự kiện cho lọc theo thể loại
  document
    .querySelector(".category-input")
    .addEventListener("change", (event) => {
      filterByCategory(event.target.value); // Gọi hàm lọc theo thể loại
    });

  // Gắn sự kiện cho sắp xếp theo dưỡng chất
  document.querySelector(".sort-input").addEventListener("change", (event) => {
    sortByNutrient(event.target.value); // Gọi hàm sắp xếp theo dưỡng chất
  });
});

// Hàm load foods từ localStorage
function loadFoods() {
  foods = JSON.parse(localStorage.getItem("foods")) || []; // Lấy danh sách thực phẩm từ localStorage
  console.log("foods loaded: ", foods); // Kiểm tra dữ liệu đã load

  filteredFoods = [...foods]; // Bắt đầu bằng danh sách tất cả thực phẩm

  const foodList = document.querySelector(".list-food");
  foodList.innerHTML = ""; // Làm sạch danh sách thực phẩm

  // Tính toán chỉ số của thực phẩm cần hiển thị dựa trên trang hiện tại
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const foodsToDisplay = filteredFoods.slice(startIndex, endIndex); // Lấy các thực phẩm cho trang hiện tại
  console.log("Displaying foods: ", foodsToDisplay); // Kiểm tra thực phẩm đang hiển thị

  foodsToDisplay.forEach((food) => {
    renderFood(food);
  });

  // Hiển thị các nút phân trang
  renderPagination();
}

// Hàm render thực phẩm vào danh sách
function renderFood(food) {
  const foodList = document.querySelector(".list-food");

  const foodItem = document.createElement("div");
  foodItem.classList.add("food-one");
  foodItem.dataset.id = food.id; // Thêm ID cho từng thực phẩm
  foodItem.innerHTML = `
    <table class="nutrition-table">
      <thead>
        <tr>
          <th class="food-one-left-header">${food.name}</th>
          <th></th>
          <th></th>
          <th class="item1">${food.nutrition.energy} kcal</th>
          <th class="item1">${food.nutrition.fat} g</th>
          <th class="item1">${food.nutrition.carbohydrate} g</th>
          <th class="item1">${food.nutrition.protein} g</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="food-one-left-next">${food.source}</td>
          <td class="item2" style="display: none;">${food.category}</td>
          <td class="item2" style="display: none;">${food.quantity} g</td>
          <td class="item2" style="display: none;">${food.micronutrients.cholesterol}</td>
          <td class="item2" style="display: none;">${food.micronutrients.fiber}</td>
          <td class="item2" style="display: none;">${food.micronutrients.sodium}</td>
          <td class="item2" style="display: none;">${food.micronutrients.water}</td>
          <td class="item2" style="display: none;">${food.micronutrients.vitaminA}</td>
          <td class="item2" style="display: none;">${food.micronutrients.vitaminB6}</td>
          <td class="item2" style="display: none;">${food.micronutrients.calcium}</td>
          <td class="item2" style="display: none;">${food.micronutrients.iron}</td>
          <td class="item2" style="display: none;">${food.micronutrients.zinc}</td>
          <td class="item2" style="display: none;">${food.micronutrients.magnesium}</td>
        </tr>
      </tbody>
    </table>
  `;

  foodItem.onclick = function () {
    openFoodModal(food);
  };

  foodList.appendChild(foodItem);
}

// Hàm hiển thị các nút phân trang
function renderPagination() {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = ""; // Làm sạch các nút phân trang hiện tại

  const totalPages = Math.ceil(filteredFoods.length / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("pagination-button");

    pageButton.onclick = function () {
      currentPage = i;
      loadFoods(); // Tải lại thực phẩm khi chuyển trang
    };

    pagination.appendChild(pageButton);
  }
}

// Hàm tìm kiếm thực phẩm theo tên
function searchFoods(query) {
  query = query.toLowerCase(); // Chuyển từ khóa tìm kiếm thành chữ thường
  filteredFoods = foods.filter(
    (food) => food.name.toLowerCase().includes(query) // Kiểm tra tên thực phẩm có chứa từ khóa không
  );
  currentPage = 1; // Reset về trang 1 khi tìm kiếm
  loadFoods(); // Tải lại danh sách thực phẩm sau khi lọc
}

// Hàm lọc theo thể loại (category)
function filterByCategory(category) {
  if (category === "all") {
    filteredFoods = [...foods]; // Hiển thị tất cả thực phẩm
  } else {
    filteredFoods = foods.filter((food) => food.category === category); // Lọc theo thể loại
  }
  currentPage = 1; // Reset về trang 1 khi lọc
  loadFoods(); // Tải lại thực phẩm sau khi lọc
}

// Hàm sắp xếp theo dưỡng chất (Energy, Fat, Carbohydrate, Protein)
function sortByNutrient(nutrient) {
  if (!nutrient) return;
  filteredFoods.sort((a, b) => {
    const nutrientA = parseFloat(a.nutrition[nutrient]);
    const nutrientB = parseFloat(b.nutrition[nutrient]);
    return nutrientA - nutrientB; // Sắp xếp từ thấp đến cao
  });
  currentPage = 1; // Reset về trang 1 khi sắp xếp
  loadFoods(); // Tải lại thực phẩm sau khi sắp xếp
}

// Hàm mở modal thêm thực phẩm mới
function openAddNewFoodModal() {
  document.getElementById("modalAddNewFood").style.display = "flex";
}

// Hàm đóng modal thêm thực phẩm mới
function closeAddNewFoodModal() {
  document.getElementById("modalAddNewFood").style.display = "none";
}

// Hàm mở modal chỉnh sửa thực phẩm
function openFoodModal(food) {
  document.getElementById("modalEditFood").style.display = "flex";

  document.getElementById("food-name-edit").value = food.name || "";
  document.getElementById("food-source-edit").value = food.source || "";
  document.getElementById("food-category-edit").value = food.category || "";
  document.getElementById("food-quantity-edit").value = food.quantity || "";

  document.getElementById("food-energy-edit").value =
    food.nutrition?.energy || "";
  document.getElementById("food-fat-edit").value = food.nutrition?.fat || "";
  document.getElementById("food-carbohydrate-edit").value =
    food.nutrition?.carbohydrate || "";
  document.getElementById("food-protein-edit").value =
    food.nutrition?.protein || "";

  document.getElementById("food-cholesterol-edit").value =
    food.micronutrients?.cholesterol || "";
  document.getElementById("food-fiber-edit").value =
    food.micronutrients?.fiber || "";
  document.getElementById("food-sodium-edit").value =
    food.micronutrients?.sodium || "";
  document.getElementById("food-water-edit").value =
    food.micronutrients?.water || "";
  document.getElementById("food-vitaminA-edit").value =
    food.micronutrients?.vitaminA || "";
  document.getElementById("food-vitaminB6-edit").value =
    food.micronutrients?.vitaminB6 || "";
  document.getElementById("food-calcium-edit").value =
    food.micronutrients?.calcium || "";
  document.getElementById("food-iron-edit").value =
    food.micronutrients?.iron || "";
  document.getElementById("food-zinc-edit").value =
    food.micronutrients?.zinc || "";
  document.getElementById("food-magnesium-edit").value =
    food.micronutrients?.magnesium || "";

  window.currentFood = food;
}

// Hàm đóng modal chỉnh sửa thực phẩm
function closeFoodModal() {
  document.getElementById("modalEditFood").style.display = "none";
}

// Hàm lưu thay đổi thực phẩm sau khi chỉnh sửa
function saveFoodChanges() {
  const updatedFood = {
    id: window.currentFood.id, // Lưu lại ID khi chỉnh sửa
    name: document.getElementById("food-name-edit").value,
    source: document.getElementById("food-source-edit").value,
    category: document.getElementById("food-category-edit").value,
    quantity: document.getElementById("food-quantity-edit").value,
    nutrition: {
      energy: document.getElementById("food-energy-edit").value,
      fat: document.getElementById("food-fat-edit").value,
      carbohydrate: document.getElementById("food-carbohydrate-edit").value,
      protein: document.getElementById("food-protein-edit").value,
    },
    micronutrients: {
      cholesterol: document.getElementById("food-cholesterol-edit").value,
      fiber: document.getElementById("food-fiber-edit").value,
      sodium: document.getElementById("food-sodium-edit").value,
      water: document.getElementById("food-water-edit").value,
      vitaminA: document.getElementById("food-vitaminA-edit").value,
      vitaminB6: document.getElementById("food-vitaminB6-edit").value,
      calcium: document.getElementById("food-calcium-edit").value,
      iron: document.getElementById("food-iron-edit").value,
      zinc: document.getElementById("food-zinc-edit").value,
      magnesium: document.getElementById("food-magnesium-edit").value,
    },
  };

  updateFoodInList(updatedFood);
  saveFoodsToLocalStorage();
  closeFoodModal();
}

// Cập nhật thực phẩm trong danh sách
function updateFoodInList(updatedFood) {
  const foodList = document.querySelector(".list-food");

  const foodItem = [...foodList.children].find(
    (item) => item.dataset.id === updatedFood.id // Dùng ID để tìm thực phẩm cần cập nhật
  );

  if (foodItem) {
    foodItem.querySelector(".food-one-left-header").textContent =
      updatedFood.name;
    foodItem.querySelector(".item1:nth-child(4)").textContent =
      updatedFood.nutrition.energy + " kcal";
    foodItem.querySelector(".item1:nth-child(5)").textContent =
      updatedFood.nutrition.fat + " g";
    foodItem.querySelector(".item1:nth-child(6)").textContent =
      updatedFood.nutrition.carbohydrate + " g";
    foodItem.querySelector(".item1:nth-child(7)").textContent =
      updatedFood.nutrition.protein + " g";

    foodItem.querySelector(".food-one-left-next").textContent =
      updatedFood.source;
    foodItem.querySelector(".item2:nth-child(2)").textContent =
      updatedFood.category;
    foodItem.querySelector(".item2:nth-child(3)").textContent =
      updatedFood.quantity + " g";

    foodItem.querySelector(".item2:nth-child(4)").textContent =
      updatedFood.micronutrients.cholesterol || "";
    foodItem.querySelector(".item2:nth-child(5)").textContent =
      updatedFood.micronutrients.fiber || "";
    foodItem.querySelector(".item2:nth-child(6)").textContent =
      updatedFood.micronutrients.sodium || "";
    foodItem.querySelector(".item2:nth-child(7)").textContent =
      updatedFood.micronutrients.water || "";
    foodItem.querySelector(".item2:nth-child(8)").textContent =
      updatedFood.micronutrients.vitaminA || "";
    foodItem.querySelector(".item2:nth-child(9)").textContent =
      updatedFood.micronutrients.vitaminB6 || "";
    foodItem.querySelector(".item2:nth-child(10)").textContent =
      updatedFood.micronutrients.calcium || "";
    foodItem.querySelector(".item2:nth-child(11)").textContent =
      updatedFood.micronutrients.iron || "";
    foodItem.querySelector(".item2:nth-child(12)").textContent =
      updatedFood.micronutrients.zinc || "";
    foodItem.querySelector(".item2:nth-child(13)").textContent =
      updatedFood.micronutrients.magnesium || "";
  }
}

// Lưu thực phẩm mới vào localStorage
function saveNewFood() {
  const name = document.getElementById("food-name").value;
  const source = document.getElementById("food-source").value;
  const category = document.getElementById("food-category").value;
  const quantity = document.getElementById("food-quantity").value;
  const energy = document.getElementById("food-energy").value;
  const fat = document.getElementById("food-fat").value;
  const carbohydrate = document.getElementById("food-carbohydrate").value;
  const protein = document.getElementById("food-protein").value;

  const micronutrients = {
    cholesterol: document.getElementById("food-cholesterol").value,
    fiber: document.getElementById("food-fiber").value,
    sodium: document.getElementById("food-sodium").value,
    water: document.getElementById("food-water").value,
    vitaminA: document.getElementById("food-vitaminA").value,
    vitaminB6: document.getElementById("food-vitaminB6").value,
    calcium: document.getElementById("food-calcium").value,
    iron: document.getElementById("food-iron").value,
    zinc: document.getElementById("food-zinc").value,
    magnesium: document.getElementById("food-magnesium").value,
  };

  const newFoodId = Date.now().toString(); // Tạo ID duy nhất cho thực phẩm mới

  const newFood = {
    id: newFoodId, // Thêm id
    name,
    source,
    category,
    quantity,
    nutrition: {
      energy,
      fat,
      carbohydrate,
      protein,
    },
    micronutrients,
  };

  foods.push(newFood); // Thêm thực phẩm mới vào danh sách
  localStorage.setItem("foods", JSON.stringify(foods)); // Lưu lại danh sách thực phẩm mới vào localStorage

  loadFoods(); // Tải lại thực phẩm sau khi thêm mới
  closeAddNewFoodModal(); // Đóng modal
}

// Lưu thực phẩm vào localStorage
function saveFoodsToLocalStorage() {
  const foodList = document.querySelector(".list-food");
  const foods = [];

  foodList.querySelectorAll(".food-one").forEach((foodItem) => {
    const id = foodItem.dataset.id; // Lấy ID từ thuộc tính data-id
    const name = foodItem.querySelector(".food-one-left-header").textContent;
    const source = foodItem.querySelector(".food-one-left-next").textContent;
    const energy = foodItem.querySelector(".item1:nth-child(4)").textContent;
    const fat = foodItem.querySelector(".item1:nth-child(5)").textContent;
    const carbohydrate = foodItem.querySelector(
      ".item1:nth-child(6)"
    ).textContent;
    const protein = foodItem.querySelector(".item1:nth-child(7)").textContent;

    const category = foodItem.querySelector(".item2:nth-child(2)")
      ? foodItem.querySelector(".item2:nth-child(2)").textContent
      : "";
    const quantity = foodItem.querySelector(".item2:nth-child(3)")
      ? foodItem.querySelector(".item2:nth-child(3)").textContent
      : "";

    const micronutrients = {
      cholesterol: foodItem.querySelector(".item2:nth-child(4)")
        ? foodItem.querySelector(".item2:nth-child(4)").textContent
        : "",
      fiber: foodItem.querySelector(".item2:nth-child(5)")
        ? foodItem.querySelector(".item2:nth-child(5)").textContent
        : "",
      sodium: foodItem.querySelector(".item2:nth-child(6)")
        ? foodItem.querySelector(".item2:nth-child(6)").textContent
        : "",
      water: foodItem.querySelector(".item2:nth-child(7)")
        ? foodItem.querySelector(".item2:nth-child(7)").textContent
        : "",
      vitaminA: foodItem.querySelector(".item2:nth-child(8)")
        ? foodItem.querySelector(".item2:nth-child(8)").textContent
        : "",
      vitaminB6: foodItem.querySelector(".item2:nth-child(9)")
        ? foodItem.querySelector(".item2:nth-child(9)").textContent
        : "",
      calcium: foodItem.querySelector(".item2:nth-child(10)")
        ? foodItem.querySelector(".item2:nth-child(10)").textContent
        : "",
      iron: foodItem.querySelector(".item2:nth-child(11)")
        ? foodItem.querySelector(".item2:nth-child(11)").textContent
        : "",
      zinc: foodItem.querySelector(".item2:nth-child(12)")
        ? foodItem.querySelector(".item2:nth-child(12)").textContent
        : "",
      magnesium: foodItem.querySelector(".item2:nth-child(13)")
        ? foodItem.querySelector(".item2:nth-child(13)").textContent
        : "",
    };

    foods.push({
      id, // Lưu ID
      name,
      source,
      category,
      nutrition: {
        energy: energy.replace(" kcal", ""),
        fat: fat.replace(" g", ""),
        carbohydrate: carbohydrate.replace(" g", ""),
        protein: protein.replace(" g", ""),
      },
      quantity,
      micronutrients,
    });
  });

  localStorage.setItem("foods", JSON.stringify(foods));
}
