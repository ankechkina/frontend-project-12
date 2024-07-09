import React, {
  createContext, useContext, useEffect, useMemo, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../utils/socket';
import { addNewMessage } from '../store/entities/messagesSlice';
import { addNewChannel, changeChannelName, setCurrentChannel } from '../store/entities/channelsSlice';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
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

  useEffect(() => {
    socket.on('newMessage', onMessage);
    socket.on('newChannel', onNewChannel);
    socket.on('renameChannel', onRenameChannel);

    return () => {
      socket.off('newMessage', onMessage);
      socket.off('newChannel', onNewChannel);
      socket.off('renameChannel', onRenameChannel);
    };
  }, [onMessage, onNewChannel, onRenameChannel]);

  const contextValue = useMemo(() => ({
    socket,
    onMessage,
    onNewChannel,
    onRenameChannel,
  }), [onMessage, onNewChannel, onRenameChannel]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
