import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../store/authSlice';

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setUserData({ token: storedToken }));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return children;
};

export default AuthLoader;
