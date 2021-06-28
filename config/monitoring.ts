import elastic_apm from "elastic-apm-node";
import winston, { format } from "winston";

const apm = elastic_apm.start();

const consoleTransportOpts = {
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.splat(),
    format.colorize(),
    format.simple()
  ),
};

/**
 * A simple logger that log to the console
 */
const logger = winston.createLogger({
  level: "info",
  transports: new winston.transports.Console(consoleTransportOpts),
});

export { logger };
