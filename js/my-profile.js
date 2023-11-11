// Declaramos variables para manejar la imagen seleccionada
let selectedImage = null;
const profileImageInput = document.getElementById("profileImageInput");
const profileImg = document.getElementById("profile-img");


// Manejamos el evento de cambio en el input de la imagen de perfil
profileImageInput.addEventListener("change", (event) => {
  selectedImage = event.target.files[0];

  if (selectedImage) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profileImg.src = e.target.result;
    };
    reader.readAsDataURL(selectedImage);
  }
});

// Aplicamos la lógica de validación de Bootstrap a los form con clase "needs-validation".
// Evita que un formulario se envíe si no pasa la validación y aplica estilos adicionales para indicar campos inválidos.
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

// Esta función obtiene el nombre de usuario actual desde el localstorage
function getCurrentUser() {
  return localStorage.getItem("username");
}

// Esta función comienza obteniendo el nombre de usuario actual
function saveUserDataToLocalStorage() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    // Si no hay usuario autenticado, no se guarda nada y la función se detiene
    return;
  }

  // Se crea un objeto 'userData' que contiene los valores de los campos del formulario y la URL de la imagen de perfil
  const userData = {
    firstName: document.getElementById("nameInput1").value,
    secondName: document.getElementById("nameInput2").value,
    lastName1: document.getElementById("lastNameInput1").value,
    lastName2: document.getElementById("lastNameInput2").value,
    email: document.getElementById("emailInput").value,
    phoneNumber: document.getElementById("phoneInput").value,
    profileImage: profileImg.src,
  };

  // Verificamos si hay una nueva imagen seleccionada. 
  // Si hay una nueva imagen, se lee como un 'DataURL' y se guarda en el localstorage
  if (selectedImage) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataURL = e.target.result;
      userData.profileImage = dataURL;
      localStorage.setItem(`userData_${currentUser}`, JSON.stringify(userData));
    };
    reader.readAsDataURL(selectedImage);
    // Si no hay una nueva imagen, se verifica si ya existe un conjunto de datos de usuario en el localstorage y se conserva la imagen existente si la hay
  } else {
    const storedUserData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));
    if (storedUserData) {
      userData.profileImage = storedUserData.profileImage;
    }

    localStorage.setItem(`userData_${currentUser}`, JSON.stringify(userData));
  }
}

// Esta función carga los datos del usuario desde el localstorage y los muestra en los campos correspondientes del formulario
function loadUserDataFromLocalStorage() {
  const currentUser = getCurrentUser();

  if (currentUser) {
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser}`));

    if (userData) {
      document.getElementById("nameInput1").value = userData.firstName;
      document.getElementById("nameInput2").value = userData.secondName;
      document.getElementById("lastNameInput1").value = userData.lastName1;
      document.getElementById("lastNameInput2").value = userData.lastName2;
      document.getElementById("emailInput").value = userData.email;
      document.getElementById("phoneInput").value = userData.phoneNumber;

      if (userData.profileImage) {
        const profileImage = new Image();
        profileImage.onload = function () {
          profileImg.src = userData.profileImage;
        };
        profileImage.src = userData.profileImage;
      }
    }
  }
}

// Llamamos a loadUserDataFromLocalStorage cuando la página se carga para cargar automáticamente los datos del usuario.
loadUserDataFromLocalStorage();

// Cuando hacemos click en el botón de guardar, se guardan los datos del usuario en el localstorage.
const saveButton = document.getElementById("saveChanges");
saveButton.addEventListener("click", saveUserDataToLocalStorage);
