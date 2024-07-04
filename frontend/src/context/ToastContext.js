import React, { createContext, useContext } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const options = {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  };

  const showToast = {
    success: (message) => toast.success(message, options),
    error: (message) => toast.error(message, options),
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

export { ToastProvider, useToast };
