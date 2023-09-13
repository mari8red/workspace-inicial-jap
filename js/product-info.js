
function getProductURL(catID) {
    // La función toma el argumento catID
    return `${PRODUCT_INFO_URL}${catID}${EXT_TYPE}`; //y devuelve una URL construida usando ese verificador
  
  } 
  
    // Función para crear el contenido HTML de un producto
function createInfoProductHTML(product) {
    //Toma un objeto 'product' como argumento y crea el contenido HTML que representa al producto
    return `
    <div class="d-flex align-items-center">
        <img src="${product.image}" alt="${product.name}" style="width: 25%;" class="mr-3 product-image">
        <div style="width:100%;">
        <h5 style="margin-left: 5px;" class="fw-bold display-8 product-title">${product.name}</h5>
        <p style="margin-left: 5px;" class="product-price"> ${product.currency} ${product.cost}</p>
        <p style="margin-left: 5px;" class="product-description">${product.description}</p>
        <p style="margin-left: 5px;" class="text-end">${product.soldCount} vendidos</p>
        </div>
    </div>
    `;
}

// Función para cargar los productos desde la URL
async function loadProductsFromURL(url) {
    try {
    const response = await fetch(url); // Hacemos la solicitud a la URL usando fetch
    if (response.ok) {
    const data = await response.json(); // Convertimos la respuesta JSON en un objeto JavaScript
        }
    return data.products; // Devuelve la lista de productos desde la propeidad 'products' de ese objeto 
    } catch (error) {
    console.error("Error al obtener los productos:", error); // Si hay un error, imprimimos el mensaje de error en consola
    return [];
    }
}

// Función para agregar productos al contenedor
function displayProducts(products, container) {
    console.log(products);
    // Limpiar el contenido existente en el contenedor
    container.innerHTML = "";

    // La función toma la lista products y un contenedor HTML (container) como argumentos
    products.forEach((product) => {
    // Iteramos a través de la lista de productos, crea los elementos para cada producto y los agrega al contenedor
    const productCard = document.createElement("div");
    productCard.className =
        "list-group-item product-item d-flex justify-content-between align-items-center";
    productCard.innerHTML = createInfoProductHTML(product);
    container.appendChild(productCard);
    });
}

// Función para cargar y mostrar productos en el contenedor
async function loadAndDisplayProducts() {
    // Obtenemos el contenedor de productos del HTML
    productContainer = document.getElementById("product-info");

    // Obtenemos el identificador de categoría del almacenamiento local
    const catID = localStorage.getItem("selectedProductId");
    if (!catID) {
    // Si el identificador no está presente, muestra un mensaje de error
    console.error(
        "Identificador de categoría no encontrado en el almacenamiento local."
    );
    return;
    }

    const url = getProductURL(catID); // Si el identificador está presente, construye la URL de la categoría
    products = await loadProductsFromURL(url); // Almacena los productos cargados en la variable products
    displayProducts(products, productContainer); // y los muestra en el contendor
}


document.addEventListener("DOMContentLoaded", function(){

    // Cargamos y mostramos productos al cargar la página
    loadAndDisplayProducts();
  
});