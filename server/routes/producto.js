/**===================
 * Requires
 ====================*/
const express = require('express');
const Producto = require('../models/producto');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();



/**===================
 * Obtener todos los productos
 ====================*/
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let disponible = req.query.disponible || true;

    Producto.find({ disponible })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) { return res.status(400).json({ ok: false, err }); } // Si se presenta un error
            res.json({ ok: true, productos });
        });
});

/**===================
 * Buscar producto por descripcion
 ====================*/
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let disponible = req.query.disponible || true;

    Producto.find({ nombre: regexp, disponible })
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
            if (!productos) { return res.status(400).json({ ok: false, err: { message: 'No se encontro el producto' } }); } // Si se presenta un error

            res.json({ ok: true, productos });
        });
});

/**===================
 * Obtener descripcion de un producto
 ====================*/
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
            if (!productos) { return res.status(400).json({ ok: false, err: { message: 'No se encontro el producto' } }); } // Si se presenta un error
            res.json({ ok: true, productos });
        });
});

/**===================
 * Crear un producto
 ====================*/
app.post('/producto', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
        if (!productoDB) { return res.status(400).json({ ok: false, err }); } // Si no se crea el producto
        res.status(201).json({ ok: true, producto: productoDB });
    });
});

/**===================
 * Actualizar un producto
 ====================*/
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre']);


    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
        if (!productoDB) { return res.status(400).json({ ok: false, err: { message: 'No se pudo actualizar' } }); } // No se actualizo
        res.json({ ok: true, producto: productoDB });
    });
});

/**===================
 * Borrar un producto
 ====================*/
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) { return res.status(500).json({ ok: false, err }); } // Si se presenta un error
        if (!productoDB) { return res.status(400).json({ ok: false, err: { message: 'No se pudo eliminar el producto' } }); } // No se actualizo
        res.json({ ok: true, producto: productoDB, message: 'El producto ha sido borrado!' });
    });
});

// Exportar
module.exports = app;