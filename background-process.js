const exec = require('child_process').exec;
const low = require('lowdb');
const db = low('db.json');

function sendMsg(title, msg, icon) {
  console.log(title, msg, icon)
  let sCommand = 'notify-send';

  if (icon && icon !== "") {
    sCommand += ' -i ' + icon;
  }
  if (title) {
    sCommand += ' "' + title + ' "';
  } else {
    sCommand += ' "' + ' "';
  }
  if (msg && msg !== "") {
    sCommand += ' "' + msg + '"';
  }
  console.log(sCommand);

  exec(sCommand);

}

const time = db.get('time').value;
const msg = db.get('message').value;

console.log(time, msg);

//sendMsg(msg, time);
sendMsg('msg', 'time');