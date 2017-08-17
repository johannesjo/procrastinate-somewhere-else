const moment = require('moment');
const exec = require('child_process').exec;
const Store = require('jfs');
const schedule = require('node-schedule');
const db = new Store('db.json', { pretty: true });
const sendMsg = require('./send-message');


function launchAction(action) {
  if (action === 'LOCK') {
    exec('gnome-screensaver-command -l');
  } else if (action === 'SUSPEND') {
    exec('systemctl suspend');
  } else if (action === 'SHUTDOWN') {
    exec('systemctl poweroff');
  }
}

function scheduleJob() {
  const time = moment(db.getSync('time')).toDate();
  schedule.scheduleJob(time, () => {
    const msg = db.getSync('message');
    const icon = db.getSync('icon');
    const repetitions = db.getSync('repetitions');
    const repetitionInterval = db.getSync('repetitionInterval');
    const action = db.getSync('action');
    const timeOutBeforeLock = db.getSync('timeOutBeforeLock');

    let currentRepetitions = 0;

    // send one right away
    sendMsg(msg, null, icon);

    // one timeout should be enough as we don't need any reps then
    setTimeout(() => {
      launchAction(action)
    }, timeOutBeforeLock);

    const timerId = setInterval(() => {

      currentRepetitions++;
      sendMsg(msg, null, icon);
      if (currentRepetitions === repetitions) {
        clearInterval(timerId);
      }
    }, repetitionInterval);

  });
}

scheduleJob();
