const moment = require('moment');
const exec = require('child_process').exec;
const Store = require('jfs');
const schedule = require('node-schedule');
const sendMsg = require('./send-message');
const CONST = require('./constants');
const DB_KEY = CONST.DB_KEY;
const STORE_FILE_PATH = CONST.STORE_FILE_PATH;
const db = new Store(STORE_FILE_PATH, { pretty: true });

// schedule job right away
scheduleJob();

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
  try {
    const time = moment(db.getSync(DB_KEY).time).toDate();

    schedule.scheduleJob(time, () => {
      const data = db.getSync(DB_KEY);

      let currentRepetitions = 0;

      // send one right away
      sendMsg(data.message, null, data.icon);

      // one timeout should be enough as we don't need any reps then
      setTimeout(() => {
        launchAction(data.action)
      }, data.timeOutBeforeAction);

      const timerId = setInterval(() => {
        currentRepetitions++;
        sendMsg(data.message, null, data.icon);
        if (currentRepetitions === data.repetitions) {
          clearInterval(timerId);
        }
      }, data.repetitionInterval);

    });
  } catch (e) {
    sendMsg('procrastinate-somewhere-else', e);
  }
}


