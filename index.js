import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';


// Routers
import { routes } from './routes/routes.js';
// import {homeRoute} from './routes/homeRoute.js';
const app = express();

const __dirname = path.dirname('./app.js');

app.use('/', routes)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());


app.listen(3000, () => console.log('Runnug on : http://localhost:3000'))