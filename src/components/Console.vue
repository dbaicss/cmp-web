<template>
    <div class="console" id="terminal"></div>
</template>
<script>
import Terminal from './Xterm'
export default {
  name: 'Console',
  props: {
    terminal: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      term: null,
      terminalSocket: null
    }
  },
  computed: {
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
      //return this.$route.params.container
      return ''
    },
    wsUrl() {
      //const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://'
      const host = window.location.host
      return `${host}`
    }
  },
  methods: {
    runRealTerminal () {
      console.log('webSocket is finished')
    },
    errorRealTerminal () {
      console.log('error')
    },
    closeRealTerminal () {
      console.log('close')
    }
  },
  mounted () {
    console.log('pid : ' + this.terminal.pid + ' is on ready')
    let terminalContainer = document.getElementById('terminal')
    this.term = new Terminal()
    this.term.open(terminalContainer)
    // open websocket
    console.log(`${this.wsUrl}`)
    this.terminalSocket = new WebSocket(`ws://localhost:8000/ssh?podNs=${this.namespace}&podName=${this.pod}&containerName=${this.container}`)
    this.terminalSocket.onopen = this.runRealTerminal
    this.terminalSocket.onclose = this.closeRealTerminal
    this.terminalSocket.onerror = this.errorRealTerminal
    this.term.attach(this.terminalSocket)
    this.term._initialized = true
    console.log('mounted is going on')
  },
  beforeDestroy () {
    this.terminalSocket.close()
    this.term.destroy()
  }
}
</script>