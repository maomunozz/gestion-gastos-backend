// Importamos la librería "jsonwebtoken" para trabajar con JWT
const jwt = require("jsonwebtoken");

// Definición del middleware "auth" para proteger rutas en Express
const auth = (req, res, next) => {
  // Se obtiene el encabezado "Authorization" de la solicitud
  const authHeader = req.header("Authorization");

  // Se valida que el encabezado exista y que comience con "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Si no cumple la validación, se envía una respuesta 401 (No autorizado)
    return res
      .status(401)
      .json({ error: "Token no proporcionado o malformado" });
  }

  // Se extrae el token dividiendo el encabezado por espacios y tomando el segundo elemento
  // El formato esperado es: "Bearer <token>"
  const token = authHeader.split(" ")[1];

  try {
    // Se verifica el token utilizando la clave secreta definida en las variables de entorno
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Si la verificación es exitosa, se almacena la información decodificada en req.user
    req.user = verified;
    // Se llama a next() para continuar al siguiente middleware o ruta protegida
    next();
  } catch (error) {
    // Si ocurre algún error en la verificación, se imprime el error en la consola
    console.error("Error al verificar el token:", error.name, error.message);
    // Se define un mensaje de error predeterminado
    let message = "Token inválido";
    // Si el error es porque el token ha expirado, se actualiza el mensaje
    if (error.name === "TokenExpiredError") message = "Token expirado";
    // Se envía una respuesta 400 (Bad Request) con el mensaje de error
    res.status(400).json({ error: message });
  }
};

// Se exporta el middleware para que pueda ser utilizado en otras partes de la aplicación
module.exports = auth;

