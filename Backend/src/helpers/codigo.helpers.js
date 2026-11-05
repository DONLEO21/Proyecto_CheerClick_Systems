// Genera códigos legibles tipo IM4821 / SL1307 que no se repitan
export const generarCodigo = async (Model, prefijo) => {
    for (let i = 0; i < 10; i++) {
        const codigo = `${prefijo}${Math.floor(1000 + Math.random() * 9000)}`;
        if (!(await Model.exists({ codigo }))) return codigo;
    }
    return `${prefijo}${Date.now().toString().slice(-8)}`;
};