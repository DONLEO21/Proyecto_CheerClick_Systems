const authorizationMiddleware = ( allowedRoles) => {

    return (req, res, next) => {
        // 1. Extraer el rol del usuario del payload del token que valida el middleware de autenticación
        const rol = req.userFound.rol;

        if ( ! rol){
            return res.status(403).json({msg: 'Error: El usuario autenticado no tiene rol definido'});
        }

        // 2. Verificar si el rol del usuario se encuentra en la lista de errores permitidos... para esta ruta
        if ( ! allowedRoles.includes( rol )) {
            return res.status(403).json({
                msg: `Error: el rol ${ rol} no esta autorizado para realizar esta acción`
            })
        }
        console.log(`Usuario autorizado con rol ${rol}`);
        next();
    }
    
}
export {
    authorizationMiddleware
}