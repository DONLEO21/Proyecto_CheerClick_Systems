const withRoleMiddleware = (req, res, next) => {
    // Paso 1: Obtiene los datos de la peticion
    const inputData = req.body;

    // Paso 2: Elimina lo que el usuario no puede decidir
    delete inputData.rol
    delete inputData.status
    delete inputData.codigo

    // Paso 3: Todo registro público queda pendiente hasta que el administrador lo valide
    inputData.estadoSolicitud = 'Pendiente';

    next();
}
export {
    withRoleMiddleware
}