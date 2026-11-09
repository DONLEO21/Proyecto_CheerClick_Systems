export const errorHttp = (status, mensaje) => {
    const err = new Error(mensaje);
    err.status = status;
    return err;
};

export const errorValidacion = (campo, mensaje) => {
    const err = new Error(mensaje);
    err.name = 'ValidationError';
    err.errors = { [campo]: { message: mensaje } };
    return err;
};

// Reemplaza los catch repetidos de los controladores
export const responderError = (res, error, msgGenerico) => {
    console.error(error);

    if (error.status) {
        return res.status(error.status).json({ msg: error.message });
    }
    if (error.name === 'CastError') {
        return res.status(400).json({
            msg: 'Error en el formato del ID',
            [error.path]: `El identificador ${error.value} no tiene el formato valido que requiere MongoDB`
        });
    }
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            msg: `Error por duplicado en el campo '${field}'`,
            [field]: `El ${field} ${error.keyValue[field]} ya se encuentra registrado`
        });
    }
    if (error.name === 'ValidationError') {
        const errors = {};
        for (const field in error.errors) errors[field] = error.errors[field].message;
        return res.status(400).json({ errors });
    }
    return res.status(500).json({ msg: msgGenerico });
};