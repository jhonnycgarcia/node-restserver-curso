/** 
 * Requires
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

// Obtener imagen
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.png');
        res.sendFile(noImagePath);
    }
});


// Exportar
module.exports = app;