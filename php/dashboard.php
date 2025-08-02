<?php
// Inicia la sesión para acceder a las variables de sesión
session_start();

// Función para detectar si la petición viene de un navegador tradicional
function esDesdeNavegador() {
    return !isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strpos($_SERVER['HTTP_ACCEPT'], 'text/html') !== false;
}

// Verifica si no hay sesión activa (nombre de usuario no está definido o está vacío)
if (empty($_SESSION["name"])) {
    http_response_code(401); // Establece código de estado HTTP 401 (No autorizado)

    // Si es desde navegador, muestra alerta y redirige
    if (esDesdeNavegador()) {
        echo "<script>
                alert('Acceso no autorizado. Por favor inicie sesión.');
                window.location.href = '../html/index.html';
              </script>";
    } else {
        // Si es API, devuelve JSON con error
        header("Content-Type: application/json");
        echo json_encode(["error" => "Acceso no autorizado."]);
    }
    exit; // Termina la ejecución
}

// Obtiene el nombre de usuario de la sesión
$name = $_SESSION["name"];

// Si la petición es desde navegador, muestra el HTML del dashboard
if (esDesdeNavegador()) {
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="../html/css/nav-dashboard.css">
  <link rel="stylesheet" href="../html/css/dashboard.css">
</head>
<body>
  <!-- Barra de navegación -->
  <header class="contenedor-navegacion">
    <nav class="navegacion">
      <a href="#" onclick="mostrarSeccion('principal')" class="peluqueria-text">Peluquería Denis</a>
      <ul>
        <!-- Menú de navegación -->
        <li><a href="#" id="b-tarea">PERFIL</a></li>
        <li><a href="#" onclick="mostrarSeccion('cita')">CITA</a></li>
        <li><a href="#" onclick="mostrarSeccion('serviciosDeshboard')">SERVICIOS</a></li>
        <li><a href="#" id="menu-admin" onclick="mostrarSeccion('video-cliente')">ADMIN</a></li>
        <li><a href="#" id="menu-gestion" onclick="mostrarSeccion('gestion-citas')">GESTIÓN</a></li>
        <li><a href="#" onclick="mostrarSeccion('pago')">PAGO</a></li>
        <li><a href="#" onclick="cerrarSesion()">SALIR</a></li>
      </ul>
    </nav>
  </header>

  <!-- Contenido principal -->
  <div class="centrar">
    <h1>Bienvenido, <?php echo htmlspecialchars($name); ?>!</h1>
    <p>A Peluquería Denis.</p>
  </div>
</body>
</html>
<?php
} else {
    // Si no es desde navegador, devuelve JSON con datos del usuario
    header("Content-Type: application/json");
    echo json_encode([
        "mensaje" => "Bienvenido al dashboard",
        "usuario" => [
            "name" => $name
        ]
    ]);
}
?>