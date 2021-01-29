import { format, transports } from 'winston';

export default {
  exitOnError: false,
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: 'HH:mm:ss YY/MM/DD',
    }),

    format.label({
      label: '测试',
    }),

    format.splat(),
    format.printf(info => `${info.timestamp} ${info.level}: [${info.label}]${info.message}`),
  ),
  transports: [
    new transports.Console({
      level: 'info',

    }),
  ],
};
