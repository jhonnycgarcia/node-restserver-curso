/** 
 * Requires
 */
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();


const bodyParser = require('body-parser');


/** 
 * Middlewares
 */
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

// Conexion con la DBA
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos en línea');
});

// Puerto de Escucha
app.listen(process.env.PORT, () => { console.log(`Escuchando a traves del puerto ${process.env.PORT}`); });