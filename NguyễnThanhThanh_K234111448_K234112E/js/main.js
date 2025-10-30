document.addEventListener("DOMContentLoaded", () => {
  const mainButtons = document.querySelectorAll(".menu-btn");
  const subButtons = document.querySelectorAll(".sub-btn");
  const subMenus = document.querySelectorAll(".submenu");
  const content = document.getElementById("C");

  // Ẩn tất cả submenu khi bắt đầu
  subMenus.forEach(menu => (menu.style.display = "none"));

  // --- Menu chính ---
  mainButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const subMenuId = btn.dataset.menu;
      const page = btn.dataset.page;

      if (action === "about") loadPage("about.html");
      if (page) loadPage(page);

      if (subMenuId) {
        const targetMenu = document.getElementById(subMenuId);
        const isVisible = targetMenu.style.display === "block";
        subMenus.forEach(m => (m.style.display = "none"));
        targetMenu.style.display = isVisible ? "none" : "block";
      }
    });
  });

  // --- Submenu ---
  subButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      if (page) loadPage(page);
    });
  });

  // --- Load trang ---
  async function loadPage(page) {
    content.innerHTML = `<p>Loading ${page}...</p>`;
    try {
      const res = await fetch(`../html/${page}`);
      if (!res.ok) throw new Error("Không tìm thấy trang");
      const html = await res.text();
      content.innerHTML = html;

      // Gọi script riêng
      if (page === "products.html") handleProductsXML();
      if (page === "employees.html") handleJSON();
      if (page === "weather.html") handleWeatherAPI();
      if (page === "rss.html") handleRSS();
    } catch (err) {
      content.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  }
});

// --- JSON ---
async function handleJSON() {
  const content = document.getElementById("C");
  try {
    const res = await fetch("../data/sample.json");
    const data = await res.json();
    let html = `<h3>Danh sách nhân viên (JSON)</h3><ul>`;
    data.forEach(e => (html += `<li>${e.name} - ${e.role}</li>`));
    html += "</ul>";
    content.innerHTML += html;
  } catch (err) {
    content.innerHTML += `<p style="color:red;">Lỗi tải JSON: ${err.message}</p>`;
  }
}

// --- XML Products ---
async function handleProductsXML() {
  const content = document.getElementById("C");
  content.innerHTML = `<h2>📦 Products List</h2><p>Đang tải dữ liệu sản phẩm...</p>`;
  try {
    const res = await fetch("https://tranduythanh.com/datasets/CA01_products.xml");
    const xmlText = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const products = xml.getElementsByTagName("Product");

    if (products.length === 0) throw new Error("Không có dữ liệu sản phẩm!");

    let html = `<div class="product-container">`;
    for (let i = 0; i < products.length; i++) {
      const id = products[i].getElementsByTagName("ProductID")[0]?.textContent || "N/A";
      const name = products[i].getElementsByTagName("ProductName")[0]?.textContent || "Không tên";
      const price = products[i].getElementsByTagName("Price")[0]?.textContent || "0";
      const category = products[i].getElementsByTagName("Category")[0]?.textContent || "Chưa phân loại";
      html += `
        <div class="product-card">
          <h3>${name}</h3>
          <p>🆔 ${id}</p>
          <p>💰 ${price}₫</p>
          <p>🏷️ ${category}</p>
        </div>`;
    }
    html += `</div>`;
    content.innerHTML = html;
  } catch (err) {
    content.innerHTML += `<p style="color:red;">Lỗi tải XML: ${err.message}</p>`;
  }
}

// --- Weather API ---
async function handleWeatherAPI() {
  const content = document.getElementById("C");
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=10.75&longitude=106.67&current=temperature_2m");
    const data = await res.json();
    content.innerHTML += `<p>Nhiệt độ hiện tại ở TP.HCM: <b>${data.current.temperature_2m}°C</b></p>`;
  } catch (err) {
    content.innerHTML += `<p style="color:red;">Lỗi API thời tiết: ${err.message}</p>`;
  }
}

// --- RSS ---
async function handleRSS() {
  const content = document.getElementById("C");
  try {
    const res = await fetch("https://vnexpress.net/rss/tin-moi-nhat.rss");
    const xmlText = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "text/xml");
    const items = xml.querySelectorAll("item");

    let html = `<h3>Tin mới nhất (RSS)</h3><ul>`;
    items.forEach((item, i) => {
      if (i < 5) {
        const title = item.querySelector("title").textContent;
        const link = item.querySelector("link").textContent;
        html += `<li><a href="${link}" target="_blank">${title}</a></li>`;
      }
    });
    html += `</ul>`;
    content.innerHTML = html;
  } catch (err) {
    content.innerHTML += `<p style="color:red;">Lỗi tải RSS: ${err.message}</p>`;
  }
}
