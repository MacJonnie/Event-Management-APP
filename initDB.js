// initDB.js
import fs from 'fs';
import pool from './db.js';

const schema = fs.readFileSync('./schema.sql', 'utf8');

pool.query(schema)
  .then(() => {
    console.log('✅ Database tables created successfully.');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error creating tables:', err);
    process.exit(1);
  });
