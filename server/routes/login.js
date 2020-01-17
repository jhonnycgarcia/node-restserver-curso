/**
 * Requires
 */
const express = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


/** 
 * Configuracines de Google
 */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

// Autenticar utilizando Google
app.post('/signin-with-google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });

    //     // Validar que el usuario existe en la DB
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Existe el usuario en la DB
        if (usuarioDB) {
            // Si se autentico con credenciales normales
            if (usuarioDB.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Debe utilizar su método de autenticación normal'
                    }
                });
            } else { // Es un usuario que se autentica por google SignIn
                // Generar el TOKEN
                let token = jwt.sign({
                        usuario: usuarioDB
                    },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else { // El usuario no existe en la DB
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                // Generar el TOKEN
                let token = jwt.sign({
                        usuario: usuarioDB
                    },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });

});


// Exportar
module.exports = app;