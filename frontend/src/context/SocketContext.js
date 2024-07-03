import React, {
  createContext, useContext, useEffect, useState, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import socket from '../utils/socket';
import { addNewMessage } from '../store/entities/messagesSlice';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useDispatch();

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onMessage = (message) => {
      dispatch(addNewMessage(message));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onMessage);
    };
  }, [dispatch]);

  const contextValue = useMemo(() => ({ isConnected }), [isConnected]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
