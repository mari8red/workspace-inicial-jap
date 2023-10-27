// Definimos una función para generar las filas
function createQueue(element) {
  const queue = document.createElement("tr");
  queue.innerHTML = `
    <td><img src="${
      element.image
    }" class="miniatura" class="img-thumbnail" class="img-fluid"></td>
    <td class="text-success"> ${element.name}</td>
    <td class="costo-cell text-success">${
      element.currency === "UYU"
        ? (element.unitCost / 40).toFixed(2)
        : element.unitCost
    } USD</td>
    <td><input type="number" value="${
      element.count
    }" class="col-sm-2 w-75 mx-auto form-control-sm cantidad-input" min="0"></td>
    <td class="subtotal-cell text-success">${
      (element.currency === "UYU" ? element.unitCost / 40 : element.unitCost) *
      element.count
    } USD</td>
    <td> <button class="delete-product" data-product-id="${
      element.id
    }"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
    </svg></button></td>
  `;
  return queue;
}

document.addEventListener("DOMContentLoaded", () => {
  // Función para calcular el subtotal de una fila
  function calcularSubtotal(fila) {
    const cantidadInput = fila.querySelector(".cantidad-input");
    const costoCell = fila.querySelector(".costo-cell");
    const subtotalCell = fila.querySelector(".subtotal-cell");
    const cantidad = parseInt(cantidadInput.value);
    const costoUnitario = parseFloat(costoCell.textContent.split(" ")[0]); // Obtenemos el valor numérico del costo
    const moneda = costoCell.textContent.split(" ")[1]; // Obtenemos la unidad de moneda del costo
    let subtotal = cantidad * costoUnitario;

    if (moneda === "UYU") {
      // Convertimos el costo a dólares si la moneda es "UYU"
      subtotal = subtotal / 40;
    }

    subtotalCell.textContent = `${subtotal.toFixed(2)} USD`;

    actualizarTotales();
  }

  function actualizarTotales() {
    let subtotalGeneral = 0;
    // Calculamos el subtotal general sumando los subtotales de todas las filas
    const filas = document.querySelectorAll("tbody tr");
    filas.forEach((fila) => {
      const subtotalCell = fila.querySelector(".subtotal-cell");
      const filaSubtotal = parseFloat(subtotalCell.textContent.split(" ")[0]);
      const moneda = subtotalCell.textContent.split(" ")[1]; // Obten la moneda de la fila

      if (moneda === "UYU") {
        // Convierte el subtotal a dólares si la moneda es "UYU"
        subtotalGeneral += filaSubtotal / 40;
      } else {
        subtotalGeneral += filaSubtotal;
      }
    });

    // Obtenemos el valor del tipo de envío seleccionado
    const selectedShippingOption = document.querySelector(
      "input[name='shippingType']:checked"
    );
    let costoEnvio = 0;

    if (selectedShippingOption) {
      // Obtenemos el valor del tipo de envío seleccionado (premium, express, o standard)
      const shippingType = selectedShippingOption.value;
      // Calculamos el costo de envío en función del tipo de envío seleccionado
      if (shippingType === "premium") {
        costoEnvio = subtotalGeneral * 0.15; // 15% del subtotal
      } else if (shippingType === "express") {
        costoEnvio = subtotalGeneral * 0.07; // 7% del subtotal
      } else {
        costoEnvio = subtotalGeneral * 0.05; // 5% del subtotal (por defecto)
      }
    }

    const shippingOptions = document.querySelectorAll(
      "input[name='shippingType']"
    );

    shippingOptions.forEach((option) => {
      option.addEventListener("change", () => {
        actualizarTotales(); // Recalcula los totales cuando cambia la opción de envío
      });
    });

    // Calculamos el total a pagar sumando el subtotal general y el costo de envío
    const totalPagar = subtotalGeneral + costoEnvio;

    // Actualizamos los valores en el HTML para mostrarlos al usuario
    document.getElementById(
      "subtotal"
    ).textContent = `${subtotalGeneral.toFixed(2)} USD`;
    document.getElementById("costo-envio").textContent = `${costoEnvio.toFixed(
      2
    )} USD`;
    document.getElementById("total-pagar").textContent = `${totalPagar.toFixed(
      2
    )} USD`;
  }

  displayCartItems();

  function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    const productInfoDiv = document.getElementById("cart-products");

    // Limpiamos cualquier contenido existente en el contenedor
    productInfoDiv.innerHTML = "";

    // Iteramos sobre los productos en el carrito y los mostramos
    cartItems.forEach((product) => {
      // Creamos una fila con los datos del producto
      let queue = createQueue(product);

      // Agregamos la fila a la tabla
      productInfoDiv.appendChild(queue);

      // Agregamos un evento "input" al campo de cantidad en esta fila
      const cantidadInput = queue.querySelector(".cantidad-input");
      cantidadInput.addEventListener("input", () => {
        // Obtén el valor actual del input
        let cantidad = parseInt(cantidadInput.value);

        // Verifica si el valor es menor que 1
        if (cantidad < 1) {
          cantidad = 1; // Establece el valor mínimo en 1
          cantidadInput.value = cantidad; // Actualiza el valor en el input
        }

        calcularSubtotal(queue);
        actualizarTotales();
      });

      // Agregamos un evento de clic al icono de eliminación (X) en la imagen del producto
      const deleteIcon = queue.querySelector(".delete-product");
      deleteIcon.addEventListener("click", (event) => {
        const productId = product.id;

        // Eliminar el producto del carrito (en la tabla del carrito)
        queue.remove();

        // Eliminar el producto del localStorage
        const updatedCart = cartItems.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        actualizarTotales(); // Calcula los totales después de eliminar un producto
      });
    });
    // Calcula los totales cuando se muestran los productos
    actualizarTotales();
  }

  const overlay = document.getElementById("overlay");
  const mostrarOverlayButton = document.getElementById("mostrarOverlay");
  const cerrarOverlayButton = document.getElementById("cerrarOverlay");
  const streetAddressInput = document.getElementById("streetAddress");
  const numberAddressInput = document.getElementById("numberAddress");
  const esquinaAddressInput = document.getElementById("cornerAddress");
  const modalMediosPago = new bootstrap.Modal(
    document.getElementById("modalMediosPago")
  );
  const saveChangesButton = document.querySelector(
    "#modalMediosPago .btn-primary"
  );
  const creditCardNumberInput = document.getElementById("creditCard");
  const creditCardCVVInput = document.getElementById("creditCardCVV");
  const creditCardDateInput = document.getElementById("creditCardDate");
  const cuentaBancariaInput = document.getElementById("cuentaBancaria");

  mostrarOverlayButton.addEventListener("click", () => {
   
    // Validar la dirección de envío
    if (streetAddressInput.value.trim() === "") {
      streetAddressInput.classList.add("is-invalid");
    } else {
      streetAddressInput.classList.remove("is-invalid");
      streetAddressInput.classList.add("is-valid");
    }

    if (numberAddressInput.value.trim() === "") {
      numberAddressInput.classList.add("is-invalid");
    } else {
      numberAddressInput.classList.remove("is-invalid");
      numberAddressInput.classList.add("is-valid");
    }

    if (esquinaAddressInput.value.trim() === "") {
      esquinaAddressInput.classList.add("is-invalid");
    } else {
      esquinaAddressInput.classList.remove("is-invalid");
      esquinaAddressInput.classList.add("is-valid");
    }

    if (
      document.querySelector('input[name="flexRadioDefault"]:checked').id ===
      "flexRadioDefault1"
    ) {
      // Validar campos de tarjeta de crédito
      if (CC.value.trim() === "") {
        CC.classList.add("is-invalid");
      } else {
        CC.classList.remove("is-invalid");
        CC.classList.add("is-valid");
      }

      if (CVV.value.trim() === "") {
        CVV.classList.add("is-invalid");
      } else {
        CVV.classList.remove("is-invalid");
        CVV.classList.add("is-valid");
      }

      if (dateCC.value.trim() === "") {
        dateCC.classList.add("is-invalid");
      } else {
        dateCC.classList.remove("is-invalid");
        dateCC.classList.add("is-valid");
      }
    } else if (
      document.querySelector('input[name="flexRadioDefault"]:checked').id ===
      "flexRadioDefault2"
    ) {
      // Validar campo de cuenta bancaria
      if (bankAccount.value.trim() === "") {
        bankAccount.classList.add("is-invalid");
      } else {
        bankAccount.classList.remove("is-invalid");
        bankAccount.classList.add("is-valid");
      }
    }

    // Si todos los campos requeridos están llenos, mostrar el overlay de compra exitosa
    if (document.querySelectorAll(".is-invalid").length === 0) {
      overlay.classList.add("active");
      setTimeout(() => {
        overlay.classList.remove("active");
      }, 2000);
    }
  });

  // Agregar eventos para quitar las clases de validación cuando se cambia el contenido de los campos
  streetAddressInput.addEventListener("input", () => {
    streetAddressInput.classList.remove("is-invalid", "is-valid");
  });

  numberAddressInput.addEventListener("input", () => {
    numberAddressInput.classList.remove("is-invalid", "is-valid");
  });

  esquinaAddressInput.addEventListener("input", () => {
    esquinaAddressInput.classList.remove("is-invalid", "is-valid");
  });

  // Eventos para campos de tarjeta de crédito y cuenta bancaria
  CC.addEventListener("input", () => {
    CC.classList.remove("is-invalid", "is-valid");
  });

  CVV.addEventListener("input", () => {
    CVV.classList.remove("is-invalid", "is-valid");
  });

  dateCC.addEventListener("input", () => {
    dateCC.classList.remove("is-invalid", "is-valid");
  });

  bankAccount.addEventListener("input", () => {
    bankAccount.classList.remove("is-invalid", "is-valid");
  });

  mostrarOverlayButton.addEventListener("click", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Verificar si el carrito está vacío
  if (cartItems.length === 0) {
    alert("Tu carrito está vacío. Agrega productos antes de comprar.");
    return; // Detener la ejecución de la función
  }
    // Verificar si el campo de la calle está vacío
    if (
      streetAddressInput.value.trim() === "" ||
      numberAddressInput.value.trim() === "" ||
      esquinaAddressInput.value.trim() === ""
    ) {
      alert(
        "Por favor, completa todos los campos de dirección antes de comprar."
      );
    } else if (
      document.querySelector('input[name="flexRadioDefault"]:checked').id ===
      "flexRadioDefault1"
    ) {
      // Verificar si se seleccionó tarjeta de crédito y validar campos de tarjeta de crédito
      if (
        creditCardNumberInput.value.trim() === "" ||
        creditCardCVVInput.value.trim() === "" ||
        creditCardDateInput.value.trim() === ""
      ) {
        alert(
          "Por favor, completa todos los campos de tarjeta de crédito antes de comprar."
        );
      } else {
        // Mostrar el overlay de compra exitosa
        overlay.classList.add("active");
        // Usamos setTimeout para cerrar el overlay después de 2 segundos (2000 milisegundos)
        setTimeout(() => {
          overlay.classList.remove("active");
        }, 2000);
      }
    } else if (
      document.querySelector('input[name="flexRadioDefault"]:checked').id ===
      "flexRadioDefault2"
    ) {
      // Verificar si se seleccionó transferencia bancaria y validar campo de cuenta bancaria
      if (cuentaBancariaInput.value.trim() === "") {
        alert(
          "Por favor, completa el campo de cuenta bancaria antes de comprar."
        );
      } else {
        // Mostrar el overlay de compra exitosa
        overlay.classList.add("active");
        // Usamos setTimeout para cerrar el overlay después de 2 segundos (2000 milisegundos)
        setTimeout(() => {
          overlay.classList.remove("active");
        }, 2000);
      }
    } else {
      // Si no se seleccionó ninguna opción de pago, mostrar un mensaje de error
      alert("Por favor, selecciona una forma de pago antes de comprar.");
    }
  });

  cerrarOverlayButton.addEventListener("click", () => {
    overlay.classList.remove("active");
  });
});

/*Script para manejar medios de pago Entrega6*/

const ccTransfer = document.getElementById("flexRadioDefault1");
const bankTransfer = document.getElementById("flexRadioDefault2");
const CC = document.getElementById("creditCard");
const CVV = document.getElementById("creditCardCVV");
const dateCC = document.getElementById("creditCardDate");
const bankAccount = document.getElementById("cuentaBancaria");

ccTransfer.addEventListener("click", (event) => {
  bankAccount.setAttribute("disabled", "");
  CC.removeAttribute("disabled");
  CVV.removeAttribute("disabled");
  dateCC.removeAttribute("disabled");
  bankAccount.value = "";
});

bankTransfer.addEventListener("click", (event) => {
  CC.setAttribute("disabled", "");
  CVV.setAttribute("disabled", "");
  dateCC.setAttribute("disabled", "");
  bankAccount.removeAttribute("disabled");
  CC.value = "";
  CVV.value = "";
  dateCC.value = "";
});

/*Script para manejar medios de pago Entrega6*/
