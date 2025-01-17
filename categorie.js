const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); 

const app = express();
app.use(bodyParser.json()); // Voor JSON-parsing

app.get('/', (req, res) => 
    {
    res.send('test categorieën');
  });

// alle kleding stukken ophalen uit de db
app.get('/categorie', async (req, res) => {
  try 
  {
    const [rows] = await pool.query('SELECT * FROM categorieën'); 
    res.json(rows);
  } 
  catch (err) 
  {
    console.error('Error fetching kleding items:', err.message);
    res.status(500).send('Error retrieving data from the database');
  }
});

// specifiek kledingstuk ophalen
app.get('/categorie/:id', async (req, res) => {
    const { id } = req.params; 
    try 
    {
      const [rows] = await pool.query('SELECT * FROM categorieën WHERE id = ?', [id]); 
      res.json(rows);
      
    } 
    catch (err) 
    {
      console.error('Error fetching kleding items:', err.message);
      res.status(500).send('Error retrieving data from the database');
    }
  });

// nieuwe kleren toevoegen
app.post('/categorie/toevoegen', async (req, res) => {
    const { naam } = req.body; 
    
    try {
      // Voer een INSERT query uit
      const [result] = await pool.query(
        'INSERT INTO categorieën (naam) VALUES (?)',
        [naam] 
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
  app.put('/categorie/aanpassen/:id', async (req, res) => {
    const { id } = req.params; 
    const { naam } = req.body; 
  
    try {
      // Voer een UPDATE query uit
      const [result] = await pool.query(
        'UPDATE categorieën SET naam = ? WHERE id = ?',
        [naam, id] 
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'categorie niet gevonden' });
      }
  
      res.json({ 
        message: 'categorie is aangepast',
        affectedRows: result.affectedRows 
      });
    } catch (err) {
      console.error('Fout bij updaten van de categorie:', err);
      res.status(500).send('Er is een fout opgetreden bij het updaten van data');
    }
  });
  

  // kleiding stukken verwijderen
  app.delete('/categorie/verwijderen/:id', async (req, res) => {
    const { id } = req.params; 
    
    try 
    {
        const [result] = await pool.query(
        'DELETE FROM categorieën  WHERE id = ?;',
        [id] 
    );
  
    if (result.affectedRows === 0) 
    {
        return res.status(404).json({ message: 'categorie niet gevonden' });
    }
  
    res.json
    ({ 
        message: 'categorie is verwijderd',
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