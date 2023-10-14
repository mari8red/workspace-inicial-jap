const userID = 25801;
const url = `${CART_INFO_URL}${userID}.json`;

//Definimos una función para generar las filas
function createQueue(element) {
  const queue = document.createElement("tr");
  queue.innerHTML = `
        <td><img src="${element.image
    }" class="miniatura" class="img-thumbnail" class="img-fluid"></td>
        <td class="text-success"> ${element.name}</td>
        <td class="costo-cell text-success">${element.unitCost} ${element.currency}</td>
        <td><input type="number" value="${element.count
    }" class="col-sm-2 w-75 mx-auto form-control-sm cantidad-input"  min="0"></td>
        <td class="subtotal-cell text-success">${element.unitCost * element.count} ${element.currency
    }</td>
        <td> <button class="delete-product" data-product-id="${element.id}" >Eliminar</button></td>
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
    const costoUnitario = parseFloat(costoCell.textContent.split(" ")[0]); // Obtén el valor numérico del costo

    const subtotal = cantidad * costoUnitario;
    subtotalCell.textContent = subtotal.toFixed(0) + " USD";
  }

  // Trae los datos del carrito
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const productInfoDiv = document.getElementById("cart-products");
      const product = data.articles[0];

      // Creamos una fila con los datos del producto
      let queue = createQueue(product);

      // Agregamos la fila a la tabla
      productInfoDiv.appendChild(queue);

      // Agregamos un evento "input" al campo de cantidad en esta fila
      const cantidadInput = queue.querySelector(".cantidad-input");
      cantidadInput.addEventListener("input", () => calcularSubtotal(queue));
    })
    .catch((error) => {
      console.error("Error al cargar el carrito de compras:", error);
    });
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
      });
    });
  }
  const overlay = document.getElementById("overlay");
    const mostrarOverlayButton = document.getElementById("mostrarOverlay");
    const cerrarOverlayButton = document.getElementById("cerrarOverlay");
  
    mostrarOverlayButton.addEventListener("click", () => {
      overlay.classList.add("active");
      // Usamos setTimeout para cerrar el overlay después de 2 segundos (2000 milisegundos)
      setTimeout(() => {
        overlay.classList.remove("active");
      }, 3000);
    });
  
    cerrarOverlayButton.addEventListener("click", () => {
      overlay.classList.remove("active");
    });
});
