# Brasa Urbana

Sitio web de una hamburguesería moderna y responsiva para presentar el menú, promocionar productos y permitir una experiencia de pedido simulada en línea.

## Descripción general

Brasa Urbana es una landing page estática desarrollada con HTML, CSS y JavaScript modular. La aplicación permite:

- Explorar un catálogo de productos por categorías.
- Filtrar el menú por hamburguesas, acompañamientos, combos, bebidas y postres.
- Agregar productos a un carrito de compras.
- Modificar cantidades dentro del pedido.
- Guardar la información del carrito y la última categoría visitada en almacenamiento local del navegador.
- Mostrar un banner de cookies con opciones de aceptar o rechazar.
- Validar campos del formulario de contacto.
- Adaptarse a distintas resoluciones móviles y desktop.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES Modules
- JSON para el catálogo de productos
- APIs del navegador: localStorage, sessionStorage, cookies y formularios

## Estructura del proyecto

```text
paginaComidaRapida/
├── AUDITORIA.md                # Documento de revisión de accesibilidad y UX
├── index.html                  # Estructura principal de la interfaz
├── script.js                   # Script adicional / legado (no principal)
├── data/
│   └── productos.json          # Catálogo de productos del menú
├── assets/
│   └── css/
│       └── styles.css          # Estilos visuales de la página
├── js/
│   ├── app.js                  # Lógica principal de renderizado y UI
│   ├── cart.js                 # Gestión del carrito de compras
│   ├── storage.js              # Persistencia con localStorage, sessionStorage y cookies
│   └── validation.js           # Validación del formulario de contacto
└── README.md                   # Documentación del proyecto
```

## Requisitos

No requiere instalación de dependencias ni compilación.

Solo necesitas un navegador moderno y, opcionalmente, un servidor local para servir la carpeta del proyecto.

## Cómo ejecutar la página

### Opción 1: abrir directamente

Puedes abrir `index.html` directamente en el navegador.

### Opción 2: servidor local

Desde la carpeta del proyecto, ejecuta:

```bash
python -m http.server 8000
```

Luego abre en el navegador:

```text
http://localhost:8000
```

## Funcionalidades principales

### Menú dinámico

La página obtiene los productos desde `data/productos.json` y los renderiza en la sección de menú. Cada producto incluye:

- `id`
- `nombre`
- `descripcion`
- `precio`
- `categoria`
- `imagen`
- `etiqueta`

Esto facilita agregar o modificar elementos del catálogo sin tocar la lógica de la interfaz.

### Carrito de compras

La lógica del carrito se encuentra en `js/cart.js` y permite:

- Agregar productos.
- Incrementar y decrementar cantidades.
- Calcular subtotal y total con IVA.
- Mantener el pedido guardado en el navegador mediante `localStorage`.

### Persistencia de estado

El archivo `js/storage.js` administra:

- Carrito guardado en almacenamiento local.
- Última categoría elegida en `sessionStorage`.
- Fecha de última actualización del carrito en cookie.

### Validación del formulario

`js/validation.js` valida los campos `nombre`, `email`, `telefono` y `direccion` con reglas simples para asegurar entradas mínimamente válidas antes del envío.

### Cookies y consentimientos

La página incluye un banner de cookies que permite aceptar o rechazar su uso para almacenamiento local y mejora de experiencia.

## Personalización del contenido

### Agregar o modificar productos

Edita el archivo `data/productos.json` siguiendo este formato:

```json
{
  "id": 1,
  "nombre": "La Brasa Clásica",
  "descripcion": "Hamburguesa de res a la parrilla con queso cheddar.",
  "precio": 7.5,
  "categoria": "hamburguesas",
  "imagen": "https://example.com/imagen.jpg",
  "etiqueta": "Favorita"
}
```

Las categorías válidas son:

- `hamburguesas`
- `acompanamientos`
- `combos`
- `bebidas`
- `postres`

### Cambiar estilos visuales

Los estilos principales se encuentran en:

```text
assets/css/styles.css
```

Aquí puedes ajustar:

- colores corporativos
- tipografías
- tamaños de botones y tarjetas
- layout responsive
- estilos del carrito, hero y promociones

## Consideraciones importantes

- La página es una demostración front-end sin backend real.
- Los pedidos no generan pagos ni confirmaciones reales.
- El sitio depende de imágenes externas para algunas fotografías del menú.
- La estructura está pensada para ser fácil de mantener y ampliar con nuevas funcionalidades.

## Documentación adicional

Para conocer más sobre accesibilidad, diseño responsive y recomendaciones de UX, revisa:

- [AUDITORIA.md](./AUDITORIA.md)

## Autor

Proyecto desarrollado para una actividad académica de desarrollo web en plataforma.
