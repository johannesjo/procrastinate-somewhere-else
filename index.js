const low = require('lowdb');
const db = low('db.json');

// Set some defaults if your JSON file is empty
db.defaults({
  message: '',
  time: null
})
  .write();