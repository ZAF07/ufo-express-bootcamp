


import express from 'express';
import {
  home, 
  sightingForm, 
  singleSighting, 
  editSingleSighting, 
  showShape, 
  showOneShape} 
  from '../controllers/appController.js';


const routes = express.Router();
routes.get('/', home)
routes.get('/sighting', sightingForm)
routes.get('/sighting/:index', (singleSighting))
routes.get('/sighting/:index/edit', (editSingleSighting))
routes.get('/shapes', showShape)
routes.get('/shapes/:shape', showOneShape)

export {routes}