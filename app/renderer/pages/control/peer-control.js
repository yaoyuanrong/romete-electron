const EventEmitter = require('events')
const peer = new EventEmitter()
const { ipcRenderer } = require('electron')

const pc = new window.RTCPeerConnection({}) // 创建RTC

//在链接中新增数据通道 reliable是否必须可达的
const dc = pc.createDataChannel('robotchannel', {reliable: false})
dc.onopen = function() {
  peer.on('robot', (type, data) => {
    console.log('open开启')
    dc.send(JSON.stringify({type, data}))
  })
}
dc.onmessage = function (e) {
  console.log('message', e)
}
dc.onerror = (e) => {console.log('error',e)}
pc.onicecandidate = function (e) {
  console.log('控制端candidate',e.candidate)
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
  }
}
ipcRenderer.on('puppet-candidate', (e, candidate) => {
  console.log('加入candidate')
  addIceCandidate(candidate)
})
let candidates = [] // 放入缓存
async function addIceCandidate(candidate) {
  if(candidate) {
    candidates.push(candidate)
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for(let i = 0;i < candidates.length;i++) {
      await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(candidates[i])))
    }
    candidates = []
  }
}
window.addIceCandidate = addIceCandidate

async function createOffer() {
  const offer = await pc.createOffer({ // 创建offer
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer) // 设置本地描述
  console.log('pc offer 设置本地描述')
  return pc.localDescription 
}
createOffer().then(offer => {
  console.log('offer创建')
  ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp })
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer) // 设置控制端描述
}
ipcRenderer.on('answer', (e, answer) => {
  console.log('拿到答案')
  // 完成了 P2P 通信过程中的媒体协商部分
  setRemote(answer)
})
window.setRemote = setRemote

pc.onaddstream = function (e) { // 监听流的增加
  console.log('add-stream', e)
  peer.emit('add-stream', e.stream)
}
peer.on('robot', (type, data) => {
  // if(type == 'mouse' || type == 'mouseMove') {
  //   data.screen = { 
  //     width: window.screen.width * window.devicePixelRatio,
  //     height: window.screen.height* window.devicePixelRatio,
  //     width: window.screen.width,
  //     height: window.screen.height
  //   }
  // }
  ipcRenderer.send('robot', type, data)
})
module.exports = peer