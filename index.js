#!/usr/bin/env node
const inquirer = require('inquirer');
const moment = require('moment');
const spawn = require('child_process').spawn;
const Store = require('jfs');
const sendMsg = require('./send-message');

const CONST = require('./constants');
const DEFAULTS = CONST.DEFAULTS;
const DB_KEY = CONST.DB_KEY;
const PI_ID_KEY = CONST.PI_ID_KEY;
const STORE_FILE_PATH = CONST.STORE_FILE_PATH;

class App {
  constructor() {
    this.db = new Store(STORE_FILE_PATH, { pretty: true });
    this.currentStoredVals = this.db.allSync().config || {};
    this.checkAndWriteDefaults(DEFAULTS, this.currentStoredVals);

    this.baseQuestions = [
      {
        name: 'time',
        type: 'input',
        message: 'Please enter time when you want be leave the computer (as HH:mm).',
        default: this.currentStoredVals.time && moment(this.currentStoredVals.time).format('HH:mm'),
      },
      {
        name: 'action',
        type: 'list',
        message: 'Please select an action to execute after the timeout.',
        choices: [
          'NONE',
          'LOCK',
          'SUSPEND',
          'SHUTDOWN'
        ],
        default: this.currentStoredVals.action || 'LOCK'
      },
      {
        name: 'message',
        type: 'string',
        message: 'Enter the message to be displayed or press enter to leave as is.',
        default: this.currentStoredVals.message
      }
    ];

    this.startPrompt();
  }

  startPrompt() {
    inquirer.prompt(this.baseQuestions)
      .then((result) => {
        this.configDone(result);
      });
  }

  configDone(result) {
    const timeMoment = this.parseTimeString(result.time);
    const dataToSave = Object.assign({}, result, { time: timeMoment });
    this.writeInputToDb(dataToSave);
    this.sendDoneMsg(timeMoment);
    this.stopPreviousBackgroundProcess();
    this.startBackgroundProcess();

    console.log('All done! Exiting!');

    // kill script afterwards, but wait just a little bit for
    // error messages by the spawned process
    setTimeout(() => {
      process.exit();
    }, 300);
  }

  startBackgroundProcess() {
    const child = spawn('node', [__dirname + '/background-process.js'], {
      detached: true
    });
    console.log('Background process initialized. Continuing...');
    child.stderr.on('data', (data) => {
      console.log(`ps stderr: ${data}`);
    });
    this.db.saveSync(PI_ID_KEY, child.pid);
  }

  stopPreviousBackgroundProcess() {
    try {
      const childId = this.db.getSync(PI_ID_KEY);
      process.kill(childId, 'SIGINT');
      console.log(`Killing previous background process (${childId}). Continuing...`);
    } catch (e) {
      console.log('No previous processes running. Continuing...');
    }
  }

  checkAndWriteDefaults(DEFAULTS, currentCfg) {
    if (!currentCfg) {
      this.db.saveSync(DB_KEY, Object.assign({}, DEFAULTS));
    } else {
      this.db.saveSync(DB_KEY, Object.assign({}, DEFAULTS, currentCfg));
    }
  }

  parseTimeString(timeStr) {
    // also allow hours
    if (timeStr.length <= 2) {
      timeStr += ':00';
    }
    let momentVal = moment(timeStr, 'H:m');
    // check if maybe tomorrow is meant
    const diff = momentVal.diff(moment(), 'seconds');
    if (diff < 1) {
      momentVal = momentVal.add(1, 'days');
    }

    return momentVal;
  }

  sendDoneMsg(timeMoment) {
    const now = moment();
    const timeDiff = this.getTimeDifference(now, timeMoment);
    const msg = `Timer set. You will be notified in ${timeDiff} at ${timeMoment.format('HH:mm')} o'clock.`;
    sendMsg(msg);
  }

  writeInputToDb(dataToSave) {
    this.db.saveSync(DB_KEY, Object.assign({}, this.currentStoredVals, dataToSave));
  }

  getTimeDifference(now, then) {
    return moment.duration(now.diff(then)).humanize();
  }
}

new App();
