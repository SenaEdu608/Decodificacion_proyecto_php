<?php
// Función para detectar si la petición viene de un navegador
function esDesdeNavegador() {
    return isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'text/html') && 
           (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || $_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest');
}

// Función para enviar respuestas consistentes
function responder($mensaje, $codigo = 200, $esError = false) {
    http_response_code($codigo);

    if (esDesdeNavegador()) {
        // Escapa el mensaje para seguridad en JavaScript
        $safe = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');
        echo "<script>
                alert('{$safe}');
                " . ($esError ? "window.history.back();" : "window.location.href = '../html/index.html';") . "
              </script>";
    } else {
        // Respuesta JSON para APIs
        header("Content-Type: application/json");
        $payload = $esError
            ? ["error" => $mensaje]
            : ["mensaje" => $mensaje, "redirect" => "../html/index.html"];

        echo json_encode($payload);
    }
    exit;
}

// Verifica que todos los campos del formulario estén presentes
if (!isset($_POST["name"], $_POST["email"], $_POST["password"], $_POST["confirmedPassword"])) {
    responder("Faltan datos del formulario.", 400, true);
}

// Limpia y obtiene los datos del formulario
$name = trim($_POST["name"]);
$email = trim($_POST["email"]);
$password = $_POST["password"];
$confirmPassword = $_POST["confirmedPassword"];

// Verifica que las contraseñas coincidan
if ($password !== $confirmPassword) {
    responder("Las contraseñas no coinciden.", 400, true);
}

// Expresión regular para validar contraseña segura
$regex = "/^(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$/";

// Valida el formato de la contraseña
if (!preg_match($regex, $password)) {
    responder("La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.", 400, true);
}

// Valida el formato del email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder("Formato de email no válido.", 400, true);
}

// Ruta al archivo de usuarios
$ruta_archivo = "usuarios.json";

// Crea el archivo si no existe
if (!file_exists($ruta_archivo)) {
    file_put_contents($ruta_archivo, "[]");
}

// Lee y decodifica el archivo JSON
$contenido = file_get_contents($ruta_archivo);
$usuarios = json_decode($contenido, true);

// Verifica que el JSON sea válido
if (!is_array($usuarios)) {
    responder("El archivo de usuarios está dañado.", 500, true);
}

// Verifica si el email ya está registrado
foreach ($usuarios as $usuario) {
    if ($usuario["email"] === $email) {
        responder("El email ya está registrado.", 409, true);
    }
}

// Crea el nuevo usuario con contraseña hasheada
$nuevo_usuario = [
    "name" => $name,
    "email" => $email,
    "password" => password_hash($password, PASSWORD_DEFAULT)
];

// Agrega el nuevo usuario al array
$usuarios[] = $nuevo_usuario;

// Guarda los datos en el archivo JSON
if (file_put_contents($ruta_archivo, json_encode($usuarios, JSON_PRETTY_PRINT)) === false) {
    responder("No se pudo guardar el usuario.", 500, true);
}

// Responde con éxito y redirige
responder("Usuario registrado exitosamente.", 201, false);