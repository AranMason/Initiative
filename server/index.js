const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  sessions({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  }),
);
app.use(cookieParser());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`);
});

app.use('/api', require('./api'));

app.use(express.static(__dirname + '/public'));
