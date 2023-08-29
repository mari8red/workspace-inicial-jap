document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});


// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    // Obtenemos el valor de la clave "isLoggedIn" del almacenamiento local
    var isLoggedIn = localStorage.getItem("isLoggedIn");
    
    // Si el usuario no está autenticado (isLoggedIn es null o falso)
    if (!isLoggedIn) {
        window.location.href = "login.html"; // Redirigimos al usuario a la página de inicio de sesión
    }
}

// Llamamos a la función cuando la página se carga
window.onload = checkAuthentication;


function cerrarSesion() {
    localStorage.removeItem("isLoggedIn"); // Eliminar el valor de inicio de sesión
    window.location.href = "login.html"; // Redirigir al inicio de sesión
  }

  // Obtén los elementos necesarios
const perfilButton = document.getElementById("perfil-button");
const perfilMenu = document.getElementById("perfil-menu");
// Agrega un evento click al botón de perfil
perfilButton.addEventListener("click", () => {
  // Cambia la visibilidad del menú desplegable
  if (perfilMenu.style.display === "block") {
    perfilMenu.style.display = "none";
  } else {
    perfilMenu.style.display = "block";
  }
});
// Cierra el menú si se hace clic en cualquier parte del documento
document.addEventListener("click", (event) => {
  if (!perfilButton.contains(event.target) && !perfilMenu.contains(event.target)) {
    perfilMenu.style.display = "none";
  }
});
