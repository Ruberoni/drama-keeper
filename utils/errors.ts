/*
 * Catch variables are `unknown` under strict TypeScript. This returns a
 * printable message for anything that was thrown.
 */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
