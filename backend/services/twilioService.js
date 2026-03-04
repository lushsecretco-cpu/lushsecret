const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = new twilio(accountSid, authToken);

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

module.exports = { sendSMS, sendVerificationSMS, verifyCode };