import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import db from './config/db';
import routes from './routes';

const app: Application = express();
const port = 3002;

//Connection DB
db.connect();

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Route
routes(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
