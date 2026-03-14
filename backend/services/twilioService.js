const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = new twilio(accountSid, authToken);

// Número WhatsApp del que se envía (sandbox Twilio o número registrado)
const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

// Servicio de verificación de Twilio
async function sendVerificationSMS(phoneNumber) {
  try {
    // Forzar una nueva verificación cada vez
    const result = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({
        to: phoneNumber,
        channel: 'sms',
        locale: 'es' // Español para Colombia
      });

    console.log('Verificación enviada:', result.sid);
    return { success: true, verificationSid: result.sid };

  } catch (error) {
    console.error('Error enviando verificación:', error.message);
    throw error;
  }
}

async function verifyCode(phoneNumber, code) {
  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({
        to: phoneNumber,
        code: code
      });

    console.log('Verificación completada:', verificationCheck.status);
    return verificationCheck.status === 'approved';

  } catch (error) {
    console.error('Error verificando código:', error.message);
    return false;
  }
}

// Función original para SMS normales (pedidos, alertas)
async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });
    console.log('SMS enviado:', result.sid);
    return result;
  } catch (error) {
    console.error('Error enviando SMS:', error.message);
    throw error;
  }
}

// Enviar mensaje por WhatsApp
async function sendWhatsApp(to, message) {
  const toFormatted = to.startsWith('whatsapp:') ? to : `whatsapp:${to.replace(/\s/g, '')}`;
  const fromFormatted = whatsappFrom.startsWith('whatsapp:') ? whatsappFrom : `whatsapp:${whatsappFrom}`;
  const result = await client.messages.create({
    body: message,
    from: fromFormatted,
    to: toFormatted
  });
  console.log('WhatsApp enviado:', result.sid);
  return result;
}

// Intenta WhatsApp primero; si falla, cae a SMS
async function sendNotification(to, message) {
  if (!to) return;
  const normalized = to.replace(/\s/g, '');
  try {
    return await sendWhatsApp(normalized, message);
  } catch (waError) {
    console.warn('WhatsApp falló, intentando SMS:', waError.message);
    return await sendSMS(normalized, message);
  }
}

module.exports = { sendSMS, sendWhatsApp, sendNotification, sendVerificationSMS, verifyCode };