import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import bodyParser from 'body-parser';
import path from 'path';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import passport from 'passport';
// Routers
import cookieParser from 'cookie-parser';
import session from 'express-session';
import routes from './routes/routes.js';
import User from './models/user.js';
// import { sightingRoutes } from './routes/sightings.js';
// import {homeRoute} from './routes/homeRoute.js';
const app = express();

mongoose.connect('mongodb://localhost:27017/ufo', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.use(
  session({
    secret: 'littleSecretIsheredudee.',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// Reading and populate Cookies
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// eslint-disable-next-line no-underscore-dangle

const __dirname = path.dirname('./app.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
// app.use(session({ secret: 'Shh, its a secret!' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// // Override POST requests with query param ?_method=PUT to be PUT requests
app.use(methodOverride('__method'));

app.use('/', routes);

app.listen(3000, () => console.log('Runnug on : http://localhost:3000'));
