import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logOut } from '../store/entities/userSlice';
import { setCurrentChannel } from '../store/entities/channelsSlice';
import { useGetChannelsQuery } from '../api/channelsApi';
import { useGetMessagesQuery, useAddMessageMutation } from '../api/messagesApi';
import ModalWindow from '../modal/ModalWindow';
import { useToast } from '../context/ToastContext';
import useFilter from '../hooks/useFilter';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../utils/router';
import ChatWindow from './ChatWindow';
import ChannelList from './ChannelList';
import Navigation from './Navigation';
import { openModalWindow, closeModalWindow } from '../store/entities/appSlice';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    isAuthenticated && (
      <HomeContent />
    )
  );
};

const HomeContent = () => {
  const { username } = useSelector((state) => state.user);
  const { currentChannelId } = useSelector((state) => state.channels);

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
    refetch: refetchChannels,
  } = useGetChannelsQuery();

  const {
    data: messagesData, error: messagesError, refetch: refetchMessages,
  } = useGetMessagesQuery();

  const [addMessage] = useAddMessageMutation();

  const [dropdownsOpen, setDropdownsOpen] = useState({});

  const isModalOpen = useSelector((state) => state.app.isModalOpen);

  const handleOpenModal = (type, props) => {
    dispatch(openModalWindow({ type, props }));
  };

  const handleCloseModal = () => {
    dispatch(closeModalWindow());
  };

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

  const handleLogout = useCallback(() => {
    logout();
    dispatch(logOut());
    navigate(ROUTES.login);
  }, [logout, dispatch, navigate]);

  useEffect(() => {
    if (channelsError) {
      if (channelsError.status === 403) {
        handleLogout();
      } else {
        console.error(channelsError);
        toast.error(t('error.networkError'));
      }
    }
  }, [channelsError, t, toast, handleLogout]);

  useEffect(() => {
    if (messagesError) {
      if (messagesError.status === 403) {
        handleLogout();
      } else {
        console.error(messagesError);
        toast.error(t('error.networkError'));
      }
    }
  }, [messagesError, t, toast, handleLogout]);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannel(channelId));
  };

  const handleToggleDropdown = (channelId) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const currentChannel = channelsData?.find((channel) => channel.id === currentChannelId);
  const currentChannelName = currentChannel ? currentChannel.name : t('error.channelNotFound');

  const filteredMessages = (messagesData ?? []).filter((m) => m.channelId === currentChannelId);

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
                handleOpenModal={handleOpenModal}
                username={username}
                channels={channelsData}
                currentChannelId={currentChannelId}
                handleChannelClick={handleChannelClick}
                filter={filter}
                dropdownsOpen={dropdownsOpen}
                handleToggleDropdown={handleToggleDropdown}
                refetchChannels={refetchChannels}
              />
              <ChatWindow
                filter={filter}
                currentChannelName={currentChannelName}
                filteredMessages={filteredMessages}
                t={t}
                handleSendMessage={handleSendMessage}
                messageRef={messageRef}
                refetchMessages={refetchMessages}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalWindow
        show={isModalOpen}
        handleClose={handleCloseModal}
      />
    </div>
  );
};

export default Home;
