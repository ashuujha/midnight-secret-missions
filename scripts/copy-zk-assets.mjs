import { cp, mkdir, rm, access } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
for (const [contract, prefix] of [
  ["cat-bluff", ""],
  ["cat-bluff52", "classic52"],
]) {
  for (const directory of ["keys", "zkir"]) {
    const source = resolve(root, "managed", contract, directory);
    try {
      await access(source);
    } catch {
      throw new Error(
        `Missing ${contract} proving assets. Run npm run compile before building or starting the app.`,
      );
    }
    const destination = resolve(root, "public", prefix, directory);
    await mkdir(resolve(root, "public", prefix), { recursive: true });
    await rm(destination, { recursive: true, force: true });
    await cp(source, destination, { recursive: true });
  }
}
console.log("Copied legacy and Classic 52 proving assets.");
