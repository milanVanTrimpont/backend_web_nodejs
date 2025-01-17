const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db'); // Importeer de databaseverbinding

const app = express();
app.use(bodyParser.json()); // Voor JSON-parsing

app.get('/', (req, res) => 
    {
    res.send('test');
  });


// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));