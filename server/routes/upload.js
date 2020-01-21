/**===================
 * Requires
 ====================*/
const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middlewares/autenticacion');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();


// Middleware de la libreria fileUpload
app.use(fileUpload({ useTempFiles: true }));

// Cargar un archivo al servidor
// --- :tipo = puede ser usuario y producto
// --- :id = el ID del registro asociar
app.put('/upload/:tipo/:id', verificaToken, (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    // Validar tipos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(401).json({ ok: false, err: { message: 'Los tipos permitidos son: ' + tiposValidos.join(', '), tipo } });
    }

    if (!req.files) { return res.status(400).json({ ok: false, err: { message: 'No se ha seleccionado ningún archivo' } }) } // Si se presenta un error

    // Capturar el archivo subido
    let archivoForm = req.files.archivoForm;
    // Capturar extension el archivo
    let archivoExtension = archivoForm.name.split('.').pop();

    // Extensiones validas
    let extensionesValidas = ['png', 'jpg', 'jpeg'];
    // Validar si la extension es valida
    if (extensionesValidas.indexOf(archivoExtension) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', '), ext: archivoExtension } })
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${archivoExtension}`;

    // Mover archivo a directorio
    archivoForm.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si ocurre un error

        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, nombreArchivo, res);
                break;
            case 'productos':
                imagenProducto(id, nombreArchivo, res);
                break;

            default:
                borrarImagen(tipo, nombreArchivo);
                break;
        }


        // res.json({ ok: true, message: 'Archivo cargado exitosamente' });
    });
});

let imagenUsuario = (id, nombreArchivo, res) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) { // Si ocurre un error
            borrarImagen('usuarios', nombreArchivo);
            return res.status(500).json({ ok: false, err });
        }
        if (!usuarioDB) { // El id no existe
            borrarImagen('usuarios', nombreArchivo);
            return res.status(400).json({ ok: false, err: { message: 'EL usuario no existe' } })
        }

        // Borrar imagen anterior
        borrarImagen('usuarios', usuarioDB.img);

        // Asignar valor al campo del registro
        usuarioDB.img = nombreArchivo;
        //Guardar cambios
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) { return res.status(500).json({ ok: false, err }); } // Si ocurre un error
            res.json({ ok: true, usuario: usuarioGuardado, img: nombreArchivo })
        });
    });
};

let imagenProducto = (id, nombreArchivo, res) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) { // Si ocurre un error
            borrarImagen('productos', nombreArchivo);
            return res.status(500).json({ ok: false, err });
        }
        if (!productoDB) { // El id no existe
            borrarImagen('productos', nombreArchivo);
            return res.status(400).json({ ok: false, err: { message: 'EL producto no existe' } })
        }

        // Borrar imagen anterior
        borrarImagen('productos', productoDB.img);

        // Asignar valor al campo del registro
        productoDB.img = nombreArchivo;
        //Guardar cambios
        productoDB.save((err, productoGuardado) => {
            if (err) { return res.status(500).json({ ok: false, err }); } // Si ocurre un error
            res.json({ ok: true, producto: productoGuardado, img: nombreArchivo })
        });
    });
};


// Borrar la imagen anterior dl servidor
let borrarImagen = (tipo, nombreImagen) => {
    // Direccion de la imagen anterior
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    // Validar que exista
    if (fs.existsSync(pathImagen)) { fs.unlinkSync(pathImagen); }
}

// Exportar
module.exports = app;