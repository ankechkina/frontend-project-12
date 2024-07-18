import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../utils/router';

const AuthLoader = ({ children }) => {
  const { isAuthenticated, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.login);
    } else {
      setToken();
    }
  }, [isAuthenticated, navigate, setToken]);

  return children;
};

export default AuthLoader;
