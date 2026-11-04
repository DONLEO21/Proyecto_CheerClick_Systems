//ODM: 
import mongoose from "mongoose";

const URI_MONGO =process.env.URI_MONGO || 'mongodb://localhost:27017/db-CheerClick';

//sequelize (SQL)
// Prisma (SQL, NoSQL)

const conexion = async () => {
    try {
        await mongoose.connect(URI_MONGO)    
        console.log ('Conectado a la bases de datos de MongoDB')    
    } catch (error) {
        console.error('Error al conectar a la base de datos:' , error)
    }
 
}

export default conexion; 