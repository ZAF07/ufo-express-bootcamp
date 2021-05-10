import {read} from '../jsonFileStorage.js';

const home = (req, res) => {
  // Read into DB and retrieve all sightings
  read('./data.json',(err, data) => {
 let dataRecieved;
    if (err) {
      console.log(`ERROR READING IN HOME CONTROLLER ${err}`);
    } else {
      console.log(`DATA RECIEVED FROM READ FN -> ${data.sightings}`);
      dataRecieved = data.sightings
      console.log(dataRecieved);
    }
      res.render('home', {
        title: 'Home',
        content: dataRecieved,
        index: 0
      })

  })

}
const sightingForm = (req, res) => {
  res.render('sightingForm', {
    title: 'New Sighting'
  })
}
const singleSighting = (req, res) => {
  const {index} = req.params
  console.log(req.params);

  read('./data.json', (err, data) => {
    if (err) {
      console.log(`ERROR READING FROM SINGLESIGHTING -<  ${err}`);
    } else {
      const {sightings} = data;
      const singleSighting = sightings[index];
      console.log(`THIS IS IT -> ${sightings[0]}`);
      res.render('singleSighting', {
        title: 'Single Sighting',
        index: index,
        singleSighting
        
      })
    }
  })
}
const editSingleSighting = (req, res) => {
  
  const {index} = req.params

  // Read into DB and retrieve unique info
  read('./data.json', (err, data) => {
    if (err) {
      console.log(`ERROR READING FROM EDITSINGLESIGHTING ${err}`);
    } else {
      const {sightings} = data;
      const sightingBeingEdited = sightings[index];
      const {date_time, state, summary} = sightingBeingEdited ;
        res.render('editSighting', {
    title: 'Edit Sighting',
    date_time,
    state,
    summary
  })
    }
  })



}
const deleteSingleSighting = (req, res) => {
  res.send('Delete single sighting (DELETE REQ)')
}
const showShape = (req, res) => {
  res.send('List all sighting shapes')
}
const showOneShape = (req, res) => {
  res.send('List all sighting of single shape')
}




export { 
  home, 
  sightingForm, 
  singleSighting, 
  editSingleSighting, 
  showShape, showOneShape
}