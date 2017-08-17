const low = require('lowdb');
const db = low('db.json');
const prompt = require('prompt');
const moment = require('moment');

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
      this.time = moment(result.time, 'H:m');

      const now = moment();
      const timeDiff = this.getTimeDifference(now, this.time);
      console.log(`You will be notified in ${timeDiff} at ${this.time.format('HH:mm')} o'clock.`);
    });
  }

  getTimeDifference(now, then) {
    return moment.duration(now.diff(then)).humanize();
  }
}

const app = new App();
app.initDb();
app.startPrompt();

