import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import db from './config/db';
import routes from './routes';

const app: Application = express();
const port = 3002;

//Connection DB
db.connect();

//Middleware
app.use(
    cors({
        origin: [
            'http://localhost:5173',
            'https://fe-converse.onrender.com',
            'https://nhom4-ud27-12.onrender.com',
        ],

        credentials: true,
    }),
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route
routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
