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

window.onmouseup = function (e) {
  let data = {}
  data.clientX = e.clientX
  data.clientY = e.clientY
  data.video = {
    width: video.getBoundingClientRect().width,
    height: video.getBoundingClientRect().height
  }
  peer.emit('robot', 'mouse',data)
}