import dbg from "debug";
import app from "./index";

const debug = dbg("http");

const port: number = normalizePort(process.env.PORT || 3000);

/**
 * Start server
 */
app.listen(port, onListening);

function normalizePort(val: any): number {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    throw new Error("Port invalid");
  }

  if (port >= 0) {
    // port number
    return port;
  }

  throw new Error("Port can not be negative");
}

function onListening() {
  debug("Listening on port:", port);
}
