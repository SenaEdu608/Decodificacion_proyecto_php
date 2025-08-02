<?php
// Inicia la sesión para almacenar datos del usuario
session_start();

// Función para detectar si la petición viene de un navegador
function esDesdeNavegador() {
    return isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'text/html') &&
           (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest');
}

// Función para enviar respuestas consistentes
function responder($mensaje, $codigo = 200, $esError = false, $redirect = null) {
    http_response_code($codigo);

    if (esDesdeNavegador()) {
        // Escapa el mensaje para seguridad en JavaScript
        $safe = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');
        if ($esError) {
            // Muestra alerta de error y regresa
            echo "<script>
                    alert('{$safe}');
                    window.history.back();
                  </script>";
        } else {
            if ($redirect) {
                // Redirección directa para navegador
                header("Location: " . $redirect);
                exit;
            }
            // Muestra alerta de éxito
            echo "<script>
                    alert('{$safe}');
                  </script>";
        }
    } else {
        // Respuesta JSON para APIs
        header("Content-Type: application/json");
        $payload = $esError
            ? ["error" => $mensaje]
            : ["mensaje" => $mensaje];
        
        if ($redirect && !$esError) {
            $payload["redirect"] = $redirect;
        }

        echo json_encode($payload);
    }
    exit;
}

// Verifica que se hayan enviado email y contraseña
if (!isset($_POST["email"], $_POST["password"])) {
    responder("Faltan email o contraseña.", 400, true);
}

// Limpia y obtiene los datos del formulario
$email = trim($_POST["email"]);
$password = $_POST["password"];

// Valida que los campos no estén vacíos
if ($email === "" || $password === "") {
    responder("Email y contraseña no pueden estar vacíos.", 400, true);
}

// Ruta al archivo de usuarios
$ruta_archivo = "usuarios.json";

// Verifica que el archivo de usuarios exista
if (!file_exists($ruta_archivo)) {
    responder("No hay usuarios registrados.", 404, true);
}

// Lee y decodifica el archivo JSON
$contenido = file_get_contents($ruta_archivo);
$usuarios = json_decode($contenido, true);

// Verifica que el JSON sea válido
if (!is_array($usuarios)) {
    responder("El archivo de usuarios está dañado.", 500, true);
}

// Busca el usuario por email
$usuarioEncontrado = null;
foreach ($usuarios as $usuario) {
    if (isset($usuario["email"]) && $usuario["email"] === $email) {
        $usuarioEncontrado = $usuario;
        break;
    }
}

// Si no encuentra el usuario
if (!$usuarioEncontrado) {
    responder("Usuario no encontrado.", 404, true);
}

// Verifica la contraseña (comparando hash)
if (!isset($usuarioEncontrado["password"]) || !password_verify($password, $usuarioEncontrado["password"])) {
    responder("Credenciales inválidas.", 401, true);
}

// Almacena datos del usuario en la sesión
$_SESSION["name"] = $usuarioEncontrado["name"];


// Responde con éxito y redirige al dashboard
responder("Inicio de sesión exitoso.", 200, false, "../php/dashboard.php");