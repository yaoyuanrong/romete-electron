const { ipcMain, desktopCapturer,clipboard ,nativeImage} = require('electron')
const { send: sendMainWindow,
       hide: hideMainWindow,
      reload: reloadMainWindow } = require('./windows/main')
const { create: createControlWindow, 
          send: sendControlWindow,
        close: closeControlWindow } = require('./windows/control')
const signal = require('./signal')
module.exports = function () {
  ipcMain.handle('login', async () => {
    // 先mock。返回一个code
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.handle('sources', async () => {
    console.log('desktopCapturer',desktopCapturer)
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
    signal.on('on-clipboard', (data) => { // 被控制端将对方剪贴板的内容保存在自己剪切板
      console.log('clipboard', data)
      switch (data.type) {
        case 'text': 
          clipboard.writeText(data.content)
        case 'image':
          clipboard.writeImage(nativeImage.createFromDataURL(data.content))
      }
    })
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
  
  // 控制端关闭按钮 触发关闭主窗口
  signal.on('close-control-window', () => {
    reloadMainWindow()
  })
  signal.on('control-quit-fresh', () => {
    sendMainWindow('control-quit-fresh',{})
		closeControlWindow()
  })
}