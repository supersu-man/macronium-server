const { app, BrowserWindow } = require('electron')
const path = require('path')
const { listen } = require('./socket')

require('update-electron-app')()

if (require('electron-squirrel-startup')) app.quit()

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: path.join(__dirname, '../img/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  })
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
    .then(() => { listen(mainWindow) })
  mainWindow.removeMenu()
  //mainWindow.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

const { ipcMain } = require('electron')
const qrcode = require('qrcode')
const ip = require('ip')
const package = require('../package.json')
const shell = require('electron').shell
const Store = require('electron-store')
const store = new Store()

ipcMain.handle('getqr', () => {
  return qrcode.toDataURL(ip.address(), { width: 300 })
})

ipcMain.handle('getVersion', () => {
  return package.version.toString()
})

ipcMain.handle('open', (event, link) => {
  shell.openExternal(link)
})

ipcMain.handle('getTheme', () => {
  return store.has('darkMode')
})

ipcMain.handle('saveTheme', (event, bool) => {
  if (bool) store.set('darkMode', bool)
  else store.delete('darkMode')
  console.log(store.has('darkMode'))
})