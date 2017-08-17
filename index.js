const prompt = require('prompt');
const moment = require('moment');
const spawn = require('child_process').spawn;
const Store = require('jfs');

class App {
  constructor() {
  }

  initDb() {
    this.db = new Store('db.json', { pretty: true });
  }

  startPrompt(cb) {
    prompt.start();

    console.log('Please enter time when you want be leave the computer (as "HH:mm").');
    prompt.get(['time'], (err, result) => {
      const time = moment(result.time, 'H:m');
      const now = moment();
      const timeDiff = this.getTimeDifference(now, time);

      this.writeTimeToDb(time);

      console.log(`You will be notified in ${timeDiff} at ${time.format('HH:mm')} o'clock.`);
      if (cb) {
        cb();
      }
    });
  }

  writeTimeToDb(time) {
    this.db.saveSync('time', time);
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
app.startPrompt(app.startBackgroundProcess);
