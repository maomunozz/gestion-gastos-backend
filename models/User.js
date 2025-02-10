const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
});

// Encriptar la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Verificar si ya está hasheada
  if (this.password.startsWith("$2b$")) {
    console.log(
      "🔹 La contraseña ya está hasheada. No se volverá a encriptar."
    );
    return next();
  }

  console.log("🔹 Encriptando contraseña antes de guardar...");

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  console.log("🔹 Contraseña encriptada:", this.password);

  next();
});

module.exports = mongoose.model("User", userSchema);
