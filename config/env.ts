import { resolve } from "path";
import { config } from "dotenv";

// Resolve from the working directory: after compiling, __dirname is dist/config.
config({ path: resolve(process.cwd(), ".env"), quiet: true });
