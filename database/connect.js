import pool from './db.js';

const connectDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ DB connected', res.rows[0].now);
  } catch (err) {
    console.error('❌ DB failed', err);
    process.exit(1);
  }
};

export default connectDB;