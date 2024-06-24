/* eslint-disable react/jsx-no-constructed-context-values, max-len */

import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useSelector } from 'react-redux';
import socket from '../init';
import { addMessage } from '../api/api'; // Импортируйте новую функцию

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const token = useSelector((state) => state.auth.token); // Получите токен из состояния

  useEffect(() => {
    const onConnect = () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    };

    const onMessage = (message) => {
      console.log('New message received:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onMessage); // Изменено на 'newMessage'

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onMessage); // Изменено на 'newMessage'
    };
  }, []);

  const sendMessage = async (message) => {
    try {
      console.log('Sending message:', message);
      const response = await addMessage(message, token); // Используйте новую функцию для отправки сообщения
      console.log('Message sent:', response);
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
