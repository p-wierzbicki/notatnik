import 'dotenv/config';
import express from 'express';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', function(req, res) {
    res.send('Serwer działa');
});

app.get('/notatki', async function(req, res) {
    const wynik = await pool.query('SELECT * FROM notatki');
    res.json(wynik.rows);
});

app.post('/notatki', async function(req, res) {
    const { tytul, tresc } = req.body;

    if (!tytul || !tresc) {
        return res.status(400).json({ blad: 'brakuje danych - podaj tytul i tresc' });
    }

    const wynik = await pool.query(
        'INSERT INTO notatki (tytul, tresc) VALUES ($1, $2) RETURNING *',
        [tytul, tresc]
    );

    res.json(wynik.rows[0]);
});

app.delete('/notatki/:id', async function(req, res) {
    const id = Number(req.params.id);

    const wynik = await pool.query('DELETE FROM notatki WHERE id = $1 RETURNING *', [id]);

    if (wynik.rows.length === 0) {
        return res.status(404).json({ blad: 'Nie znaleziono notatki' });
    }

    res.json({ message: 'Notatka usunieta' });
});

app.patch('/notatki/:id', async function(req, res) {
    const id = Number(req.params.id);
    const { tytul, tresc } = req.body;

    if (!tytul && !tresc) {
        return res.status(400).json({ blad: 'Podaj tytul lub tresc do zmiany' });
    }

    const notatka = await pool.query('SELECT * FROM notatki WHERE id = $1', [id]);

    if (notatka.rows.length === 0) {
        return res.status(404).json({ blad: 'Nie znaleziono notatki' });
    }

    const nowyTytul = tytul || notatka.rows[0].tytul;
    const nowaTresc = tresc || notatka.rows[0].tresc;

    await pool.query(
        'UPDATE notatki SET tytul = $1, tresc = $2 WHERE id = $3',
        [nowyTytul, nowaTresc, id]
    );

    res.json({ message: 'Notatka zaktualizowana' });
});

app.listen(PORT, function() {
    console.log(`Serwer dziala na http://localhost:${PORT}`);
});