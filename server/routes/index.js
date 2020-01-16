/**
 * Requires
 */
const express = require('express');
const app = express();

// Rutas de /usuario
app.use(require('./usuario'));
// Rutas de /login
app.use(require('./login'));

module.exports = app;