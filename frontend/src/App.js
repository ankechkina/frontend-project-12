import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/NotFound';
import AuthLoader from './components/AuthLoader';
import { ROUTES } from './utils/router';
import { SocketProvider } from './context/SocketContext';

const App = () => (
  <SocketProvider>
    <Router>
      <Routes>
        <Route path={ROUTES.home} element={<AuthLoader><Home /></AuthLoader>} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </SocketProvider>
);

export default App;
