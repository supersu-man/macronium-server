const { app, BrowserWindow } = require('electron')
const { startServer } = require('./functions.js')
const path = require('path')

const { autoUpdater } = require("electron-updater")
autoUpdater.checkForUpdatesAndNotify()

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../../img/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
    }
  })
  mainWindow.removeMenu()
  mainWindow.loadFile('./src/html/index.html')
  startServer(mainWindow)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})