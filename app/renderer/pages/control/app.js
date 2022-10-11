const peer = require('./peer-control.js')

peer.on('add-stream', (stream) => {
  play(stream)
})
let video = document.getElementById('video')

function play(stream) {
  video.srcObject = stream
  video.onloadedmetadata = function () {
    video.play()
  }
}
function sreenData (e) {
  let data = {}
  data.clientX = e.clientX
  data.clientY = e.clientY
  data.video = {
    width: video.getBoundingClientRect().width,
    height: video.getBoundingClientRect().height+20
  }
  return data
}
window.onkeydown = function (e) {
  console.log(e)
  let data = {
    keyCode: e.keyCode,
    shift: e.shift,
    meta: e.meta,
    control: e.control,
    alt: e.altKey
  }
  peer.emit('robot', 'key', data)
}
window.onclick = function (e) {
  let data = sreenData(e)
  peer.emit('robot', 'click',data)
}
window.onmousedown = function (e) {
  let data = sreenData(e)
  peer.emit('robot', 'down',data)
} 
window.onmouseup= function (e) {
  let data = sreenData(e)
  peer.emit('robot', 'up',data)
} 
window.onmousemove = function (e) {
  let data = sreenData(e)
  peer.emit('robot', 'mouseMove',data)
}
window.oncontextmenu = function (e) {
  let data = sreenData(e)
  peer.emit('robot', 'clickRight',data)
}

window.onmousewheel = function (e) {
  peer.emit('robot', 'mousewheel',{
    x:e.deltaX,
    y:e.deltaY
  })
}