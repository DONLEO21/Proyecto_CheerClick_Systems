const withRoleMiddleware = (req, res, next) => {
    // Paso 1: Obtiene los datos de la peticion
    const inputData = req.body;

    // Paso 2: Elimina el rol y el status para que se registren los valores por defecto
    delete inputData.rol          // Eliminando la propiedad rol
    delete inputData.status       // Eliminando la propiedad status

    // Paso 3: 
    next();
}
export {
    withRoleMiddleware
}