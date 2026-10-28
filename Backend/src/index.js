// const express = require('express'); //CommonJS
import express from 'express';//EsModule


import horariosRoute from './routes/horarios.routes.js';
import plantilla_horariosRoute from './routes/plantilla_horarios.routes.js'
import nivelesRoute from './routes/niveles.routes.js'
import competenciasRoute from './routes/competencias.routes.js'
import inscripciones_competenciasRoute from './routes/inscripciones_competencias.routes.js'
import pqrsRoute from './routes/pqrs.routes.js'
import respuestapqrsRoute from './routes/respuesta_pqrs.routes.js'


import conexion from './config/mongo.config.js' //Conexion a la base de datos

//Iniciar servidor 
const port= process.env.PORT || 3001;

const app = express();     //Instancia de express

conexion();      //Ejecuta la conexion a la base de datos

//Habilita a la aplicacion para intepretar JSON
app.use(express.json());

//Definiendo el primer endpoint (Ruta de entrada) 
app.get('/health', (req, res) => {
    res.status(200).json({msg : 'Servidor de CheerClick esta funcionando!'})
});


// Enlazar todas las rutas de la aplicacion
app.use('/api/horarios', horariosRoute);
app.use('/api/plantilla_horario', plantilla_horariosRoute);
app.use('/api/niveles', nivelesRoute );
app.use('/api/competencias', competenciasRoute);
app.use('/api/inscripciones_competencias', inscripciones_competenciasRoute)
app.use('/api/pqrs', pqrsRoute);
app.use('/api/respuesta_pqrs', respuestapqrsRoute);


//Iniciar servidor 
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});