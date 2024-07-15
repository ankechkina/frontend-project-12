import React, { createContext, useContext } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({ children, socket }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
