const VARIANT_NUMBER = 18;

// 1. System info
function collectSystemInfo() {
  return {
    userAgent: navigator.userAgent || "Невідомо",
    platform: navigator.platform || "Невідомо",
    language: navigator.language || "Невідомо",
    languages: navigator.languages ? navigator.languages.join(", ") : "Невідомо",
    vendor: navigator.vendor || "Невідомо",
    appName: navigator.appName || "Невідомо",
    appVersion: navigator.appVersion || "Невідомо",
    cookieEnabled: navigator.cookieEnabled,
    hardwareConcurrency: navigator.hardwareConcurrency || "Невідомо",
    screenResolution: `${screen.width} × ${screen.height}`,
    colorDepth: screen.colorDepth
  };
}

function showSystemInfo() {
  const info = collectSystemInfo();
  localStorage.setItem("systemInfo", JSON.stringify(info));
  const savedInfo = JSON.parse(localStorage.getItem("systemInfo") || "{}");
  const container = document.getElementById("systemInfo");
  container.replaceChildren();

  const list = document.createElement("ul");
  list.className = "system-list";
  const labels = {
    userAgent: "User-Agent", platform: "Платформа / ОС",
    language: "Мова браузера", languages: "Доступні мови",
    vendor: "Виробник браузера", appName: "Назва браузера",
    appVersion: "Версія браузера", cookieEnabled: "Cookies увімкнені",
    hardwareConcurrency: "Логічні процесори",
    screenResolution: "Роздільна здатність екрана", colorDepth: "Глибина кольору"
  };

  Object.entries(savedInfo).forEach(([key, value]) => {
    const item = document.createElement("li");
    item.textContent = `${labels[key] || key}: ${value}`;
    list.appendChild(item);
  });
  container.appendChild(list);
}

// 2. Comments
async function loadReviews() {
  const container = document.getElementById("reviews");
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${VARIANT_NUMBER}/comments`
    );
    if (!response.ok) throw new Error(`HTTP-помилка: ${response.status}`);
    const comments = await response.json();

    container.replaceChildren();
    comments.forEach((comment) => {
      const card = document.createElement("article");
      card.className = "review-card";

      const title = document.createElement("h3");
      title.textContent = comment.name;
      const author = document.createElement("p");
      author.textContent = `Автор: ${comment.email}`;
      const body = document.createElement("p");
      body.textContent = comment.body;

      card.append(title, author, body);
      container.appendChild(card);
    });
  } catch (error) {
    container.textContent = `Не вдалося завантажити коментарі: ${error.message}`;
  }
}

// 3. Feedback
const feedbackWindow = document.getElementById("contactFeedback");
const closeButton = document.getElementById("closeFeedback");

const feedbackTimer = setTimeout(
  () => {
  feedbackWindow.classList.add("is-visible");
  feedbackWindow.setAttribute("aria-hidden", "false");
}, 60000);

closeButton.addEventListener(
  "click", () => {
  feedbackWindow.classList.remove("is-visible");
  feedbackWindow.setAttribute("aria-hidden", "true");
  clearTimeout(feedbackTimer);
});

feedbackWindow.addEventListener(
  "click", (event) => {
  if (event.target === feedbackWindow) {
    feedbackWindow.classList.remove("is-visible");
    feedbackWindow.setAttribute("aria-hidden", "true");
  }
});

// 4. Dark theme
const themeButton = document.getElementById("themeToggle");

function getTime() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 20 ? "light" : "dark";
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark_theme");
    themeButton.textContent = "Light theme";
  }
  else {
    document.body.classList.remove("dark_theme");
    themeButton.textContent = "Dark theme";
  }
  themeButton.dataset.theme = theme;
}

themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark_theme");
  applyTheme(isDark ? "light" : "dark");
});

applyTheme(getTime());
showSystemInfo();
loadReviews();
