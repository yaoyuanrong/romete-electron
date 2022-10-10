const { app,BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
let win
let willQuitApp = false
function create () {
  win = new BrowserWindow({
		width:600,
		height:500,
		webPreferences:{
			nodeIntegration:true,
			contextIsolation:false
		},
		show: false,
	})
	win.on('close', (e) => {
		if(willQuitApp) {
			win = null
		} else {
			e.preventDefault()
			win.hide()
		}
	})
	win.on('ready-to-show', () => {
		win.show()
	})
	// win.webContents.openDevTools()
	if(isDev){
		win.loadURL('http://localhost:9000')
	} else {
		win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
	}
}
function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}
function show() {
	if (win.isMinimized()) win.restore()
	win.show()
}
function close() {
	willQuitApp = true
	win.close()
}
module.exports = { create, send, show, close }