# Decodificacion_proyecto_php


**Nombre:** John jairo Zamudio Agudelo

**Ficha:**  2977467

**Evidencia:** GA7-220501096-AA5-EV03: Diseño y desarrollo de servicios web-proyecto   


Este proyecto implementa un sistema completo de **login**, **registro** y **dashboard personalizado** para Peluquería Denis. 
Su propósito es gestionar el acceso de usuarios mediante una interfaz sencilla, moderna y segura.




## Tecnologías Utilizadas

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** PHP  
- **Persistencia:** JSON (usuarios almacenados en `usuarios.json`)

## Estructura del Proyecto

```
Decodificacion_proyecto_php/
├── html/
│   ├── css/                  # Estilos CSS
│   ├── imagenes/             # Imágenes del proyecto
│   ├── js/                   # Scripts JavaScript
│   ├── index.html            # Página principal
│   ├── login.html            # Modal de login
│   ├── register.html         # Modal de registro
│   └── textPrincipal.html    # Contenido principal
└── php/
    ├── dashboard.php         # Panel post-login
    ├── login.php             # Lógica de autenticación
    ├── register.php          # Lógica de registro
    └── usuarios.json         # Base de datos de usuarios
```

## Características Principales

### 1. Autenticación Segura

- Validación del email
- Contraseñas con requisitos mínimos:
  - 8 caracteres
  - Mayúscula, número y carácter especial
- Hash con `password_hash()`
- Verificación segura con `password_verify()`

### 2. Interfaz de Usuario

- Modales interactivos para login y registro
- Estilo moderno con efectos CSS/JS
- Diseño responsivo
- Transiciones suaves

### 3. Dashboard Personalizado

- Muestra el nombre del usuario
- Menú de navegación
- Protección de rutas mediante sesiones

## Instalación y Configuración

1. Clona el repositorio en la carpeta `htdocs` de XAMPP:
   ```bash
   git clone https://github.com/SenaEdu608/Decodificacion_proyecto_php.git
   ```

2. Asegúrate de tener **PHP** correctamente instalado.

3. Verifica que el archivo `php/usuarios.json` tenga **permisos de escritura**.

4. Abre el navegador y accede a:
   ```
   http://localhost/Decodificacion_proyecto_php/html/index.html
   ```

## Documentación de Servicios Web

### Registro de Usuario

- **Endpoint:** `/php/register.php`  
- **Método:** `POST`  
- **Parámetros:**
  - `name`
  - `email`
  - `password`
  - `confirmedPassword`
- **Respuestas:**
  - `200 OK`: Registro exitoso
  - `400`: Datos inválidos
  - `409`: Email ya registrado

### Login

- **Endpoint:** `/php/login.php`  
- **Método:** `POST`  
- **Parámetros:**
  - `email`
  - `password`
- **Respuestas:**
  - `200 OK`: Login exitoso
  - `400`: Datos faltantes
  - `401`: Credenciales incorrectas

### Dashboard

- **Endpoint:** `/php/dashboard.php`  
- **Método:** `GET`  
- **Requiere:** Sesión activa  
- **Contenido:** Dashboard con nombre del usuario

## Consideraciones de Seguridad

- Sanitización de inputs para prevenir inyecciones
- Manejo de sesiones con `session_start()`
- Almacenamiento de contraseñas con hash (bcrypt)
- Validaciones del lado del cliente **y** del servidor



## Repositorio

**[https://github.com/SenaEdu608/Decodificacion_proyecto_php.git](https://github.com/SenaEdu608/Decodificacion_proyecto_php.git)**
