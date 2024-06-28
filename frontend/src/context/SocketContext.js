/* eslint-disable react/jsx-no-constructed-context-values, max-len */

import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socket from '../init';
import { addNewMessage } from '../store/entities/messagesSlice';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const token = useSelector((state) => state.authorization.token);

  const dispatch = useDispatch();

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onMessage = (message) => {
      console.log('New message received:', message);
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

  /* const sendMessage = async (message) => {
    try {
      await addMessage(message, token);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  }; */

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
