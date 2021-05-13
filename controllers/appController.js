import validate from 'express-validator';
import {
  read, edit, add, del,
} from '../jsonFileStorage.js';

const { validationResult } = validate;
// const { body, validationResult } = validateBody;
// // const validateUserInput = () => {
// //   body('description').isLength({ min: 10 });
// // };

const home = (req, res) => {
  // Read into DB and retrieve all sightings
  read('./data.json', (err, data) => {
    let dataRecieved;
    if (err) {
      console.log(`ERROR READING IN HOME CONTROLLER ${err}`);
    } else {
      console.log('here is dsat ++#+#)$ ', req.body);
      console.log(`DATA RECIEVED FROM READ FN -> ${data.sightings}`);
      dataRecieved = data.sightings;
      console.log(dataRecieved);
    }
    res.render('home', {
      title: 'Home',
      content: dataRecieved,
      index: 0,
    });
  });
};
const sightingForm = (req, res) => {
  res.render('sightingForm', {
    title: 'New Sighting',
  });
};
const singleSighting = (req, res) => {
  const { index } = req.params;
  console.log(req.params);

  read('./data.json', (err, data) => {
    if (err) {
      console.log(`ERROR READING FROM SINGLESIGHTING -<  ${err}`);
    } else {
      const { sightings } = data;
      const singleSighting = sightings[index];
      console.log(`THIS IS IT -> ${sightings[0]}`);
      res.render('singleSighting', {
        title: 'Single Sighting',
        index,
        singleSighting,

      });
    }
  });
};
const editSingleSighting = (req, res) => {
  const { index } = req.params;

  // Read into DB and retrieve unique info
  read('./data.json', (err, data) => {
    if (err) {
      console.log(`ERROR READING FROM EDITSINGLESIGHTING ${err}`);
    } else {
      const { sightings } = data;
      const sightingBeingEdited = sightings[index];
      // eslint-disable-next-line camelcase
      const { date_time, state, summary } = sightingBeingEdited;
      res.render('editSighting', {
        title: 'Edit Sighting',
        date_time,
        state,
        summary,
        index,
      });
    }
  });
};
const deleteSingleSighting = (req, res) => {
  const { index } = req.params;
  del('./data.json', 'sightings', 0, (err, response) => {
    if (!err) {
      console.log(`THIS IS DELETESIGFHTING -- . ${response}`);
      res.status(300).redirect('/');
      return;
    }
    res.json(err);
  });
};
const showShape = (req, res) => {
  // Read into DB and retrieve all sightings
  read('./data.json', (err, data) => {
    const finalObjsToRespondWith = [];

    // store unique shapes values
    const uniqueShapes = new Set([]);
    if (err) {
      console.log(`ERROR READING IN HOME CONTROLLER ${err}`);
    } else {
      console.log(`DATA RECIEVED FROM READ FN ShowShape -> ${data.sightings}`);
      const shapesRecieved = [];
      const { sightings } = data;

      sightings.forEach((sighting, i) => {
        uniqueShapes.add(sighting.shape);
        const singleShapeObj = {
          i,
          ...sighting,
        };

        shapesRecieved.push(singleShapeObj);

        console.log(`SHAPES ${shapesRecieved}`);
      });

      // now check for repeated values
      shapesRecieved.forEach((shape) => {
        if (!uniqueShapes.has(shape.shape)) {
          finalObjsToRespondWith.push(shape);
        }
      });

      console.log(`THIS IS FINAL ${finalObjsToRespondWith}`);
      // Render EJS with shapes as variables
      res.render('shapes', {
        title: 'Shapes Reported',
        header: 'All  Reported Shapes',
        shapesRecieved,

      });
    }
  });
};
const showOneShape = (req, res) => {
  // retrieve requested shape from query param
  const shapeRequested = req.params.shape;

  // Read from DB and retrieve specific shape
  read('./data.json', (err, data) => {
    // store returned data
    const { sightings } = data;
    const shapesToSend = [];
    let index;

    // loop returned data and pick similar shapes
    sightings.forEach((sighting, i) => {
      if (sighting.shape === shapeRequested) {
        const shapeObj = {
          ...sighting,
          index: i,
        };
        shapesToSend.push(shapeObj);
      }
    });
    res.render('singleShape', {
      title: 'Single Shape',
      shapesToSend,
      index,
      shapeRequested,
    });
  });
};
const putEditSighting = (req, res) => {
  console.log(req.body.description);
  // Get the index position of current article via query params  (index)
  const { index } = req.params;
  console.log(req.body);
  // const { created_at } = req.body;
  // console.log(`${index} at : ${created_at}`);
  // collect all form data
  const {
    // eslint-disable-next-line camelcase
    text, date_time, city, state, shape, duration, summary, created_at,
  } = req.body;
  // const editedSummary = req.body.summary;
  // const editedState = req.body.state;
  // Store in object to replace existing object in DB
  const editedData = {
    text,
    date_time,
    city,
    state,
    shape,
    duration,
    summary,
    created_at,
  };

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(`ERROROROR VALIDATION =--------> ${errors.array()}`);
    // Read into DB and retrieve unique info
    read('./data.json', (err, data) => {
      if (err) {
        console.log(`ERROR READING FROM EDITSINGLESIGHTING ${err}`);
      } else {
        // const { sightings } = data;
        // const sightingBeingEdited = sightings[index];
        // const { date_time, state, summary } = sightingBeingEdited;

        const messagesToRespondWith = [];
        // Store err msg here
        const errorsArray = errors.array();
        errorsArray.forEach((errorObj) => {
          // Retrieve neccessary values and push to array to pass to client
          const { param, msg } = errorObj;
          const errObj = {
            param,
            msg,
          };
          messagesToRespondWith.push(errObj);
        });
        console.log(messagesToRespondWith);
        res.status(400).render('editSighting', {
          title: 'Edit Sighting',
          // editedDateTime,
          summary,
          date_time,
          index,
          b: messagesToRespondWith,
          // text,
          // city,
          // shape,
          // duration,
          editedData: { ...editedData },
        });
      }
    });

    return;
  }

  edit('./data.json', index, editedData, (err, respond) => {
    if (err) {
      console.log(`ERROR EDITING IN APPCONTROLLER ${err}`);
      return;
    }
    console.log(`SUCCESS ${respond}`);
    res.status(200).redirect('/');
  });
};
const postSighting = (req, res) => {
  // retrieve user input
  const {
    // eslint-disable-next-line camelcase
    text, city, state, shape, duration, date_time, summary,
  } = req.body;

  // // convert to capital
  // const toCapitalString = state.charAt(0).toUpperCase().slice(1);

  // New sighting object to push to DB
  const newSighting = {
    text,
    city,
    state: state.charAt(0).toUpperCase().slice(1),
    shape,
    duration,
    date_time,
    summary,
  };

  // Validate user input
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(`ERROROROR VALIDATION =--------> ${errors.array()}`);
    // Read into DB and retrieve unique info
    read('./data.json', (err, data) => {
      if (err) {
        console.log(`ERROR READING FROM EDITSINGLESIGHTING ${err}`);
      } else {
        const messagesToRespondWith = [];
        // Store err msg here
        const errorsArray = errors.array();
        errorsArray.forEach((errorObj) => {
          // Retrieve neccessary error values and push to array to pass to client
          const { param, msg } = errorObj;
          const errObj = {
            param,
            msg,
          };
          messagesToRespondWith.push(errObj);
        });
        console.log(`FROM POSTSIGHTING ${messagesToRespondWith}`);

        res.status(400).render('errorFormNewSighting', {
          title: 'New Sighting',
          errorMsg: messagesToRespondWith,
          newSighting: { ...newSighting },
        });
      }
    });
    return;
  }
  add('./data.json', 'sightings', newSighting, (err) => {
    if (!err) {
      res.status(200).redirect('/');
      return;
    }
    res.status(400).json(err);
  });
};

export {
  home,
  sightingForm,
  singleSighting,
  editSingleSighting,
  showShape,
  showOneShape,
  putEditSighting,
  postSighting,
  deleteSingleSighting,
};
