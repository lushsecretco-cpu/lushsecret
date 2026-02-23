// Test de login de administrador
const testAdminLogin = async () => {
  try {
    console.log('🧪 Probando login de admin...\n');
    
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@lushsecret.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login exitoso!');
      console.log('📧 Email:', data.user.email);
      console.log('👤 Nombre:', data.user.name);
      console.log('🔐 Rol:', data.user.role);
      console.log('🎫 Token:', data.token.substring(0, 20) + '...');
      console.log('\n✨ Ahora puedes usar estas credenciales en http://localhost:3000/admin/login');
    } else {
      console.log('❌ Error en login:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n⚠️ Asegúrate de que el backend esté corriendo en el puerto 4000');
  }
};

testAdminLogin();
