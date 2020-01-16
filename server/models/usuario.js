/**
 * Requires
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Definir roles validos para el registro
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let Schema = mongoose.Schema;

// Definir el esquema de usuario para el modelo
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: false,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        required: false,
        default: true
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
});

// Metodo para eliminar el campo "password" al retornar el registro
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObjetct = user.toObject();
    delete userObjetct.password;
    return userObjetct;
}

// Añadir plugin al esquema
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

// Exportar modelo
module.exports = mongoose.model('Usuario', usuarioSchema);