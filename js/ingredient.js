// Khi trang tải, kiểm tra xem có dữ liệu thực phẩm trong localStorage không
window.addEventListener("DOMContentLoaded", () => {
  loadFoods(); // Tải thực phẩm từ localStorage khi trang tải
});

// Mở modal thêm mới thực phẩm
function openAddNewFoodModal() {
  document.getElementById("modalAddNewFood").style.display = "flex";
}

// Đóng modal thêm mới thực phẩm
function closeAddNewFoodModal() {
  document.getElementById("modalAddNewFood").style.display = "none";
}

// Mở modal chỉnh sửa thực phẩm
function openFoodModal(food) {
  document.getElementById("modalEditFood").style.display = "flex";

  // Điền thông tin thực phẩm vào các trường input trong modal từ food
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

  // Điền thông tin Micronutrients vào modal từ food
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

  window.currentFood = food; // Lưu thực phẩm hiện tại để sau này cập nhật
}

// Hàm đóng modal chỉnh sửa thực phẩm
function closeFoodModal() {
  document.getElementById("modalEditFood").style.display = "none";
}

// Hàm lưu thay đổi thực phẩm sau khi chỉnh sửa trong modal
function saveFoodChanges() {
  const updatedFood = {
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

  updateFoodInList(updatedFood); // Cập nhật thực phẩm trong danh sách
  saveFoodsToLocalStorage(); // Lưu danh sách thực phẩm vào localStorage
  closeFoodModal(); // Đóng modal chỉnh sửa
}

// Cập nhật thực phẩm trong danh sách
function updateFoodInList(updatedFood) {
  const foodList = document.querySelector(".list-food");

  const foodItem = [...foodList.children].find(
    (item) =>
      item.querySelector(".food-one-left-header").textContent ===
      window.currentFood.name
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
  }
}

// Hàm để lưu thực phẩm mới vào localStorage
function saveNewFood() {
  const name = document.getElementById("food-name").value;
  const source = document.getElementById("food-source").value;
  const category = document.getElementById("food-category").value; // Lấy category từ input trong modal
  const quantity = document.getElementById("food-quantity").value; // Lấy quantity từ input trong modal
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

  const newFood = {
    name,
    source,
    category, // Lưu category vào thực phẩm mới
    quantity, // Lưu quantity vào thực phẩm mới
    nutrition: {
      energy,
      fat,
      carbohydrate,
      protein,
    },
    micronutrients,
  };

  renderFood(newFood); // Render thực phẩm mới vào danh sách
  saveFoodsToLocalStorage(); // Lưu danh sách thực phẩm vào localStorage
  closeAddNewFoodModal(); // Đóng modal thêm mới thực phẩm
}

// Render thực phẩm mới vào danh sách
function renderFood(food) {
  const foodList = document.querySelector(".list-food");

  const foodItem = document.createElement("div");
  foodItem.classList.add("food-one");
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
                  <td class="item2"></td>
                  <td class="item2"></td>
                  <td class="item2">Energy</td>
                  <td class="item2">Fat</td>
                  <td class="item2">Carbohydrate</td>
                  <td class="item2">Protein</td>
                </tr>
              </tbody>
            </table>
          `;

  foodItem.onclick = function () {
    openFoodModal(food); // Mở modal chỉnh sửa khi click vào thực phẩm
  };

  foodList.appendChild(foodItem); // Thêm thực phẩm vào danh sách
}

// Lưu danh sách thực phẩm vào localStorage
function saveFoodsToLocalStorage() {
  const foodList = document.querySelector(".list-food");
  const foods = [];

  foodList.querySelectorAll(".food-one").forEach((foodItem) => {
    const name = foodItem.querySelector(".food-one-left-header").textContent;
    const source = foodItem.querySelector(".food-one-left-next").textContent;
    const energy = foodItem.querySelector(".item1:nth-child(4)").textContent;
    const fat = foodItem.querySelector(".item1:nth-child(5)").textContent;
    const carbohydrate = foodItem.querySelector(
      ".item1:nth-child(6)"
    ).textContent;
    const protein = foodItem.querySelector(".item1:nth-child(7)").textContent;

    // Lấy giá trị category từ modal khi thêm mới hoặc chỉnh sửa
    const category = document.getElementById("food-category").value || ""; // Lấy category từ input trong modal
    const quantity = document.getElementById("food-quantity").value || ""; // Lấy quantity từ input trong modal

    // Lấy các giá trị micronutrients từ các trường input trong modal
    const micronutrients = {
      cholesterol: document.getElementById("food-cholesterol").value || "",
      fiber: document.getElementById("food-fiber").value || "",
      sodium: document.getElementById("food-sodium").value || "",
      water: document.getElementById("food-water").value || "",
      vitaminA: document.getElementById("food-vitaminA").value || "",
      vitaminB6: document.getElementById("food-vitaminB6").value || "",
      calcium: document.getElementById("food-calcium").value || "",
      iron: document.getElementById("food-iron").value || "",
      zinc: document.getElementById("food-zinc").value || "",
      magnesium: document.getElementById("food-magnesium").value || "",
    };

    foods.push({
      name,
      source,
      category, // Lưu category vào food
      nutrition: {
        energy: energy.replace(" kcal", ""),
        fat: fat.replace(" g", ""),
        carbohydrate: carbohydrate.replace(" g", ""),
        protein: protein.replace(" g", ""),
      },
      quantity, // Lưu quantity vào localStorage
      micronutrients, // Lưu micronutrients vào localStorage
    });
  });

  localStorage.setItem("foods", JSON.stringify(foods)); // Lưu dữ liệu vào localStorage
}

// Tải danh sách thực phẩm từ localStorage và hiển thị
function loadFoods() {
  const foods = JSON.parse(localStorage.getItem("foods"));

  if (foods) {
    foods.forEach((food) => {
      renderFood(food); // Render thực phẩm từ localStorage ra danh sách
    });
  }
}
