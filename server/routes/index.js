/**
 * Requires
 */
const express = require('express');
const app = express();

// Rutas de /usuario
app.use(require('./usuario'));
// Rutas de /login
app.use(require('./login'));
// Rutas de /categoria
app.use(require('./categoria'));
// Rutas de /producto
app.use(require('./producto'));

module.exports = app;