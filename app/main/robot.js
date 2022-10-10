/**
 * @info 通过信令服务
 *       基于WebRTC的RTCDataChannel
 *         -无服务端依赖，p2p传输
 *         -基于sctp（传输层，有着tcp、udp的优点）
 */
const { ipcMain } = require('electron')
const robot = require('robotjs')
const vkey = require('vkey')
function screenData(data) {
  let {clientX, clientY, screen, video} = data
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  let x = clientX * screen.width / video.width
  let y = clientY * screen.height / video.height
  console.log('屏幕数据屏幕数据屏幕数据',data, x, y)

  return { x,y }
}
function handleMouse(data) {
  screenData(data)
  robot.mouseClick()
}
function handleMouseMove(data) {
  let {x,y} = screenData(data)
  robot.moveMouse(x, y)
}
function handleKey(data) {
  // data {KeyCode, meta, alt, ctrl, shift}  
  const modifiers = []
  if(data.meta)modifiers.push('meta')
  if(data.shift)modifiers.push('shift')
  if(data.alt)modifiers.push('alt')
  if(data.ctrl)modifiers.push('ctrl')
  let key = vkey[data.keyCode].toLowerCase()
  if(key[0] !== '<') { // <shift>
    robot.keyTap(key, modifiers)
  }
  let RexStr = /\<|\>|\"|\'|\&/g
  robot.keyTap(key.replace(RexStr,''));

}
module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    console.log(type,data)
    if(type === 'mouse') {
      handleMouse(data)
    }else if(type === 'key') {
      handleKey(data)
    }else if (type === 'mouseMove') {
      handleMouseMove(data)
    }
  })
}

