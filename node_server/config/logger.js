const winston = require('winston');
const { format } = winston;
const SlackHook = require("winston-slack-webhook-transport");
const path = require('path')

const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata'
  });
};

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      format.label({ label: path.basename(process.mainModule.filename) }),
      format.timestamp({
        format: timezoned
      }),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
      logFormat
      ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'combined.log' }),
      new SlackHook({
        webhookUrl: "https://hooks.slack.com/services/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"
    })
    ],
  });

module.exports = logger;
