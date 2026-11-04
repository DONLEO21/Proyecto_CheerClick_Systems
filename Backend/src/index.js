import express from 'express';

import implementosRoute from './routes/implementos.routes.js';
import implementoTallaRoute from './routes/implementoTalla.routes.js';
import solicitudRoute from './routes/solicitud.routes.js';
import solicitudImplementosRoute from './routes/solicitudImplementos.routes.js';
import resenaRoute from './routes/resena.routes.js';


import conexion from './config/mongo.config.js' 

const port= process.env.PORT || 3001;

const app = express();    

conexion();  

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({msg : 'Servidor de CheerClick esta funcionando!'})

});

app.use( '/api/implementos' , implementosRoute );
app.use( '/api/implementoTalla' , implementoTallaRoute );
app.use( '/api/solicitud' , solicitudRoute );
app.use( '/api/solicitudImplementos' , solicitudImplementosRoute );
app.use( '/api/resena' , resenaRoute );

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});