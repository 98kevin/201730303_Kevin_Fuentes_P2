const express = require('express');
const router = express.Router();
const main = require('../logica/logica.js')


router.use(express.json());


router.get('/', (req, res) => {
    res.render('home', { max: 15 });
});

router.get('/ingreso', (req, res) => {
    res.render('ingreso', { max: 15 });
});


router.post('/evaluarContenido', (req,res) => {
    let archivo=req.body.archivo;
    let response = main(archivo);
    res.status(200).json({
        textoResultado: response
    });
});


router.get('/siguienteToken', (req,res) => {
    console.log(tokens[0]);
    res.status(200).json({
        primerTokenActual: tokens[0]
    });
    tokens.shift(); //elimina el primer elemento
});


module.exports = router;
