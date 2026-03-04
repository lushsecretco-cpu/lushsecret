const pool = require('./db');

async function runMigration() {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(10);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
    `);
    console.log('✅ Migración completada: campos agregados a users');
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
  } finally {
    process.exit();
  }
}

runMigration();