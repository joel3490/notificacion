import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { ImAirplane } from "react-icons/im"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


type Mensaje = {
  usuario: string
  mensaje: string
};

const socket = io('http://localhost:4000')

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [nuevoMensaje, setNuevoMensaje] = useState('')

  const [mensajes, setMensajes] = useState<Mensaje[]>([])

  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMessage, setSelectedMessage] = useState('')





  const [isHovered, setIsHovered] = useState(false)
  const handleMouseEnter = () => {
    setIsHovered(true)
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))

    socket.on('chat_mensaje', (data) => {
      console.log(data)
      setMensajes((mensajes) => [...mensajes, data])
      setUnreadCount((prevCount) => prevCount + 1) // Incrementar el contador de mensajes no leídos
    })

    return () => {
      socket.off('connect')
      socket.off('chat_mensaje')
    }
  }, [])

  const enviarMensaje = () => {
    try {
      socket.emit('chat_mensaje', {
        usuario: socket.id,
        mensaje: nuevoMensaje,
      });
      console.log(nuevoMensaje)
    } catch (error) {
      console.log('error')
    }
    toast.success('Se envió el mensaje', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })
  }

  const recibirMensaje = (mensaje: Mensaje) => {
    setUnreadCount((prevCount) => Math.max(0, prevCount - 1)) // Restar uno al contador de no leídos
    setSelectedMessage(mensaje.mensaje) // Mostrar el mensaje en el input
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{isConnected ? 'conectado' : 'no conectado'}</h1>







      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full p-6">
        <input
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4"
          placeholder="Buscar..."
          onChange={(e) => setNuevoMensaje(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="button"
          onClick={enviarMensaje}
        >
          Enviar
        </button>
        <br />
        <br />
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">PROCEDENCIA</th>
              <th className="text-left px-4 py-2">MATRICULA</th>
              <th className="text-left px-4 py-2">CONTROLADOR</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {mensajes.map((mensaje, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{mensaje.usuario}</td>
                <td className="px-4 py-2">{mensaje.mensaje}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    type="button"
                    onClick={() => recibirMensaje(mensaje)} // Llamar a la función al hacer clic
                  >
                    Recibir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />







      <div className="icon-container">
        <ImAirplane
          size={40}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ zIndex: 20 }}
        />
        <span className="notification">{unreadCount}</span>
        {isHovered && (
          <div
            id="carrito"
            className="absolute top-12 right-0 bg-white p-6 shadow-md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ zIndex: 30 }} // Asegúrate de que el z-index sea mayor que el del formulario
          >
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2">PROCEDENCIA</th>
                  <th className="text-left px-4 py-2">MATRICULA</th>
                  <th className="text-left px-4 py-2">CONTROLADOR</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map((mensaje, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{mensaje.usuario}</td>
                    <td className="px-4 py-2">{mensaje.mensaje}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        type="button"
                        onClick={() => recibirMensaje(mensaje)} // Llamar a la función al hacer clic
                      >
                        Recibir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <br />
      <br />


      <div>
        <input
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4"
          placeholder="Mensaje recibido..."
          value={selectedMessage} // Mostrar el mensaje recibido

        />
      </div>

      <div>
        <input
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4"
          placeholder="Mensaje recibido..."
          value={selectedMessage} // Mostrar el mensaje recibido

        />
      </div>

      <div>
        <input
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4"
          placeholder="Mensaje recibido..."
          value={selectedMessage} // Mostrar el mensaje recibido

        />
      </div>
      <div>
        <input
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4"
          placeholder="Mensaje recibido..."
          value={selectedMessage} // Mostrar el mensaje recibido

        />
      </div>
      <div>
        <input
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-4"
          placeholder="Mensaje recibido..."
          value={selectedMessage} // Mostrar el mensaje recibido

        />
      </div>
    </>
  );
}

export default App;
