const prompt = require('prompt');
const moment = require('moment');
const spawn = require('child_process').spawn;
const Store = require('jfs');
const sendMsg = require('send-message');

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
      const msg = `Timer set. You will be notified in ${timeDiff} at ${time.format('HH:mm')} o'clock.`;

      this.writeTimeToDb(time);

      sendMsg(msg);
      console.log(msg);

      // exec callback if given
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
