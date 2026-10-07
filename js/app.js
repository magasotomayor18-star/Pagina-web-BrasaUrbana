import { Cart } from "./cart.js";
import { getLastCategory, getLastUpdateTimestamp, saveLastCategory } from "./storage.js";
import { initValidation } from "./validation.js";

const productGrid = document.querySelector("#product-grid");
const menuStatus = document.querySelector("#menu-status");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const goToComboLinks = document.querySelectorAll(".go-to-combos");
const orderItems = document.querySelector("#order-items");
const orderSubtotal = document.querySelector("#order-subtotal");
const orderTotal = document.querySelector("#order-total");
const orderCount = document.querySelector("#order-count");
const navCount = document.querySelector("#nav-count");
const confirmOrder = document.querySelector("#confirm-order");
const orderMessage = document.querySelector("#order-message");
const lastUpdate = document.querySelector("#cart-last-update");
const menuToggle = document.querySelector(".menu-toggle");
const menuToggleLabel = menuToggle.querySelector("[data-menu-label]");
const mainNav = document.querySelector(".main-nav");
const contactForm = document.querySelector("#contact-form");
const contactMessage = document.querySelector("#contact-message");
const cookieBanner = document.querySelector("#cookie-banner");
const acceptCookiesButton = document.querySelector("#accept-cookies");
const declineCookiesButton = document.querySelector("#decline-cookies");
const cart = new Cart();

function handleCookieBanner() {
	try {
		if (localStorage.getItem("cookies_accepted") === null) {
			cookieBanner?.classList.remove("is-hidden");
		}
	} catch {
		cookieBanner?.classList.remove("is-hidden");
	}
}

handleCookieBanner();

acceptCookiesButton?.addEventListener("click", () => {
	try {
		localStorage.setItem("cookies_accepted", "true");
	} catch {
		// Navegación privada o bloqueo del almacenamiento no interrumpe la experiencia.
	}
	cookieBanner?.classList.add("is-hidden");
});

declineCookiesButton?.addEventListener("click", () => {
	try {
		localStorage.setItem("cookies_accepted", "false");
	} catch {
		// Se continúa sin almacenamiento persistente.
	}
	cookieBanner?.classList.add("is-hidden");
});

function formatPrice(value) {
	return `$${value.toFixed(2)}`;
}

function createProductCard(product) {
	const card = document.createElement("article");
	card.className = "product-card";
	card.dataset.category = product.categoria;

	const imageContainer = document.createElement("div");
	imageContainer.className = "product-image";
	const image = document.createElement("img");
	image.src = product.imagen;
	image.alt = product.nombre;
	image.loading = "lazy";
	image.width = 640;
	image.height = 640;
	image.decoding = "async";
	imageContainer.append(image);

	if (product.etiqueta) {
		const label = document.createElement("span");
		label.className = "product-label";
		if (product.etiqueta === "Picante") label.classList.add("spicy");
		if (product.etiqueta === "Mejor precio") label.classList.add("combo");
		label.textContent = product.etiqueta;
		imageContainer.append(label);
	}

	const info = document.createElement("div");
	info.className = "product-info";
	const details = document.createElement("div");
	const name = document.createElement("h3");
	name.textContent = product.nombre;
	const description = document.createElement("p");
	description.textContent = product.descripcion;
	details.append(name, description);

	const bottom = document.createElement("div");
	bottom.className = "product-bottom";
	const price = document.createElement("strong");
	price.textContent = formatPrice(product.precio);
	const addButton = document.createElement("button");
	addButton.className = "add-button";
	addButton.type = "button";
	addButton.dataset.id = String(product.id);
	addButton.dataset.name = product.nombre;
	addButton.dataset.price = String(product.precio);
	addButton.setAttribute("aria-label", `Agregar ${product.nombre} al pedido`);
	addButton.textContent = "+";
	bottom.append(price, addButton);
	info.append(details, bottom);
	card.append(imageContainer, info);
	return card;
}

function filterProducts(category) {
	productGrid.querySelectorAll(".product-card").forEach((card) => {
		card.classList.toggle("is-hidden", category !== "todos" && card.dataset.category !== category);
	});
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
	filterProducts(selectedCategory);
	if (persist) saveLastCategory(selectedCategory);

	if (menuStatus) {
		const messages = {
			todos: "Mostrando todos los productos.",
			hamburguesas: "Mostrando hamburguesas.",
			acompanamientos: "Mostrando acompañamientos.",
			combos: "Mostrando combos.",
			bebidas: "Mostrando bebidas.",
			postres: "Mostrando postres.",
		};
		menuStatus.textContent = messages[selectedCategory] || "Mostrando productos.";
	}
}

async function loadProducts() {
	try {
		const response = await fetch("./data/productos.json");
		if (!response.ok) throw new Error("No se pudo cargar el catálogo");
		const products = await response.json();
		if (!Array.isArray(products)) throw new Error("El catálogo no es una lista");

		productGrid.replaceChildren(...products.map(createProductCard));
		selectCategory(getLastCategory());
		menuStatus.textContent = "";
	} catch {
		menuStatus.textContent = "No se pudo cargar el menú. Inténtalo de nuevo más tarde.";
	}
}

function renderLastUpdate() {
	const timestamp = getLastUpdateTimestamp();
	const date = timestamp === null ? null : new Date(timestamp);

	if (!date || Number.isNaN(date.getTime())) {
		lastUpdate.removeAttribute("datetime");
		lastUpdate.textContent = "Sin modificaciones";
		return;
	}

	lastUpdate.dateTime = date.toISOString();
	lastUpdate.textContent = new Intl.DateTimeFormat("es-EC", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

function renderCart() {
	const entries = [...cart.items.entries()];
	const totalProducts = entries.reduce((total, [, item]) => total + item.quantity, 0);

	navCount.textContent = totalProducts;
	orderCount.textContent = `${totalProducts} ${totalProducts === 1 ? "producto" : "productos"}`;
	orderSubtotal.textContent = formatPrice(cart.getSubtotal());
	orderTotal.textContent = formatPrice(cart.getTotal());
	confirmOrder.disabled = entries.length === 0;
	renderLastUpdate();

	if (entries.length === 0) {
		orderItems.innerHTML = '<p class="empty-order">Todavía no has elegido nada.<br><a href="#menu">Explora el menú para comenzar.</a></p>';
		return;
	}

	orderItems.innerHTML = entries.map(([id, item]) => `
		<div class="order-item">
			<span class="order-item-name">${item.nombre}</span>
			<span class="order-item-price">${formatPrice(item.precio * item.quantity)}</span>
			<span class="quantity-controls" role="group" aria-label="Cantidad de ${item.nombre}">
				<button type="button" data-action="decrease" data-id="${id}" aria-label="Quitar una unidad de ${item.nombre}">−</button>
				<span aria-live="polite">${item.quantity}</span>
				<button type="button" data-action="increase" data-id="${id}" aria-label="Agregar una unidad de ${item.nombre}">+</button>
			</span>
		</div>
	`).join("");
}

function addToCart(product) {
	cart.addItem(product);
	renderCart();
	orderMessage.textContent = `${product.nombre} se agregó a tu pedido.`;
}

function changeQuantity(id, amount) {
	const item = cart.items.get(String(id));
	if (!item) return;

	const itemRemoved = amount < 0 && item.quantity === 1;
	cart.updateQuantity(id, item.quantity + amount);
	renderCart();
	if (amount > 0) {
		orderMessage.textContent = `Se agregó una unidad de ${item.nombre} a tu pedido.`;
	} else if (itemRemoved) {
		orderMessage.textContent = `${item.nombre} se eliminó de tu pedido.`;
	} else {
		orderMessage.textContent = `Se quitó una unidad de ${item.nombre} de tu pedido.`;
	}
}

filterButtons.forEach((button) => {
	button.setAttribute("aria-pressed", String(button.classList.contains("active")));
	button.addEventListener("click", () => selectCategory(button.dataset.filter, true));
});

goToComboLinks.forEach((link) => {
	link.addEventListener("click", () => {
		selectCategory(link.dataset.filter, true);
	});
});

productGrid.addEventListener("click", (event) => {
	const button = event.target.closest(".add-button");
	if (!button || button.classList.contains("is-added")) return;
	addToCart({
		id: button.dataset.id,
		nombre: button.dataset.name,
		precio: Number(button.dataset.price),
	});
	button.classList.add("is-added");
	button.textContent = "✓";
	setTimeout(() => {
		button.classList.remove("is-added");
		button.textContent = "+";
	}, 600);
});

orderItems.addEventListener("click", (event) => {
	const button = event.target.closest("button[data-action]");
	if (!button) return;
	changeQuantity(button.dataset.id, button.dataset.action === "increase" ? 1 : -1);
});

confirmOrder.addEventListener("click", () => {
	orderMessage.textContent = "¡Listo! Tu pedido de prueba fue recibido. Gracias por elegir Brasa Urbana.";
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

if (contactForm) {
	initValidation(contactForm, () => {
		contactMessage.textContent = "Datos validados. Esta demostración no envía solicitudes.";
	});
}

loadProducts();
renderCart();