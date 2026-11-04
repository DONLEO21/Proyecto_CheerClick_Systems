// const express = require('express'); //CommonJS
import express from 'express';

import conexion from './config/mongo.config.js'; //Importar la connexion a la base de datos
import pagosRouter from './routes/pagos.routes.js'; //EsModule
import mensualidadRouter from './routes/mensualidades.routes.js'
import PlanAsociadoRouter from './routes/planAsociado.routes.js';
import MetodoPagoRouter from './routes/metodosPago.routes.js';
import usuariosRoute from './routes/usuarios.routes.js'
import authRoute from './routes/auth.routes.js'

const port= process.env.PORT || 3001;

const app = express(); //Instacia de express
conexion(); // Ejecuta la conexion de la base de datos 

app.use(express.json()) //Habilita a la aplicacion para interpretar JSON


//Definiendo el primer endpoint (Ruta de entrada) 
app.get('/health', (req, res) => {
    res.status(200).json({ msg: 'Servidor de CheerClick esta funcionando!'})

});

//Enlazar todas las rutas de la aplicacion 
app.use( '/api/pagos' , pagosRouter );
app.use( '/api/mensualidades', mensualidadRouter);
app.use( '/api/plan-asociado', PlanAsociadoRouter);
app.use( '/api/metodo-pago', MetodoPagoRouter);

//Enlazar todas las rutas de la aplicacion 
app.use( '/api/usuarios' , usuariosRoute );
app.use('/api/auth', authRoute);

//Iniciar servidor 
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});