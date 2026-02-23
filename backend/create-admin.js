const pool = require('./db');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    // Verificar si ya existe un admin
    const checkAdmin = await pool.query(
      "SELECT * FROM users WHERE email = 'admin@lushsecret.com'"
    );

    if (checkAdmin.rows.length > 0) {
      console.log('✅ Usuario admin ya existe:');
      console.log('   Email: admin@lushsecret.com');
      console.log('   Contraseña: admin123');
      return;
    }

    // Crear usuario admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role`,
      ['Administrador', 'admin@lushsecret.com', hashedPassword, 'admin']
    );

    console.log('✅ Usuario admin creado exitosamente:');
    console.log('   Email: admin@lushsecret.com');
    console.log('   Contraseña: admin123');
    console.log('   ID:', result.rows[0].id);
    
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error.message);
  } finally {
    process.exit();
  }
}

createAdminUser();
