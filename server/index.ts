import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import api from './src/api/index';

const app = express();
const port = 3000;

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

app.use('/api', api);

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Application is running on port ${port}.`);
});
