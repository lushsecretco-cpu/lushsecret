const express = require('express');
const pool = require('../db');
const router = express.Router();

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

// Obtener todos los productos
router.get('/', async (req, res) => {
  const includeInactive = req.query.includeInactive === 'true';
  try {
    const query = includeInactive
      ? 'SELECT * FROM products ORDER BY id'
      : 'SELECT * FROM products WHERE is_active = true ORDER BY id';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    // Si la columna is_active no existe, caemos a la versión antigua (sin filtro)
    if (err.message && err.message.includes('column "is_active" does not exist')) {
      try {
        const result = await pool.query('SELECT * FROM products ORDER BY id');
        return res.json(result.rows);
      } catch (innerErr) {
        console.error('Error obteniendo productos (fallback):', innerErr);
        return res.status(500).json({ message: 'Error obteniendo productos', error: innerErr.message });
      }
    }

    console.error('Error obteniendo productos:', err);
    res.status(500).json({ message: 'Error obteniendo productos', error: err.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const includeInactive = req.query.includeInactive === 'true';
  try {
    const query = includeInactive
      ? 'SELECT * FROM products WHERE id = $1'
      : 'SELECT * FROM products WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    // Si la columna is_active no existe, caemos a la versión antigua (sin filtro)
    if (err.message && err.message.includes('column "is_active" does not exist')) {
      try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.json(result.rows[0]);
      } catch (innerErr) {
        console.error('Error obteniendo producto (fallback):', innerErr);
        return res.status(500).json({ message: 'Error obteniendo producto', error: innerErr.message });
      }
    }

    console.error('Error obteniendo producto:', err);
    res.status(500).json({ message: 'Error obteniendo producto', error: err.message });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  const { name, description, price, cost_price, image, category, sizes, stock, video } = req.body;
  const finalSizes = category === 'linea-intima' ? JSON.stringify(sizes) : null;
  
  // Calcular stock total si tiene sizes
  const totalStock = category === 'linea-intima' && sizes ? calculateTotalStock(sizes) : (stock || 0);
  
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, cost_price, image, category, sizes, stock, video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, description, price, cost_price || 0, image, category, finalSizes, totalStock, video]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creando producto:', err);
    res.status(500).json({ message: 'Error creando producto' });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, cost_price, image, category, sizes, stock, video } = req.body;
  const finalSizes = category === 'linea-intima' ? JSON.stringify(sizes) : null;
  
  // Calcular stock total si tiene sizes
  const totalStock = category === 'linea-intima' && sizes ? calculateTotalStock(sizes) : (stock || 0);
  
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, cost_price = $4, image = $5, category = $6, sizes = $7, stock = $8, video = $9 WHERE id = $10 RETURNING *',
      [name, description, price, cost_price || 0, image, category, finalSizes, totalStock, video, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error actualizando producto:', err);
    res.status(500).json({ message: 'Error actualizando producto' });
  }
});

// Reactivar producto (soft delete)
router.put('/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE products SET is_active = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto reactivado', product: result.rows[0] });
  } catch (err) {
    console.error('Error reactivando producto:', err);
    res.status(500).json({ message: 'Error reactivando producto', error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Marcar producto como inactivo en lugar de eliminarlo, para conservar historial de pedidos
    const result = await client.query('UPDATE products SET is_active = false WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Producto desactivado' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error eliminando producto:', err);
    res.status(500).json({ message: 'Error eliminando producto', error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
