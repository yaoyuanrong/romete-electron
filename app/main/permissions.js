const { systemPreferences, shell, dialog, app} = require('electron')

const screenStatus = systemPreferences.getMediaAccessStatus('screen')
systemPreferences.isTrustedAccessibilityClient(true)
if(screenStatus === 'denied') {
  dialog.showMessageBox({
    type: 'info',
    title: '设备权限',
    message: '请授权屏幕录制权限',
    buttons: ['前往设置'],
    cancelId:1
  }).then(res => {
    if (res.response === 0) {
      shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture')
    }
  })
}
