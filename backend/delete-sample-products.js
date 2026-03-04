const pool = require('./db');

async function deleteSampleProducts() {
  try {
    const productNames = [
      'Lencería Roja Seductora',
      'Vibrador Inteligente',
      'Lubricante a Base de Agua',
      'Juguete de Succión Clitoriana',
      'Arnés de Cuero para Juegos',
      'Corsé Negro con Encaje'
    ];

    for (const name of productNames) {
      const result = await pool.query(
        'DELETE FROM products WHERE name = $1 RETURNING id, name',
        [name]
      );

      if (result.rows.length > 0) {
        console.log(`🗑️  Producto eliminado: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
      } else {
        console.log(`⚠️  Producto "${name}" no encontrado`);
      }
    }

    console.log('\n✅ Productos de ejemplo eliminados exitosamente!');

  } catch (error) {
    console.error('❌ Error al eliminar productos:', error.message);
  } finally {
    process.exit();
  }
}

deleteSampleProducts();