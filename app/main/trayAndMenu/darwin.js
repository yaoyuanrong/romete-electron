const { app, Tray, Menu } = require('electron')
const { show:showMainWindow } = require('../windows/main')
const path = require('path')
const { create: createAboutWindow } = require('../windows/about.js')
let tray
function setTray() {
  tray = new Tray(path.resolve(__dirname, './connection.png'))
  tray.on('click', () => {
    showMainWindow()
  })
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: '显示', click: showMainWindow },
      { label: '退出', click: app.quit }
    ])
    tray.popUpContextMenu(contextMenu)
  })
}
function setAppMenu() {
  let appMenu = Menu.buildFromTemplate([
    {
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            },
            { type: 'separator'  },
            { role: 'services'  },
            { type: 'separator'  },
            { role: 'hide'  },
            { role: 'hideothers'  },
            { role: 'unhide'  },
            { type: 'separator'  },
            { role: 'quit'  }
        ],

    },
{ role: 'fileMenu' },
{ role: 'windowMenu' },
{ role: 'editMenu' }
]);
  app.applicationMenu = appMenu
}
app.whenReady().then(() => {
  setTray()
  setAppMenu()
})