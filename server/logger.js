const winston = require('winston');

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
    info: 'bold white',
    debug: 'dim cyan',
    trace: 'dim cyan',
  },
};

winston.addColors(lvls);

const logger = winston.createLogger({
  level: 'trace',
  levels: lvls.levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
