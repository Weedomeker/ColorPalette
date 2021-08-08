const { app, BrowserWindow, ipcMain, Browserwin } = require("electron");
const path = require("path");
const ipc = ipcMain;
function createWindow() {
  const win = new BrowserWindow({
    useContentSize: true,
    frame: false,
    icon:'./assets/icone.ico',
    width: 800,
    height: 600,
    backgroundColor: "#2e2c29",
    webPreferences: {
      preload: path.join(__dirname, "/js/preload"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("index.html");
  //win.webContents.openDevTools();


  ipc.on("closeApp", () => {
    win.close();
  });

  ipc.on("minimizeApp", () => {
    win.minimize();
  });

  ipc.on("maximizeApp", () => {
    win.maximize();
  });
}
app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});