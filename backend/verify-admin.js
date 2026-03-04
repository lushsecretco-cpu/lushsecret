const pool = require('./db');

async function verifyAdmin() {
  try {
    const result = await pool.query(
      "UPDATE users SET is_verified = true WHERE email = 'admin@lushsecret.co'"
    );

    if (result.rowCount > 0) {
      console.log('✅ Cuenta de administrador verificada exitosamente.');
    } else {
      console.log('❌ No se encontró el usuario administrador.');
    }
  } catch (error) {
    console.error('❌ Error al verificar la cuenta:', error.message);
  } finally {
    process.exit();
  }
}

verifyAdmin();