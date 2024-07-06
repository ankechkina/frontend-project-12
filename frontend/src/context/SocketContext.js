import React, {
  createContext, useContext, useEffect, useState, useMemo, useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import socket from '../utils/socket';
import { addNewMessage } from '../store/entities/messagesSlice';
import { changeChannelName } from '../store/entities/channelsSlice';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  const onMessage = useCallback((message) => {
    dispatch(addNewMessage(message));
  }, [dispatch]);

  const onRenameChannel = useCallback((channel) => {
    dispatch(changeChannelName(channel));
  }, [dispatch]);

  useEffect(() => {
    socket.on('newMessage', onMessage);
    socket.on('renameChannel', onRenameChannel);

    return () => {
      socket.off('newMessage', onMessage);
      socket.off('renameChannel', onRenameChannel);
    };
  }, [onMessage, onRenameChannel]);

  const contextValue = useMemo(() => ({
    socket,
    onMessage,
    onRenameChannel,
  }), [onMessage, onRenameChannel]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
