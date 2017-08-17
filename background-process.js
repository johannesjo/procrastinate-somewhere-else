const exec = require('child_process').exec;
const Store = require('jfs');
const db = new Store('db.json', { pretty: true });

function sendMsg(title, msg, icon) {
  let command = 'notify-send';

  if (icon && icon !== '') {
    command += ' -i ' + icon;
  }
  if (title) {
    command += ' "' + title + ' "';
  } else {
    command += ' "' + ' "';
  }
  if (msg && msg !== "") {
    command += ' "' + msg + '"';
  }
  exec(command);
}

const time = db.getSync('time');
const msg = db.getSync('message');
const icon = db.getSync('icon');
const repetitions = db.getSync('repetitions');
const repetitionInterval = db.getSync('repetitionInterval');

sendMsg(msg, null, icon);