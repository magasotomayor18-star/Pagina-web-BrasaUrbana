const CART_STORAGE_KEY = "cart_items";
const CATEGORY_STORAGE_KEY = "last_category";
const CART_UPDATE_COOKIE = "cart_last_update";
const CART_UPDATE_COOKIE_DAYS = 365;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function safeStorageGet(storageName, key) {
  try {
    const storage = storageName === "session" ? sessionStorage : localStorage;
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(storageName, key, value) {
  try {
    const storage = storageName === "session" ? sessionStorage : localStorage;
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function saveCartToStorage(cartData) {
  const items = Array.isArray(cartData) ? cartData : [];
  safeStorageSet("local", CART_STORAGE_KEY, JSON.stringify(items));
  setCookie(CART_UPDATE_COOKIE, Date.now(), CART_UPDATE_COOKIE_DAYS);
}

export function getCartFromStorage() {
  try {
    const storedItems = safeStorageGet("local", CART_STORAGE_KEY);
    const items = storedItems ? JSON.parse(storedItems) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveLastCategory(category) {
  safeStorageSet("session", CATEGORY_STORAGE_KEY, String(category));
}

export function getLastCategory() {
  return safeStorageGet("session", CATEGORY_STORAGE_KEY) || "todos";
}

export function setCookie(name, value, days) {
  try {
    const expires = new Date(Date.now() + Number(days) * MILLISECONDS_PER_DAY);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(String(value))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch {
    // Ignored when cookies are blocked by the browser or privacy settings.
  }
}

export function getCookie(name) {
  try {
    const prefix = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie.split("; ").find((entry) => entry.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

export function getLastUpdateTimestamp() {
  const timestamp = getCookie(CART_UPDATE_COOKIE);
  if (timestamp === null) return null;

  const numericTimestamp = Number(timestamp);
  return Number.isFinite(numericTimestamp) ? numericTimestamp : null;
}