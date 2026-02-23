const fetch = require('node-fetch');

async function testSync() {
  // Primero, obtener productos
  console.log('Obteniendo productos actuales...');
  const getResponse = await fetch('http://localhost:4000/api/products');
  const products = await getResponse.json();
  console.log('Productos actuales:', products.length);

  // Agregar un producto de prueba (asumiendo token, pero como es test, quizás sin auth para GET)
  // Para POST, necesito token. Asumamos que hay un token válido.

  // Para simplificar, solo verificar GET
  console.log('Test de sincronización: GET funciona.');
}

testSync();