const pool = require('./db');
const bcrypt = require('bcryptjs');
const { sendSMS } = require('./services/twilioService');

async function createAdminUser() {
  try {
    // Verificar si ya existe un admin
    const checkAdmin = await pool.query(
      "SELECT * FROM users WHERE email = 'admin@lushsecret.co'"
    );

    if (checkAdmin.rows.length > 0) {
      console.log('✅ Usuario admin ya existe:');
      console.log('   Email: admin@lushsecret.co');
      console.log('   Contraseña: Siempreactivo1$');
      return;
    }

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('Siempreactivo1$', 10);
    
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, phone, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, role`,
      ['Administrador', 'admin@lushsecret.co', hashedPassword, 'admin', '+57 6013570804', true] // Usar el mismo teléfono de Twilio o uno del admin
    );

    // Enviar SMS de alerta
    try {
      await sendSMS('+57 6013570804', 'Cuenta de administrador creada en LushSecret. Email: admin@lushsecret.co, Password: Siempreactivo1$');
    } catch (smsError) {
      console.error('Error enviando SMS de admin:', smsError.message);
    }

    console.log('✅ Usuario admin creado exitosamente:');
    console.log('   Email: admin@lushsecret.co');
    console.log('   Contraseña: Siempreactivo1$');
    console.log('   ID:', result.rows[0].id);
    
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error.message);
  } finally {
    process.exit();
  }
}

createAdminUser();
