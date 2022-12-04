const Store = require('electron-store')
const store = new Store()

window.addEventListener('DOMContentLoaded', () => {

  setVersionText()
  setTheme()

  initStatusListener()
  initButtonListeners()
  initToggleListener()

  checkForUpdates()

})

window.addEventListener('load', ()=>{
  setQR()
})

function setVersionText() {
  const package = require('../../package.json')
  const versionTextElement = document.getElementById('versionText')
  const currentVersion = package.version.toString()
  versionTextElement.innerHTML = 'v' + currentVersion
}

function setTheme() {
  const body = document.getElementById('body')
  const toggle = document.getElementById('themeSwitch')
  if (store.has('darkMode')) {
    body.classList.remove('light-theme')
    body.classList.add('dark-theme')
    toggle.setAttribute('checked', 'true')
  } else {
    body.classList.remove('dark-theme')
    body.classList.add('light-theme')
  }
}

function setQR() {
  const qrcode = require('qrcode')
  const ip = require('ip')
  const canvas = document.getElementById('imgContainer')
  const tint = getComputedStyle(canvas).getPropertyValue('--on-surface').trim()
  const opts = {
    width: 300,
    color: {
      dark: tint,
      light: "#0000"
    }
  }
  qrcode.toCanvas(canvas, ip.address(), opts, (error) => {
    if (error) console.error(error)
  })
}

function initStatusListener() {
  const { ipcRenderer } = require('electron')

  const statusTextElement = document.getElementById("statusText")
  ipcRenderer.on('setStatus', (_, arg) => {
    if (arg) {
      console.log("Connected")
      statusTextElement.innerHTML = 'Connected'
    } else {
      statusTextElement.innerHTML = 'Not Connected'
    }
  })
}

function initButtonListeners() {
  const shell = require('electron').shell

  const updateButton = document.getElementById('updateButton')
  updateButton.addEventListener('click', () => {
    shell.openExternal("https://github.com/supersu-man/macronium-server/releases")
  })

  const repoButton = document.getElementById('repoButton')
  repoButton.addEventListener('click', () => {
    shell.openExternal("https://supersu-man.github.io/macronium/")
  })
}

function initToggleListener() {
  const body = document.getElementById('body')
  const toggle = document.getElementById('themeSwitch')
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      body.classList.remove('light-theme')
      body.classList.add('dark-theme')
      store.set('darkMode', true)
    } else {
      body.classList.add('light-theme')
      body.classList.remove('dark-theme')
      store.delete('darkMode')
    }
    setQR()
  })
}

function checkForUpdates() {
  const checkUpdate = require('./checkUpdate.js')

  checkUpdate.isNewUpdateFound((bool) => {
    if (bool) {
      console.log('Update found')
      const updateButton = document.getElementById('updateButton')
      updateButton.removeAttribute('hidden')
    }
  })
}