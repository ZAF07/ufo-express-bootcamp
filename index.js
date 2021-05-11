import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import methodOverride from 'method-override';



// Routers
import { routes } from './routes/routes.js';
// import { sightingRoutes } from './routes/sightings.js';
// import {homeRoute} from './routes/homeRoute.js';
const app = express();



const __dirname = path.dirname('./app.js');
// // Override POST requests with query param ?_method=PUT to be PUT requests


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(methodOverride('__method'));


// app.use('/sighting', sightingRoutes)
app.use('/', routes)


app.listen(3000, () => console.log('Runnug on : http://localhost:3000'))