const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validaciones para creación de pedidos
const validateOrderCreation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Los items son requeridos y deben ser un arreglo'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('El ID del producto debe ser un número entero positivo'),
  body('items.*.product_name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('El nombre del producto debe ser una cadena válida'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero positivo'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('total')
    .isFloat({ min: 0 })
    .withMessage('El total debe ser un número positivo'),
  body('payment_method')
    .optional()
    .isIn(['bold', 'transferencia', 'efectivo', 'mercadopago'])
    .withMessage('Método de pago inválido'),
  body('session_id')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Session ID inválido')
];

// Validaciones para pedidos sin registro (con información del cliente)
const validateGuestOrderCreation = [
  ...validateOrderCreation,
  body('customer_info.nombre')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre es requerido y debe tener entre 2 y 100 caracteres'),
  body('customer_info.apellidos')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Los apellidos son requeridos'),
  body('customer_info.cedula')
    .isString()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('La cédula es requerida'),
  body('customer_info.telefono')
    .isString()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('El teléfono debe tener un formato válido'),
  body('customer_info.correo')
    .isEmail()
    .normalizeEmail()
    .withMessage('El correo debe tener un formato válido'),
  body('customer_info.direccion')
    .isString()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('La dirección es requerida y debe tener al menos 5 caracteres'),
  body('customer_info.ciudad')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad es requerida'),
  body('customer_info.nombreRecibe')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de quien recibe debe tener entre 2 y 100 caracteres'),
  body('customer_info.observaciones')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres')
];

// Validaciones para dirección de envío en pedidos de usuarios registrados
const validateShippingAddress = [
  body('shipping_address.nombre')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('shipping_address.direccion')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La dirección debe tener entre 10 y 500 caracteres'),
  body('shipping_address.ciudad')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres'),
  body('shipping_address.telefono')
    .optional()
    .isString()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('El teléfono debe tener un formato válido')
];

// Validaciones para registro de usuarios
const validateUserRegistration = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('El correo debe tener un formato válido'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'),
  body('phone')
    .isString()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('El teléfono debe tener un formato válido'),
  body('age')
    .isInt({ min: 18, max: 120 })
    .withMessage('La edad debe ser un número entre 18 y 120 años'),
  body('city')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres'),
  body('address')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La dirección debe tener entre 10 y 500 caracteres')
];

// Validaciones para login
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('El correo debe tener un formato válido'),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// Validaciones para verificación de SMS
const validateSMSVerification = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('El correo debe tener un formato válido'),
  body('verificationCode')
    .isString()
    .isLength({ min: 6, max: 6 })
    .matches(/^\d{6}$/)
    .withMessage('El código de verificación debe ser 6 dígitos')
];

// Validaciones para actualización de perfil
const validateProfileUpdate = [
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('phone')
    .optional()
    .isString()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]+$/)
    .withMessage('El teléfono debe tener un formato válido'),
  body('address')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La dirección debe tener entre 10 y 500 caracteres')
];

module.exports = {
  validateOrderCreation,
  validateGuestOrderCreation,
  validateShippingAddress,
  validateUserRegistration,
  validateUserLogin,
  validateSMSVerification,
  validateProfileUpdate,
  handleValidationErrors
};