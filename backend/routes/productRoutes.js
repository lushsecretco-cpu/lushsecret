const express = require('express');
const pool = require('../db');
const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo productos:', err);
    res.status(500).json({ message: 'Error obteniendo productos', error: err.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error obteniendo producto:', err);
    res.status(500).json({ message: 'Error obteniendo producto' });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  const { name, description, price, cost_price, image, category, sizes, stock, video } = req.body;
  const finalSizes = category === 'linea-intima' ? JSON.stringify(sizes) : null;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, cost_price, image, category, sizes, stock, video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, description, price, cost_price || 0, image, category, finalSizes, stock, video]
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
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, cost_price = $4, image = $5, category = $6, sizes = $7, stock = $8, video = $9 WHERE id = $10 RETURNING *',
      [name, description, price, cost_price || 0, image, category, finalSizes, stock, video, id]
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

// Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

module.exports = router;
