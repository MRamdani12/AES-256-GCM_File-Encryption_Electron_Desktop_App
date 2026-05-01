const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  encryptFile: (data) => ipcRenderer.invoke("encrypt-file", data),
  decryptFile: (data) => ipcRenderer.invoke("decrypt-file", data),
  selectFile: () => ipcRenderer.invoke("select-file"),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
});
