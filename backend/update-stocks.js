const pool = require('./db');

// Función para calcular stock total de sizes
const calculateTotalStock = (sizes) => {
  if (!sizes || !Array.isArray(sizes)) return 0;

  return sizes.reduce((total, item) => {
    // Si es estructura con colores (cada item tiene color y sizes)
    if (item.sizes && Array.isArray(item.sizes)) {
      return total + item.sizes.reduce((sizeTotal, size) => sizeTotal + (size.stock || 0), 0);
    }
    // Si es estructura simple (cada item tiene stock directamente)
    else if (typeof item === 'object' && item.stock !== undefined) {
      return total + (item.stock || 0);
    }
    return total;
  }, 0);
};

async function updateStocks() {
  try {
    console.log('Actualizando stocks de productos...');

    // Obtener todos los productos con sizes
    const result = await pool.query('SELECT id, sizes FROM products WHERE sizes IS NOT NULL');

    for (const product of result.rows) {
      let sizes = product.sizes;

      // Parsear si es string
      if (typeof sizes === 'string') {
        try {
          sizes = JSON.parse(sizes);
        } catch (e) {
          console.error(`Error parseando sizes para producto ${product.id}:`, e);
          continue;
        }
      }

      const totalStock = calculateTotalStock(sizes);

      // Actualizar stock
      await pool.query('UPDATE products SET stock = $1 WHERE id = $2', [totalStock, product.id]);

      console.log(`Producto ${product.id}: stock actualizado a ${totalStock}`);
    }

    console.log('Actualización completada');
  } catch (error) {
    console.error('Error actualizando stocks:', error);
  } finally {
    pool.end();
  }
}

updateStocks();