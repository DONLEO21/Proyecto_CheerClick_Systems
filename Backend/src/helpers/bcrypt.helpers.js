import bcrypt from 'bcrypt'

const generarPassword= (originalPassword) => {
    const salt = bcrypt.genSaltSync(9);
    const hashPassword = bcrypt.hashSync(originalPassword, salt);

    return hashPassword;
}

const verifyPassword = (originalPassword, hashPassword) => {
    return bcrypt.compareSync(originalPassword, hashPassword);
}

export {
    generarPassword,
    verifyPassword
}