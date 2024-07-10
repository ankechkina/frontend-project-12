import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../store/entities/authSlice';
import { ROUTES } from '../utils/router';

const useAuth = (shouldRedirect = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setUserData({ token: storedToken }));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (shouldRedirect) {
        navigate(ROUTES.login);
      }
    }
  }, [dispatch, navigate, shouldRedirect]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
