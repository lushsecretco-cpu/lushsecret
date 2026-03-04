const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);

async function createVerifyService() {
  try {
    console.log('🔧 Creando servicio de verificación de Twilio...');

    const service = await client.verify.v2.services.create({
      friendlyName: 'LushSecret SMS Verification',
      codeLength: 6
    });

    console.log('✅ Servicio de verificación creado exitosamente!');
    console.log('📋 Service SID:', service.sid);
    console.log('📝 Friendly Name:', service.friendlyName);
    console.log('');
    console.log('💡 Copia este SID y pégalo en tu archivo .env como TWILIO_VERIFY_SERVICE_SID');

  } catch (error) {
    console.error('❌ Error creando servicio de verificación:', error.message);
  } finally {
    process.exit();
  }
}

createVerifyService();