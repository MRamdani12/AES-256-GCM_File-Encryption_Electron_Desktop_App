import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { decryptFile, encryptFile } from "./crypto.js";
import { dialog } from "electron";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  win.loadFile(path.join(__dirname, "../dist/index.html"));

  win.setAutoHideMenuBar(true);
}

app.whenReady().then(createWindow);

// IPC
ipcMain.handle("encrypt-file", async (event, data) => {
  try {
    const encryptedPath = await encryptFile(
      data.filePath,
      data.password,
      data.outputPath,
    );
    return encryptedPath;
  } catch (error) {
    throw new Error(error.message || error);
  }
});

ipcMain.handle("decrypt-file", async (event, data) => {
  try {
    const encryptedPath = await decryptFile(
      data.filePath,
      data.password,
      data.outputPath,
    );
    return encryptedPath;
  } catch (error) {
    throw new Error(error.message || error);
  }
});

ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  if (result.canceled) return null;

  return result.filePaths[0]; // real file path
});

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (result.canceled) return null;

  return result.filePaths[0]; // real file path
});
