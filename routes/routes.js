import express from 'express';
import validate from 'express-validator';
import methodOverride from 'method-override';
import {
  home,
  sightingForm,
  singleSighting,
  editSingleSighting,
  showShape,
  showOneShape,
  putEditSighting,
}
  from '../controllers/appController.js';

// const validateUseInput = (req, res, next) => [
//   validate.check('text').isLength({ min: 10 }).withMessage('Cannot be empty'),
//   validate.check('city').isLength({ min: 10 }).withMessage('Connort'),
//   // validate.check('state'.isLength({ min: 10 })),
//   // validate.check('shape'.isLength({ min: 10 })),
//   // validate.check('duration'.isLength({ min: 10 })),
//   // validate.check('date'.isLength({ min: 10 })),
//   // validate.check('summary'.isLength({ min: 10 })),
// ];

const routes = express.Router();
routes.use(methodOverride('__method'));
routes.get('/', home);
routes.get('/sighting', sightingForm);
routes.get('/sighting/:index', (singleSighting));
routes.get('/sighting/:index/edit', (editSingleSighting));
routes.put('/sighting/:index',
  validate.check('text').isLength({ min: 10 }).withMessage('Share some details?'),
  validate.check('city').isLength({ min: 1 }).withMessage('Where did it happened?'),
  validate.check('state').isLength({ min: 1 }).withMessage('Where did it happened?'),
  validate.check('shape').isLength({ min: 1 }).withMessage('Shape of the object?'),
  validate.check('duration').isLength({ min: 1 }).withMessage('Tell us what ⏳ this happened?'),
  validate.check('date_time').isLength({ min: 1 }).withMessage('Don\'t Forget 📅'),
  validate.check('summary').isLength({ min: 1 }).withMessage('Leave a summary 📃'),
  putEditSighting);
routes.get('/shapes', showShape);
routes.get('/shapes/:shape', showOneShape);

export default routes;
