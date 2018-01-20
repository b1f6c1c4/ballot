const winston = require('winston');
const chalk = require('chalk');

const lvls = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    fatal: 'underline dim red',
    error: 'bold red',
    warn: 'bold yellow',
    info: 'dim green',
    debug: 'dim cyan',
    trace: 'dim cyan',
  },
};

winston.addColors(lvls);

const logger = winston.createLogger({
  level: process.env.BACKEND_LOG || 'info',
  levels: lvls.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
      const msg = chalk`{gray ${info.timestamp}} [${info.label}] ${info.level}: ${info.message}`;
      if (info.data === undefined) {
        return msg;
      }
      let data;
      if (info.data instanceof Error) {
        data = info.data.toString();
      } else {
        data = JSON.stringify(info.data, null, 2);
      }
      if (data.includes('\n')) {
        return `${msg}\n${data}`;
      }
      return `${msg} ${data}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = (lbl) => {
  const customApi = {};
  Object.keys(lvls.levels).forEach((k) => {
    customApi[k] = (msg, data) => {
      let message = msg;
      if (message === undefined) {
        message = 'undefined';
      }
      logger.log({
        level: k,
        label: lbl || 'default',
        message,
        data,
      });
    };
  });
  return customApi;
};
