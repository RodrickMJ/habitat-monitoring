import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    if (location.pathname !== '/') {
      const newSocket = io('http://54.165.181.210', {
        extraHeaders: {
          'Authorization': '123ADWAWDAWDQWDAD33',
        },
      });

      newSocket.on('connect', () => {
        console.clear();
        console.log('Conectado al servidor');
      });

      newSocket.on('sensors', (data) => {
        setSensorData(data); // Almacena los datos recibidos en el estado
      });

      newSocket.on('connect_error', (err) => {
        console.error('Error de conexión:', err.message);
      });

      newSocket.on('disconnect', () => {
        console.log('Desconectado del servidor');
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [location.pathname]);

  return (
    <SocketContext.Provider value={{ socket, sensorData }}>
      {children}
    </SocketContext.Provider>
  );
};
