import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { logOut } from '../store/entities/authSlice';
import { setCurrentChannel, setFetchedChannels } from '../store/entities/channelsSlice';
import { setMessages } from '../store/entities/messagesSlice';
import { useGetChannelsQuery } from '../api/channelsApi';
import { useGetMessagesQuery, useAddMessageMutation } from '../api/messagesApi';
import ModalWindow from '../modal/ModalWindow';
import { useToast } from '../context/ToastContext';
import useFilter from '../utils/useFilter';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../utils/router';
import ChatWindow from './ChatWindow';
import ChannelList from './ChannelList';
import Navigation from './Navigation';

const Home = () => {
  const currentState = useSelector((state) => state);
  useEffect(() => {
    console.log(currentState);
  }, [currentState]);

  const { isAuthenticated } = useAuth();

  return (
    isAuthenticated && (
      <HomeContent />
    )
  );
};

const HomeContent = () => {
  const { username } = useSelector((state) => state.user);
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toast = useToast();

  const filter = useFilter();

  const messageRef = useRef(null);

  const { t } = useTranslation();

  const { logout } = useAuth();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, []);

  const {
    data: channelsData,
    error: channelsError,
    isLoading: isLoadingChannels,
  } = useGetChannelsQuery();
  const { data: messagesData, error: messagesError } = useGetMessagesQuery();

  const [addMessage] = useAddMessageMutation();

  const [dropdownsOpen, setDropdownsOpen] = useState({});

  const [modalInfo, setModalInfo] = useState({ type: null, props: {} });
  const handleShowModal = (type, props = {}) => setModalInfo({ type, props });
  const handleCloseModal = () => setModalInfo({ type: null, props: {} });

  const handleSendMessage = async (values, { setSubmitting, resetForm }) => {
    try {
      await addMessage({ body: values.message, channelId: currentChannelId, username }).unwrap();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(t('error.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (channelsError) {
      console.error(channelsError);
      toast.error(t('error.networkError'));
    }
  }, [channelsError, t, toast]);

  useEffect(() => {
    if (channelsData) {
      dispatch(setFetchedChannels(channelsData));
    }
  }, [channelsData, dispatch]);

  useEffect(() => {
    if (messagesError) {
      console.error(messagesError);
      toast.error(t('error.networkError'));
    }
  }, [messagesError, t, toast]);

  useEffect(() => {
    if (messagesData) {
      dispatch(setMessages(messagesData));
    }
  }, [messagesData, dispatch]);

  const handleLogout = () => {
    logout();
    dispatch(logOut());
    navigate(ROUTES.login);
  };

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleToggleDropdown = (channelId) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelName = currentChannel ? currentChannel.name : t('error.channelNotFound');

  const filteredMessages = messages.filter((message) => message.channelId === currentChannelId);

  if (isLoadingChannels) {
    return <div>{t('channels.loading')}</div>;
  }

  return (
    <div className="h-100">
      <div id="chat" className="h-100">
        <div className="d-flex flex-column chat-page">
          <Navigation
            t={t}
            handleLogout={handleLogout}
            showLogoutButton
          />
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row">
              <ChannelList
                t={t}
                handleShowModal={handleShowModal}
                username="currentUsername"
                channels={channels}
                currentChannelId={currentChannelId}
                handleChannelClick={handleChannelClick}
                filter={filter}
                dropdownsOpen={dropdownsOpen}
                handleToggleDropdown={handleToggleDropdown}
              />
              <ChatWindow
                filter={filter}
                currentChannelName={currentChannelName}
                filteredMessages={filteredMessages}
                t={t}
                handleSendMessage={handleSendMessage}
                messageRef={messageRef}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <ModalWindow
        show={!!modalInfo.type}
        handleClose={handleCloseModal}
        modalType={modalInfo.type}
        modalProps={modalInfo.props}
      />
    </div>
  );
};

export default Home;
