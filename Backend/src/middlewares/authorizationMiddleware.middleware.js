// Allowed roles: Roles Permitidos (Administrador, Entrenador, Atleta)
const authorizationMiddleware = ( allowedRoles) => {
   

    return (req, res, next) => {
     // Paso 1: Extraer el rol del usuario payload del token que valida el Middleware de Autenticacion
    const rol = req.userFound.rol;
    if (! rol) {
        return res.status(403).json({msg: 'Error: EL usuario autenticado no tiene rol definido'})
    }

    // Paso 2: Verificar si el rol del usuario se encuentra en la lista de roles permitidos.... para esta ruta

    if ( ! allowedRoles.includes (rol)){
        return res.status(403).json({msg: `Error: el rol ${rol} no esta autorizao para realizar esta accion`});
    }
    console.log(`Usuario autorizado con el rol ${rol}`)
     next();
    }


    


}
export {
    authorizationMiddleware
}