const exec = require('child_process').exec;

module.exports = function sendMsg(title, msg, icon) {
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
};