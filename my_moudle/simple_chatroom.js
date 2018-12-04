const events = require('events')
const net = require('net')
const channel = new events.EventEmitter()

channel.clients = {}
channel.subscriptions = {}

channel.on('join', function (id, clients) {
    this.clients[id] = clients
    this.subscriptions[id] = (senderId, message) => {
        if (id != senderId) {
            this.clients[id].write(message)
        }
    }
    this.on('broadcast', this.subscriptions[id])
})

channel.on('leave', function (id) {
    channel.removeListener(
        'broadcast', this.subscriptions[id]
    )
    channel.emit('broadcast', id, `${id} has left the chatroom. \n`)
})

channel.on('shutdown', () => {
    channel.emit('broadcast', '', 'the chatroom has shut down')
    channel.removeAllListeners('broadcast')
})

const server = net.createServer(client => {
    const id = `${client.remoteAddress}:${client.remotePort}`
    channel.emit('join', id, client)
    client.on('data', data => {
        data = data.toString()
        if (data === 'shutdown\r\n') {
            channel.emit('shutdown')
        }
        channel.emit('broadcast', id, data)
    })
    client.on('close', () => {
        channel.emit('leave', id)
    })
})

server.listen(8888)