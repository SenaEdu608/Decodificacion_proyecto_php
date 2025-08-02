// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

  // Función asíncrona para cargar el contenido principal
  async function loadTextPrincipal() {
    // Obtiene el contenedor principal por su ID
    const container = document.getElementById('textPrincipal');

    // Verifica si el contenedor existe
    if (!container) {
      console.error('No se encontró el contenedor con id "textPrincipal"');
      return; // Sale de la función si no existe
    }

    try {
      // Carga el contenido HTML de forma asíncrona
      const response = await fetch('../html/textPrincipal.html');

      // Verifica si la respuesta es correcta
      if (!response.ok) {
        throw new Error(`Error al cargar ${response.url}: ${response.statusText}, ${response.status}`);
      }

      // Obtiene el HTML como texto
      const html = await response.text();

      // Inserta el HTML en el contenedor
      container.innerHTML = html;

      // Configura el evento click del botón de reserva
      const abrirLoginBtn = document.getElementById("abrirLogin");
      if (abrirLoginBtn) {
        abrirLoginBtn.addEventListener("click", function (e) {
          e.preventDefault(); // Previene el comportamiento por defecto del enlace
          if (typeof window.openRegisterModal === 'function') {
            window.openRegisterModal(); // Abre el modal de registro si existe
          } else {
            console.warn('openRegisterModal no está definido en window');
          }
        });
      }

      // Efecto parallax mejorado con throttling para rendimiento
      let lastScroll = 0;
      const parallaxDelay = 16; // ~60fps (1000ms/60 ≈ 16ms)
      
      window.addEventListener('scroll', function() {
        const now = Date.now();
        if (now - lastScroll < parallaxDelay) return; // Throttling
        lastScroll = now;
        
        const textPrincipal = document.querySelector('.textPrincipal');
        if (!textPrincipal) return;
        
        const scrollPosition = window.scrollY;
        const parallaxSpeed = 0.4; // Velocidad del efecto
        const maxTranslation = 300; // Límite de desplazamiento
        
        // Calcula transformación y opacidad basado en el scroll
        const translation = Math.min(scrollPosition * parallaxSpeed, maxTranslation);
        const opacity = 1 - (translation / maxTranslation * 0.5);
        
        // Aplica los estilos
        textPrincipal.style.transform = `translateY(${translation}px)`;
        textPrincipal.style.opacity = opacity;
      });
      
    } catch (error) {
      // Manejo de errores
      console.error('Fallo al cargar el texto principal:', error);

      // Muestra mensaje de error en el contenedor
      container.innerHTML = `<div class="mensaje-2"><p>Error al cargar contenido.</p></div>`;
    }
  }

  // Ejecuta la función de carga
  loadTextPrincipal();
});