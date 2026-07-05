import 'dotenv/config';
import express from 'express';
import db from './baza.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', function(req, res) {
    res.send('Serwer działa');
});

app.get('/notatki', function(req, res) {
    res.json(db.data.notatki);
});

app.post('/notatki', async function(req, res) {
    const { tytul, tresc } = req.body;

    if (!tytul || !tresc) {
        return res.status(400).json({ blad: 'brakuje danych - podaj tytul i tresc' });
    }

    const notatka = { id: db.data.nextId, tytul, tresc };
    db.data.notatki.push(notatka);
    db.data.nextId++;
    await db.write();

    res.json(notatka);
});

app.delete('/notatki/:id', async function(req, res) {
    const id = Number(req.params.id);
    const index = db.data.notatki.findIndex(n => n.id === id);

    if (index === -1) {
        return res.status(404).json({ blad: 'Nie znaleziono notatki' });
    }

    db.data.notatki.splice(index, 1);
    await db.write();

    res.json({ message: 'Notatka usunieta' });
});

app.patch('/notatki/:id', async function(req, res) {
    const id = Number(req.params.id);
    const { tytul, tresc } = req.body;

    if (!tytul && !tresc) {
        return res.status(400).json({ blad: 'Podaj tytul lub tresc do zmiany' });
    }

    const notatka = db.data.notatki.find(n => n.id === id);

    if (!notatka) {
        return res.status(404).json({ blad: 'Nie znaleziono notatki' });
    }

    if (tytul) notatka.tytul = tytul;
    if (tresc) notatka.tresc = tresc;
    await db.write();

    res.json({ message: 'Notatka zaktualizowana' });
});

app.listen(PORT, function() {
    console.log(`Serwer dziala na http://localhost:${PORT}`);
});