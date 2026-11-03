import "./config/env";
import app from "./index";

const port: number = normalizePort(process.env.PORT || 4000);

/**
 * Start server
 */
app.listen(port, onListening);

function normalizePort(val: string | number): number {
  const port = parseInt(val as string, 10);
  if (isNaN(port)) {
    throw new Error("Port invalid");
  }

  if (port >= 0) {
    return port;
  }

  throw new Error("Port can not be negative");
}

function onListening() {
  console.log("Server listening on port:", port);
}
