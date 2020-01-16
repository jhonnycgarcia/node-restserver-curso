/**
 * Requires
 */
const express = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const app = express();

// Funcion para el logeo en la app
app.post('/login', (req, res) => {
    let body = req.body;
    // let passwordForm = crypto.scryptSync(body.password, 'salt', 10).toString('hex');

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err });
        }

        // Validar si existe el usuario
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `(Usuario) o contraseña incorrectos`
                }
            });
        }

        // Validar si el password coincide
        if (!bcryptjs.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Usuario o (contraseña) incorrectos`
                }
            });
        }

        // Generar el TOKEN
        let token = jwt.sign({
                usuario: usuarioDB
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});


// Exportar
module.exports = app;