import validate from 'express-validator';
import passport from 'passport';
import {
  read, edit, add, del,
} from '../jsonFileStorage.js';
import User from '../models/user.js';

const { validationResult } = validate;
// const { body, validationResult } = validateBody;
// // const validateUserInput = () => {
// //   body('description').isLength({ min: 10 });
// // };
let visitedNumberDays = 0;
let user;
const home = (req, res) => {
  let user;
  const userExists = req.user;
  const date = new Date();
  if (req.user) {
    user = req.user.username;
  }

  res.cookie('day', date.getDate());
  // const numberOfVisits = 0;
  // let here;

  // if (req.session.pageViews) {
  //   req.session.pageViews += 1;
  // } else {
  //   req.session.pageViews = 1;
  // }
  const today = 15;
  const tomorrow = 'tuesday';

  if (req.cookies !== today) {
    console.log(req.cookies);
    console.log('!= today ', req.cookies.day);
    visitedNumberDays += 1;
    res.cookie.day = tomorrow;
  }

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
      visitedNumberDays,
      userExists,
      user,
    });
  });
};
const sightingForm = (req, res) => {
  let user;
  if (req.user) {
    user = req.user.username;
  }
  const date = new Date();
  res.cookie('day', date.getDate());
  // const numberOfVisits = 0;
  // let here;

  // if (req.session.pageViews) {
  //   req.session.pageViews += 1;
  // } else {
  //   req.session.pageViews = 1;
  // }
  const today = 15;
  const tomorrow = 'tuesday';

  if (req.cookies !== today) {
    console.log(req.cookies);
    console.log('!= today ', req.cookies.day);
    visitedNumberDays += 1;
    res.cookie.day = tomorrow;
  }
  res.render('sightingForm', {
    title: 'New Sighting',
    user,
  });
};
const singleSighting = (req, res) => {
  const { index } = req.params;
  let user;
  if (req.user) {
    user = req.user.username;
  }
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
        user,

      });
    }
  });
};
const editSingleSighting = (req, res) => {
  const { index } = req.params;
  let user;
  if (req.user) {
    user = req.user.username;
  }
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
        user,
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
  let user;
  if (req.user) {
    user = req.user.username;
  }
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
        visitedNumberDays,
        user,

      });
    }
  });
};
const showOneShape = (req, res) => {
  let user;
  if (req.user) {
    user = req.user.username;
  }
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
      user,
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

const getRegisterPage = (req, res) => {
  let user;
  if (req.user) {
    user = req.user.username;
  }
  res.render('register', {
    title: 'New User',
    user,
  });
};

const handleRegister = (req, res) => {
  const userExists = req.user;

  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(`Passport error ${err}`);
        res.status(404).render('register', {
          title: 'Sign Up Here',
          userExists,
          errMsg: err.message,
        });
      } else {
        console.log(`HERE IS PASSPORT ${req.user}`);
        passport.authenticate('local')(req, res, () => {
          res.redirect('/sighting');
        });
      }
    },
  );
};

const handleLogIn = (req, res) => {
  const userExists = req.user;
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  // Query DB to find if username exists
  User.findOne({ username: user.username }, (err, found) => {
    // If user is found, go ahead and run login()and authenticate
    if (found) {
      req.login(user, (logErr) => {
        // If error, redirect to login page
        if (logErr) {
          console.log('LOGIN ERROR --> ', err);
          res.redirect('/login');
        } else {
          console.log('FOUNDDDDD');
          // Authenticate user and redirect to secrets page
          passport.authenticate('local')(req, res, () => {
            // on LogIn is where i set my session tokens and cookies
            console.log(`Login error ${err}`);
            console.log(user);
            req.session.logged_in = user.username;
            req.session.visited_times = 1;
            res.render('sightingForm', {
              user: user.username,
              title: 'New Sighting',
            });
          });
        }
      });
    } else {
      console.log('nOOOOOOOO', err);
      // If no such user exists redirect to sign up page and prompt to register
      const errMsg = 'User not found. Please create a new account';
      const d = new Date();
      res.status(404).render('register', {
        title: 'Sign Up Here',
        userExists,
        errMsg,
      });
    }
  });
};
const handleLogOut = (req, res) => {
  // Passport method to logout user

  console.log(`USER -> ${req.user}`);
  console.log(`SESSION -> ${req.session}`);
  req.logout();
  // On log out is where i destroy all sessions and cookies
  req.session.destroy((err) => {
    // cannot access session here
    if (err) {
      console.log(`SESSION DESTRYO ERROR ${err}`);
    }
  });
  res.redirect('/');
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
  handleRegister,
  handleLogIn,
  getRegisterPage,
  handleLogOut,
};
