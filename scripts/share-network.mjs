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
    // networkInterfaces can fail in restricted environments; server still binds 0.0.0.0
  }

  return [...addresses];
}

const addresses = getLocalAddresses();

console.log("\nPixiio production server (best for sharing on another PC)");
console.log(`Local:   http://localhost:${port}`);

if (addresses.length > 0) {
  console.log("Network: share one of these links on another PC (same Wi-Fi):");
  for (const address of addresses) {
    console.log(`         http://${address}:${port}`);
  }
} else {
  console.log("Network: no local IPv4 address found. Check Wi-Fi/Ethernet.");
}

console.log("All features (menu, scroll, booking) work on network links.\n");

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "start", "-H", "0.0.0.0", "-p", port],
  { stdio: "inherit", env: process.env }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
