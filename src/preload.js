const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
  getqr: () => ipcRenderer.invoke('getqr'),
  getVersion: () => ipcRenderer.invoke('getVersion'),
  open: (link) => ipcRenderer.invoke('open', link),
  status: (bool) => ipcRenderer.on('status', bool),
  saveTheme: (bool) => ipcRenderer.invoke('saveTheme', bool),
  getTheme: () => ipcRenderer.invoke('getTheme')
})