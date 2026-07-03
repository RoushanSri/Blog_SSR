document.addEventListener("DOMContentLoaded", () => {
  const showError = (elementId, message) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.style.display = "block";
    }
  };

  const showSuccess = (elementId, message) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = message;
      el.style.display = "block";
    }
  };

  const hideMessage = (elementId) => {
    const el = document.getElementById(elementId);
    if (el) el.style.display = "none";
  };

  const fetchOptions = {
    headers: { "Content-Type": "application/json" },
  };

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "User";

  if (isLoggedIn) {
    document.querySelectorAll(".auth-required").forEach((el) => (el.style.display = "inline-flex"));
    document.querySelectorAll(".guest-only").forEach((el) => (el.style.display = "none"));

    const avatar = document.getElementById("userAvatar");
    if (avatar) {
      avatar.textContent = userName.charAt(0).toUpperCase();
    }
  }

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger1 = document.getElementById("hamburger1");
  const hamburger2 = document.getElementById("hamburger2");
  const hamburger3 = document.getElementById("hamburger3");

  if (mobileMenuBtn && mobileMenu) {
    let menuOpen = false;
    mobileMenuBtn.addEventListener("click", () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle("hidden", !menuOpen);

      if (menuOpen) {
        hamburger1.style.transform = "rotate(45deg) translate(4px, 4px)";
        hamburger2.style.opacity = "0";
        hamburger3.style.transform = "rotate(-45deg) translate(4px, -4px)";
      } else {
        hamburger1.style.transform = "";
        hamburger2.style.opacity = "1";
        hamburger3.style.transform = "";
      }
    });

    if (isLoggedIn) {
      mobileMenu.querySelectorAll(".auth-required").forEach((el) => (el.style.display = "block"));
      mobileMenu.querySelectorAll(".guest-only").forEach((el) => (el.style.display = "none"));
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST", ...fetchOptions });
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", handleLogout);

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/auth/login", {
          method: "POST",
          ...fetchOptions,
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("isLoggedIn", "true");
          if (data.data?.username) localStorage.setItem("userName", data.data.username);
          window.location.href = "/";
        } else {
          showError("loginError", data.message || "Login failed. Please check your credentials.");
        }
      } catch (err) {
        showError("loginError", "An error occurred connecting to the server.");
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      const reader = document.getElementById("reader");
      const writer = document.getElementById("writer");

      const rolesRequested = [];
      if (reader.checked) rolesRequested.push("READER");
      if (writer.checked) rolesRequested.push("WRITER");

      try {
        const res = await fetch("/auth/register", {
          method: "POST",
          ...fetchOptions,
          body: JSON.stringify({
            username,
            email,
            password,
            confirmPassword,
            rolesRequested,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          window.location.href = "/login";
        } else {
          let msg = data.message || "Registration failed.";
          if (data.errors && data.errors.length > 0) {
            msg = data.errors[0].msg;
          }
          showError("registerError", msg);
        }
      } catch (err) {
        showError("registerError", "An error occurred connecting to the server.");
      }
    });
  }

  const myCategoryFilterSelect = document.getElementById("myCategoryFilterSelect");
  if (myCategoryFilterSelect) {
    myCategoryFilterSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        window.location.href = `/my-blogs?category=${encodeURIComponent(e.target.value)}`;
      } else {
        window.location.href = `/my-blogs`;
      }
    });
  }

  const categoryFilterSelect = document.getElementById("categoryFilterSelect");
  if (categoryFilterSelect) {
    categoryFilterSelect.addEventListener("change", (e) => {
      if (e.target.value) {
        window.location.href = `/blogs?category=${encodeURIComponent(e.target.value)}`;
      } else {
        window.location.href = `/blogs`;
      }
    });
  }

  const avatarContainer = document.getElementById("avatarContainer");
  const avatarText = document.getElementById("avatar-text");
  if (avatarText && userName) {
    avatarText.textContent = userName[0].toUpperCase();
  }
  const avatarDropdown = document.getElementById("avatarDropdown");
  if (avatarContainer && avatarDropdown) {
    avatarContainer.addEventListener("click", () => {
      avatarDropdown.classList.toggle("hidden");
    });

    window.addEventListener("click", (e) => {
      if (!avatarContainer.contains(e.target) && !avatarDropdown.contains(e.target)) {
        avatarDropdown.classList.add("hidden");
      }
    });
  }

  const myProfileBtn = document.getElementById("myProfileBtn");
  if (myProfileBtn) myProfileBtn.addEventListener("click", () => (window.location.href = "/profile"));

  const myBlogsBtn = document.getElementById("myBlogsBtn");
  if (myBlogsBtn) myBlogsBtn.addEventListener("click", () => (window.location.href = "/my-blogs"));

  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) settingsBtn.addEventListener("click", () => (window.location.href = "/settings"));

  window.requestRole = async function(roleName) {
    try {
      const res = await fetch("/user/request-role", {
        method: "POST",
        ...fetchOptions,
        body: JSON.stringify({ roleName }),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message || 'Role requested successfully. Refreshing page...');
        window.location.reload();
      } else {
        alert(data.message || 'Error requesting role.');
      }
    } catch (err) {
      alert("Failed to request role. Please try again.");
    }
  };

  const changeUsernameForm = document.getElementById("changeUsernameForm");
  if (changeUsernameForm) {
    changeUsernameForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideMessage("usernameSuccess");
      hideMessage("usernameError");

      const newUsername = document.getElementById("newUsername").value;

      try {
        const res = await fetch("/user/change-username", {
          method: "PUT",
          ...fetchOptions,
          body: JSON.stringify({ newUsername }),
        });
        const data = await res.json();

        if (res.ok) {
          showSuccess("usernameSuccess", data.message);
          document.getElementById("currentUsername").value = data.username;
          document.getElementById("newUsername").value = "";
          localStorage.setItem("userName", data.username);
          const avatar = document.getElementById("userAvatar");
          if (avatar) avatar.textContent = data.username.charAt(0).toUpperCase();
        } else {
          showError("usernameError", data.message);
        }
      } catch (err) {
        showError("usernameError", "Failed to change username. Please try again.");
      }
    });
  }

  const changePasswordForm = document.getElementById("changePasswordForm");
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideMessage("passwordSuccess");
      hideMessage("passwordError");

      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword = document.getElementById("confirmNewPassword").value;

      if (newPassword !== confirmNewPassword) {
        showError("passwordError", "New passwords do not match.");
        return;
      }

      if (newPassword.length < 8) {
        showError("passwordError", "New password must be at least 8 characters.");
        return;
      }

      try {
        const res = await fetch("/user/change-password", {
          method: "PUT",
          ...fetchOptions,
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmNewPassword,
          }),
        });
        const data = await res.json();

        if (res.ok) {
          showSuccess("passwordSuccess", data.message);
          changePasswordForm.reset();
        } else {
          showError("passwordError", data.message);
        }
      } catch (err) {
        showError("passwordError", "Failed to change password. Please try again.");
      }
    });
  }

  const createBlogForm = document.getElementById("createBlogForm");
  if (createBlogForm) {
    const contentArea = document.getElementById("content");
    const charCount = document.getElementById("charCount");
    if (contentArea && charCount) {
      contentArea.addEventListener("input", () => {
        const count = contentArea.value.length;
        charCount.textContent = `${count.toLocaleString()} character${count !== 1 ? "s" : ""}`;
      });
    }

    createBlogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const category = document.getElementById("category").value;

      if (!category) {
        showError("createBlogError", "Please select a category.");
        return;
      }

      try {
        const res = await fetch("/blog/create", {
          method: "POST",
          ...fetchOptions,
          body: JSON.stringify({ title, content, category }),
        });

        const data = await res.json();

        if (res.ok) {
          window.location.href = "/";
        } else {
          showError("createBlogError", data.message || "Failed to create blog. Make sure you are a Writer.");
        }
      } catch (err) {
        showError("createBlogError", "An error occurred connecting to the server.");
      }
    });
  }

  const redirectToRequest = document.getElementById("redirect-to-request");
  if (redirectToRequest) {
    redirectToRequest.addEventListener("click", () => {
      window.location.href = "/settings#request-role";
    });
  }

    const editBlogForm = document.getElementById("editBlogForm");
  if (editBlogForm) {
    const contentArea = document.getElementById("content");
    const charCount = document.getElementById("charCount");
    if (contentArea && charCount) {
      contentArea.addEventListener("input", () => {
        const count = contentArea.value.length;
        charCount.textContent = `${count.toLocaleString()} character${count !== 1 ? "s" : ""}`;
      });
    }

    editBlogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const category = document.getElementById("category").value;

      if (!category) {
        showError("editBlogError", "Please select a category.");
        return;
      }

      try {
        const res = await fetch("/blog/update-blog", {
          method: "PUT",
          ...fetchOptions,
          body: JSON.stringify({ id: editBlogForm.dataset.id, title, content, category }),
        });

        const data = await res.json();

        if (res.ok) {
          window.location.href = "/";
        } else {
          showError("editBlogError", data.message || "Failed to edit blog. Make sure you are a Writer.");
        }
      } catch (err) {
        showError("editBlogError", "An error occurred connecting to the server.");
      }
    });
  }
});