import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ModalWindow from '../modal/ModalWindow';
import useAuth from '../hooks/useAuth';
import ChatWindow from './ChatWindow';
import ChannelList from './ChannelList';
import Navigation from './Navigation';
import { logOut } from '../store/entities/userSlice';
import { ROUTES } from '../utils/router';

const Home = () => {
  /* const currentState = useSelector((state) => state);
  useEffect(() => {
    console.log(currentState);
  }, [currentState]); */

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.login);
    }
  }, [isAuthenticated]);

  return (
    isAuthenticated && (
      <HomeContent />
    )
  );
};

const HomeContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    dispatch(logOut());
    navigate(ROUTES.login);
  }, [logout, dispatch, navigate]);

  return (
    <div className="h-100">
      <div id="chat" className="h-100">
        <div className="d-flex flex-column chat-page">
          <Navigation
            showLogoutButton
            handleLogout={handleLogout}
          />
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <ChannelList handleLogout={handleLogout} />
              <ChatWindow handleLogout={handleLogout} />
            </div>
          </div>
        </div>
      </div>
      <ModalWindow />
    </div>
  );
};

export default Home;
