import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import store from './store/index';
import initializeI18n from './utils/i18nConfig';
import { SocketProvider } from './context/SocketContext';
import App from './App';
import socket from './utils/socket';
import { ToastProvider } from './context/ToastContext';

const init = async () => {
  const i18n = await initializeI18n();

  return (
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <SocketProvider socket={socket}>
            <ToastProvider>
              <App />
            </ToastProvider>
          </SocketProvider>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>
  );
};

export default init;
