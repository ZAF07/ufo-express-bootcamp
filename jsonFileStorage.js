import { readFile, writeFile } from 'fs';

/**
 * Add a JS Object to an array of Objects in a JSON file
 * @param {string} filename - Name of JSON file
 * @param {object} jsonContentObj - The content to write to the JSON file
 * @param {function} callback - The callback function to execute on error or success
 *                              Callback takes JS Object as 1st param and write error as 2nd param.
 * @returns undefined
 */
export function write(filename, jsonContentObj, callback) {
  // Convert content object to string before writing
  const jsonContentStr = JSON.stringify(jsonContentObj);

  // Write content to DB
  writeFile(filename, jsonContentStr, (writeErr) => {
    if (writeErr) {
      console.error('Write error', jsonContentStr, writeErr);
      // Allow each client app to handle errors in their own way
      callback(writeErr, null);
      return;
    }
    console.log('Write success!');
    // Call client-provided callback on successful write
    callback(null, jsonContentStr);
  });
}

/**
 * Add a JS Object to an array of Objects in a JSON file
 * @param {string} filename - Name of JSON file
 * @param {function} clientFunction - The callback function to execute on error or success
 *                              Callback takes JS Object as 1st param and read error as 2nd param.
 * @returns undefined
 */
export function read(filename, clientFunction) {
  const handleFileRead = (readErr, jsonContentStr) => {
    if (readErr) {
      console.error('Read error', readErr);
      // Allow client to handle error in their own way
      clientFunction(readErr, null);
      return;
    }

    // Convert file content to JS Object
    const jsonContentObj = JSON.parse(jsonContentStr);

    // Call client callback on file content
    clientFunction(null, jsonContentObj);
  };

  // Read content from DB
  readFile(filename, 'utf-8', handleFileRead);
}

/**
 * Add a JS Object to an array of Objects in a JSON file
 * @param {string} filename - Name of JSON file
 * @param {string} key - The key in the JSON file whose value is the target array
 * @param {string} input - The value to append to the target array
 * @param {function} callback - The callback function to execute on error or success
 *                              Callback takes JS Object as 1st param and read or write error as 2nd param.
 * @returns undefined
 */
export function add(filename, key, input, callback) {
  const handleFileRead = (readErr, jsonContentStr) => {
    if (readErr) {
      console.error('Read error', readErr);
      callback(null, readErr);
      return;
    }

    // Parse file content into JS Object
    const jsonContentObj = JSON.parse(jsonContentStr);

    // If key does not exist in DB, exit
    if (!(key in jsonContentObj)) {
      // Call callback with relevant error message to let client handle
      callback("Key doesn't exist", null);
      return;
    }

    // Add input element to target array
    jsonContentObj[key].push(input);

    // Convert JS Object back to string for writing
    const updatedJsonContentStr = JSON.stringify(jsonContentObj);

    // Write updated content to DB
    writeFile(filename, updatedJsonContentStr, (writeErr) => {
      if (writeErr) {
        console.error('Error writing', updatedJsonContentStr, writeErr);
        callback(writeErr, null);
        return;
      }
      console.log('Write success!');
      // Call callback with updated JSON content Object
      callback(null, jsonContentObj);
    });
  };

  // Read existing content from DB
  readFile(filename, 'utf-8', handleFileRead);
}

export function edit(filename, index, input, callback) {
  const handleFileRead = (readErr, jsonContentStr) => {
    if (readErr) {
      console.error('Read error', readErr);
      callback(null, readErr);
      return;
    }

    // Parse file content into JS Object
    const jsonContentObj = JSON.parse(jsonContentStr);
    const DbObject = jsonContentObj.sightings;
    console.log(`THIS RETUIRNED FROM EDIT FUNCTION ${jsonContentObj.sightings}`);
    // // If index does not exist in DB, exit
    // if (!(index in jsonContentObj)) {
    //   // Call callback with relevant error message to let client handle
    //   callback(null, "index doesn't exist");
    //   return;
    // }

    // Add input element to target array
    DbObject[index] = (input);

    // Convert JS Object back to string for writing
    const updatedJsonContentStr = JSON.stringify(jsonContentObj);

    // Write updated content to DB
    writeFile(filename, updatedJsonContentStr, (err, writeErr) => {
      if (err) {
        console.error('Error writing', updatedJsonContentStr, writeErr);
        callback(writeErr, null);
        return;
      }
      console.log('Edit success!');
      // Call callback with updated JSON content Object
      callback(null, jsonContentObj);
    });
  };

  readFile(filename, 'utf-8', handleFileRead);
}

// Delete function
export function del(fileName, key, index, callback) {
  // get all data from DB
  read(fileName, (err, content) => {
    if (!err) {
      // const db = content.sightings;
      const { sightings } = content;
      sightings.splice(index - 1, 1);
      // db = sightings.splice(2, 1);
      const newDbAfterDelete = { sightings: [...sightings] };
      write(fileName, newDbAfterDelete, (writeErr, results) => {
        if (writeErr) {
          console.log(`ERROR WRITING IN DEL() ${writeErr}`);
        } else {
          callback(null, results);
        }
      });
      // callback(null, key);
      // console.log(` From del jsonfilestorage --> ${sightings}`);
    }
  });
}
