const low = require('lowdb');
const db = low('db.json');
const prompt = require('prompt');
const moment = require('moment');
const spawn = require('child_process').spawn;

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
      const time = moment(result.time, 'H:m');
      const now = moment();
      const timeDiff = this.getTimeDifference(now, time);

      this.writeTimeToDb(time);

      console.log(`You will be notified in ${timeDiff} at ${time.format('HH:mm')} o'clock.`);
    });
  }

  writeTimeToDb(time) {
    db.set('time', time)
      .write()
  }

  getTimeDifference(now, then) {
    return moment.duration(now.diff(then)).humanize();
  }

  startBackgroundProcess() {
    spawn('node', ['background-process.js'], {
      detached: true
    });
  }
}

const app = new App();
app.initDb();
app.startPrompt();
//app.startBackgroundProcess();
