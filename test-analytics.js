// Test rápido para verificar que las rutas de analytics funcionan
const testAnalytics = async () => {
  try {
    console.log('🧪 Probando ruta POST /api/analytics/track...');
    
    const response = await fetch('http://localhost:4000/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'test',
        user_ip: '127.0.0.1',
        user_agent: 'Test Agent',
        session_id: 'test-session-123',
        page_url: 'http://localhost:3000/test',
        metadata: { test: true }
      })
    });
    
    const data = await response.json();
    console.log('✅ Respuesta:', data);
    
    if (response.ok) {
      console.log('✅ Ruta /track funciona correctamente!');
    } else {
      console.log('❌ Error en ruta /track:', response.status);
    }
    
    // Probar ruta GET /dashboard
    console.log('\n🧪 Probando ruta GET /api/analytics/dashboard...');
    const dashboardResponse = await fetch('http://localhost:4000/api/analytics/dashboard?days=7');
    const dashboardData = await dashboardResponse.json();
    
    if (dashboardResponse.ok) {
      console.log('✅ Ruta /dashboard funciona correctamente!');
      console.log('📊 Total de visitas:', dashboardData.totalViews);
    } else {
      console.log('❌ Error en ruta /dashboard:', dashboardResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Error al probar analytics:', error.message);
  }
};

// Ejecutar test
testAnalytics();
