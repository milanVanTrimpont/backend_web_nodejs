const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); 

const app = express();
app.use(bodyParser.json()); // Voor JSON-parsing

app.get('/', (req, res) => 
    {
    res.send('test');
  });

// alle kleding stukken ophalen uit de db
app.get('/kleding_items', async (req, res) => {
  try 
  {
    const [rows] = await pool.query('SELECT * FROM kleding_items'); 
    res.json(rows);
  } 
  catch (err) 
  {
    console.error('Error fetching kleding items:', err.message);
    res.status(500).send('Error retrieving data from the database');
  }
});

// nieuwe kleren toevoegen
app.post('/kleding_items/toevoegen', async (req, res) => {
    const { titel, content } = req.body; 
    
    try {
      // Voer een INSERT query uit
      const [result] = await pool.query(
        'INSERT INTO kleding_items (titel, content) VALUES (?, ?)',
        [titel, content] 
      );
      
      // bericht of het gelukt is of niet
      res.status(201).json({ 
        message: 'Data succesvol toegevoegd', 
        insertId: result.insertId 
      });
    } catch (err) {
      console.error('Fout bij toevoegen van data:', err);
      res.status(500).send('Er is een fout opgetreden bij het toevoegen van data');
    }
  });

  // kleiding stukken aanpassesn
  app.put('/kleding_items/:id', async (req, res) => {
    const { id } = req.params; 
    const { titel, content } = req.body; 
  
    try {
      // Voer een UPDATE query uit
      const [result] = await pool.query(
        'UPDATE kleding_items SET titel = ?, content = ? WHERE id = ?',
        [titel, content, id] 
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Kleding item niet gevonden' });
      }
  
      res.json({ 
        message: 'kleding item is aangepast',
        affectedRows: result.affectedRows 
      });
    } catch (err) {
      console.error('Fout bij updaten van het kleding item:', err);
      res.status(500).send('Er is een fout opgetreden bij het updaten van data');
    }
  });
  

  // kleiding stukken verwijderen
  app.delete('/kleding_items/verwijderen/:id', async (req, res) => {
    const { id } = req.params; 
    
    try 
    {
        const [result] = await pool.query(
        'DELETE FROM kleding_items  WHERE id = ?;',
        [id] 
    );
  
    if (result.affectedRows === 0) 
    {
        return res.status(404).json({ message: 'Kleding item niet gevonden' });
    }
  
    res.json
    ({ 
        message: 'kleding item is verwijderd',
        affectedRows: result.affectedRows 
    });
    } 
    catch (err) 
    {
        console.error('Fout bij updaten van het kleding item:', err);
        res.status(500).send('Er is een fout opgetreden bij het updaten van data');
    }
  });


// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));