import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendResetCodeEmail = async (to, nombre, code, ttlMin) => {
  const pathToFrontendLogo = path.join(__dirname, "../../../Frontend Web/Trimestre IV/src/assets/icons/Logo-Club.png");

  // Agregamos una marca de tiempo al asunto solo en desarrollo para que Gmail NO agrupe los correos
  const subjectText = `Código para restablecer tu contraseña - CheerClick (${new Date().toLocaleTimeString()})`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: to,
    subject: subjectText, 
    html: `
            <div style="font-family:Arial,sans-serif;max-width:440px;margin:auto;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="background-color: #ece7e7; padding: 24px; text-align: center;">
                    <img src="cid:logo_cheerclick" alt="CheerClick Logo" style="width:75px; max-width:75px; height:auto; display:inline-block;">
                </div>
                
                <div style="padding:24px; background-color: #ffffff;">
                    <h2 style="text-align:center; color:#18181b; margin-top:0;">Recuperar contraseña</h2>
                    <p style="color:#3f3f46; line-height:1.5;">Hola ${nombre}. Hemos recibido una solicitud para restablecer la contraseña de tu cuenta asociada a este correo:</p>
                    
                    <!-- Contenedor centradon -->
                    <div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin-right: -6px; color: #18181b; display: block; text-align: center; width: 100%;">
                            ${code}
                        </div>
                    </div>
                    
                    <p style="color:#71717a; font-size:14px; margin-bottom:0;">Este código expirará en ${ttlMin} minutos. Si no lo solicitaste, ignora este mensaje.</p>
                </div>
            </div>`,
    attachments: [{
        filename: 'Logo-Club.png',
        path: pathToFrontendLogo,
        cid: 'logo_cheerclick', 
        inline: true 
    }]
  });
};

const sendSolicitudEmail = async (to, nombre, aprobada, rol) => {
  const titulo = aprobada ? '¡Tu cuenta fue aprobada!' : 'Tu solicitud fue rechazada';

  const mensaje = aprobada
    ? `Bienvenido a CheerClick Systems. Tu cuenta fue validada con el rol de <b>${rol}</b>. Ya puedes iniciar sesión.`
    : 'Tu solicitud de ingreso no fue aprobada. Si crees que es un error, contacta al club.';

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: to,
    subject: `${titulo} - CheerClick`,
    html: `
            <div style="font-family:Arial,sans-serif;max-width:440px;margin:auto;border:1px solid #e4e4e7;border-radius:12px;padding:24px;">
                <h2 style="text-align:center;color:#18181b;margin-top:0;">${titulo}</h2>
                <p style="color:#3f3f46;line-height:1.5;">Hola ${nombre}. ${mensaje}</p>
            </div>`
  });
};

export { sendResetCodeEmail, sendSolicitudEmail };
