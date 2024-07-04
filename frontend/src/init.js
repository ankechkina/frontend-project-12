import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import store from './store/index';
import initializeI18n from './utils/i18nConfig';
import { SocketProvider } from './context/SocketContext';
import App from './App';
import socket from './utils/socket';
import { ToastProvider } from './context/ToastContext';
import rollbarConfig from './utils/rollbarConfig';

const init = async () => {
  const i18n = await initializeI18n();

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <SocketProvider socket={socket}>
              <ToastProvider>
                <App />
              </ToastProvider>
            </SocketProvider>
          </I18nextProvider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
