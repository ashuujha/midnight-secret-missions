import { spawnSync } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.status !== 0)
    throw new Error(`${command} failed (${result.status ?? result.error})`);
}
let env = { ...process.env };
if (spawnSync("compact", ["--version"], { stdio: "ignore" }).status !== 0) {
  const directory = await mkdtemp(join(tmpdir(), "cat-bluff-compact-"));
  const response = await fetch(
    "https://github.com/midnightntwrk/compact/releases/download/compact-v0.5.2/compact-installer.sh",
  );
  if (!response.ok)
    throw new Error(`Compact installer download failed: ${response.status}`);
  const installer = join(directory, "installer.sh");
  await writeFile(installer, await response.text());
  env = {
    ...env,
    COMPACT_UNMANAGED_INSTALL: directory,
    PATH: `${directory}:${env.PATH}`,
  };
  run("sh", [installer], env);
}
run("compact", ["update", "0.31.1"], env);
run("npm", ["run", "compile:classic"], env);
run("npm", ["run", "build"], env);
