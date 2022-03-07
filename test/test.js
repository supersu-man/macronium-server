require('path')
require('http').createServer()
require('socket.io')
require('electron')
const {keyboard, Key} = require("@nut-tree/nut-js")
console.log(Key) 
fun()
async function fun() {
    await keyboard.pressKey(Key['Space'])
    await keyboard.releaseKey(Key['Space'])
}