import Database from "better-sqlite3";

const db = new Database ("baza.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS notatki (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tytul TEXT,
        tresc TEXT
    )
`);

export default db;