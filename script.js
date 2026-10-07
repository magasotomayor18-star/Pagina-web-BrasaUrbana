const filterButtons = [...document.querySelectorAll(".filter-button")];
const productGrid = document.querySelector("#product-grid");
const orderItems = document.querySelector("#order-items");
const orderSubtotal = document.querySelector("#order-subtotal");
const orderTotal = document.querySelector("#order-total");
const orderCount = document.querySelector("#order-count");
const navCount = document.querySelector("#nav-count");
const confirmOrder = document.querySelector("#confirm-order");
const orderMessage = document.querySelector("#order-message");
const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = menuToggle ? menuToggle.querySelector("[data-menu-label]") : null;
const mainNav = document.querySelector(".main-nav");
const cart = new Map();

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function buildLocalPlaceholder(label, category) {
  const normalizedLabel = String(label || category || "Brasa Urbana")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const palette = {
    hamburguesas: ["#a8381f", "#f5c54b"],
    acompanamientos: ["#f7f4ef", "#53685a"],
    combos: ["#53685a", "#f5c54b"],
    bebidas: ["#f0e3b1", "#a8381f"],
    postres: ["#f2d6c3", "#252321"],
  };
  const [background, accent] = palette[category] || ["#f7f4ef", "#252321"];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="${background}"/>
      <rect x="58" y="58" width="684" height="684" rx="28" fill="#fffdf9" opacity="0.2"/>
      <circle cx="270" cy="300" r="150" fill="${accent}" opacity="0.18"/>
      <circle cx="520" cy="320" r="130" fill="#fffdf9" opacity="0.2"/>
      <path d="M170 560h460c35 0 66 28 66 63v26H104v-26c0-35 31-63 66-63Z" fill="${accent}" opacity="0.35"/>
      <text x="400" y="610" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#252321">${normalizedLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderCart() {
  const entries = [...cart.entries()];
  const totalProducts = entries.reduce((sum, [, item]) => sum + item.quantity, 0);

  if (navCount) navCount.textContent = totalProducts;
  if (orderCount) orderCount.textContent = `${totalProducts} ${totalProducts === 1 ? "producto" : "productos"}`;
  if (orderSubtotal) orderSubtotal.textContent = formatPrice(entries.reduce((sum, [, item]) => sum + item.precio * item.quantity, 0));
  if (orderTotal) orderTotal.textContent = formatPrice(entries.reduce((sum, [, item]) => sum + item.precio * item.quantity * 1.12, 0));
  if (confirmOrder) confirmOrder.disabled = entries.length === 0;

  if (!orderItems) return;

  if (entries.length === 0) {
    orderItems.innerHTML = '<p class="empty-order">Todavía no has elegido nada.<br><a href="#menu">Explora el menú para comenzar.</a></p>';
    return;
  }

  orderItems.innerHTML = entries.map(([id, item]) => `
    <div class="order-item">
      <span class="order-item-name">${item.nombre}</span>
      <span class="order-item-price">${formatPrice(item.precio * item.quantity)}</span>
      <span class="quantity-controls" role="group" aria-label="Cantidad de ${item.nombre}">
        <button type="button" data-action="decrease" data-id="${id}" aria-label="Quitar una unidad de ${item.nombre}">-</button>
        <span aria-live="polite">${item.quantity}</span>
        <button type="button" data-action="increase" data-id="${id}" aria-label="Agregar una unidad de ${item.nombre}">+</button>
      </span>
    </div>
  `).join("");
}

function selectCategory(category, persist = false) {
  const selectedCategory = filterButtons.some((button) => button.dataset.filter === category)
    ? category
    : "todos";

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === selectedCategory;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  productGrid.querySelectorAll(".product-card").forEach((card) => {
    const shouldShow = selectedCategory === "todos" || card.dataset.category === selectedCategory;
    card.classList.toggle("is-hidden", !shouldShow);
  });

  if (persist) {
    try {
      sessionStorage.setItem("last_category", selectedCategory);
    } catch {
      // No se rompe si el navegador bloquea el almacenamiento temporal.
    }
  }
}

function addToCart(product) {
  const existing = cart.get(product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.set(product.id, { ...product, quantity: 1 });
  }
  renderCart();
  if (orderMessage) orderMessage.textContent = `${product.nombre} se agregó a tu pedido.`;
}

function changeQuantity(id, amount) {
  const item = cart.get(String(id));
  if (!item) return;

  const nextQuantity = item.quantity + amount;
  if (nextQuantity <= 0) {
    cart.delete(String(id));
  } else {
    item.quantity = nextQuantity;
  }
  renderCart();
}

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => selectCategory(button.dataset.filter, true));
});

productGrid?.addEventListener("click", (event) => {
  const button = event.target.closest(".add-button");
  if (!button || button.classList.contains("is-added")) return;

  addToCart({
    id: button.dataset.id,
    nombre: button.dataset.name,
    precio: Number(button.dataset.price),
  });

  button.classList.add("is-added");
  button.textContent = "?";
  setTimeout(() => {
    button.classList.remove("is-added");
    button.textContent = "+";
  }, 600);
});

orderItems?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  changeQuantity(button.dataset.id, button.dataset.action === "increase" ? 1 : -1);
});

confirmOrder?.addEventListener("click", () => {
  if (orderMessage) orderMessage.textContent = "¡Listo! Tu pedido de prueba fue recibido. Gracias por elegir Brasa Urbana.";
  confirmOrder.disabled = true;
});

function setMenuOpen(isOpen) {
  if (!menuToggle || !menuToggleLabel || !mainNav) return;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggleLabel.textContent = isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación";
  mainNav.classList.toggle("is-open", isOpen);

  if (isOpen) {
    const firstLink = mainNav.querySelector("a");
    firstLink?.focus();
  } else {
    menuToggle.focus();
  }
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

mainNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
  }
});

renderCart();
selectCategory("todos");
