import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const rootDir = "C:\\xampp\\htdocs\\PROYECTO-FINAL-APLIWEB";
const outputDir = path.join(rootDir, "docs", "pantallazos");
const profileDir = path.join(rootDir, ".tmp-chrome-screenshots");
const debugPort = 9223;
const frontendUrl = "http://localhost:5173";
const apiUrl = "http://127.0.0.1:8000/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForJson(url, retries = 60) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // Chrome still starting.
    }
    await delay(250);
  }

  throw new Error(`No se pudo conectar con Chrome en ${url}`);
}

async function createTab() {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error(`No se pudo crear una pestana: ${response.status}`);
  }

  return response.json();
}

function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  const pending = new Map();
  let id = 0;

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;

    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);

    if (message.error) {
      reject(new Error(message.error.message));
    } else {
      resolve(message.result);
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          id += 1;
          socket.send(JSON.stringify({ id, method, params }));

          return new Promise((commandResolve, commandReject) => {
            pending.set(id, {
              resolve: commandResolve,
              reject: commandReject,
            });
          });
        },
        close() {
          socket.close();
        },
      });
    });

    socket.addEventListener("error", reject);
  });
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  await delay(2200);
}

async function screenshot(client, filename) {
  const result = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });

  await writeFile(path.join(outputDir, filename), Buffer.from(result.data, "base64"));
}

async function getAdminToken() {
  const response = await fetch(`${apiUrl}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "admin@lab.com",
      password: "123456",
    }),
  });

  if (!response.ok) {
    throw new Error(`Login API fallo: ${response.status}`);
  }

  const data = await response.json();
  return data.token;
}

async function createDemoRequest(token) {
  await fetch(`${apiUrl}/loan-requests`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      equipment_id: 1,
      quantity: 1,
      observations: "Solicitud de prueba para pantallazo",
    }),
  });
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await rm(profileDir, { recursive: true, force: true });

  const token = await getAdminToken();
  await createDemoRequest(token);

  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--no-sandbox",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "--window-size=1366,900",
    "about:blank",
  ], {
    stdio: "ignore",
  });

  try {
    await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
    const tab = await createTab();
    const client = await connect(tab.webSocketDebuggerUrl);

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1366,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await navigate(client, `${frontendUrl}/`);
    await screenshot(client, "01-login.png");

    await navigate(client, `${frontendUrl}/register`);
    await screenshot(client, "02-registro.png");

    await navigate(client, `${frontendUrl}/`);
    await client.send("Runtime.evaluate", {
      expression: `localStorage.setItem("token", ${JSON.stringify(token)});`,
    });

    await navigate(client, `${frontendUrl}/dashboard`);
    await screenshot(client, "03-inventario-admin.png");

    await client.send("Runtime.evaluate", {
      expression: `document.querySelectorAll(".sidebar-nav button")[1].click();`,
    });
    await delay(1800);
    await screenshot(client, "04-solicitudes-admin.png");

    client.close();
  } finally {
    chrome.kill();
  }

  console.log(`Pantallazos guardados en: ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
