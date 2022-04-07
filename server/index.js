const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/status', (request, response) => response.json({ clients: clients.length }));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`);
});

app.use('/api', require('./api'));

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, '/index.html'));
// });

app.use(express.static(__dirname + '/public'));
