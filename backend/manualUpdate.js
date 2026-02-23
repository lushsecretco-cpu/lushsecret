// Script para ejecutar manualmente la actualización de tracking
// Útil para testing sin esperar las 4 horas del cron

const { actualizarEstadosAutomaticamente } = require('./services/trackingAutoUpdater');

console.log('🚀 Ejecutando actualización manual de tracking...\n');

actualizarEstadosAutomaticamente()
  .then(() => {
    console.log('\n✅ Actualización completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en actualización:', error);
    process.exit(1);
  });
