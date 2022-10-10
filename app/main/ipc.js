const { ipcMain, desktopCapturer } = require('electron')
const { send: sendMainWindow } = require('./windows/main')
const { create: createControlWindow, 
          send: sendControlWindow } = require('./windows/control')
const signal = require('./signal')
module.exports = function () {
  ipcMain.handle('login', async () => {
    // 先mock。返回一个code
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.handle('sources', async () => {
    // 先mock。返回一个code
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return sources
  })

  ipcMain.on('control', async (e, remote) => {
    signal.send('control', {remote})
    // 与服务端的交互
  })
  ipcMain.on('forward', (e, event, data) => {
    console.log('forward', {event})
    signal.send('forward',{ event, data })
  })
  signal.on('controlled', (data) => {
    console.log('controlled')
    createControlWindow()

    sendMainWindow('control-state-change', data.remote, 1)
  })
  signal.on('be-controlled', (data) => {
		require('./robot.js')()
    sendMainWindow('control-state-change', data.remote, 2)
  })
  
  signal.on('offer', (data) => {
    sendMainWindow('offer', data)
  })
  signal.on('answer', (data) => {
    sendControlWindow('answer', data)
  })
  signal.on('puppet-candidate', (data) => {
    sendControlWindow('puppet-candidate', data)
  })
  signal.on('control-candidate', (data) => {
    sendMainWindow('control-candidate', data)
  })
}