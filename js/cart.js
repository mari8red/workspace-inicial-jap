const userID = 25801;
const url = `${CART_INFO_URL}${userID}.json`;

//Definimos una función para generar las filas
function createQueue(element) {
    const queue = document.createElement('tr');
    queue.innerHTML = `
        <td><img src="${element.image}" class="miniatura" class="img-thumbnail" class="img-fluid"></td>
        <td>${element.name}</td>
        <td>${element.unitCost} ${element.currency}</td>
        <td><input type="number" value="${element.count}" class="col-sm-2 form-control-sm"  id="cantidad-input" min="0"></td>
        <td>${element.unitCost * element.count} ${element.currency}</td>
    `;
    return queue;
}

document.addEventListener("DOMContentLoaded", () => {

    //Nos traemos los datos del json
    fetch(url)
        .then(response => response.json())
        .then(data => {

            const productInfoDiv = document.getElementById('cart-products');
            const product = data.articles[0];

            // Creamos una fila con los datos del producto
            let queue = createQueue(product);

            // Agregamos la fila a la tabla
            productInfoDiv.appendChild(queue);

        })
        .catch(error => {
            console.error('Error al cargar el carrito de compras:', error);
        });

});

