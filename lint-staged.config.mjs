// Pre-commit: lint and format only the staged files.
// Root (API) files use the root ESLint and Prettier configs. Client files go to
// the client's own ESLint config (client/eslint.config.mjs), run from client/.
import path from "node:path";

const clientDir = path.resolve("client");
const isClient = (file) => !path.relative(clientDir, file).startsWith("..");
const quote = (files) => files.map((f) => JSON.stringify(f)).join(" ");

export default {
  "*.{ts,mts,js,mjs}": (files) => {
    const root = files.filter((f) => !isClient(f));
    const client = files.filter(isClient);
    const commands = [];
    if (root.length) {
      commands.push(
        `eslint --fix ${quote(root)}`,
        `prettier --write ${quote(root)}`,
      );
    }
    if (client.length) {
      const rel = client.map((f) => path.relative(clientDir, f));
      commands.push(`pnpm --dir client exec eslint --fix ${quote(rel)}`);
    }
    return commands;
  },
  "*.tsx": (files) => {
    const rel = files.filter(isClient).map((f) => path.relative(clientDir, f));
    return rel.length
      ? [`pnpm --dir client exec eslint --fix ${quote(rel)}`]
      : [];
  },
};
