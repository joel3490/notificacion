import express from 'express'

const server = express()




//rutas
server.get('/', (req, res)=>{
    res.send('hola mundo')
})

export default server