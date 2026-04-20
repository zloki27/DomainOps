import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";

const swcDir = join(process.cwd(), "node_modules", "@next", "swc-linux-x64-gnu");
const disabledDir = `${swcDir}.disabled`;

if (existsSync(swcDir) && !existsSync(disabledDir)) {
  renameSync(swcDir, disabledDir);
  console.log("Disabled native @next/swc-linux-x64-gnu to force WASM SWC on this VPS.");
} else if (existsSync(disabledDir)) {
  console.log("Native @next/swc-linux-x64-gnu already disabled.");
} else {
  console.log("Native @next/swc-linux-x64-gnu not present.");
}
