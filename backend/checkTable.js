const pool = require('./db');

async function verificarEstructura() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Verificando estructura de la tabla orders...\n');
    
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position;
    `);

    console.log('Columnas en la tabla orders:');
    console.log('─'.repeat(60));
    result.rows.forEach(col => {
      console.log(`${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${col.is_nullable}`);
    });
    console.log('─'.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    process.exit(0);
  }
}

verificarEstructura();
