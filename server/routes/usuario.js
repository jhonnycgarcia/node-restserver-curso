/**
 * Requires
 */
const express = require('express');
const Usuario = require('../models/usuario');
const _ = require('underscore');

const app = express();

// Consultar o listar
app.get('/usuario', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let estado = req.query.estado;

    Usuario.find({ estado }, 'nombre email estado role img google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                Usuario.countDocuments({ estado }, (err, conteo) => {
                    return res.json({
                        ok: true,
                        cuantos: conteo,
                        usuarios
                    });
                });
            }
        });
});

// Crear o registrar
app.post('/usuario', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            return res.json({
                ok: true,
                usuario: usuarioDB
            })
        }
    });
});

// Editar o actualizar
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id || null;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // Filtrar que campos se pueden modificar

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });

});

// Eliminar
app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    let cambiaEstado = { estado: false }
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    error: { message: 'Usuario no encontrado' }
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

// Exportar
module.exports = app;