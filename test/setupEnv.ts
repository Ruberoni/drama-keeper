// Runs before every test file (see vitest.config.ts setupFiles, after dotenv/config).
// config/db.ts picks MONGO_URI_TEST only when NODE_ENV === 'test', and tests
// delete documents, so refuse to run unless a separate test database is set.
process.env.NODE_ENV = "test";

if (!process.env.MONGO_URI_TEST) {
  throw new Error("MONGO_URI_TEST is not set: refusing to run tests");
}
if (process.env.MONGO_URI_TEST === process.env.MONGO_URI) {
  throw new Error("MONGO_URI_TEST must differ from MONGO_URI: refusing to run tests");
}
