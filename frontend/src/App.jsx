import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import Login from './components/Login';
import NotFound from './components/NotFound';
import AuthLoader from './components/AuthLoader';
import { ROUTES } from './utils/router';
import Signup from './components/Signup';

const App = () => (
  <>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path={ROUTES.home} element={<AuthLoader><Home /></AuthLoader>} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.signup} element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </>
);

export default App;
