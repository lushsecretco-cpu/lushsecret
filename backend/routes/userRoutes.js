const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
});

// Registrar usuario
router.post('/register', async (req, res) => {
  const { name, email, password, age, city, address } = req.body;
  if (age < 18) {
    return res.status(400).json({ message: 'Debes tener al menos 18 años para registrarte.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, age, city, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
      [name, email, hashedPassword, age, city, address]
    );
    res.status(201).json({ message: 'Usuario registrado', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ message: 'Email ya registrado' });
    } else {
      res.status(500).json({ message: 'Error registrando usuario' });
    }
  }
});

// Login usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error en login' });
  }
});

module.exports = router;
