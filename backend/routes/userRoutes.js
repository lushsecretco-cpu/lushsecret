const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { sendSMS, sendVerificationSMS, verifyCode } = require('../services/twilioService');
const { authLimiter } = require('../middleware/security');
const { validateUserRegistration, validateUserLogin, validateSMSVerification, handleValidationErrors } = require('../middleware/validation');
const { getSecurityLogs } = require('../middleware/securityLogger');
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
router.post('/register', authLimiter, validateUserRegistration, handleValidationErrors, async (req, res) => {
  const { name, email, password, phone, age, city, address } = req.body;
  if (age < 18) {
    return res.status(400).json({ message: 'Debes tener al menos 18 años para registrarte.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, age, city, address, is_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, role',
      [name, email, hashedPassword, phone, age, city, address, false]
    );

    // Enviar código de verificación usando Twilio Verify
    try {
      await sendVerificationSMS(phone);
      console.log('Código de verificación enviado al teléfono:', phone);
    } catch (smsError) {
      console.error('Error enviando verificación SMS:', smsError.message);
      // No fallar el registro si falla el SMS, pero loggear
    }

    res.status(201).json({ message: 'Usuario registrado. Revisa tu SMS para el código de verificación.', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ message: 'Email ya registrado' });
    } else {
      res.status(500).json({ message: 'Error registrando usuario' });
    }
  }
});

// Verificar código SMS
router.post('/verify', authLimiter, validateSMSVerification, handleValidationErrors, async (req, res) => {
  const { email, code } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }
    const user = result.rows[0];

    // Verificar código usando Twilio Verify
    const isValid = await verifyCode(user.phone, code);

    if (!isValid) {
      return res.status(400).json({ message: 'Código de verificación incorrecto o expirado' });
    }

    await pool.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [user.id]);
    res.json({ message: 'Cuenta verificada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error verificando código' });
  }
});

// Login usuario
router.post('/login', authLimiter, validateUserLogin, handleValidationErrors, async (req, res) => {
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
    if (!user.is_verified) {
      return res.status(400).json({ message: 'Cuenta no verificada. Revisa tu SMS para el código de verificación.' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
    res.json({ message: 'Login exitoso', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error en login' });
  }
});

// Obtener logs de seguridad (solo admin)
router.get('/security-logs', require('../middleware/auth').authenticateToken, require('../middleware/auth').requireAdmin, getSecurityLogs);

module.exports = router;
