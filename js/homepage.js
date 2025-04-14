let currentPage = 1; // Bắt đầu từ trang 1
const recipesPerPage = 2; // Số lượng công thức mỗi trang

// Hàm để tải các công thức yêu thích từ localStorage và hiển thị chúng
function loadFavouriteRecipes() {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

  // Lấy container để hiển thị công thức
  const recipesGrid = document.querySelector(".recipes-grid");

  // Xóa nội dung hiện tại trong grid
  recipesGrid.innerHTML = "";

  // Lọc theo từ khóa tìm kiếm
  const searchQuery = document
    .querySelector(".search-input")
    .value.toLowerCase();
  const categoryFilter = document
    .querySelector(".category-input")
    .value.toLowerCase();

  // Lọc các công thức yêu thích theo từ khóa tìm kiếm và bộ lọc thể loại
  const filteredRecipes = favourites.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery);
    const matchesCategory = categoryFilter
      ? recipe.category.toLowerCase().includes(categoryFilter)
      : true;
    return matchesSearch && matchesCategory;
  });

  // Sắp xếp các công thức lọc được theo dưỡng chất
  const sortByNutrient = document.querySelector(".sort-input").value;
  if (sortByNutrient) {
    filteredRecipes.sort((a, b) => {
      if (sortByNutrient === "Energy") {
        return parseInt(a.nutrient.energy) - parseInt(b.nutrient.energy);
      } else if (sortByNutrient === "Fat") {
        return parseFloat(a.nutrient.fat) - parseFloat(b.nutrient.fat);
      } else if (sortByNutrient === "Carbohydrate") {
        return (
          parseFloat(a.nutrient.carbohydrate) -
          parseFloat(b.nutrient.carbohydrate)
        );
      } else if (sortByNutrient === "Protein") {
        return parseFloat(a.nutrient.protein) - parseFloat(b.nutrient.protein);
      }
      return 0;
    });
  }

  // Phân trang các công thức đã lọc
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentPageRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Tạo các thẻ công thức
  currentPageRecipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");

    recipeCard.innerHTML = `
        <div class="header-left-recipe">
          <img class="conmunity-icon" src="../assets/icons/Community.png" alt="" />
          <div class="recipe-tag">Community Recipes</div>
        </div>
        <div class="header-right-recipe">
          <h3>${recipe.name}</h3>
          <div class="mid-recipe">
            <p>${recipe.author}</p>
            <button class="like-btn">
              <img src="../assets/icons/favorite_border.png" alt="" />
              <div>37</div>
            </button>
          </div>
          <div class="mid-recipe-two">
            <img src="../assets/icons/vegetable-tag.png" alt="" />
            <p>${recipe.category}</p>
          </div>
          <div class="recipe-stats">
            <p>by</p> ${recipe.quantity}
            <p>Energy</p>
            <p>Fat</p>
            <p>Carbohydrate</p>
            <p>Protein</p>
          </div>
          <div class="recipe-ingredient">
            <p>${recipe.quantity}</p>
            <p>${recipe.nutrient.energy}</p>
            <p class="recipe-fat">${recipe.nutrient.fat}</p>
            <p class="recipe-carbohydrate">${recipe.nutrient.carbohydrate}</p>
            <p class="recipe-protein">${recipe.nutrient.protein}</p>
          </div>
        </div>
      `;

    // Thêm thẻ công thức vào grid
    recipesGrid.appendChild(recipeCard);
  });

  // Cập nhật các nút phân trang
  updatePaginationButtons(totalPages);
}

// Hàm để cập nhật các nút phân trang
function updatePaginationButtons(totalPages) {
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  // Tạo nút previous (trước)
  const prevButton = document.createElement("img");
  prevButton.src = "../assets/icons/Item → Button.png";
  pagination.appendChild(prevButton);

  // Tạo các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      currentPage = i;
      loadFavouriteRecipes();
    });
    pagination.appendChild(pageButton);
  }

  // Tạo nút next (tiếp theo)
  const nextButton = document.createElement("img");
  nextButton.src = "../assets/icons/Item → Next page.png";
  pagination.appendChild(nextButton);

  // Thêm các sự kiện cho các nút next và previous
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadFavouriteRecipes();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadFavouriteRecipes();
    }
  });
}

// Lắng nghe sự kiện thay đổi tìm kiếm và bộ lọc thể loại
document
  .querySelector(".search-input")
  .addEventListener("input", loadFavouriteRecipes);
document
  .querySelector(".category-input")
  .addEventListener("input", loadFavouriteRecipes);
document
  .querySelector(".sort-input")
  .addEventListener("change", loadFavouriteRecipes);

// Gọi hàm để tải các công thức khi trang được tải
document.addEventListener("DOMContentLoaded", loadFavouriteRecipes);

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
