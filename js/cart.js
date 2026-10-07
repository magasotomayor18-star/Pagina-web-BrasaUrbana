import { getCartFromStorage, saveCartToStorage } from "./storage.js";

export class Cart {
  constructor() {
    this.items = new Map();

    getCartFromStorage().forEach((storedItem) => {
      const product = this.#normalizeProduct(storedItem);
      const quantity = Number(storedItem?.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1) return;
      this.items.set(product.id, { ...product, quantity });
    });
  }

  #normalizeProduct(product) {
    if (!product || typeof product !== "object") return null;

    const { id, nombre, name, precio, price, quantity, ...details } = product;
    const productId = id ?? name ?? nombre;
    const productName = nombre ?? name;
    const productPrice = Number(precio ?? price);

    if (productId === undefined || productId === null || String(productId).trim() === "") return null;
    if (typeof productName !== "string" || !Number.isFinite(productPrice) || productPrice < 0) return null;

    return {
      ...details,
      id: String(productId),
      nombre: productName,
      precio: productPrice,
    };
  }

  #syncStorage() {
    saveCartToStorage([...this.items.values()]);
  }

  addItem(product) {
    const normalizedProduct = this.#normalizeProduct(product);
    if (!normalizedProduct) throw new TypeError("El producto debe incluir id, nombre y precio válidos.");

    const existingEntry = this.items.has(normalizedProduct.id)
      ? [normalizedProduct.id, this.items.get(normalizedProduct.id)]
      : [...this.items.entries()].find(([id, item]) => id === item.nombre && item.nombre === normalizedProduct.nombre);
    const itemId = existingEntry?.[0] ?? normalizedProduct.id;
    const existingItem = existingEntry?.[1];
    this.items.set(itemId, {
      ...(existingItem || normalizedProduct),
      quantity: (existingItem?.quantity || 0) + 1,
    });
    this.#syncStorage();
  }

  removeItem(id) {
    const removed = this.items.delete(String(id));
    if (removed) this.#syncStorage();
    return removed;
  }

  updateQuantity(id, amount) {
    const itemId = String(id);
    const item = this.items.get(itemId);
    const quantity = Number(amount);
    if (!item || !Number.isInteger(quantity)) return false;
    if (quantity <= 0) return this.removeItem(itemId);

    this.items.set(itemId, { ...item, quantity });
    this.#syncStorage();
    return true;
  }

  getSubtotal() {
    return [...this.items.values()].reduce((subtotal, item) => subtotal + item.precio * item.quantity, 0);
  }

  getTotal(taxRate = 0.12) {
    return this.getSubtotal() * (1 + taxRate);
  }

  clearCart() {
    this.items.clear();
    this.#syncStorage();
  }
}