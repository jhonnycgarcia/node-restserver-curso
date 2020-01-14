/** 
 * Requires
 */
require('./config/config');
const express = require('express');
const app = express();
const port = process.env.PORT;


const bodyParser = require('body-parser');


/** 
 * Middlewares
 */
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());


app.get('/usuario', (req, res) => {
    res.json('get usuario');
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El parametro "nombre" es necesario'
        })
    } else {
        res.json({ body });
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id || null;
    res.json({ id });
});

app.delete('/usuario', (req, res) => {
    res.json('delete usuario');
});

app.listen(port, () => { console.log(`Escuchando a traves del puerto ${port}`); });