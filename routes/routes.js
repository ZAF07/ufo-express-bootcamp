import express from 'express';
import methodOverride from 'method-override';
import {
  home,
  sightingForm,
  singleSighting,
  editSingleSighting,
  showShape,
  showOneShape,
  editSighting,
}
  from '../controllers/appController.js';

export const routes = express.Router();
routes.use(methodOverride('__method'));
routes.get('/', home);
routes.get('/sighting', sightingForm);
routes.get('/sighting/:index', (singleSighting));
routes.get('/sighting/:index/edit', (editSingleSighting));
routes.put('/sighting/:index', editSighting);
routes.get('/shapes', showShape);
routes.get('/shapes/:shape', showOneShape);

// export {routes}
