const FIELD_RULES = {
  nombre: {
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
    message: "Escribe un nombre de 3 a 50 letras.",
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Ingresa un correo electrónico válido.",
  },
  telefono: {
    pattern: /^\d{9,10}$/,
    message: "Ingresa un teléfono de 9 o 10 dígitos.",
  },
  direccion: {
    pattern: /^[a-zA-Z0-9\s,.-]{5,100}$/,
    message: "La dirección debe tener de 5 a 100 caracteres válidos.",
  },
};

function validateField(field) {
  const isValid = field.pattern.test(field.input.value.trim());
  field.input.setAttribute("aria-invalid", String(!isValid));
  field.error.textContent = isValid ? "" : field.message;
  return isValid;
}

export function initValidation(formElement, onSubmitSuccess) {
  if (!formElement || typeof formElement.addEventListener !== "function") {
    throw new TypeError("Se requiere un elemento de formulario válido.");
  }

  const fields = Object.entries(FIELD_RULES).map(([id, rule]) => {
    const input = formElement.querySelector(`#${id}`);
    const error = formElement.querySelector(`#error-${id}`);
    if (!input || !error) throw new Error(`Falta el campo o mensaje de error para ${id}.`);
    return { input, error, ...rule };
  });

  fields.forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => validateField(field));
  });

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidFields = fields.filter((field) => !validateField(field));
    if (invalidFields.length > 0) {
      invalidFields[0].input.focus();
      return;
    }

    onSubmitSuccess?.(new FormData(formElement));
  });
}