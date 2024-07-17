import { useDispatch, useSelector } from 'react-redux';
import { setUserData, selectIsAuthenticated } from '../store/entities/userSlice';

const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const login = (token) => {
    localStorage.setItem('token', token);
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  const setToken = () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setUserData({ token: storedToken }));
    }
  };

  return {
    isAuthenticated, login, logout, setToken,
  };
};

export default useAuth;
