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

 

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));