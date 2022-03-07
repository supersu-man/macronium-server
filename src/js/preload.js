const ip = require("ip")
const {ipcRenderer} = require('electron')
const qrcode = require('qrcode')

window.addEventListener('DOMContentLoaded', () => {
  initListeners()
  var button = document.getElementById("updateButton")
  button.addEventListener('click', () => {
    require('electron').shell.openExternal("https://github.com/supersu-man/macronium-pc/releases/latest")
  })
})

function initListeners() {

  ipcRenderer.on("setQR", (_, arg) => {
    var canvas = document.getElementById("img-container")
    makeQR(canvas)
  })

  ipcRenderer.on("setStatus", (_, arg) => {
    var textView = document.getElementById("status_text")
    if(arg) {
      console.log("Connected")
      textView.innerHTML  = "Connected"
    } else {
      textView.innerHTML  = "Not Connected"
    }
  })

  ipcRenderer.on("showButton", (_, arg) => {
    var element = document.getElementById("updateButton")
    element.removeAttribute("hidden")
  })

}

function makeQR(canvas) {
  var qrString = ip.address()
  qrcode.toCanvas(canvas, qrString, {width : 300}, (error) => {
    if (error) console.error(error)
    console.log('QR set successfully')
  })
}

function sendMessage() {
  ipcRenderer.send("","")
}

function recieveMessage(key, callback){
  ipcRenderer.on(key, (event, arg) => {
    callback(event, arg)
  })
}