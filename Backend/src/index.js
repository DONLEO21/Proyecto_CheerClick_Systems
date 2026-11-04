// const express = require('express'); //CommonJS
import express from 'express';//EsModule

import usuariosRoute from './routes/usuarios.routes.js'; //EsModule_
import epsRoute from './routes/eps.routes.js';
import contactoEmergenciaRoute from './routes/contactoEmergencia.routes.js'
import perfilUsuarioRoute from './routes/perfilUsuario.routes.js'
import authRoute from './routes/auth.routes.js'


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

//Enlazar todas las rutas de la aplicacion 
app.use( '/api/usuarios' , usuariosRoute );
app.use( '/api/eps' ,  epsRoute);
app.use( '/api/contactoemergencia' , contactoEmergenciaRoute);
app.use( '/api/perfilusuario' , perfilUsuarioRoute) ;
app.use( '/api/auth' , authRoute)

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});