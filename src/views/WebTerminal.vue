<template>
  <div>
    <div :id="terminalId"/>
  </div>
</template>

<script>
import { Terminal } from 'xterm'
import 'xterm/dist/xterm.css'
import * as fit from 'xterm/lib/addons/fit/fit'
Terminal.applyAddon(fit)

export default {
  name: 'Terminal',
  data() {
    return {
      term: null,
      websock: null,
      timer: null
    }
  },
  computed: {
    terminalId() {
      console.log(`terminal_${this._uid}`)
      return `terminal_${this._uid}`
    },
    cluster() {
      return ''
    },
    namespace() {
      return localStorage.getItem('namespace')
    },
    pod() {
      return localStorage.getItem('name')
    },
    container() {
      return ''
    },
    wsUrl() {
      //const host = window.location.host
      //return `${host}`
      const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
      const host = window.location.host

      //return `${protocol}${host}`
      return `${protocol}`
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
    this.initWebSocket()
    const _self = this
    this.term = new Terminal()

    this.term.on('data', function(input) {
      const sendData = JSON.stringify({type: "input", input: input})
      _self.websocketsend(sendData)
    })

    this.term.open(document.getElementById(this.terminalId))

    this.term.on('resize', function() {
      //this.term.fit()
      //const re = this.get_term_size()
      const sendData = JSON.stringify({type: "resize", rows: 400, cols: 400})
      _self.websocketsend(sendData)
    })
  },
  beforeDestroy() {
    if (this.term) {
      this.term.destroy()
    }
    window.removeEventListener('resize', this.handleResize) // 移除获取高度事件
  },
  methods: {
    initWebSocket() { // 初始化weosocket
      //const wsuri = `ws://localhost:8000/ssh?podNs=${this.namespace}&podName=${this.pod}&containerName=${this.container}`
      //const host = this.wsUrl.split(':')[0]
      //const wsuri = `ws://${host}:8000/ssh?podNs=${this.namespace}&podName=${this.pod}&containerName=${this.container}`
      const wsuri = `${this.wsUrl}127.0.0.1:8000/ssh?podNs=${this.namespace}&podName=${this.pod}&containerName=${this.container}`
      console.log(wsuri)
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      console.log('ws connected')
    },
    websocketonerror() { // 连接建立失败重连
      console.log('连接出错')
      this.term.write('连接出错\r\n')
      // this.initWebSocket()
    },
    websocketonmessage(e) { // 数据接收
      //const redata = JSON.parse(e.data)
      const redata = e.data
      this.term.write(redata)
    },
    websocketsend(Data) { // 数据发送
      if (this.websock.readyState === 1) {
        this.websock.send(Data)
      }
    },
    websocketclose(e) { // 关闭
      console.log('断开连接', e)
      this.term.write('连接已断开\r\n')
    },
    get_term_size() {
      var initWidth = 9
      var initHeight = 17

      var windowsWidth = document.body.clientWidth
      var windowsHeight = document.documentElement.clientHeight
      return {
        cols: Math.floor(windowsWidth / initWidth),
        rows: Math.floor(windowsHeight / initHeight)
      }
    },
    handleResize() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.setTermSize()
      }, 2000)
    },
    setTermSize() {
      const { cols, rows } = this.get_term_size()
      this.term.resize(cols, rows)
      this.websock.send(JSON.stringify({type: "resize", rows: this.term.rows, cols: this.term.cols}))
    }
  }
}
</script>

<style scoped>

</style>
