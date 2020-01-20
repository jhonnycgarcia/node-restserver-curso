/**
 * Requires
 */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción de la categoria es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id del usuario es requerido']
    }
});

// Añadir plugin al esquema
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser única'
});

// Exportar modelo
module.exports = mongoose.model('Categoria', categoriaSchema);