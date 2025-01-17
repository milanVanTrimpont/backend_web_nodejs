const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); 

const app = express();
app.use(bodyParser.json()); // Voor JSON-parsing

app.get('/', (req, res) => 
    {
    res.send('test');
  });

// alle gebruikers ophalen uit de db
app.get('/users', async (req, res) => {
  try 
  {
    const [rows] = await pool.query('SELECT * FROM users'); 
    res.json(rows);
  } 
  catch (err) 
  {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Error retrieving data from the database');
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));