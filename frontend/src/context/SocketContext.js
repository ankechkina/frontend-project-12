/* eslint-disable react/jsx-no-constructed-context-values, max-len */

import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import socket from '../init';
import { addMessage } from '../api/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const token = useSelector((state) => state.authorization.token);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onMessage = (message) => {
      console.log('New message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onMessage);
    };
  }, []);

  const sendMessage = async (message) => {
    try {
      await addMessage(message, token);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  return (
    <SocketContext.Provider value={{ isConnected, messages, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
