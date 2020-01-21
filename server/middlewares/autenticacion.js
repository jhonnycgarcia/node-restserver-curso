/**
 * Requires
 */
const jwt = require('jsonwebtoken');

// Verificar el TOKEN
let verificaToken = (req, res, next) => {
    // Obtener header - token
    let token = req.get('token');
    // Verificar el token
    jwt.verify(token, process.env.SEED, (err, tokenDecoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = tokenDecoded.usuario;
        next();
    });
};

// Verificar el TOKEN para imagen
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    // Verificar el token
    jwt.verify(token, process.env.SEED, (err, tokenDecoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = tokenDecoded.usuario;
        next();
    });
};

// Verifica ADMIN_ROLE
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// Exportar
module.exports = {
    verificaToken,
    verificaTokenImg,
    verificaAdmin_Role
}