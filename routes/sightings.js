import express from 'express';
import methodOverride from 'method-override';
import {
  home, 
  sightingForm, 
  singleSighting, 
  editSingleSighting, 
  editSighting
} from '../controllers/appController.js';





const sightingRoutes = express.Router();
sightingRoutes.use(methodOverride('__method'));
sightingRoutes.get('/sighting', sightingForm)
sightingRoutes.get('/sighting/:index', (singleSighting))
sightingRoutes.get('/sighting/:index/edit', (editSingleSighting))
sightingRoutes.put('/sighting/:index/edit', editSighting)



export {sightingRoutes}