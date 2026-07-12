import 'dotenv/config';
import pool from './db.js';

await pool.query(`
    CREATE TABLE IF NOT EXISTS notatki (
        id SERIAL PRIMARY KEY,
        tytul TEXT NOT NULL,
        tresc TEXT NOT NULL
    )
`);

console.log('Tabela utworzona');
pool.end();