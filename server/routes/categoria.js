/**===================
 * Requires
 ====================*/
const express = require('express');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

/**===================
 * Mostrar todas las categorias
 ====================*/
app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) { return res.status(400).json({ ok: false, err }); } // Si se presenta un error
            res.json({ ok: true, categorias });
        });
});

/**===================
 * Mostrar información de una (1) categoria
 ====================*/
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
        if (!categoriaDB) { return res.status(400).json({ ok: false, err: { message: 'No se encontro el id' } }); } // Si se presenta un error
        res.json({ ok: true, categoria: categoriaDB });
    });
});

/**===================
 * Crear una categoria
 ====================*/
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    // Crear la nueva categoria
    categoria.save((err, categoriaDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
        if (!categoriaDB) { return res.status(400).json({ ok: false, err }); } // Si no se crea la categoria
        res.json({ ok: true, categoria: categoriaDB }); // Enviar si todo sale bien
    });
});

/**===================
 * Actualizar una categoria
 ====================*/
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = { descripcion: req.body.descripcion };

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
        if (!categoriaDB) { return res.status(400).json({ ok: false, err: { message: 'No se encontro el id' } }); } // Si no se encuentra la categoria
        res.json({ ok: true, categoria: categoriaDB })
    });
});

/**===================
 * Eliminar una categoria
 ====================*/
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
        if (!categoriaBorrada) { return res.status(400).json({ ok: false, err: { message: 'El id no existe' } }); } // Si no se encuentra la categoria
        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: `Categoria <<${categoriaBorrada.descripcion}>> borrada!`
        });
    });
});

/**===================
 * Exportar
 ====================*/
module.exports = app;