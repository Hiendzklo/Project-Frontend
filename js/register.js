document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const errorBox = document.querySelector(".message.error");
  const successBox = document.querySelector(".message.success");
  const errorDetail = document.querySelector(".error-detail");
  const closeErrorBtn = document.querySelector(".error-close-icon");

  errorBox.style.display = "none";
  successBox.style.display = "none";

  closeErrorBtn.addEventListener("click", () => {
    errorBox.style.display = "none";
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = form.email.value.trim();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim(); // ✅ Thêm dòng này
    const errors = [];

    if (!username) errors.push("Họ và tên không được để trống");

    if (!email) {
      errors.push("Email không được để trống");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push("Email không đúng định dạng");
      }
    }

    if (!password) {
      errors.push("Mật khẩu không được bỏ trống");
    } else if (password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }

    // ✅ Kiểm tra xác nhận mật khẩu
    if (password && confirmPassword && password !== confirmPassword) {
      errors.push("Mật khẩu xác nhận không trùng khớp");
    }

    // Kiểm tra trùng email trong localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = storedUsers.some((user) => user.email === email);
    if (emailExists) {
      errors.push("Email đã được đăng ký");
    }

    if (errors.length > 0) {
      errorDetail.innerHTML = errors.join("<br>");
      errorBox.style.display = "block";
      successBox.style.display = "none";
    } else {
      errorBox.style.display = "none";
      successBox.style.display = "flex";

      // Lưu user vào localStorage
      const newUser = { email, username, password };
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1500);
    }
  });
});
