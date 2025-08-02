/*
   -Módulo para manejar el modal de inicio de sesión
   -Se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener("DOMContentLoaded", function () {
  // Contenedor donde se insertará el modal
  const modalContainer = document.getElementById("modal-container");

  /*
   -Función asincrónica para abrir el modal de login
   -Carga el contenido HTML del modal y configura los eventos
   */
  async function openLoginModal() {
    try {
      // Carga el contenido HTML del modal de login
      const res = await fetch('../html/login.html');
      const html = await res.text();
      
      // Inserta el HTML en el contenedor
      modalContainer.innerHTML = html;
      
      // Configura los eventos del modal
      setupLoginModalEvents();
    } catch (error) {
      console.error("Error al abrir el modal de login:", error);
    }
  }

  /*
   -Configura los eventos del modal de login
   */
  function setupLoginModalEvents() {
    // Botón para cerrar el modal
    const closeBtn = document.querySelector("[data-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        // Limpia el contenido del modal al cerrar
        modalContainer.innerHTML = '';
      });
    }

    // Enlace para cambiar al modal de registro
    const urlRegister = document.getElementById("urlRegister");
    if (urlRegister) {
      urlRegister.addEventListener("click", function (e) {
        e.preventDefault(); // Previene el comportamiento por defecto
        openRegisterModal(); // Abre el modal de registro
      });
    }

    // Configura el envío del formulario
    setupLoginFormFetch();
  }

  // Configura el evento click en el enlace de login del menú
  const loginLink = document.getElementById("loginLink");
  if (loginLink) {
    loginLink.addEventListener("click", function (e) {
      e.preventDefault(); // Previene el comportamiento por defecto
      openLoginModal(); // Abre el modal de login
    });
  }

  // Hace la función accesible globalmente
  window.openLoginModal = openLoginModal;

  /*
   -Configura el envío del formulario de login mediante Fetch API
   */
  function setupLoginFormFetch() {
    const form = modalContainer.querySelector("form");
    if (!form) return; // Sale si no encuentra el formulario

    form.addEventListener("submit", async function (e) {
      e.preventDefault(); // Previene el envío tradicional del formulario

      // Deshabilita el botón de submit para evitar múltiples envíos
      const submitBtn = form.querySelector("[type=submit]");
      if (submitBtn) submitBtn.disabled = true;

      // Prepara los datos del formulario
      const formData = new FormData(form);
      
      try {
        // Envía la petición al servidor
        const response = await fetch('../php/login.php', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest' // Indica que es una petición AJAX
          }
        });

        // Determina el tipo de contenido de la respuesta
        const contentType = response.headers.get("Content-Type") || "";
        let data = {};
        
        // Procesa la respuesta según el tipo de contenido
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = { mensaje: text };
        }

        // Maneja la respuesta exitosa
        if (response.ok) {
          const mensaje = data.mensaje || "Inicio de sesión exitoso.";
          modalContainer.innerHTML = ''; // Cierra el modal
          
          // Redirige según lo indicado por el servidor o a la ruta por defecto
          if (data.redirect) {
            window.location.href = data.redirect;
          } else {
            window.location.href = '../php/dashboard.php';
          }
        } else {
          // Maneja errores específicos según el código de estado
          let msg = data.error || data.mensaje || `Error (${response.status})`;
          if (response.status === 401) {
            msg = "Email o contraseña incorrectas: " + msg;
          } else if (response.status === 403) {
            msg = "Acceso denegado: " + msg;
          } else if (response.status === 400) {
            msg = "Solicitud incorrecta: " + msg;
          }
          alert(msg); // Muestra el error al usuario
        }
      } catch (err) {
        // Maneja errores de red
        console.error("Error en la petición de login:", err);
        alert("Error de red o inesperado al iniciar sesión. Intenta de nuevo.");
      } finally {
        // Rehabilita el botón de submit
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});