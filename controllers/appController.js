import { read, edit } from '../jsonFileStorage.js';

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
  res.send('Delete single sighting (DELETE REQ)');
};
const showShape = (req, res) => {
  // Read into DB and retrieve all sightings
  read('./data.json', (err, data) => {
    if (err) {
      console.log(`ERROR READING IN HOME CONTROLLER ${err}`);
    } else {
      console.log(`DATA RECIEVED FROM READ FN ShowShape -> ${data.sightings}`);
      const shapesRecieved = [];
      let index;
      const { sightings } = data;

      sightings.forEach((sighting, i) => {
        const singleShapeObj = {
          i,
          ...sighting,
        };
        shapesRecieved.push(singleShapeObj);
        console.log(`SHAPES ${shapesRecieved}`);
      });
      // Render EJS with shapes as variables
      res.render('shapes', {
        title: 'Shapes Reported',
        header: 'All  Reported Shapes',
        shapesRecieved,
        index,

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
const editSighting = (req, res) => {
  console.log(req.body.description);
  // Get the index position of current article via query params  (index)
  const { index } = req.params;
  console.log(index);
  // collect all form data
  const {
    text, date_time, city, state, shape, duration, summary,
  } = req.body;

  // Store in object to replace existing object in DB
  const editedData = {
    text,
    date_time,
    city,
    state,
    shape,
    duration,
    summary,
  };

  edit('./data.json', index, editedData, (err, respond) => {
    if (err) {
      console.log(`ERROR EDITING IN APPCONTROLLER ${err}`);
      return;
    }
    console.log(`SUCCESS ${respond}`);
    res.status(200).redirect('/');
  });
};

export {
  home,
  sightingForm,
  singleSighting,
  editSingleSighting,
  showShape,
  showOneShape,
  editSighting,
};
