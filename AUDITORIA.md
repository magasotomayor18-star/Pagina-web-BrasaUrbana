# Auditoría de Accesibilidad (WCAG 2.2 AA), UX y Diseño Responsive

**Fecha de evaluación:** Octubre de 2026  
**Alcance:** Revisión no destructiva exhaustiva de la arquitectura web compuesta por `index.html`, `assets/css/styles.css`, el script raíz `script.js` y la suite modular en `js/` (`app.js`, `cart.js`, `storage.js`, `validation.js`), junto con el catálogo de datos `data/productos.json`.  
**Archivos modificados durante la auditoría:** Ninguno de los archivos fuente auditados. Únicamente se actualizó este informe de auditoría.

---

## 1. Resumen ejecutivo

La presente auditoría técnica evaluó la interfaz web de **Brasa Urbana** bajo las directrices internacionales de accesibilidad **WCAG 2.2 Nivel AA**, principios de experiencia de usuario (UX) y comportamiento responsivo en resoluciones de **320 px, 398 px, 768 px y escritorio (1280 px+)**.

El análisis abarcó la totalidad de los archivos de lógica frontend: tanto la arquitectura modular activa en `js/` (`app.js`, `cart.js`, `storage.js`, `validation.js`) enlazada en `index.html`, como el script monolítico raíz `script.js` (220 líneas), evaluando su sintaxis, sincronización con el DOM, gestión de eventos, robustez y accesibilidad.

### Estado actual frente a la auditoría preliminar
Se constata que el código base ha progresado en varios puntos críticos señalados en auditorías anteriores:
1. **Contraste primario corregido:** El color corporativo (`--orange`) fue oscurecido de `#ef5b32` a `#a8381f` en `styles.css`, alcanzando ratios conformes de **5.89:1** sobre fondo papel (`#f7f4ef`) y **6.36:1** sobre blanco (`#fffdf9`), superando el mínimo de 4.5:1.
2. **Ergonomía táctil en el carrito:** Los controles de cantidad (`+` y `−`) fueron redimensionados de `22 x 22 px` a **`44 x 44 px`**, cumpliendo WCAG 2.2 AA (24 px) y las guías de diseño táctil móvil (44 px).
3. **Indicador de foco visible:** Se reemplazó el contorno amarillo de bajo contraste por un doble anillo global `:focus-visible` de 3 px (`#252321` con sombra `#fffdf9` y offset de 3 px).
4. **Nombre dinámico del menú móvil:** El botón de hamburguesa ahora conmuta su etiqueta oculta entre "Abrir menú de navegación" y "Cerrar menú de navegación".
5. **Formulario accesible:** Se implementó un formulario con etiquetas vinculadas por `for`/`id`, atributos `autocomplete`, conexión de errores vía `aria-describedby` y gestión de foco al primer campo erróneo.

### Diagnóstico global consolidado
Persisten oportunidades de optimización y correcciones técnicas categorizadas en:
* **1 Hallazgo Crítico:** Carga simultánea de frameworks externos redundantes no utilizados en la interfaz (Tailwind CDN y Bootstrap CSS/JS) que penalizan el rendimiento en redes móviles y colisionan con los estilos locales.
* **4 Hallazgos Altos:** Contraste de texto insuficiente en hero y promociones; desprotección ante bloqueos de `localStorage` en `js/app.js`; falta de soporte para la tecla `Escape` y trampa de foco en el menú móvil; y bug de delegación de eventos en `script.js` (`matches("a")`) que impide cerrar el menú móvil al tocar el contador del pedido.
* **7 Hallazgos Medios:** Recorte visual de elementos y compresión extrema del resumen a 320 px; uso indebido de `aria-label` en contenedores genéricos (`div`/`span`); región viva saturada en `#product-grid`; objetivos táctiles secundarios de 32 px en botones de agregar; ausencia de `aria-pressed` en filtros de categoría; desincronización funcional severa de `script.js` con el DOM (omisión de subtotal, banner de cookies y fecha de actualización); y selectores obsoletos muertos (`.add-promo`).
* **5 Hallazgos Bajos:** Redundancia de textos alternativos (`alt`) en el catálogo; ausencia de `width` y `height` en etiquetas `<img>` (riesgo de CLS); ambigüedad del enlace "Lo quiero"; falta de feedback visual en adición de productos en `script.js`; y dependencia exclusiva de imágenes remotas en CDN.

Todos los scripts analizados (`script.js`, `js/app.js`, `js/cart.js`, `js/storage.js`, `js/validation.js`) superaron sin excepciones la validación sintáctica estricta con `node --check`.

---

## 2. Hallazgos críticos, altos, medios y bajos

| Nivel | Código | Descripción del Hallazgo | Archivos Afectados | Criterio / Estándar |
| :--- | :--- | :--- | :--- | :--- |
| **Crítico** | **C-01** | Carga de frameworks redundantes no utilizados (Tailwind CDN y Bootstrap CSS/JS) | `index.html` | W3C Performance / UX Mobile |
| **Alto** | **A-01** | Contraste insuficiente en textos secundarios de hero y promociones | `assets/css/styles.css` | WCAG 1.4.3 Contraste mínimo (AA) |
| **Alto** | **A-02** | Excepciones no capturadas en `localStorage` en `js/app.js` (Riesgo en navegación privada) | `js/app.js` | WCAG 4.1.2 Robustez / UX |
| **Alto** | **A-03** | Menú móvil sin soporte para tecla `Escape` ni gestión de foco accesible | `index.html`, `js/app.js`, `script.js` | WCAG 2.1.1, 2.1.2, 2.4.3 Teclado |
| **Alto** | **A-04** | Fallo de cierre del menú móvil por delegación estricta `matches("a")` en `script.js` | `script.js` | WCAG 2.5.2 Cancelación del puntero / UX |
| **Medio** | **M-01** | Recorte visual de sticker e insuficiencia de espacio en el pedido a 320 px | `assets/css/styles.css` | WCAG 1.4.10 Reflujo / Responsive UX |
| **Medio** | **M-02** | Atributo `aria-label` en elementos genéricos sin rol (`div` y `span`) | `index.html`, `js/app.js` | WCAG 4.1.2 Nombre, función, valor |
| **Medio** | **M-03** | Región viva (`aria-live`) sobrecargada en la cuadrícula completa de productos | `index.html`, `js/app.js`, `script.js` | WCAG 4.1.3 Mensajes de estado |
| **Medio** | **M-04** | Tamaño de objetivos táctiles de botones secundarios menor a 44x44 px | `assets/css/styles.css` | WCAG 2.5.8 (AA) / 2.5.5 (AAA / UX) |
| **Medio** | **M-05** | Estado activo no comunicado en los filtros de categoría de productos | `index.html`, `js/app.js`, `script.js` | WCAG 4.1.2 Nombre, función, valor |
| **Medio** | **M-06** | Desincronización funcional de `script.js` con el DOM (omisión de subtotal y cookies) | `script.js` | Mantenibilidad / Coherencia UI |
| **Medio** | **M-07** | Código muerto y selectores obsoletos (`.add-promo`) en `script.js` | `script.js` | Calidad de Software / Arquitectura |
| **Bajo** | **B-01** | Redundancia de texto alternativo (`alt`) en imágenes del catálogo dinámico | `js/app.js`, `script.js` | WCAG 1.1.1 Contenido no textual |
| **Bajo** | **B-02** | Ausencia de atributos `width` y `height` en etiquetas `<img>` (Riesgo de CLS) | `index.html`, `js/app.js`, `script.js` | Core Web Vitals / UX |
| **Bajo** | **B-03** | Nombre accesible ambiguo fuera de contexto en enlaces ("Lo quiero") | `index.html` | WCAG 2.4.4 Propósito del enlace |
| **Bajo** | **B-04** | Carencia de retroalimentación táctil/visual en el botón "+" en `script.js` | `script.js` | WCAG 3.2.4 / UX de interacción |
| **Bajo** | **B-05** | Dependencia absoluta de imágenes externas alojadas en CDN (Unsplash) | `index.html`, `data/productos.json` | Resiliencia de red / Disponibilidad |

---

## 3. Evidencia concreta e impacto por hallazgo

### Hallazgos Críticos

#### C-01. Carga de frameworks redundantes no utilizados (Tailwind CDN y Bootstrap CSS/JS)
* **Archivo afectado:** `index.html` (Líneas 11-33).
* **Elemento afectado:**
  ```html
  <script>tailwind = { ... };</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" defer></script>
  ```
* **Evidencia concreta:**
  1. `https://cdn.tailwindcss.com` descarga en tiempo de ejecución el compilador JIT completo (~3 MB descomprimido), el cual está catalogado por la propia documentación oficial de Tailwind exclusivamente para prototipado rápido, desaconsejado formalmente para producción.
  2. En todo `index.html` **no se utiliza ninguna clase de utilidad de Tailwind** (0 clases encontradas tras analizar los selectores).
  3. De Bootstrap solo se emplea la clase `shadow-sm` en el header; mientras que la clase `.container` es sobrescrita de inmediato por `assets/css/styles.css`.
  4. La coexistencia de Bootstrap Reboot introduce reglas que fuerzan el uso de directivas `!important` en `styles.css` (por ejemplo, en `h1` y `h2`) para contrarrestar la especificidad de Bootstrap.
* **Impacto:** Provoca demoras notables en el First Contentful Paint (FCP) y Largest Contentful Paint (LCP) en redes móviles 3G/4G, desperdiciando ancho de banda y batería en dispositivos de gama baja.

---

### Hallazgos Altos

#### A-01. Contraste insuficiente en textos secundarios de hero y promociones
* **Archivo afectado:** `assets/css/styles.css` (Líneas 57, 66, 118, 125).
* **Elementos afectados:**
  - `.hero-text` y `.hero-notes` (texto secundario sobre fondo crema).
  - `.promos-section .section-description` (descripción sobre fondo verde).
  - `.promo-secondary p:not(.promo-number)` (texto sobre fondo amarillo).
  - `.floating-tag span` (texto amarillo sobre etiqueta verde).
* **Evidencia concreta (Mediciones exactas según fórmula WCAG 2.2):**
  - **`#736d66` sobre `#eee9e0` (`.hero-text` en hero):** Ratio de **`4.23:1`** (Falla el mínimo de **4.5:1** para texto normal de 17 px).
  - **`rgba(255,255,255,0.7)` (`#b8c2bc`) sobre `#53685a` (`.promos-section` descripción):** Ratio de **`3.28:1`** (Falla el mínimo de **4.5:1**).
  - **`rgba(37,35,33,0.7)` (`#665e38`) sobre `#f5c54b` (`.promo-secondary p`):** Ratio de **`4.02:1`** (Falla el mínimo de **4.5:1**).
  - **`#f5c54b` sobre `#53685a` (`.floating-tag span`):** Ratio de **`3.71:1`** (Falla el mínimo de **4.5:1** para texto de 17 px).
* **Impacto:** Dificulta la lectura para personas con baja agudeza visual, usuarios en pantallas con brillo reducido o en exteriores bajo luz solar directa.

#### A-02. Excepciones no capturadas en `localStorage` en `js/app.js`
* **Archivo afectado:** `js/app.js` (Líneas 27-39).
* **Elementos afectados:**
  ```javascript
  if (localStorage.getItem("cookies_accepted") === null) {
    cookieBanner.classList.remove("is-hidden");
  }
  acceptCookiesButton.addEventListener("click", () => {
    localStorage.setItem("cookies_accepted", "true");
    cookieBanner.classList.add("is-hidden");
  });
  ```
* **Evidencia concreta:**
  En `js/storage.js` (línea 14), las operaciones con almacenamiento están debidamente protegidas con `try / catch`:
  ```javascript
  try {
    const storedItems = localStorage.getItem(CART_STORAGE_KEY);
  } catch { return []; }
  ```
  Sin embargo, en `js/app.js` la verificación de cookies se ejecuta de forma síncrona en el nivel raíz del módulo sin bloque `try / catch`.
* **Impacto:** Si un usuario navega en modo privado estricto, tiene deshabilitadas las cookies de terceros o el dispositivo tiene el almacenamiento saturado, el navegador lanza un error `DOMException (SecurityError / QuotaExceededError)`. Al ocurrir en el nivel superior de `js/app.js`, el script se interrumpe antes de llegar a las líneas 251-252 (`loadProducts()` y `renderCart()`), impidiendo por completo la carga del menú y del carrito.

#### A-03. Menú móvil sin soporte para tecla `Escape` ni gestión de foco accesible
* **Archivos afectados:** `index.html` (Líneas 45-56), `js/app.js` (Líneas 233-245) y `script.js` (Líneas 197-212).
* **Elementos afectados:** Botón `.menu-toggle` y contenedor `#menu-principal`.
* **Evidencia concreta:**
  1. Al presionar `.menu-toggle`, la clase `.is-open` se añade a `.main-nav` y `aria-expanded` se actualiza a `"true"`. No obstante, el foco del teclado permanece en el botón de hamburguesa y no se transfiere al primer enlace del menú.
  2. Al presionar la tecla `Escape`, ni `app.js` ni `script.js` cuentan con un manejador de teclado para cerrar el menú y devolver el foco al disparador.
  3. Al tabular secuencialmente hacia adelante dentro del menú abierto, el foco se escapa hacia el contenido principal oculto bajo la superposición sin atrapar el foco mientras el menú móvil está activo.
* **Impacto:** Los usuarios dependientes exclusivamente de teclado o lectores de pantalla en dispositivos móviles quedan desorientados al navegar en un menú superpuesto sin mecanismos estándar de escape.

#### A-04. Fallo de cierre del menú móvil por delegación estricta `matches("a")` en `script.js`
* **Archivo afectado:** `script.js` (Líneas 208-212).
* **Elemento afectado:**
  ```javascript
  mainNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      setMenuOpen(false);
    }
  });
  ```
* **Evidencia concreta:**
  En `index.html` (línea 54), el enlace del carrito contiene un elemento hijo anidado:
  `<a class="nav-order" href="#pedido">Mi pedido <span id="nav-count">0</span></a>`.
  Cuando un usuario en un dispositivo móvil toca la insignia numérica (`<span id="nav-count">`), `event.target` apunta al elemento `<span>`. Dado que `span.matches("a")` evalúa a `false`, la condición no se cumple y el menú móvil **permanece abierto** cubriendo la pantalla, obligando al usuario a buscar manualmente cómo cerrarlo.
  *(En contraste, `js/app.js` línea 244 utiliza correctamente `event.target.closest("a")`, evitando este error).*
* **Impacto:** Frustración de interacción en dispositivos táctiles pequeños (320 px y 398 px) donde el objetivo táctil del badge del contador abarca una porción considerable del botón del pedido.

---

### Hallazgos Medios

#### M-01. Recorte visual de sticker e insuficiencia de espacio en el pedido a 320 px
* **Archivo afectado:** `assets/css/styles.css` (Líneas 49, 73, 134, 142).
* **Elementos afectados:** `.hero`, `.floating-tag`, `.order-panel` y `.order-item`.
* **Evidencia concreta:**
  1. **Recorte en Hero:** En viewport de 320 px, el ancho útil del contenedor es de 288 px. La etiqueta decorativa `.floating-tag` tiene `position: absolute; right: -28px; width: 110px;`. Al sobresalir 28 px a la derecha, colisiona con el borde del viewport y es cortada abruptamente por `.hero { overflow: hidden; }`, impidiendo ver el texto completo.
  2. **Compresión extrema en Carrito:** `.order-panel` mantiene un `padding: 28px` fijo sin media query para pantallas pequeñas. En 320 px, el ancho útil restante para `.order-item` es de apenas 232 px (`288 - 56 = 232 px`). La cuadrícula `grid-template-columns: 1fr auto auto` asigna ~117 px a los botones de cantidad y ~45 px al precio, dejando para `.order-item-name` solo ~46 px de ancho. Para productos como "Cheesecake de Frutos Rojos" o "Limonada de la Casa", el texto se fragmenta en 4 o 5 líneas verticales sumamente estrechas, perjudicando la legibilidad.
* **Impacto:** Degradación visual y de legibilidad en pantallas de gama de entrada o teléfonos de formato reducido (320 px).

#### M-02. Atributo `aria-label` en elementos genéricos sin rol semántico
* **Archivos afectados:** `index.html` (Líneas 70, 140) y `js/app.js` (Línea 165).
* **Elementos afectados:**
  ```html
  <!-- index.html -->
  <div class="hero-notes" aria-label="Características del restaurante">
  <div class="gallery reveal reveal-delay" aria-label="Galería de comida rápida">
  
  <!-- js/app.js -->
  <span class="quantity-controls" aria-label="Cantidad de ${item.nombre}">
  ```
* **Evidencia concreta:**
  Según la especificación técnica de W3C WAI-ARIA 1.2/1.3, el atributo `aria-label` está prohibido o es ignorado en elementos de estructura genérica (`div`, `span`) que carecen de un rol semántico de hito (*landmark*), estructura o *widget*.
* **Impacto:** Los lectores de pantalla omiten este etiquetado, creando una falsa expectativa de accesibilidad en el código fuente que no llega al usuario asistido.

#### M-03. Región viva (`aria-live`) sobrecargada en la cuadrícula completa de productos
* **Archivos afectados:** `index.html` (Línea 116), `js/app.js` (Líneas 96-111) y `script.js` (Líneas 99-104).
* **Elemento afectado:**
  ```html
  <div id="product-grid" class="product-grid" aria-live="polite"></div>
  ```
* **Evidencia concreta:**
  Al declarar `aria-live="polite"` en el contenedor `#product-grid`, cada vez que el catálogo se carga o se filtra una categoría, los lectores de pantalla intentan verbalizar las tarjetas completas que mutan en el DOM (hasta 11 tarjetas con imágenes, títulos, precios y botones), saturando el canal auditivo del usuario. Para los mensajes de estado ya existe el elemento `<p id="menu-status" class="sr-only" role="status" aria-live="polite"></p>`, pero ni `app.js` ni `script.js` actualizan este elemento en la función de filtrado para anunciar, por ejemplo, "Mostrando 3 productos de la categoría Combos".
* **Impacto:** Ruido excesivo e ininteligible al interactuar con los filtros de la carta.

#### M-04. Tamaño de objetivos táctiles de botones secundarios menor a 44x44 px
* **Archivo afectado:** `assets/css/styles.css` (Líneas 107, 186).
* **Elementos afectados:**
  - `.add-button` (Botón "+" en cada tarjeta de producto): mide `32 x 32 px`.
  - `.menu-toggle` (Botón de hamburguesa en móvil): área efectiva de `~33 x 32 px` (padding `8px 0 8px 8px`, spans de 25px con altura combinada de 16px).
* **Evidencia concreta:**
  Aunque ambos controles superan el umbral mínimo estricto de WCAG 2.2 AA SC 2.5.8 (24x24 px), se sitúan por debajo de los 44x44 px recomendados por WCAG 2.5.5 (Nivel AAA) y las directrices de interfaz humana de Google y Apple. En contraste, los botones del carrito sí alcanzan `44 x 44 px`.
* **Impacto:** Aumenta la probabilidad de pulsaciones erróneas o frustración motriz en pantallas táctiles pequeñas.

#### M-05. Estado activo no comunicado en los filtros de categoría de productos
* **Archivos afectados:** `index.html` (Líneas 108-113), `js/app.js` (Líneas 102-111) y `script.js` (Líneas 87-93, 155-162).
* **Elementos afectados:** `<button class="filter-button">` dentro de `.filter-bar`.
* **Evidencia concreta:**
  Los botones de categoría cambian visualmente mediante la clase CSS `.active`. No obstante, en ambos scripts carecen de la asignación del atributo `aria-pressed="true"` (o `aria-pressed="false"`).
* **Impacto:** Un usuario con lector de pantalla sabe que el botón se llama "Hamburguesas", pero desconoce si dicha categoría es la que se encuentra filtrada actualmente.

#### M-06. Desincronización funcional de `script.js` con el DOM (omisión de subtotal y cookies)
* **Archivo afectado:** `script.js` (Líneas 128-153).
* **Elementos afectados:** `#order-subtotal`, `#cart-last-update` y `#cookie-banner`.
* **Evidencia concreta:**
  1. En `index.html` existen `<strong id="order-subtotal">$0.00</strong>` y `<time id="cart-last-update">Sin modificaciones</time>`.
  2. En `script.js`, la función `renderCart()` solo actualiza `orderTotal` (línea 134). Nunca selecciona ni actualiza `orderSubtotal`. Si se ejecuta `script.js`, el subtotal permanece fijado en `$0.00` mientras el total asciende a valores como `$15.00`, generando incongruencia contable visible.
  3. `script.js` omite por completo los listeners del banner de consentimiento de cookies (`#accept-cookies` y `#decline-cookies`), dejando el banner desatendido.
* **Impacto:** Datos erróneos en pantalla y fallo en la persistencia del consentimiento de cookies si se usa `script.js`.

#### M-07. Código muerto y selectores obsoletos (`.add-promo`) en `script.js`
* **Archivo afectado:** `script.js` (Líneas 10, 164-172).
* **Elementos afectados:**
  ```javascript
  const addButtons = document.querySelectorAll(".add-promo");
  addButtons.forEach((button) => { ... });
  ```
* **Evidencia concreta:**
  En `index.html`, las tarjetas de promociones no tienen la clase `.add-promo` (utilizan `.go-to-combos`). La variable `addButtons` es un NodeList vacío. Además, `script.js` no cuenta con lógica para reaccionar a los clics en `.go-to-combos`, por lo que al hacer clic en "Elegir combo" en la sección de promociones, el usuario no es llevado a la vista filtrada de combos en el menú.
* **Impacto:** Código residual inoperante y desconexión funcional de las promociones.

---

### Hallazgos Bajos

#### B-01. Redundancia de texto alternativo (`alt`) en imágenes del catálogo dinámico
* **Archivos afectados:** `js/app.js` (Líneas 54-56) y `script.js` (Línea 38).
* **Elementos afectados:** `image.alt = product.nombre;`.
* **Evidencia concreta:**
  En `script.js`, el 100% de los productos reciben como texto alternativo exactamente su nombre propio. En `js/app.js`, solo "Limonada de la Casa" recibe una descripción ampliada. Al encontrarse justo al lado del encabezado `<h3>` con el mismo nombre, el lector de pantalla lee repetitivamente *"Gráfico [Nombre], Encabezado nivel 3 [Nombre]"*.
* **Impacto:** Redundancia verbal en lectores de pantalla.

#### B-02. Ausencia de atributos `width` y `height` en etiquetas `<img>`
* **Archivos afectados:** `index.html` (Líneas 77, 140), `js/app.js` (Línea 52) y `script.js` (Líneas 36-40).
* **Elementos afectados:** Etiquetas `<img>` de hero, galería y catálogo dinámico.
* **Evidencia concreta:**
  Ninguna imagen declara atributos HTML nativos `width` o `height`. Se confía exclusivamente en reglas CSS como `aspect-ratio` y `max-width: 100%`.
* **Impacto:** Incremento potencial de la métrica Cumulative Layout Shift (CLS) antes de que el navegador descargue y calcule las hojas de estilo y las imágenes.

#### B-03. Nombre accesible ambiguo fuera de contexto en enlaces ("Lo quiero")
* **Archivo afectado:** `index.html` (Línea 125).
* **Elemento afectado:** `<a href="#menu" class="text-link light-link go-to-combos" data-filter="combos">Lo quiero <span aria-hidden="true">&#8594;</span></a>`.
* **Evidencia concreta:**
  Al listar enlaces fuera de contexto mediante un lector de pantalla, la frase "Lo quiero" no explicita a qué promoción hace referencia (en este caso, la promoción "Martes de brasa").
* **Impacto:** Dificultad para discernir el destino o propósito del enlace en navegación rápida por listado de links.

#### B-04. Carencia de retroalimentación táctil/visual en el botón "+" en `script.js`
* **Archivo afectado:** `script.js` (Líneas 174-183).
* **Elemento afectado:** Listener de clic en `.product-grid`.
* **Evidencia concreta:**
  En `script.js`, al pulsar el botón `+` para agregar un producto al carrito, la interfaz no ofrece ninguna confirmación visual sobre el botón (a diferencia de `app.js`, que cambia transitoriamente el símbolo a un checkmark `"✓"` y aplica `.is-added` por 600 ms).
* **Impacto:** El usuario puede pulsar múltiples veces creyendo que la acción no se registró, agregando productos no deseados.

#### B-05. Dependencia absoluta de imágenes externas alojadas en CDN (Unsplash)
* **Archivos afectados:** `index.html` (Líneas 77, 140) y `data/productos.json`.
* **Evidencia concreta:**
  Todas las fotos del restaurante y de los productos provienen de URLs remotas en `images.unsplash.com`.
* **Impacto:** Si la conexión a internet cae, las peticiones sufren latencia o Unsplash restringe cuotas, la interfaz queda visualmente fragmentada.

---

## 4. Recomendación de corrección para cada hallazgo

### Correcciones Críticas y Altas

1. **Corrección de C-01 (Retiro de frameworks redundantes):**
   - En `index.html`, eliminar el bloque `<script>tailwind = ...</script>`, `<script src="https://cdn.tailwindcss.com"></script>` y los enlaces de CDN a Bootstrap CSS y JS.
   - Reemplazar la clase `shadow-sm` en `<header class="site-header shadow-sm">` por una clase o regla nativa en `assets/css/styles.css` (por ejemplo, `box-shadow: 0 2px 10px rgba(0,0,0,0.06);`).
   - Retirar los modificadores `!important` en las reglas de encabezados de `styles.css`.

2. **Corrección de A-01 (Ajuste de contraste de color):**
   - **Hero:** Cambiar el color de `.hero-text` y `.hero-notes` a `#5c5650` o `#252321` cuando estén sobre `--cream` `#eee9e0` para alcanzar un ratio superior a `5.2:1`.
   - **Promociones:** En `.promos-section .section-description`, cambiar `rgba(255,255,255,0.7)` por `#ffffff` (ratio `5.91:1`). En `.promo-secondary p`, cambiar `rgba(37,35,33,0.7)` por `#252321` (ratio `9.67:1`).
   - **Etiqueta flotante:** Para `.floating-tag span`, emplear `#ffffff` sobre el fondo verde (ratio `5.91:1`) o aumentar el grosor y tamaño.

3. **Corrección de A-02 (Blindaje de `localStorage` en `js/app.js`):**
   - Envolver el acceso a almacenamiento en una función segura con `try / catch`:
     ```javascript
     function getStorageItemSafe(key) {
       try { return localStorage.getItem(key); }
       catch { return null; }
     }
     function setStorageItemSafe(key, val) {
       try { localStorage.setItem(key, val); }
       catch { /* continuar en memoria */ }
     }
     ```

4. **Corrección de A-03 (Accesibilidad por teclado en el menú móvil):**
   - Al abrir el menú (`isOpen === true`), trasladar el foco programáticamente al primer enlace con `mainNav.querySelector("a")?.focus()`.
   - Agregar un listener para la tecla `Escape`:
     ```javascript
     document.addEventListener("keydown", (event) => {
       if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
         setMenuOpen(false);
         menuToggle.focus();
       }
     });
     ```
   - Bloquear el desplazamiento de fondo (`document.body.style.overflow = isOpen ? 'hidden' : ''`).

5. **Corrección de A-04 (Delegación de eventos robusta en `script.js`):**
   - Reemplazar en `script.js` (línea 209):
     ```javascript
     // Antes: if (event.target.matches("a"))
     // Corrección:
     if (event.target.closest("a")) {
       setMenuOpen(false);
     }
     ```

---

### Correcciones Medias y Bajas

6. **Corrección de M-01 (Ajustes de reflujo y padding en 320 px):**
   - En `assets/css/styles.css`, dentro de la media query `@media (max-width: 430px)`:
     ```css
     .floating-tag { right: 0; }
     .order-panel { padding: 16px; }
     .order-item { grid-template-columns: 1fr auto; gap: 8px; }
     .quantity-controls { grid-column: span 2; justify-content: flex-end; }
     ```

7. **Corrección de M-02 (Semántica en lugar de `aria-label` huérfano):**
   - En `index.html`, convertir `.hero-notes` en una lista semántica `<ul>` o `<dl>` accesible.
   - Envolver la galería en `<section aria-labelledby="gallery-title">` o una lista `<ul class="gallery">`.
   - En `js/app.js` y `script.js`, remover `aria-label` del contenedor de cantidad si este no cuenta con rol explícito.

8. **Corrección de M-03 (Manejo limpio de anuncios vivos):**
   - Remover `aria-live="polite"` de `<div id="product-grid">`.
   - En la función de cambio de categoría, emitir un anuncio explícito en `#menu-status`:
     ```javascript
     const count = productGrid.querySelectorAll(".product-card:not(.is-hidden)").length;
     menuStatus.textContent = `Mostrando ${count} productos en la categoría ${category}.`;
     ```

9. **Corrección de M-04 (Objetivos táctiles ergonómicos):**
   - Incrementar el área de toque de `.add-button` a `width: 44px; height: 44px;`.
   - Ampliar el padding de `.menu-toggle` a `padding: 12px; min-width: 44px; min-height: 44px;`.

10. **Corrección de M-05 (Atributo `aria-pressed` en filtros):**
    - Al alternar categorías, actualizar el atributo en los botones:
      ```javascript
      filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === selectedCategory;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      ```

11. **Corrección de M-06 y M-07 (Unificación o actualización de `script.js`):**
    - Si se decide mantener `script.js` como alternativa o entrada monolítica:
      - Agregar la selección y actualización de `#order-subtotal`.
      - Agregar el control del banner de cookies.
      - Reemplazar `.add-promo` por `.go-to-combos` con la función `selectCategory("combos", true)`.
    - Si la arquitectura oficial del proyecto es la suite en `js/app.js`, eliminar `script.js` para evitar duplicidad técnica y mantener una sola fuente de verdad.

12. **Corrección de B-01, B-02, B-03, B-04 y B-05:**
    - Asignar texto descriptivo visual en `image.alt` (ej. "Hamburguesa artesanal clásica con queso fundido y lechuga") o dejar `alt=""` si el título contiguo ya identifica el producto.
    - Declarar `width` y `height` en las imágenes estáticas de `index.html`.
    - Añadir `aria-label="Elegir combo Martes de brasa"` al enlace "Lo quiero".
    - Replicar en `script.js` el feedback visual del botón de agregar (`✓` transitorio).
    - Alojar copias locales de las fotos en `assets/images/` para soportar navegación sin conexión.

---

## 5. Evidencia de criterios que cumplen plenamente

Durante las pruebas automatizadas y de código se validó el cumplimiento riguroso de múltiples requisitos tanto en la interfaz general como en los scripts auditados:

### Estructura semántica y metadatos
* **Cumple:** `index.html` cuenta con `<!DOCTYPE html>`, atributo `lang="es"`, juego de caracteres UTF-8, etiqueta viewport responsiva y `<title>` y `<meta name="description">` contextuales.
* **Cumple:** Implementación de estructura jerárquica nativa: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` y `<footer>`.
* **Cumple:** El panel de pedido `<aside class="order-panel" aria-labelledby="order-summary-title">` enlaza adecuadamente con su título interno `<h3 id="order-summary-title">`.

### Jerarquía de encabezados
* **Cumple:** Jerarquía impecable. Existe un único `<h1>` en el hero (*"El antojo tiene nombre propio."*), seguido ordenadamente de `<h2>` para cada sección principal (*"Rápido no significa..."*, *"Menú para..."*, *"Combos que..."*, *"Arma tu pedido..."*, *"Nos vemos..."*) y `<h3>` para los subelementos (promociones, resumen, formulario y tarjetas dinámicas de producto generadas por JS). No se producen saltos de nivel.

### Navegación por teclado y foco visible
* **Cumple:** Enlace de salto visible al recibir foco (`.skip-link` a `#contenido`).
* **Cumple:** Todos los elementos interactivos son controles HTML estándar (`<a>`, `<button>`, `<input>`). No existen `div` simulando botones ni manipulaciones negativas de `tabindex`.
* **Cumple:** Regla global `:focus-visible` con anillo dual de 3 px (`#252321` con sombra `#fffdf9` y offset de 3 px), que garantiza visibilidad y alto contraste contra fondos claros y de color.

### Formulario y validación accesible
* **Cumple:** Todos los campos de entrada (`nombre`, `email`, `telefono`, `direccion`) disponen de `<label for="...">` correctamente vinculados por ID.
* **Cumple:** Disponen de atributos estándar de autocompletado (`name`, `email`, `tel`, `street-address`).
* **Cumple:** Conexión de mensajes de error con `aria-describedby` y `aria-invalid` dinámico; foco automático al primer campo inválido al presionar "Enviar solicitud".

### Ergonomía del carrito de compras
* **Cumple:** Los botones de cantidad (`+` y `−`) en el resumen del pedido miden exactamente `44 x 44 px` (`.quantity-controls button`), cumpliendo tanto WCAG 2.2 AA (24 px) como las recomendaciones de diseño táctil móvil (44 px).
* **Cumple:** Los botones dinámicos incluyen etiquetas descriptivas completas (`aria-label="Agregar una unidad de..."`, `aria-label="Quitar una unidad de..."`).
* **Cumple en ambos scripts (`app.js` y `script.js`):** `changeQuantity()` y `addToCart()` actualizan correctamente el mensaje de estado `#order-message` (`role="status"`, `aria-live="polite"`), y deshabilitan el botón de confirmación cuando el carrito queda vacío.

### Sintaxis e integridad de JavaScript
* **Cumple al 100%:** Validación estricta con `node --check` superada sin errores ni advertencias en todos los archivos:
  - `script.js`
  - `js/app.js`
  - `js/cart.js`
  - `js/storage.js`
  - `js/validation.js`
* **Cumple:** Ambos scripts activan el modo estricto (módulos ES en `app.js` y directiva `"use strict"` en `script.js`).
* **Cumple:** Modelo de datos en `data/productos.json` válido y estructurado como array homogéneo de objetos.

---

## 6. Pruebas que deberían repetirse después de corregir los problemas

Tras realizar las correcciones recomendadas, se debe ejecutar la siguiente batería de pruebas de regresión:

1. **Prueba de contraste de color automatizada y manual:**
   - Verificar con analizador de contraste que los nuevos tonos en `.hero-text`, `.section-description` y `.promo-secondary p` superen **4.5:1** contra sus fondos respectivos.
2. **Prueba de navegación con teclado en menú móvil:**
   - Reducir el ancho de ventana a 375 px. Abrir el menú con la tecla `Enter` o `Espacio`. Verificar que el foco salte al primer enlace. Presionar `Escape` y confirmar que el menú se cierre inmediatamente y devuelva el foco a `.menu-toggle`.
3. **Prueba de cierre táctil en el contador del pedido:**
   - Abrir el menú móvil a 320 px / 398 px y pulsar específicamente sobre el `<span id="nav-count">` del enlace del pedido. Confirmar que el menú se cierre de inmediato sin importar si se usa `app.js` o `script.js`.
4. **Prueba de navegación sin ratón (Tab / Shift+Tab):**
   - Recorrer todo el sitio exclusivamente con teclado. Validar la aparición de `.skip-link`, la visibilidad constante del anillo de foco y la ausencia de trampas.
5. **Prueba en modo incógnito con almacenamiento bloqueado:**
   - Deshabilitar `localStorage` o acceder en navegación privada con bloqueo estricto de cookies. Confirmar que ni `app.js` ni `script.js` arrojen excepciones en consola y que el catálogo de productos y el carrito carguen correctamente.
6. **Prueba de lector de pantalla (NVDA / VoiceOver):**
   - Navegar por los filtros de menú y verificar que el lector anuncie el estado de selección (`aria-pressed="true"`).
   - Añadir, incrementar y disminuir productos del carrito; verificar que los anuncios en `#order-message` sean claros y que no haya ruido cacofónico en `#product-grid`.
7. **Prueba de consistencia del resumen del pedido:**
   - Agregar 2 unidades de un producto y verificar que tanto el subtotal como el total calculado (con IVA del 12%) se actualicen congruentemente.
8. **Prueba de reflujo y visualización en 320 px y 398 px:**
   - Cargar la interfaz a 320 x 640 px y 398 x 800 px. Verificar que el distintivo `.floating-tag` no esté recortado y que los nombres de productos en el resumen del pedido cuenten con espacio suficiente sin distorsión vertical extrema.
   - Evaluar `document.documentElement.scrollWidth <= window.innerWidth` para certificar la ausencia total de scroll horizontal.
9. **Prueba de auditoría de rendimiento (Lighthouse):**
   - Medir la puntuación de Performance tras retirar Tailwind CDN y Bootstrap; certificar la reducción de tiempo de carga y la eliminación de código CSS/JS no utilizado.
10. **Prueba de degradación sin conexión (Offline test):**
    - Bloquear el dominio `images.unsplash.com` en las herramientas de red para verificar la visualización de los textos alternativos y el comportamiento de la maquetación.
