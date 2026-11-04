const withRoleMiddleware = (req, res, next) => {
    // Paso 1: Obtiene los datos de la peticion

    // Paso 2: Elimina el rol  para que se registre el rol por defecto
     const inputData = req.body;
     delete inputData.rol          // Eliminando la propiedad rol



    // Paso 3: 
     next();
}
export {
    withRoleMiddleware
}