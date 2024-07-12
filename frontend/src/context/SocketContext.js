import React, {
  createContext, useContext, useEffect, useMemo, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewMessage } from '../store/entities/messagesSlice';
import {
  addNewChannel, changeChannelName, setCurrentChannel, removeChannel,
} from '../store/entities/channelsSlice';

const SocketContext = createContext();

export const SocketProvider = ({ children, socket }) => {
  const dispatch = useDispatch();

  const onMessage = useCallback((message) => {
    dispatch(addNewMessage(message));
  }, [dispatch]);

  const { username } = useSelector((state) => state.user);

  const onNewChannel = useCallback((channel) => {
    dispatch(addNewChannel(channel));
    if (channel.creatorName === username) {
      dispatch(setCurrentChannel(channel.id));
    }
  }, [dispatch, username]);

  const onRenameChannel = useCallback((channel) => {
    dispatch(changeChannelName(channel));
  }, [dispatch]);

  const onRemoveChannel = useCallback((channel) => {
    dispatch(removeChannel(channel));
  }, [dispatch]);

  useEffect(() => {
    socket.on('newMessage', onMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('renameChannel', onRenameChannel);
    socket.on('removeChannel', onRemoveChannel);

    return () => {
      socket.off('newMessage', onMessage);
      socket.off('newChannel', onNewChannel);
      socket.off('renameChannel', onRenameChannel);
      socket.off('removeChannel', onRemoveChannel);
    };
  }, [socket, onMessage, onNewChannel, onRenameChannel, onRemoveChannel]);

  const contextValue = useMemo(() => ({
    socket,
    onMessage,
    onNewChannel,
    onRenameChannel,
    onRemoveChannel,
  }), [socket, onMessage, onNewChannel, onRenameChannel, onRemoveChannel]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
