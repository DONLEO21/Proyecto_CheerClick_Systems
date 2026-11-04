//mongoose.createConnection('mongodb://127.0.0.1:27017/test')//
//ODM//;

import mongoose from "mongoose";

 const URI_MONGO = process.env.URI_MONGO || 'mongodb://localhost:27017/db-CheerClick'

//sequialize (SQL)
//Prisma (SQL, NO SQL)
const conexion = async () => {
    try {
        await mongoose.connect(URI_MONGO)
        console.log('Conectado a la base de datos MongoDB')
    } catch (error) {
        console.error('Error al conectar a la base de datos', error)
    }
}

export default conexion;