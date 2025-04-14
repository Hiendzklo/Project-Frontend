document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra trạng thái đăng nhập khi trang load
  if (localStorage.getItem("currentUser")) {
    window.location.href = "./homepage.html"; // chuyển hướng nếu đã đăng nhập
    return; // dừng các xử lý còn lại của trang đăng nhập
  }

  // Lấy các phần tử cần thiết từ DOM
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const errorBox = document.querySelector(".message.error");
  const successBox = document.querySelector(".message.success");
  const errorDetail = document.querySelector(".error-detail");
  const closeErrorBtn = document.querySelector(".error-close-icon");

  // Đóng thông báo lỗi khi nhấn nút close
  closeErrorBtn.addEventListener("click", () => {
    errorBox.style.display = "none";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const errors = [];

    // Validate dữ liệu nhập
    if (!email) errors.push("Email không được để trống");
    if (!password) errors.push("Mật khẩu không được để trống");

    if (errors.length > 0) {
      errorDetail.innerHTML = errors.join("<br>");
      errorBox.style.display = "block";
      successBox.style.display = "none";
      return;
    }

    // Lấy danh sách user đã lưu trong localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Tìm user phù hợp dựa trên email và password
    const matchedUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      errorDetail.innerHTML = "Email hoặc mật khẩu không đúng";
      errorBox.style.display = "block";
      successBox.style.display = "none";
    } else {
      // Đánh dấu trạng thái đăng nhập bằng cách lưu thông tin người dùng
      localStorage.setItem("currentUser", JSON.stringify(matchedUser));

      errorBox.style.display = "none";
      successBox.style.display = "flex";

      // Sau vài giây chuyển hướng sang homepage
      setTimeout(() => {
        window.location.href = "./homepage.html";
      }, 1500);
    }
  });
});
