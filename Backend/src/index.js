import express from 'express';

import rendimientoRoute from './routes/rendimiento.routes.js';
import habilidadRoute from './routes/habilidades.routes.js';
import tipoHabilidadRoute from './routes/tipoHabilidad.routes.js';
import asistenciaRoute from './routes/asistencia.routes.js';
import justificacionRoute from './routes/justificacion.routes.js';


import conexion from './config/mongo.config.js' 

const port= process.env.PORT || 3001;

const app = express();    

conexion();  

app.use(express.json());

//Definiendo endpoint (ruta de entrada)
app.get('/health', (req, res) => {
    res.status(200).json({msg : 'Servidor de CheerClick esta funcionando!'})

});

// Enlazar todas las rutas de la aplicacion
app.use( '/api/rendimiento' , rendimientoRoute );
app.use( '/api/habilidad', habilidadRoute);
app.use( '/api/tipo-habilidad', tipoHabilidadRoute);
app.use( '/api/asistencia' , asistenciaRoute );
app.use( '/api/justificacion' , justificacionRoute );

// Iniciar Servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});