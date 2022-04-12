const {app, BrowserWindow, ipcMain} = require('electron')
const {path, startServer, initListener, ipcSend} = require('./functions.js')
const checkUpdate = require('./checkUpdate.js')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, '../../img/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })
  mainWindow.removeMenu()
  mainWindow.loadFile('./src/html/index.html')
  ipcSend(mainWindow, "setQR", true) //sets qr in preload
  initListener(mainWindow)
  startServer()
  checkUpdate.isNewUpdateFound((bool) => {
    if(bool) {
      console.log("Update found")
      ipcSend(mainWindow, "showButton", true)
    }
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed',() => {
  if (process.platform !== 'darwin') app.quit()
})