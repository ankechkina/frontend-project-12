import { useDispatch, useSelector } from 'react-redux';
import { setUserData, selectIsAuthenticated, logOut } from '../store/entities/userSlice';

const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const login = (token, username) => {
    localStorage.setItem('token', token);
    dispatch(setUserData({ token, username }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(logOut());
  };

  return {
    isAuthenticated, login, logout,
  };
};

export default useAuth;
