import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendResetCodeEmail = async ( to, nombre, code, ttlMin ) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: to,
        subject: 'Código para restablecer tu contraseña - CheerClick',
        html: `
            <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto">
                <h2>Recuperar contraseña</h2>
                <p>Hola ${nombre}, usa este código para continuar:</p>
                <p style="font-size:32px;letter-spacing:8px;font-weight:bold">${code}</p>
                <p>Vence en ${ttlMin} minutos. Si no lo solicitaste, ignora este mensaje.</p>
            </div>`
    });
}

export {
    sendResetCodeEmail
}