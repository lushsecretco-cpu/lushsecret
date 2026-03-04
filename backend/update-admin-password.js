const pool = require('./db');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  try {
    // First, ensure the is_verified column exists
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    `);

    const newPassword = 'Siempreactivo1$';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      "UPDATE users SET password = $1, is_verified = true WHERE email = 'admin@lushsecret.co'",
      [hashedPassword]
    );

    if (result.rowCount > 0) {
      console.log('✅ Contraseña del administrador actualizada exitosamente.');
      console.log('   Email: admin@lushsecret.co');
      console.log('   Nueva contraseña:', newPassword);
    } else {
      console.log('❌ No se encontró el usuario administrador.');
    }
  } catch (error) {
    console.error('❌ Error al actualizar la contraseña:', error.message);
  } finally {
    process.exit();
  }
}

updateAdminPassword();