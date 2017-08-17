const exec = require('child_process').exec;
const Store = require('jfs');
const db = new Store('db.json', { pretty: true });


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

const time = db.getSync('time');
const msg = db.getSync('message');
const icon = db.getSync('icon');

console.log(time, msg, icon);

//sendMsg(msg, time);
sendMsg('msg', 'time');