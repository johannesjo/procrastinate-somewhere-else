const low = require('lowdb');
const db = low('db.json');
const prompt = require('prompt');

class App {
  constructor() {
  }

  initDb() {
    // Set some defaults if your JSON file is empty
    db.defaults({
      message: '',
      time: null
    })
      .write();
  }

  startPrompt() {
    prompt.start();

    console.log('Please enter time when you want be leave the computer.');
    prompt.get(['time'], (err, result) => {
      console.log('  time: ' + result.time);
    });
  }
}

const app = new App();
app.initDb();
app.startPrompt();

