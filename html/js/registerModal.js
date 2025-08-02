/*
 -Módulo para manejar el modal de registro de usuarios
 -Se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener("DOMContentLoaded", function () {
  // Contenedor donde se insertará el modal
  const modalContainer = document.getElementById("modal-container");

  /*
   -Función asincrónica para abrir el modal de registro
   -Carga el contenido HTML del modal y configura los eventos
   */
  async function openRegisterModal() {
    try {
      // Carga el contenido HTML del modal de registro
      const res = await fetch('../html/register.html');
      const html = await res.text();
      
      // Inserta el HTML en el contenedor
      modalContainer.innerHTML = html;
      
      // Configura los eventos del modal
      setupRegisterModalEvents();
    } catch (error) {
      console.error("Error al cargar el modal de registro:", error);
    }
  }

  /*
   -Configura los eventos del modal de registro
   */
  function setupRegisterModalEvents() {
    // Botón para cerrar el modal
    const closeBtn = document.querySelector("[data-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        // Limpia el contenido del modal al cerrar
        modalContainer.innerHTML = "";
      });
    }

    // Enlace para cambiar al modal de login
    const linkComando = document.getElementById("linkComando");
    if (linkComando) {
      linkComando.addEventListener("click", function (e) {
        e.preventDefault(); // Previene el comportamiento por defecto
        openLoginModal(); // Abre el modal de login
      });
    }

    // Configura el envío del formulario
    setupRegisterFormFetch();
  }

  // Configura el evento click en el enlace de registro del menú
  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault(); // Previene el comportamiento por defecto
      openRegisterModal(); // Abre el modal de registro
    });
  }

  // Hace la función accesible globalmente
  window.openRegisterModal = openRegisterModal;

  /*
   -Configura el envío del formulario de registro mediante Fetch API
   */
  function setupRegisterFormFetch() {
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
        const response = await fetch('../php/register.php', {
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
          const mensaje = data.mensaje || "Registro exitoso.";
          alert(mensaje); // Muestra mensaje de éxito
          
          // Redirige a la página principal después del registro
          window.location.href = '../html/index.html';
        } else {
          // Maneja errores específicos según el código de estado
          let msg = data.error || data.mensaje || `Error (${response.status})`;
          if (response.status === 402) {
            msg = "Pago requerido: " + msg;
          } else if (response.status === 409) {
            msg = "Conflicto: " + msg;
          } else if (response.status === 400) {
            msg = "Solicitud inválida: " + msg;
          }
          alert(msg); // Muestra el error al usuario
        }
      } catch (err) {
        // Maneja errores de red
        console.error("Error en la petición de registro:", err);
        alert("Error de red o inesperado al registrar. Intenta de nuevo.");
      } finally {
        // Rehabilita el botón de submit
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
});