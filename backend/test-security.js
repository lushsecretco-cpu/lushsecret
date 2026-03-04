const fetch = require('node-fetch');

async function testSecurityEndpoint() {
  try {
    console.log('Testing security endpoint...');

    // Simular un request sin token (debería fallar)
    const response = await fetch('http://localhost:4000/api/auth/security-logs');
    console.log('Response status:', response.status);

    if (response.status === 401) {
      console.log('✅ Endpoint correctamente protegido - requiere autenticación');
    } else {
      console.log('❌ Endpoint no está protegido correctamente');
    }

  } catch (error) {
    console.log('❌ Error conectando al servidor:', error.message);
    console.log('Asegúrate de que el servidor esté corriendo en el puerto 4000');
  }
}

testSecurityEndpoint();