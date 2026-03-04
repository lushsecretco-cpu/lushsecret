const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./db');

// Obtener token válido del admin
async function getAdminToken() {
  try {
    // Obtener usuario admin de la base de datos
    const result = await pool.query(
      "SELECT * FROM users WHERE email = 'admin@lushsecret.co'"
    );

    if (result.rows.length === 0) {
      console.log('❌ Usuario admin no encontrado');
      return;
    }

    const admin = result.rows[0];
    console.log('✅ Usuario admin encontrado:', admin.email);

    // Verificar contraseña
    const isValid = await bcrypt.compare('admin123', admin.password);

    if (!isValid) {
      console.log('❌ Contraseña incorrecta');
      return;
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      'secretkey',
      { expiresIn: '1h' }
    );

    console.log('✅ Token generado correctamente');
    return token;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Probar API de seguridad
async function testSecurityAPI() {
  const token = await getAdminToken();

  if (!token) return;

  const fetch = require('node-fetch');
  const response = await fetch('http://localhost:4000/api/auth/security-logs', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
}

testSecurityAPI();