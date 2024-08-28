const http = require('http')
const server = http.createServer()

const io = require('socket.io')(server, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  console.log('se conectó un cliente')

  socket.on('chat_mensaje', (data) => {
    console.log(data)
    socket.broadcast.emit('chat_mensaje', data)
  })
})

server.listen(4000, () => {
  console.log('Servidor escuchando en el puerto 3000')
})