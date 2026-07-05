import 'dotenv/config';
import express from 'express';
import db from './baza.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/',function(req, res) {
    res.send('Serwer działa');
});

app.get('/notatki',function(req, res) {
    const notatki = db.prepare('SELECT * FROM notatki').all();
    res.json(notatki);
});

app.post('/notatki',function(req,res) {
    const {tytul, tresc} = req.body;

    if (!tytul || !tresc) {
        return res.status(400).json({ blad: 'brakuje danych - podaj tytul i tresc'});
    }
    db.prepare('INSERT INTO notatki (tytul, tresc) VALUES (?, ?)').run(tytul, tresc);
    res.json({tytul, tresc});
    
});

app.delete('/notatki/:id',function(req,res) {
    const id = Number(req.params.id);

    const wynik = db.prepare('DELETE FROM notatki WHERE id = ?').run(id);


    if(wynik.changes === 0) {
        return res.status(404).json({
            blad: "nie znaleziono notatki z tym id"
        });
    }

    res.json({
        message: "notatka usunieta"
    });
});

app.patch('/notatki/:id', function(req, res) {
    const id = Number(req.params.id);
    const { tytul, tresc } = req.body;

    if (!tytul && !tresc) {
        return res.status(400).json({ blad: 'Podaj tytul lub tresc do zmiany' });
    }

    const notatka = db.prepare('SELECT * FROM notatki WHERE id = ?').get(id);

    if (!notatka) {
        return res.status(404).json({ blad: 'Nie znaleziono notatki' });
    }

    const nowyTytul = tytul || notatka.tytul;
    const nowaTresc = tresc || notatka.tresc;

    db.prepare('UPDATE notatki SET tytul = ?, tresc = ? WHERE id = ?').run(nowyTytul, nowaTresc, id);

    res.json({ message: 'Notatka zaktualizowana' });
});

app.listen(PORT, function(){
    console.log(`Serwer dziala na https://localhost:${PORT}`);
});