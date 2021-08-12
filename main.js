const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ipc = ipcMain;
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    darkTheme: true,
    useContentSize: true,
    frame: false,
    icon:'./assets/icon.ico',
    backgroundColor: "#2e2c29",
    webPreferences: {
      preload: path.join(__dirname, "/js/preload"),
      nodeIntegration: true,
      contextIsolation: false
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