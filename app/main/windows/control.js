const { BrowserWindow, 
        app, 
        globalShortcut,
        clipboard }  = require('electron');
const path = require('path');
const signal = require('../signal')
let win
function create() {
  win = new BrowserWindow({
    width: 1000,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.webContents.openDevTools()
  win.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
  win.on('close', (e) => {
    console.log('closed','close-control-window')
    signal.send('close-control-window', {})
    // win = null
	})

  win.on('focus',() => {
    globalShortcut.register("CommandOrControl+V", () => {
      const text = clipboard.readText('clipboard') // 获取text
      const img = clipboard.readImage('clipboard') // 获取图片
      const RTF = clipboard.readRTF('clipboard') // 获取RTF类型文件

      if (!img.isEmpty()) {
        signal.send('send-clipboard', {content: img.toDataURL(), type: 'image'})
        return 
      }
      if (text != '') {
        signal.send('send-clipboard', {content: text, type: 'text'})
        return
      }
      
      console.log('text', text)
      console.log('RTF', RTF)
    });
  })
  win.on('blur', () => {
    globalShortcut.unregisterAll() // 注销键盘事件
  })
  app.whenReady().then(async () => {
    require('../permissions.js') // 兼容mac权限问题
  })
}

function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}
function close() {
  console.log('controlClose')
	win.close()
}
function reload() {
  win.reload()
}

module.exports = { create, send, close, reload }