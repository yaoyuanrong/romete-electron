const { ipcMain, desktopCapturer,app } = require('electron')
const { send: sendMainWindow,
       close: closeMainWindow,
       hide: hideMainWindow } = require('./windows/main')
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
  signal.on('closeControl', () => {
    closeMainWindow()
  })
  signal.on('hide-be-control', () => {
    hideMainWindow()
  })
  signal.on('offer', (data) => {
    sendMainWindow('offer', data)
  })
  signal.on('answer', (data) => {
    sendControlWindow('answer', data)
  })
  signal.on('puppet-candidate', (data) => {
    console.log('signal puppet-candidate')
    sendControlWindow('puppet-candidate', data)
    signal.send('hide-be-control')
  })
  signal.on('control-candidate', (data) => {
    sendMainWindow('control-candidate', data)
  })
  signal.on('control-quit-fresh', (data) => {
    sendMainWindow('control-quit-fresh')
  })
}