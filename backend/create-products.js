const pool = require('./db');

async function createSampleProducts() {
  try {
    const products = [
      {
        name: 'Lencería Roja Seductora',
        description: 'Conjunto de lencería roja con encaje delicado, perfecto para ocasiones especiales.',
        price: 45000,
        cost_price: 25000,
        image: '/images/prod1.jpg',
        category: 'linea-intima',
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 15,
        video: null
      },
      {
        name: 'Vibrador Inteligente',
        description: 'Vibrador con control remoto vía app, múltiples modos de vibración.',
        price: 120000,
        cost_price: 70000,
        image: '/images/prod2.jpg',
        category: 'smart-pleasure',
        sizes: null,
        stock: 8,
        video: '/videos/vibrador-demo.mp4'
      },
      {
        name: 'Lubricante a Base de Agua',
        description: 'Lubricante hipoalergénico, compatible con juguetes y preservativos.',
        price: 25000,
        cost_price: 12000,
        image: '/images/prod3.jpg',
        category: 'lub-care',
        sizes: null,
        stock: 25,
        video: null
      },
      {
        name: 'Juguete de Succión Clitoriana',
        description: 'Dispositivo de succión con múltiples intensidades para placer femenino.',
        price: 85000,
        cost_price: 50000,
        image: '/images/pub1.jpg',
        category: 'power-up',
        sizes: null,
        stock: 12,
        video: null
      },
      {
        name: 'Arnés de Cuero para Juegos',
        description: 'Arnés ajustable de cuero premium para juegos de rol y bondage.',
        price: 95000,
        cost_price: 55000,
        image: '/images/pub2.jpg',
        category: 'zona-fetish',
        sizes: ['S/M', 'L/XL'],
        stock: 6,
        video: null
      },
      {
        name: 'Corsé Negro con Encaje',
        description: 'Corsé negro con detalles en encaje, ideal para realzar la figura.',
        price: 55000,
        cost_price: 30000,
        image: '/images/pub3.jpg',
        category: 'linea-intima',
        sizes: ['32B', '34C', '36D', '38DD'],
        stock: 10,
        video: null
      }
    ];

    for (const product of products) {
      // Verificar si el producto ya existe
      const checkProduct = await pool.query(
        'SELECT * FROM products WHERE name = $1',
        [product.name]
      );

      if (checkProduct.rows.length > 0) {
        console.log(`⚠️  Producto "${product.name}" ya existe, saltando...`);
        continue;
      }

      // Insertar producto
      const result = await pool.query(
        `INSERT INTO products (name, description, price, cost_price, image, category, sizes, stock, video)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, name, category`,
        [
          product.name,
          product.description,
          product.price,
          product.cost_price,
          product.image,
          product.category,
          product.sizes ? JSON.stringify(product.sizes) : null,
          product.stock,
          product.video
        ]
      );

      console.log(`✅ Producto creado: ${result.rows[0].name} (ID: ${result.rows[0].id}, Categoría: ${result.rows[0].category})`);
    }

    console.log('\n🎉 Productos de ejemplo creados exitosamente!');
    console.log('Puedes verlos en: http://localhost:3000 (después de iniciar el frontend)');

  } catch (error) {
    console.error('❌ Error al crear productos:', error.message);
  } finally {
    process.exit();
  }
}

createSampleProducts();