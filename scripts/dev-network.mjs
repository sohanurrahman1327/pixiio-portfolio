import { spawn } from "node:child_process";
import os from "node:os";

const port = process.env.PORT ?? "3000";

function getLocalAddresses() {
  const addresses = new Set();

  try {
    for (const interfaces of Object.values(os.networkInterfaces())) {
      for (const iface of interfaces ?? []) {
        if (iface.family !== "IPv4" || iface.internal) continue;
        addresses.add(iface.address);
      }
    }
  } catch {
    // networkInterfaces can fail in restricted environments; dev still binds 0.0.0.0
  }

  return [...addresses];
}

const addresses = getLocalAddresses();

console.log("\nPixiio dev server");
console.log(`Local:   http://localhost:${port}`);

if (addresses.length > 0) {
  console.log("Network: share one of these links on another PC (same Wi-Fi):");
  for (const address of addresses) {
    console.log(`         http://${address}:${port}`);
  }
} else {
  console.log("Network: no local IPv4 address found. Check Wi-Fi/Ethernet.");
}

console.log("For full menu + scroll on another PC, use: npm run share");
console.log("Dev mode over network has limited interactivity.\n");

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "dev", "-H", "0.0.0.0", "-p", port, "--webpack"],
  { stdio: "inherit", env: process.env }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
